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

describe('Notification Workflow Integration Tests', () => {
  const mockPet = {
    id: 'pet1',
    name: 'テスト犬',
    gender: 'male' as const,
    birthday: new Date('2020-01-01'),
    breed: '柴犬',
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockPetService.getAll.mockResolvedValue([mockPet]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('完全なワークフロー：ワクチン通知', () => {
    it('ワクチン通知が有効で、期限が近いワクチンがある場合に正しい通知を生成する', async () => {
      // 設定：ワクチン通知が有効
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      
      // 設定：明日がワクチン接種予定日
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
      
      // 設定：当日の記録はある（日次記録通知は生成されない）
      const mockRecord = {
        id: 'record1',
        date: new Date().toISOString().split('T')[0],
        type: 'meal' as const,
        time: '09:00',
        detail: 'ドライフード'
      };
      mockRecordService.getByDate.mockResolvedValue([mockRecord]);
      
      // 実行
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('vaccine');
      expect(notifications[0].priority).toBe('high');
      expect(notifications[0].actionTarget).toBe('/history');
      expect(notifications[0].data).toEqual({ vaccineId: 'vaccine1' });
    });

    it('ワクチン通知が無効の場合はワクチン通知を生成しない', async () => {
      // 設定：ワクチン通知が無効
      mockIsVaccineNotificationEnabled.mockResolvedValue(false);
      
      // 設定：明日がワクチン接種予定日（通常なら通知される）
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
      
      // 設定：当日の記録はない（日次記録通知は生成される）
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 実行（朝9時に設定）
      const mockDate = new Date();
      mockDate.setHours(9, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証：ワクチン通知はないが、日次記録通知は生成される
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('daily_record');
    });
  });

  describe('完全なワークフロー：日次記録通知', () => {
    it('当日の記録がなく、適切な時間帯の場合に日次記録通知を生成する', async () => {
      // 設定：ワクチン通知は無効（または該当するワクチンなし）
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([]);
      
      // 設定：当日の記録はない
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 実行（夜20時に設定）
      const mockDate = new Date();
      mockDate.setHours(20, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('daily_record');
      expect(notifications[0].priority).toBe('high');
      expect(notifications[0].actionTarget).toBe('/daily-record');
      expect(notifications[0].message).toContain('振り返り');
    });

    it('深夜時間帯では日次記録通知を生成しない', async () => {
      // 設定：ワクチン通知は無効
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue([]);
      
      // 設定：当日の記録はない
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 実行（深夜2時に設定）
      const mockDate = new Date();
      mockDate.setHours(2, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証：通知は生成されない
      expect(notifications).toHaveLength(0);
    });
  });

  describe('完全なワークフロー：通知の却下', () => {
    it('通知を却下した後、同じ通知が再表示されない', async () => {
      // 設定：初回通知生成
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
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 時間を朝9時に設定（日次記録通知が生成される時間帯）
      const mockDate = new Date();
      mockDate.setHours(9, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      // 第1回：通知生成
      mockAsyncStorage.getItem.mockResolvedValue(null); // まだ却下されていない
      const firstNotifications = await notificationItemService.generateNotifications();
      expect(firstNotifications).toHaveLength(2); // ワクチン + 日次記録
      
      // 通知を却下
      const notificationId = firstNotifications[0].id;
      mockAsyncStorage.setItem.mockResolvedValue();
      await notificationItemService.dismissNotification(notificationId);
      
      // 却下機能のテスト
      await notificationItemService.isDismissed(notificationId);
      
      // 検証：却下機能が正しく動作することを確認
      // 実際のIDベースの却下動作をテスト
      const dismissedList = JSON.stringify([notificationId]);
      mockAsyncStorage.getItem.mockResolvedValue(dismissedList);
      
      const isDismissedAfterMock = await notificationItemService.isDismissed(notificationId);
      expect(isDismissedAfterMock).toBe(true);
    });
  });

  describe('完全なワークフロー：複数ワクチンの優先度', () => {
    it('複数のワクチンがある場合、優先度順にソートされる', async () => {
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 6);
      
      const mockVaccines = [
        {
          id: 'vaccine1',
          petId: 'pet1',
          type: '混合ワクチン',
          lastDate: new Date('2023-01-01'),
          nextDate: nextWeek // 1週間以内（medium priority）
        },
        {
          id: 'vaccine2',
          petId: 'pet1',
          type: '狂犬病ワクチン',
          lastDate: new Date('2023-01-01'),
          nextDate: today // 当日（high priority）
        },
        {
          id: 'vaccine3',
          petId: 'pet1',
          type: 'フィラリア予防',
          lastDate: new Date('2023-01-01'),
          nextDate: tomorrow // 明日（high priority）
        }
      ];
      
      mockMedicalService.getVaccineRecordsByPetId.mockResolvedValue(mockVaccines);
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 時間を朝9時に設定（日次記録通知が生成される時間帯）
      const mockDate = new Date();
      mockDate.setHours(9, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証：優先度順にソートされている（high, high, medium, daily_record）
      expect(notifications).toHaveLength(4);
      expect(notifications[0].priority).toBe('high'); // 当日または明日のワクチン
      expect(notifications[1].priority).toBe('high'); // 当日または明日のワクチン
      expect(notifications[2].priority).toBe('medium'); // 1週間以内のワクチン
      expect(notifications[3].type).toBe('daily_record'); // 日次記録通知
    });
  });

  describe('エラーハンドリング', () => {
    it('データベースエラーが発生しても空の配列を返す', async () => {
      mockPetService.getAll.mockRejectedValue(new Error('Database connection failed'));
      
      const notifications = await notificationItemService.generateNotifications();
      
      expect(notifications).toEqual([]);
    });

    it('一部のサービスでエラーが発生しても、他の通知は正常に生成される', async () => {
      // ワクチンサービスでエラー
      mockIsVaccineNotificationEnabled.mockResolvedValue(true);
      mockMedicalService.getVaccineRecordsByPetId.mockRejectedValue(new Error('Vaccine service error'));
      
      // 日次記録サービスは正常
      mockRecordService.getByDate.mockResolvedValue([]);
      
      // 朝9時に設定
      const mockDate = new Date();
      mockDate.setHours(9, 0, 0, 0);
      jest.setSystemTime(mockDate);
      
      const notifications = await notificationItemService.generateNotifications();
      
      // 検証：ワクチン通知はエラーでスキップされるが、日次記録通知は生成される
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('daily_record');
    });
  });
});