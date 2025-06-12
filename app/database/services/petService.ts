import { getDatabase } from '../init';
import { PetProfile } from '../../types/profile';

export const petService = {
  async create(pet: Omit<PetProfile, 'id'>): Promise<string> {
    const db = getDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    await db.runAsync(
      `INSERT INTO pets (id, name, gender, birthday, breed, weight, registration_number, microchip_number, photo_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        pet.name,
        pet.gender,
        pet.birthday.toISOString().split('T')[0],
        pet.breed,
        pet.weight || null,
        pet.registrationNumber || null,
        pet.microchipNumber || null,
        pet.photo || null,
        pet.notes || null
      ]
    );
    
    return id;
  },

  async getById(id: string): Promise<PetProfile | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync(
      `SELECT * FROM pets WHERE id = ?`,
      [id]
    );
    
    if (!result) return null;
    
    return this.mapRowToPet(result as any);
  },

  async getAll(): Promise<PetProfile[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(`SELECT * FROM pets ORDER BY created_at DESC`);
    
    return results.map(row => this.mapRowToPet(row as any));
  },

  async update(id: string, updates: Partial<Omit<PetProfile, 'id'>>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.gender !== undefined) {
      fields.push('gender = ?');
      values.push(updates.gender);
    }
    if (updates.birthday !== undefined) {
      fields.push('birthday = ?');
      values.push(updates.birthday.toISOString().split('T')[0]);
    }
    if (updates.breed !== undefined) {
      fields.push('breed = ?');
      values.push(updates.breed);
    }
    if (updates.weight !== undefined) {
      fields.push('weight = ?');
      values.push(updates.weight);
    }
    if (updates.registrationNumber !== undefined) {
      fields.push('registration_number = ?');
      values.push(updates.registrationNumber);
    }
    if (updates.microchipNumber !== undefined) {
      fields.push('microchip_number = ?');
      values.push(updates.microchipNumber);
    }
    if (updates.photo !== undefined) {
      fields.push('photo_url = ?');
      values.push(updates.photo);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    
    if (fields.length > 0) {
      values.push(id);
      await db.runAsync(
        `UPDATE pets SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(`DELETE FROM pets WHERE id = ?`, [id]);
  },

  mapRowToPet(row: any): PetProfile {
    return {
      id: row.id,
      name: row.name,
      gender: row.gender as 'male' | 'female',
      birthday: new Date(row.birthday),
      breed: row.breed,
      weight: row.weight,
      registrationNumber: row.registration_number,
      microchipNumber: row.microchip_number,
      photo: row.photo_url,
      notes: row.notes
    };
  }
};