import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'wankolog.db';
const CURRENT_SCHEMA_VERSION = 3; // notification_enabled列を削除

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await createTables();
    await migrateDatabase();
  }
  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const ensureDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    console.log('Database not initialized, initializing now...');
    return await initDatabase();
  }
  return db;
};

const migrateDatabase = async (): Promise<void> => {
  if (!db) return;

  try {
    // まずバージョン管理テーブルを作成
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY
      );
    `);

    // 現在のバージョンを取得
    const result = await db.getFirstAsync<{ version: number }>(`
      SELECT version FROM schema_version LIMIT 1
    `);

    const currentVersion = result?.version || 0;

    if (currentVersion < CURRENT_SCHEMA_VERSION) {
      console.log(`Migrating database from version ${currentVersion} to ${CURRENT_SCHEMA_VERSION}`);
      
      // バージョン1→2: daily_recordsテーブルにamountとunitカラムを追加
      if (currentVersion < 2) {
        try {
          // カラムが存在するかチェック
          const tableInfo = await db.getAllAsync(`PRAGMA table_info(daily_records)`);
          const hasAmountColumn = tableInfo.some((col: any) => col.name === 'amount');
          const hasUnitColumn = tableInfo.some((col: any) => col.name === 'unit');
          
          if (!hasAmountColumn) {
            await db.execAsync(`ALTER TABLE daily_records ADD COLUMN amount REAL;`);
            console.log('Added amount column to daily_records');
          }
          
          if (!hasUnitColumn) {
            await db.execAsync(`ALTER TABLE daily_records ADD COLUMN unit TEXT;`);
            console.log('Added unit column to daily_records');
          }
          
          // typeカラムのCHECK制約を更新（weightを追加）
          // SQLiteでは制約を直接変更できないため、新しいテーブルを作成して移行
          await db.execAsync(`
            CREATE TABLE daily_records_new (
              id TEXT PRIMARY KEY,
              pet_id TEXT NOT NULL REFERENCES pets(id),
              type TEXT NOT NULL CHECK (type IN ('meal', 'poop', 'exercise', 'weight')),
              date TEXT NOT NULL,
              time TEXT NOT NULL,
              detail TEXT,
              amount REAL,
              unit TEXT,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
          `);
          
          // データを移行
          await db.execAsync(`
            INSERT INTO daily_records_new 
            SELECT id, pet_id, type, date, time, detail, amount, unit, created_at, updated_at 
            FROM daily_records;
          `);
          
          // 古いテーブルを削除して新しいテーブルをリネーム
          await db.execAsync(`DROP TABLE daily_records;`);
          await db.execAsync(`ALTER TABLE daily_records_new RENAME TO daily_records;`);
          
          console.log('Migrated daily_records table structure');
        } catch {
          console.log('Migration already completed or table structure is up to date');
        }
      }

      // バージョン2→3: vaccine_recordsテーブルからnotification_enabledカラムを削除
      if (currentVersion < 3) {
        try {
          // カラムが存在するかチェック
          const tableInfo = await db.getAllAsync(`PRAGMA table_info(vaccine_records)`);
          const hasNotificationColumn = tableInfo.some((col: any) => col.name === 'notification_enabled');
          
          if (hasNotificationColumn) {
            // SQLiteでは列を直接削除できないため、新しいテーブルを作成して移行
            await db.execAsync(`
              CREATE TABLE vaccine_records_new (
                id TEXT PRIMARY KEY,
                pet_id TEXT NOT NULL REFERENCES pets(id),
                type TEXT NOT NULL,
                last_date TEXT NOT NULL,
                next_date TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
              );
            `);
            
            // データを移行（notification_enabled列を除く）
            await db.execAsync(`
              INSERT INTO vaccine_records_new 
              SELECT id, pet_id, type, last_date, next_date, created_at, updated_at 
              FROM vaccine_records;
            `);
            
            // 古いテーブルを削除して新しいテーブルをリネーム
            await db.execAsync(`DROP TABLE vaccine_records;`);
            await db.execAsync(`ALTER TABLE vaccine_records_new RENAME TO vaccine_records;`);
            
            // インデックスとトリガーを再作成
            await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_vaccine_records_pet_id ON vaccine_records(pet_id);`);
            await db.execAsync(`
              CREATE TRIGGER IF NOT EXISTS update_vaccine_records_timestamp 
              AFTER UPDATE ON vaccine_records BEGIN
                UPDATE vaccine_records SET updated_at = datetime('now') WHERE id = NEW.id;
              END;
            `);
            
            console.log('Removed notification_enabled column from vaccine_records');
          }
        } catch {
          console.log('Vaccine records migration already completed or column does not exist');
        }
      }

      // バージョンを更新
      await db.execAsync(`
        INSERT OR REPLACE INTO schema_version (version) VALUES (${CURRENT_SCHEMA_VERSION});
      `);
      
      console.log(`Database migration completed to version ${CURRENT_SCHEMA_VERSION}`);
    }
  } catch (error) {
    console.error('Database migration error:', error);
  }
};

const createTables = async (): Promise<void> => {
  if (!db) return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    -- ペットプロフィールテーブル
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
      birthday TEXT NOT NULL,
      breed TEXT NOT NULL,
      weight REAL,
      registration_number TEXT,
      microchip_number TEXT,
      photo_url TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 日々の記録テーブル
    CREATE TABLE IF NOT EXISTS daily_records (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id),
      type TEXT NOT NULL CHECK (type IN ('meal', 'poop', 'exercise', 'weight')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      detail TEXT,
      amount REAL,
      unit TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 医療記録テーブル
    CREATE TABLE IF NOT EXISTS medical_records (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id),
      type TEXT NOT NULL CHECK (type IN ('vaccine', 'checkup', 'treatment')),
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      next_appointment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 薬の記録テーブル
    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      medical_record_id TEXT NOT NULL REFERENCES medical_records(id),
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ワクチン記録テーブル
    CREATE TABLE IF NOT EXISTS vaccine_records (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id),
      type TEXT NOT NULL,
      last_date TEXT NOT NULL,
      next_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 通知設定テーブル
    CREATE TABLE IF NOT EXISTS notification_settings (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL REFERENCES pets(id),
      type TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      time TEXT NOT NULL,
      frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
      custom_days TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- インデックス
    CREATE INDEX IF NOT EXISTS idx_daily_records_pet_id_date ON daily_records(pet_id, date);
    CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON medical_records(pet_id);
    CREATE INDEX IF NOT EXISTS idx_vaccine_records_pet_id ON vaccine_records(pet_id);
    CREATE INDEX IF NOT EXISTS idx_notification_settings_pet_id ON notification_settings(pet_id);

    -- updated_at自動更新のトリガー
    CREATE TRIGGER IF NOT EXISTS update_pets_timestamp 
    AFTER UPDATE ON pets BEGIN
      UPDATE pets SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_daily_records_timestamp 
    AFTER UPDATE ON daily_records BEGIN
      UPDATE daily_records SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_medical_records_timestamp 
    AFTER UPDATE ON medical_records BEGIN
      UPDATE medical_records SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_medications_timestamp 
    AFTER UPDATE ON medications BEGIN
      UPDATE medications SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_vaccine_records_timestamp 
    AFTER UPDATE ON vaccine_records BEGIN
      UPDATE vaccine_records SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_notification_settings_timestamp 
    AFTER UPDATE ON notification_settings BEGIN
      UPDATE notification_settings SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);
};