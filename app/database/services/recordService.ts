import { ensureDatabase } from '../init';
import { Record, RecordsByDate, DailySummary } from '../../types/record';

export const recordService = {
  async create(record: Omit<Record, 'id'> & { petId: string }): Promise<string> {
    const db = await ensureDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO daily_records (id, pet_id, type, date, time, detail, amount, unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        record.petId,
        record.type,
        record.date,
        record.time,
        record.detail,
        record.amount || null,
        record.unit || null
      ]
    );
    
    return id;
  },

  async getById(id: string): Promise<Record | null> {
    const db = await ensureDatabase();
    const result = await db.getFirstAsync(
      `SELECT * FROM daily_records WHERE id = ?`,
      [id]
    );
    
    if (!result) return null;
    
    return this.mapRowToRecord(result as any);
  },

  async getByPetId(petId: string): Promise<Record[]> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM daily_records WHERE pet_id = ? ORDER BY date DESC, time DESC`,
      [petId]
    );
    
    return results.map(row => this.mapRowToRecord(row as any));
  },

  async getByDateRange(petId: string, startDate: string, endDate: string): Promise<RecordsByDate> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM daily_records 
       WHERE pet_id = ? AND date BETWEEN ? AND ? 
       ORDER BY date DESC, time DESC`,
      [petId, startDate, endDate]
    );
    
    const recordsByDate: RecordsByDate = {};
    
    results.forEach(row => {
      const record = this.mapRowToRecord(row as any);
      if (!recordsByDate[record.date]) {
        recordsByDate[record.date] = [];
      }
      recordsByDate[record.date].push(record);
    });
    
    return recordsByDate;
  },

  async getByDate(petId: string, date: string): Promise<Record[]> {
    const db = await ensureDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM daily_records WHERE pet_id = ? AND date = ? ORDER BY time DESC`,
      [petId, date]
    );
    
    return results.map(row => this.mapRowToRecord(row as any));
  },

  async update(id: string, updates: Partial<Omit<Record, 'id'>>): Promise<void> {
    const db = await ensureDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.date !== undefined) {
      fields.push('date = ?');
      values.push(updates.date);
    }
    if (updates.time !== undefined) {
      fields.push('time = ?');
      values.push(updates.time);
    }
    if (updates.detail !== undefined) {
      fields.push('detail = ?');
      values.push(updates.detail);
    }
    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.unit !== undefined) {
      fields.push('unit = ?');
      values.push(updates.unit);
    }
    
    if (fields.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE daily_records SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  },

  async delete(id: string): Promise<void> {
    const db = await ensureDatabase();
    await db.runAsync(`DELETE FROM daily_records WHERE id = ?`, [id]);
  },

  async deleteByPetId(petId: string): Promise<void> {
    const db = await ensureDatabase();
    await db.runAsync(`DELETE FROM daily_records WHERE pet_id = ?`, [petId]);
  },

  async getDailySummary(petId: string, date: string): Promise<DailySummary> {
    const records = await this.getByDate(petId, date);
    
    const mealRecords = records.filter(r => r.type === 'meal');
    const poopRecords = records.filter(r => r.type === 'poop');
    const exerciseRecords = records.filter(r => r.type === 'exercise');
    const weightRecords = records.filter(r => r.type === 'weight');
    
    // 運動時間の合計を計算（amountがあればその値、なければ1回30分と仮定）
    const exerciseMinutes = exerciseRecords.reduce((total, record) => {
      if (record.amount && record.unit === 'minutes' && !isNaN(record.amount)) {
        return total + record.amount;
      }
      return total + 30; // デフォルト30分
    }, 0);
    
    // 最新の体重を取得
    const latestWeightRecord = weightRecords.length > 0 
      ? weightRecords.sort((a, b) => a.time.localeCompare(b.time)).pop()
      : undefined;
    const latestWeight = latestWeightRecord?.amount && !isNaN(latestWeightRecord.amount) 
      ? latestWeightRecord.amount 
      : undefined;
    
    return {
      weight: latestWeight,
      mealsCount: mealRecords.length,
      poopsCount: poopRecords.length,
      exerciseMinutes
    };
  },

  mapRowToRecord(row: any): Record {
    return {
      id: row.id,
      date: row.date,
      type: row.type as 'meal' | 'poop' | 'exercise' | 'weight',
      time: row.time,
      detail: row.detail,
      amount: row.amount !== null && row.amount !== undefined ? Number(row.amount) : undefined,
      unit: row.unit
    };
  }
};