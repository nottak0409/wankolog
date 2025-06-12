import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'wankolog.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await createTables();
  }
  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
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
      type TEXT NOT NULL CHECK (type IN ('meal', 'poop', 'exercise')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      detail TEXT,
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
      notification_enabled INTEGER NOT NULL DEFAULT 1,
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