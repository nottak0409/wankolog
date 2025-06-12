import { petService } from '../../../app/database/services/petService';
import { ensureDatabase } from '../../../app/database/init';
import { PetProfile } from '../../../app/types/profile';

// モック設定
jest.mock('../../../app/database/init');

const mockEnsureDatabase = ensureDatabase as jest.MockedFunction<typeof ensureDatabase>;

describe('petService', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(),
    };
    mockEnsureDatabase.mockResolvedValue(mockDb);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockPetData: Omit<PetProfile, 'id' | 'created_at' | 'updated_at'> = {
      name: 'テスト犬',
      gender: 'male',
      birthday: new Date('2020-01-01'), // Dateオブジェクトに変更
      breed: '柴犬',
      weight: 10.5,
      registrationNumber: '123456',
      microchipNumber: '987654321',
      photo: 'path/to/photo.jpg',
      notes: 'テストメモ'
    };

    it('ペットを正常に作成できる', async () => {
      mockDb.runAsync.mockResolvedValue({});
      
      const result = await petService.create(mockPetData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO pets'),
        expect.arrayContaining([
          result,
          mockPetData.name,
          mockPetData.gender,
          mockPetData.birthday.toISOString().split('T')[0],
          mockPetData.breed,
          mockPetData.weight,
          mockPetData.registrationNumber,
          mockPetData.microchipNumber,
          mockPetData.photo,
          mockPetData.notes
        ])
      );
    });

    it('オプショナルフィールドがnullの場合も正常に作成できる', async () => {
      const minimalPetData = {
        name: 'テスト犬',
        gender: 'female' as const,
        birthday: new Date('2020-01-01'),
        breed: '柴犬'
      };

      mockDb.runAsync.mockResolvedValue({});
      
      const result = await petService.create(minimalPetData);
      
      expect(result).toBeDefined();
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO pets'),
        expect.arrayContaining([
          result,
          minimalPetData.name,
          minimalPetData.gender,
          minimalPetData.birthday.toISOString().split('T')[0],
          minimalPetData.breed,
          null, // weight
          null, // registration_number
          null, // microchip_number
          null, // photo
          null  // notes
        ])
      );
    });

    it('データベースエラーが発生した場合は例外を投げる', async () => {
      mockDb.runAsync.mockRejectedValue(new Error('Database error'));
      
      await expect(petService.create(mockPetData)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('存在するIDでペットを取得できる', async () => {
      const mockRow = {
        id: 'pet1',
        name: 'テスト犬',
        gender: 'male',
        birthday: '2020-01-01',
        breed: '柴犬',
        weight: 10.5,
        registration_number: '123456',
        microchip_number: '987654321',
        photo_url: 'path/to/photo.jpg',
        notes: 'テストメモ',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      mockDb.getFirstAsync.mockResolvedValue(mockRow);
      
      const result = await petService.getById('pet1');
      
      expect(result).not.toBeNull();
      expect(result!.id).toBe('pet1');
      expect(result!.name).toBe('テスト犬');
      expect(result!.gender).toBe('male');
      expect(result!.weight).toBe(10.5);
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT * FROM pets WHERE id = ?',
        ['pet1']
      );
    });

    it('存在しないIDの場合はnullを返す', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);
      
      const result = await petService.getById('nonexistent');
      
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('全てのペットを取得できる', async () => {
      const mockRows = [
        {
          id: 'pet1',
          name: 'テスト犬1',
          gender: 'male',
          birthday: '2020-01-01',
          breed: '柴犬',
          weight: 10.5,
          registration_number: null,
          microchip_number: null,
          photo_url: null,
          notes: null,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'pet2',
          name: 'テスト犬2',
          gender: 'female',
          birthday: '2021-01-01',
          breed: 'トイプードル',
          weight: 5.0,
          registration_number: '654321',
          microchip_number: '123456789',
          photo_url: 'path/to/photo2.jpg',
          notes: 'テストメモ2',
          created_at: '2024-01-02T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z'
        }
      ];

      mockDb.getAllAsync.mockResolvedValue(mockRows);
      
      const result = await petService.getAll();
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('テスト犬1');
      expect(result[1].name).toBe('テスト犬2');
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM pets ORDER BY created_at DESC'
      );
    });

    it('ペットが存在しない場合は空の配列を返す', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);
      
      const result = await petService.getAll();
      
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('ペット情報を正常に更新できる', async () => {
      const updates = {
        name: '更新されたテスト犬',
        weight: 11.0,
        notes: '更新されたメモ'
      };

      mockDb.runAsync.mockResolvedValue({});
      
      await petService.update('pet1', updates);
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE pets SET'),
        expect.arrayContaining([
          updates.name,
          updates.weight,
          updates.notes,
          'pet1'
        ])
      );
    });

    it('一部のフィールドのみ更新できる', async () => {
      const updates = {
        weight: 12.0
      };

      mockDb.runAsync.mockResolvedValue({});
      
      await petService.update('pet1', updates);
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'UPDATE pets SET weight = ? WHERE id = ?',
        [updates.weight, 'pet1']
      );
    });

    it('更新するフィールドがない場合はデータベースを呼び出さない', async () => {
      await petService.update('pet1', {});
      
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('ペットを正常に削除できる', async () => {
      mockDb.runAsync.mockResolvedValue({});
      
      await petService.delete('pet1');
      
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM pets WHERE id = ?',
        ['pet1']
      );
    });

    it('データベースエラーが発生した場合は例外を投げる', async () => {
      mockDb.runAsync.mockRejectedValue(new Error('Delete failed'));
      
      await expect(petService.delete('pet1')).rejects.toThrow('Delete failed');
    });
  });

  describe('mapRowToPet', () => {
    it('データベース行をPetProfileオブジェクトに正しくマッピングする', () => {
      const mockRow = {
        id: 'pet1',
        name: 'テスト犬',
        gender: 'male',
        birthday: '2020-01-01',
        breed: '柴犬',
        weight: 10.5,
        registration_number: '123456',
        microchip_number: '987654321',
        photo_url: 'path/to/photo.jpg',
        notes: 'テストメモ',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      const result = petService.mapRowToPet(mockRow);
      
      expect(result).toEqual({
        id: 'pet1',
        name: 'テスト犬',
        gender: 'male',
        birthday: new Date('2020-01-01'),
        breed: '柴犬',
        weight: 10.5,
        registrationNumber: '123456',
        microchipNumber: '987654321',
        photo: 'path/to/photo.jpg',
        notes: 'テストメモ'
      });
    });

    it('null値を正しく処理する', () => {
      const mockRow = {
        id: 'pet1',
        name: 'テスト犬',
        gender: 'female',
        birthday: '2020-01-01',
        breed: '柴犬',
        weight: null,
        registration_number: null,
        microchip_number: null,
        photo_url: null,
        notes: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      const result = petService.mapRowToPet(mockRow);
      
      expect(result.weight).toBeNull();
      expect(result.registrationNumber).toBeNull();
      expect(result.microchipNumber).toBeNull();
      expect(result.photo).toBeNull();
      expect(result.notes).toBeNull();
    });
  });
});