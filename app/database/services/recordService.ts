import { getDatabase } from '../init';
import { Record, RecordsByDate } from '../../types/record';

export const recordService = {
  async create(record: Omit<Record, 'id'> & { petId: string }): Promise<string> {
    const db = getDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO daily_records (id, pet_id, type, date, time, detail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        record.petId,
        record.type,
        record.date,
        record.time,
        record.detail
      ]
    );
    
    return id;
  },

  async getById(id: string): Promise<Record | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync(
      `SELECT * FROM daily_records WHERE id = ?`,
      [id]
    );
    
    if (!result) return null;
    
    return this.mapRowToRecord(result as any);
  },

  async getByPetId(petId: string): Promise<Record[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM daily_records WHERE pet_id = ? ORDER BY date DESC, time DESC`,
      [petId]
    );
    
    return results.map(row => this.mapRowToRecord(row as any));
  },

  async getByDateRange(petId: string, startDate: string, endDate: string): Promise<RecordsByDate> {
    const db = getDatabase();
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
    const db = getDatabase();
    const results = await db.getAllAsync(
      `SELECT * FROM daily_records WHERE pet_id = ? AND date = ? ORDER BY time DESC`,
      [petId, date]
    );
    
    return results.map(row => this.mapRowToRecord(row as any));
  },

  async update(id: string, updates: Partial<Omit<Record, 'id'>>): Promise<void> {
    const db = getDatabase();
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
    
    if (fields.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE daily_records SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(`DELETE FROM daily_records WHERE id = ?`, [id]);
  },

  async deleteByPetId(petId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(`DELETE FROM daily_records WHERE pet_id = ?`, [petId]);
  },

  mapRowToRecord(row: any): Record {
    return {
      id: row.id,
      date: row.date,
      type: row.type as 'meal' | 'poop' | 'exercise',
      time: row.time,
      detail: row.detail
    };
  }
};