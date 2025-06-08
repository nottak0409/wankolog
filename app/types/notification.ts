export type NotificationType = "daily_record" | "medical_history";

export interface Notification {
  id: string;
  message: string;
  date: string;
  type?: NotificationType;
  data?: {
    recordDate?: string;
    vaccineId?: string;
  };
}

export interface NotificationSetting {
  id: string;
  type: string;
  enabled: boolean;
  time: string;
  frequency: string;
  customDays?: string[];
}

export interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export const FREQUENCY_OPTIONS = [
  { label: "毎日", value: "daily" },
  { label: "毎週", value: "weekly" },
  { label: "毎月", value: "monthly" },
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "1",
    type: "食事記録",
    enabled: true,
    time: "09:00",
    frequency: "daily",
  },
  {
    id: "2",
    type: "運動記録",
    enabled: true,
    time: "18:00",
    frequency: "daily",
  },
  {
    id: "3",
    type: "体重記録",
    enabled: true,
    time: "20:00",
    frequency: "weekly",
  },
];
