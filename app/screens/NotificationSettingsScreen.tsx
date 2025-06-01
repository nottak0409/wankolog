import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NotificationSetting,
  DEFAULT_NOTIFICATION_SETTINGS,
  FREQUENCY_OPTIONS,
} from "../types/notification";
import { TimePicker } from "../components/molecules/TimePicker";
import theme from "../constants/theme";

const getNotificationTypeIcon = (type: string) => {
  switch (type) {
    case "vaccine":
      return "needle";
    case "medication":
      return "pill";
    case "health_check":
      return "stethoscope";
    default:
      return "bell";
  }
};

const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case "vaccine":
      return "ワクチン通知";
    case "medication":
      return "投薬通知";
    case "health_check":
      return "健康チェック通知";
    default:
      return "通知";
  }
};

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSetting[]>(
    DEFAULT_NOTIFICATION_SETTINGS
  );

  const handleToggle = (id: string, enabled: boolean) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled } : setting
      )
    );
  };

  const handleTimeChange = (id: string, time: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, time } : setting
      )
    );
  };

  const handleFrequencyChange = (id: string, frequency: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              frequency: frequency as "daily" | "weekly" | "monthly" | "custom",
            }
          : setting
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔔 通知設定</Text>

      {settings.map((setting) => (
        <View key={setting.id} style={styles.settingCard}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name={getNotificationTypeIcon(setting.type)}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.settingTitle}>
                {getNotificationTypeLabel(setting.type)}
              </Text>
            </View>
            <Switch
              value={setting.enabled}
              onValueChange={(enabled) => handleToggle(setting.id, enabled)}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={theme.colors.background.main}
            />
          </View>

          {setting.enabled && (
            <View style={styles.settingDetails}>
              <View style={styles.settingRow}>
                <Text style={styles.label}>通知時刻</Text>
                <TimePicker
                  time={setting.time || "09:00"}
                  onTimeChange={(time) => handleTimeChange(setting.id, time)}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.label}>通知頻度</Text>
                <View style={styles.frequencyButtons}>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.frequencyButton,
                        setting.frequency === option.value &&
                          styles.frequencyButtonActive,
                      ]}
                      onPress={() =>
                        handleFrequencyChange(setting.id, option.value)
                      }
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          setting.frequency === option.value &&
                            styles.frequencyButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {setting.frequency === "custom" && (
                <View style={styles.customDaysContainer}>
                  <Text style={styles.label}>カスタム日数</Text>
                  <View style={styles.customDaysInput}>
                    <Text style={styles.customDaysText}>
                      {setting.customDays || 1}
                    </Text>
                    <Text style={styles.customDaysUnit}>日</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
  },
  settingCard: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  settingDetails: {
    marginTop: theme.spacing.md,
  },
  settingRow: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  frequencyButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.xs,
  },
  frequencyButton: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  frequencyButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  frequencyButtonText: {
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  frequencyButtonTextActive: {
    color: theme.colors.background.main,
    fontWeight: "bold",
  },
  customDaysContainer: {
    marginTop: theme.spacing.sm,
  },
  customDaysInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    width: 100,
  },
  customDaysText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  customDaysUnit: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
