-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ペットプロフィールテーブル
CREATE TABLE pets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  birthday DATE NOT NULL,
  breed VARCHAR(100) NOT NULL,
  weight DECIMAL(4,1),
  registration_number VARCHAR(50),
  microchip_number VARCHAR(50),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 日々の記録テーブル
CREATE TABLE daily_records (
  id UUID PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('meal', 'poop', 'exercise')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  detail TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 医療記録テーブル
CREATE TABLE medical_records (
  id UUID PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('vaccine', 'checkup', 'treatment')),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  next_appointment DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 薬の記録テーブル
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ワクチン記録テーブル
CREATE TABLE vaccine_records (
  id UUID PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id),
  type VARCHAR(100) NOT NULL,
  last_date DATE NOT NULL,
  next_date DATE NOT NULL,
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 通知設定テーブル
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id),
  type VARCHAR(50) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  time TIME NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  custom_days JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_daily_records_pet_id_date ON daily_records(pet_id, date);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_vaccine_records_pet_id ON vaccine_records(pet_id);
CREATE INDEX idx_notification_settings_pet_id ON notification_settings(pet_id);

-- タイムスタンプ自動更新のトリガー
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_pets_timestamp BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_daily_records_timestamp BEFORE UPDATE ON daily_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_medical_records_timestamp BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_medications_timestamp BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_vaccine_records_timestamp BEFORE UPDATE ON vaccine_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_notification_settings_timestamp BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
