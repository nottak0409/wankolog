import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Date;
  data?: any;
}

export const notificationService = {
  // 通知権限を要求
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('通知権限の要求エラー:', error);
      return false;
    }
  },

  // 通知をスケジュール
  async scheduleNotification(notification: ScheduledNotification): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('通知権限が拒否されました');
        return null;
      }

      const now = new Date();
      if (notification.trigger <= now) {
        console.warn('過去の日時には通知をスケジュールできません');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: notification.trigger,
      });

      console.log('通知をスケジュールしました:', {
        id: notificationId,
        title: notification.title,
        trigger: notification.trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('通知のスケジュールエラー:', error);
      return null;
    }
  },

  // 通知をキャンセル
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('通知をキャンセルしました:', notificationId);
    } catch (error) {
      console.error('通知のキャンセルエラー:', error);
    }
  },

  // すべての通知をキャンセル
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('すべての通知をキャンセルしました');
    } catch (error) {
      console.error('すべての通知のキャンセルエラー:', error);
    }
  },

  // スケジュールされた通知を取得
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('スケジュールされた通知の取得エラー:', error);
      return [];
    }
  },

  // ワクチン通知をスケジュール（1週間前）
  async scheduleVaccineNotification(
    vaccineId: string,
    vaccineType: string,
    petName: string,
    nextDate: Date
  ): Promise<string | null> {
    const oneWeekBefore = new Date(nextDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (oneWeekBefore <= now) {
      console.warn('ワクチン接種日まで1週間を切っているため通知をスケジュールしません');
      return null;
    }

    return this.scheduleNotification({
      id: `vaccine_${vaccineId}`,
      title: `${petName}のワクチン接種予定`,
      body: `${vaccineType}の接種予定日（${nextDate.toLocaleDateString('ja-JP')}）が1週間後に迫っています。`,
      trigger: oneWeekBefore,
      data: {
        type: 'vaccine_reminder',
        vaccineId,
        vaccineType,
        petName,
        nextDate: nextDate.toISOString(),
      },
    });
  },

  // ワクチン通知をキャンセル
  async cancelVaccineNotification(vaccineId: string): Promise<void> {
    // スケジュールされた通知から該当するものを探してキャンセル
    const scheduledNotifications = await this.getScheduledNotifications();
    const vaccineNotification = scheduledNotifications.find(
      notification => notification.content.data?.vaccineId === vaccineId
    );

    if (vaccineNotification) {
      await this.cancelNotification(vaccineNotification.identifier);
    }
  },

  // 通知リスナーを設定
  addNotificationListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // 通知応答リスナーを設定
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  // デバッグ用: すべてのスケジュールされた通知を表示
  async logScheduledNotifications(): Promise<void> {
    const notifications = await this.getScheduledNotifications();
    console.log('スケジュールされた通知:', notifications.map(n => ({
      id: n.identifier,
      title: n.content.title,
      trigger: n.trigger,
      data: n.content.data,
    })));
  },
};