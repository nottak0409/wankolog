import { notificationItemService } from '../../app/services/notificationItemService';
import { petService, medicalService, recordService } from '../../app/database/services';
import { isVaccineNotificationEnabled } from '../../app/(tabs)/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

// モック設定
jest.mock('../../app/database/services');
jest.mock('../../app/(tabs)/settings');
jest.mock('@react-native-async-storage/async-storage');

const mockPetService = petService as jest.Mocked<typeof petService>;
const mockMedicalService = medicalService as jest.Mocked<typeof medicalService>;
const mockRecordService = recordService as jest.Mocked<typeof recordService>;
const mockIsVaccineNotificationEnabled = isVaccineNotificationEnabled as jest.MockedFunction<typeof isVaccineNotificationEnabled>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('notificationItemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('generateNotifications', () => {
    it('ペットが登録されていない場合は空の配列を返す', async () => {
      mockPetService.getAll.mockResolvedValue([]);
      
      const result = await notificationItemService.generateNotifications();
      
      expect(result).toEqual([]);
    });

    it('通知が正常に生成される', async () => {
      const mockPet = {
        id: 'pet1',
        name: 'テストペット',
        gender: 'male' as const,
        birthday: new Date('2020-01-01'),
        breed: 'テスト犬種',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPetService.getAll.mockResolvedValue([mockPet]);
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([]);
      mockRecordService.getByDate.mockResolvedValue([]);

      const result = await notificationItemService.generateNotifications();
      
      expect(result).toBeInstanceOf(Array);
      expect(mockPetService.getAll).toHaveBeenCalled();
    });

    it('エラーが発生した場合は空の配列を返す', async () => {
      mockPetService.getAll.mockRejectedValue(new Error('Database error'));
      
      const result = await notificationItemService.generateNotifications();
      
      expect(result).toEqual([]);
    });
  });

  describe('checkVaccineNotifications', () => {
    const mockPet = {
      id: 'pet1',
      name: 'テストペット',
      gender: 'male' as const,
      birthday: new Date('2020-01-01'),
      breed: 'テスト犬種',
      created_at: new Date(),
      updated_at: new Date()
    };

    beforeEach(() => {
      mockPetService.getAll.mockResolvedValue([mockPet]);
    });

    it('ワクチン通知が無効の場合は空の配列を返す', async () => {
      mockIsVaccineNotificationEnabled.mockResolvedValue(false);
      
      const result = await notificationItemService.checkVaccineNotifications();
      
      expect(result).toEqual([]);
    });

    it('1週間以内のワクチン接種予定で通知を生成する', async () => {
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const mockVaccine = {
        id: 'vaccine1',
        petId: 'pet1',
        type: '狂犬病ワクチン',
        lastDate: new Date('2023-01-01'),
        nextDate: tomorrow
      };

      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([mockVaccine]);
      
      const result = await notificationItemService.checkVaccineNotifications();
      
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('vaccine');
      expect(result[0].priority).toBe('high');
      expect(result[0].title).toBe('ワクチン接種のお知らせ');
    });

    it('当日のワクチン接種予定で高優先度通知を生成する', async () => {
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      
      const today = new Date();
      
      const mockVaccine = {
        id: 'vaccine1',
        petId: 'pet1',
        type: '狂犬病ワクチン',
        lastDate: new Date('2023-01-01'),
        nextDate: today
      };

      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([mockVaccine]);
      
      const result = await notificationItemService.checkVaccineNotifications();
      
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
      expect(result[0].message).toContain('接種予定日です');
    });

    it('1週間以上先のワクチン接種予定では通知を生成しない', async () => {
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 8);
      
      const mockVaccine = {
        id: 'vaccine1',
        petId: 'pet1',
        type: '狂犬病ワクチン',
        lastDate: new Date('2023-01-01'),
        nextDate: futureDate
      };

      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([mockVaccine]);
      
      const result = await notificationItemService.checkVaccineNotifications();
      
      expect(result).toHaveLength(0);
    });
  });

  describe('checkDailyRecords', () => {
    const mockPet = {
      id: 'pet1',
      name: 'テストペット',
      gender: 'male' as const,
      birthday: new Date('2020-01-01'),
      breed: 'テスト犬種',
      created_at: new Date(),
      updated_at: new Date()
    };

    beforeEach(() => {
      mockPetService.getAll.mockResolvedValue([mockPet]);
    });

    it('ペットが登録されていない場合はnullを返す', async () => {
      mockPetService.getAll.mockResolvedValue([]);
      
      const result = await notificationItemService.checkDailyRecords();
      
      expect(result).toBeNull();
    });

    it('当日の記録がある場合はnullを返す', async () => {
      const mockRecord = {
        id: 'record1',
        date: new Date().toISOString().split('T')[0],
        type: 'meal' as const,
        time: '09:00',
        detail: 'テスト記録'
      };

      mockRecordService.getByDate.mockResolvedValue([mockRecord]);
      
      const result = await notificationItemService.checkDailyRecords();
      
      expect(result).toBeNull();
    });

    it('当日の記録がない場合は通知を生成する（朝の時間帯）', async () => {
      // 朝9時に設定
      const mockDate = new Date();
      mockDate.setHours(9, 0, 0, 0);
      jest.setSystemTime(mockDate);

      mockRecordService.getByDate.mockResolvedValue([]);
      
      const result = await notificationItemService.checkDailyRecords();
      
      expect(result).not.toBeNull();
      expect(result!.type).toBe('daily_record');
      expect(result!.priority).toBe('medium');
      expect(result!.message).toContain('健康管理を始めましょう');
    });

    it('当日の記録がない場合は通知を生成する（夜の時間帯）', async () => {
      // 夜20時に設定
      const mockDate = new Date();
      mockDate.setHours(20, 0, 0, 0);
      jest.setSystemTime(mockDate);

      mockRecordService.getByDate.mockResolvedValue([]);
      
      const result = await notificationItemService.checkDailyRecords();
      
      expect(result).not.toBeNull();
      expect(result!.priority).toBe('high');
      expect(result!.message).toContain('振り返り');
    });

    it('深夜時間帯では通知を生成しない', async () => {
      // 深夜2時に設定
      const mockDate = new Date();
      mockDate.setHours(2, 0, 0, 0);
      jest.setSystemTime(mockDate);

      mockRecordService.getByDate.mockResolvedValue([]);
      
      const result = await notificationItemService.checkDailyRecords();
      
      expect(result).toBeNull();
    });
  });

  describe('dismissNotification', () => {
    it('通知を正常に却下できる', async () => {
      const notificationId = 'test_notification_1';
      const existingDismissed = JSON.stringify(['other_notification']);
      
      mockAsyncStorage.getItem.mockResolvedValue(existingDismissed);
      mockAsyncStorage.setItem.mockResolvedValue();
      
      await notificationItemService.dismissNotification(notificationId);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('dismissed_notifications_'),
        JSON.stringify(['other_notification', notificationId])
      );
    });

    it('既存の却下リストがない場合も正常に動作する', async () => {
      const notificationId = 'test_notification_1';
      
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();
      
      await notificationItemService.dismissNotification(notificationId);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('dismissed_notifications_'),
        JSON.stringify([notificationId])
      );
    });
  });

  describe('isDismissed', () => {
    it('却下された通知の場合はtrueを返す', async () => {
      const notificationId = 'test_notification_1';
      const dismissedList = JSON.stringify([notificationId, 'other_notification']);
      
      mockAsyncStorage.getItem.mockResolvedValue(dismissedList);
      
      const result = await notificationItemService.isDismissed(notificationId);
      
      expect(result).toBe(true);
    });

    it('却下されていない通知の場合はfalseを返す', async () => {
      const notificationId = 'test_notification_1';
      const dismissedList = JSON.stringify(['other_notification']);
      
      mockAsyncStorage.getItem.mockResolvedValue(dismissedList);
      
      const result = await notificationItemService.isDismissed(notificationId);
      
      expect(result).toBe(false);
    });

    it('却下リストが存在しない場合はfalseを返す', async () => {
      const notificationId = 'test_notification_1';
      
      mockAsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await notificationItemService.isDismissed(notificationId);
      
      expect(result).toBe(false);
    });
  });
});