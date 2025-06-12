import { petService, medicalService, recordService } from '../database/services';
import { isVaccineNotificationEnabled } from '../(tabs)/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationItem {
  id: string;
  type: 'vaccine' | 'daily_record' | 'general';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionType?: 'navigate' | 'dismiss';
  actionTarget?: string;
  createdAt: Date;
  data?: any;
}

export const notificationItemService = {
  async generateNotifications(): Promise<NotificationItem[]> {
    const notifications: NotificationItem[] = [];
    
    try {
      // ワクチン通知をチェック
      const vaccineNotifications = await this.checkVaccineNotifications();
      notifications.push(...vaccineNotifications);
      
      // 当日記録をチェック
      const dailyRecordNotification = await this.checkDailyRecords();
      if (dailyRecordNotification) {
        notifications.push(dailyRecordNotification);
      }
      
      // 優先度順にソート
      return notifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('お知らせ生成エラー:', error);
      return [];
    }
  },

  async checkVaccineNotifications(): Promise<NotificationItem[]> {
    const notifications: NotificationItem[] = [];
    
    // 通知設定が無効の場合はスキップ
    const notificationEnabled = await isVaccineNotificationEnabled();
    if (!notificationEnabled) return notifications;
    
    try {
      const pets = await petService.getAll();
      if (pets.length === 0) return notifications;
      
      const pet = pets[0];
      const vaccines = await medicalService.getVaccineRecordsByPetId(pet.id);
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);
      
      for (const vaccine of vaccines) {
        const nextDate = vaccine.nextDate;
        const daysUntilNext = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // 1週間以内にワクチン接種予定がある場合
        if (daysUntilNext >= 0 && daysUntilNext <= 7) {
          let priority: 'high' | 'medium' | 'low' = 'medium';
          let message = '';
          
          if (daysUntilNext === 0) {
            priority = 'high';
            message = `${vaccine.type}の接種予定日です`;
          } else if (daysUntilNext <= 3) {
            priority = 'high';
            message = `${vaccine.type}の接種まであと${daysUntilNext}日です`;
          } else {
            priority = 'medium';
            message = `${vaccine.type}の接種まで1週間を切りました（あと${daysUntilNext}日）`;
          }
          
          notifications.push({
            id: `vaccine_${vaccine.id}_${today.toDateString()}`,
            type: 'vaccine',
            title: 'ワクチン接種のお知らせ',
            message,
            priority,
            actionType: 'navigate',
            actionTarget: '/history',
            createdAt: today,
            data: { vaccineId: vaccine.id }
          });
        }
      }
    } catch (error) {
      console.error('ワクチン通知チェックエラー:', error);
    }
    
    return notifications;
  },

  async checkDailyRecords(): Promise<NotificationItem | null> {
    try {
      const pets = await petService.getAll();
      if (pets.length === 0) return null;
      
      const pet = pets[0];
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = await recordService.getByDate(pet.id, today);
      
      // 当日の記録が何もない場合
      if (todayRecords.length === 0) {
        const now = new Date();
        const hour = now.getHours();
        
        // 朝（6-11時）、昼（12-17時）、夜（18-22時）によってメッセージを変える
        let message = '';
        let priority: 'high' | 'medium' | 'low' = 'low';
        
        if (hour >= 6 && hour <= 11) {
          message = '今日の記録をつけて、わんちゃんの健康管理を始めましょう！';
          priority = 'medium';
        } else if (hour >= 12 && hour <= 17) {
          message = 'まだ今日の記録がありません。お散歩や食事の記録をつけませんか？';
          priority = 'medium';
        } else if (hour >= 18 && hour <= 22) {
          message = '今日の振り返りはいかがですか？1日の記録をつけて完了させましょう。';
          priority = 'high';
        } else {
          // 深夜・早朝は通知しない
          return null;
        }
        
        return {
          id: `daily_record_${today}`,
          type: 'daily_record',
          title: '今日の記録',
          message,
          priority,
          actionType: 'navigate',
          actionTarget: '/',
          createdAt: now
        };
      }
      
      return null;
    } catch (error) {
      console.error('日次記録チェックエラー:', error);
      return null;
    }
  },

  async dismissNotification(notificationId: string): Promise<void> {
    // 必要に応じて、却下された通知をキャッシュして同日に再表示を防ぐ
    try {
      const dismissedKey = `dismissed_notifications_${new Date().toDateString()}`;
      const existing = await AsyncStorage.getItem(dismissedKey);
      const dismissed = existing ? JSON.parse(existing) : [];
      dismissed.push(notificationId);
      
      await AsyncStorage.setItem(dismissedKey, JSON.stringify(dismissed));
    } catch (error) {
      console.error('通知却下の保存エラー:', error);
    }
  },

  async isDismissed(notificationId: string): Promise<boolean> {
    try {
      const dismissedKey = `dismissed_notifications_${new Date().toDateString()}`;
      const existing = await AsyncStorage.getItem(dismissedKey);
      const dismissed = existing ? JSON.parse(existing) : [];
      return dismissed.includes(notificationId);
    } catch (error) {
      console.error('通知却下状態の確認エラー:', error);
      return false;
    }
  }
};