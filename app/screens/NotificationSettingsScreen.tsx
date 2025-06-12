import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from "../services/notificationService";
import { petService, medicalService } from "../database/services";
import theme from "../constants/theme";

const VACCINE_NOTIFICATION_KEY = 'vaccineNotificationEnabled';

export default function NotificationSettingsScreen() {
  const [vaccineNotificationEnabled, setVaccineNotificationEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(VACCINE_NOTIFICATION_KEY);
      if (stored !== null) {
        setVaccineNotificationEnabled(JSON.parse(stored));
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVaccineNotificationToggle = async (enabled: boolean) => {
    try {
      setVaccineNotificationEnabled(enabled);
      await AsyncStorage.setItem(VACCINE_NOTIFICATION_KEY, JSON.stringify(enabled));
      
      if (enabled) {
        // 通知を有効にした場合、すべてのワクチン記録に対して通知をスケジュール
        await rescheduleAllVaccineNotifications();
      } else {
        // 通知を無効にした場合、すべてのワクチン通知をキャンセル
        await notificationService.cancelAllNotifications();
      }
      
      Alert.alert(
        '成功',
        enabled 
          ? 'ワクチン通知を有効にしました'
          : 'ワクチン通知を無効にしました'
      );
    } catch (error) {
      console.error('設定の保存エラー:', error);
      Alert.alert('エラー', '設定の保存に失敗しました');
      // エラー時は元の状態に戻す
      setVaccineNotificationEnabled(!enabled);
    }
  };

  const rescheduleAllVaccineNotifications = async () => {
    try {
      const pets = await petService.getAll();
      if (pets.length === 0) return;
      
      const pet = pets[0];
      const vaccines = await medicalService.getVaccineRecordsByPetId(pet.id);
      
      for (const vaccine of vaccines) {
        await notificationService.scheduleVaccineNotification(
          vaccine.id,
          vaccine.type,
          pet.name,
          vaccine.nextDate
        );
      }
    } catch (error) {
      console.error('ワクチン通知の再スケジュールエラー:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 通知設定</Text>
        <Text style={styles.subtitle}>ワクチンの接種予定日を通知でお知らせします</Text>
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="needle"
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.textContainer}>
              <Text style={styles.settingTitle}>ワクチン通知</Text>
              <Text style={styles.settingDescription}>
                接種予定日の1週間前に通知します
              </Text>
            </View>
          </View>
          <Switch
            value={vaccineNotificationEnabled}
            onValueChange={handleVaccineNotificationToggle}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor={
              vaccineNotificationEnabled
                ? theme.colors.background.main
                : "#f4f3f4"
            }
          />
        </View>
        
        {vaccineNotificationEnabled && (
          <View style={styles.notificationInfo}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.infoText}>
              登録されたすべてのワクチン記録に対して通知が送られます
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// グローバルにアクセスできる関数
export const isVaccineNotificationEnabled = async (): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(VACCINE_NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : true; // デフォルトは有効
  } catch (error) {
    console.error('通知設定の読み込みエラー:', error);
    return true;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  settingCard: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
    lineHeight: 16,
  },
});
