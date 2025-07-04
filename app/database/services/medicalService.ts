import { ensureDatabase } from '../init';
import { MedicalRecord, VaccineRecord, Medication } from '../../types/medical';
import { notificationService } from '../../services/notificationService';
import { isVaccineNotificationEnabled } from '../../(tabs)/settings';

export const medicalService = {
  async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<string> {
    const db = await ensureDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO medical_records (id, pet_id, type, date, description, next_appointment)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        record.petId,
        record.type,
        record.date.toISOString().split('T')[0],
        record.description,
        record.nextAppointment?.toISOString().split('T')[0] || null
      ]
    );

    // 薬の記録も追加
    if (record.medications && record.medications.length > 0) {
      for (const medication of record.medications) {
        await this.createMedication(id, medication);
      }
    }
    
    return id;
  },

  async getMedicalRecordById(id: string): Promise<MedicalRecord | null> {
    const db = await ensureDatabase();
    const result = await db.getFirstAsync(
      `SELECT * FROM medical_records WHERE id = ?`,
      [id]
    );
    
    if (!result) return null;
    
    const medications = await this.getMedicationsByRecordId(id);
    return this.mapRowToMedicalRecord(result as any, medications);
  },

  async getMedicalRecordsByPetId(petId: string): Promise<MedicalRecord[]> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM medical_records WHERE pet_id = ? ORDER BY date DESC`,
      [petId]
    );
    
    const records: MedicalRecord[] = [];
    for (const row of results) {
      const medications = await this.getMedicationsByRecordId((row as any).id);
      records.push(this.mapRowToMedicalRecord(row as any, medications));
    }
    
    return records;
  },

  async updateMedicalRecord(id: string, updates: Partial<Omit<MedicalRecord, 'id' | 'petId'>>): Promise<void> {
    const db = await ensureDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.date !== undefined) {
      fields.push('date = ?');
      values.push(updates.date.toISOString().split('T')[0]);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.nextAppointment !== undefined) {
      fields.push('next_appointment = ?');
      values.push(updates.nextAppointment?.toISOString().split('T')[0] || null);
    }
    
    if (fields.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE medical_records SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // 薬の記録を更新
    if (updates.medications !== undefined) {
      await this.deleteMedicationsByRecordId(id);
      for (const medication of updates.medications) {
        await this.createMedication(id, medication);
      }
    }
  },

  async deleteMedicalRecord(id: string): Promise<void> {
    const db = await ensureDatabase();
    await this.deleteMedicationsByRecordId(id);
    await db.runAsync(`DELETE FROM medical_records WHERE id = ?`, [id]);
  },

  // 薬関連
  async createMedication(medicalRecordId: string, medication: Omit<Medication, 'id'>): Promise<string> {
    const db = await ensureDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO medications (id, medical_record_id, name, dosage, frequency)
       VALUES (?, ?, ?, ?, ?)`,
      [id, medicalRecordId, medication.name, medication.dosage, medication.frequency]
    );
    
    return id;
  },

  async getMedicationsByRecordId(medicalRecordId: string): Promise<Medication[]> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM medications WHERE medical_record_id = ?`,
      [medicalRecordId]
    );
    
    return results.map(row => this.mapRowToMedication(row as any));
  },

  async deleteMedicationsByRecordId(medicalRecordId: string): Promise<void> {
    const db = await ensureDatabase();
    await db.runAsync(`DELETE FROM medications WHERE medical_record_id = ?`, [medicalRecordId]);
  },

  // ワクチン関連
  async createVaccineRecord(record: Omit<VaccineRecord, 'id'> & { petName?: string }): Promise<string> {
    const db = await ensureDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO vaccine_records (id, pet_id, type, last_date, next_date, hospital_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        record.petId,
        record.type,
        record.lastDate.toISOString().split('T')[0],
        record.nextDate.toISOString().split('T')[0],
        record.hospitalName || null
      ]
    );
    
    // グローバル通知設定をチェックして通知をスケジュール
    const notificationEnabled = await isVaccineNotificationEnabled();
    if (notificationEnabled && record.petName) {
      await notificationService.scheduleVaccineNotification(
        id,
        record.type,
        record.petName,
        record.nextDate
      );
    }
    
    return id;
  },

  async getVaccineRecordsByPetId(petId: string): Promise<VaccineRecord[]> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM vaccine_records WHERE pet_id = ? ORDER BY last_date DESC`,
      [petId]
    );
    
    return results.map(row => this.mapRowToVaccineRecord(row as any));
  },

  async updateVaccineRecord(id: string, updates: Partial<Omit<VaccineRecord, 'id' | 'petId'>> & { petName?: string }): Promise<void> {
    const db = await ensureDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.lastDate !== undefined) {
      fields.push('last_date = ?');
      values.push(updates.lastDate.toISOString().split('T')[0]);
    }
    if (updates.nextDate !== undefined) {
      fields.push('next_date = ?');
      values.push(updates.nextDate.toISOString().split('T')[0]);
    }
    if (updates.hospitalName !== undefined) {
      fields.push('hospital_name = ?');
      values.push(updates.hospitalName || null);
    }
    
    if (fields.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE vaccine_records SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    // 通知を再スケジュール
    await this.rescheduleVaccineNotification(id, updates);
  },

  async rescheduleVaccineNotification(
    id: string, 
    updates: Partial<Omit<VaccineRecord, 'id' | 'petId'>> & { petName?: string }
  ): Promise<void> {
    // 既存の通知をキャンセル
    await notificationService.cancelVaccineNotification(id);
    
    // グローバル通知設定をチェックして通知をスケジュール
    const notificationEnabled = await isVaccineNotificationEnabled();
    if (notificationEnabled && updates.petName) {
      // 更新されたレコードの情報を取得
      const updatedRecord = await this.getVaccineRecordById(id);
      if (updatedRecord) {
        await notificationService.scheduleVaccineNotification(
          id,
          updatedRecord.type,
          updates.petName,
          updatedRecord.nextDate
        );
      }
    }
  },

  async getVaccineRecordById(id: string): Promise<VaccineRecord | null> {
    const db = await ensureDatabase();
    const result = await db.getFirstAsync(
      `SELECT * FROM vaccine_records WHERE id = ?`,
      [id]
    );
    
    if (!result) return null;
    
    return this.mapRowToVaccineRecord(result as any);
  },

  async deleteVaccineRecord(id: string): Promise<void> {
    const db = await ensureDatabase();
    
    // 通知をキャンセル
    await notificationService.cancelVaccineNotification(id);
    
    await db.runAsync(`DELETE FROM vaccine_records WHERE id = ?`, [id]);
  },

  mapRowToMedicalRecord(row: any, medications: Medication[]): MedicalRecord {
    return {
      id: row.id,
      petId: row.pet_id,
      type: row.type as 'vaccine' | 'checkup' | 'treatment',
      date: new Date(row.date),
      description: row.description,
      nextAppointment: row.next_appointment ? new Date(row.next_appointment) : undefined,
      medications
    };
  },

  mapRowToMedication(row: any): Medication {
    return {
      id: row.id,
      name: row.name,
      dosage: row.dosage,
      frequency: row.frequency
    };
  },

  mapRowToVaccineRecord(row: any): VaccineRecord {
    return {
      id: row.id,
      petId: row.pet_id,
      type: row.type,
      lastDate: new Date(row.last_date),
      nextDate: new Date(row.next_date),
      hospitalName: row.hospital_name || undefined
    };
  }
};