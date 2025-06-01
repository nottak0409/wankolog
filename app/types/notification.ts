export interface NotificationSetting {
  id: string;
  type: "vaccine" | "medication" | "health_check";
  enabled: boolean;
  time?: string; // HH:mm形式
  frequency?: "daily" | "weekly" | "monthly" | "custom";
  customDays?: number; // カスタム頻度の場合の日数
  lastNotified?: Date;
  nextNotification?: Date;
}

export interface NotificationFrequency {
  label: string;
  value: "daily" | "weekly" | "monthly" | "custom";
}

export interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export interface NotificationSettingsState {
  settings: NotificationSetting[];
  updateSetting: (id: string, updates: Partial<NotificationSetting>) => void;
}

// 通知設定の初期値
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "vaccine",
    type: "vaccine",
    enabled: true,
    time: "09:00",
    frequency: "weekly",
    lastNotified: new Date(),
    nextNotification: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
  },
  {
    id: "medication",
    type: "medication",
    enabled: true,
    time: "08:00",
    frequency: "daily",
    lastNotified: new Date(),
    nextNotification: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1日後
  },
  {
    id: "health_check",
    type: "health_check",
    enabled: true,
    time: "10:00",
    frequency: "monthly",
    lastNotified: new Date(),
    nextNotification: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
  },
];

export const FREQUENCY_OPTIONS: NotificationFrequency[] = [
  { label: "毎日", value: "daily" },
  { label: "毎週", value: "weekly" },
  { label: "毎月", value: "monthly" },
  { label: "カスタム", value: "custom" },
];
