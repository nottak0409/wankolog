import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from "../services/notificationService";
import { petService, medicalService } from "../database/services";
import { subscriptionService } from "../services/subscriptionService";
import theme from "../constants/theme";

const VACCINE_NOTIFICATION_KEY = 'vaccineNotificationEnabled';

export default function SettingsScreen() {
  const router = useRouter();
  const [vaccineNotificationEnabled, setVaccineNotificationEnabled] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(VACCINE_NOTIFICATION_KEY);
      if (stored !== null) {
        setVaccineNotificationEnabled(JSON.parse(stored));
      }
      
      // プレミアム状態を取得
      const premiumStatus = await subscriptionService.isPremiumUser();
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
  };

  const handleVaccineNotificationToggle = async (enabled: boolean) => {
    try {
      setVaccineNotificationEnabled(enabled);
      await AsyncStorage.setItem(VACCINE_NOTIFICATION_KEY, JSON.stringify(enabled));
      
      if (enabled) {
        await rescheduleAllVaccineNotifications();
      } else {
        await notificationService.cancelAllNotifications();
      }
    } catch (error) {
      console.error('設定の保存エラー:', error);
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

  // デバッグ用: プレミアム状態をトグル
  const handleTogglePremium = async () => {
    if (__DEV__) {
      await subscriptionService.togglePremiumForTesting();
      const newStatus = await subscriptionService.isPremiumUser();
      setIsPremium(newStatus);
      Alert.alert(
        'プレミアム状態変更',
        `プレミアム: ${newStatus ? 'ON' : 'OFF'}\n\n広告表示設定も更新されました。`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "設定",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      
      {/* 通知設定 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>通知設定</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuContent}>
          <MaterialCommunityIcons
            name="needle"
            size={24}
            color={theme.colors.primary}
          />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>ワクチン通知</Text>
            <Text style={styles.menuDescription}>
              接種予定日の1週間前に通知
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

      {/* プレミアム設定 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>プレミアム機能</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuContent}>
          <MaterialCommunityIcons
            name="crown"
            size={24}
            color={isPremium ? theme.colors.primary : theme.colors.text.secondary}
          />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>
              {isPremium ? 'プレミアムプラン有効' : '無料プラン'}
            </Text>
            <Text style={styles.menuDescription}>
              {isPremium ? '広告非表示、全機能利用可能' : '基本機能のみ利用可能'}
            </Text>
          </View>
        </View>
        {!isPremium && (
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/premium-upgrade')}
          >
            <Text style={styles.upgradeButtonText}>アップグレード</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 広告設定 */}
      <View style={styles.menuItem}>
        <View style={styles.menuContent}>
          <MaterialCommunityIcons
            name="advertisements"
            size={24}
            color={theme.colors.text.secondary}
          />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>広告表示</Text>
            <Text style={styles.menuDescription}>
              {isPremium ? '広告は表示されません' : '控えめな広告を表示'}
            </Text>
          </View>
        </View>
        <View style={styles.statusIndicator}>
          <Text style={[styles.statusText, { color: isPremium ? theme.colors.primary : theme.colors.text.secondary }]}>
            {isPremium ? 'OFF' : 'ON'}
          </Text>
        </View>
      </View>

      {/* デバッグ機能（開発環境のみ） */}
      {__DEV__ && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>デバッグ機能</Text>
          </View>
          <TouchableOpacity style={styles.debugMenuItem} onPress={handleTogglePremium}>
            <View style={styles.menuContent}>
              <MaterialCommunityIcons
                name="bug"
                size={24}
                color="#ff6b6b"
              />
              <View style={styles.textContainer}>
                <Text style={[styles.menuText, { color: '#ff6b6b' }]}>
                  プレミアム状態をトグル
                </Text>
                <Text style={styles.menuDescription}>
                  開発用: プレミアム機能のテスト
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  sectionHeader: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  debugMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#ff6b6b',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderStyle: 'dashed',
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  menuDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  upgradeButtonText: {
    color: theme.colors.background.main,
    fontSize: 12,
    fontWeight: '600',
  },
  statusIndicator: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

// グローバルにアクセスできる関数
export const isVaccineNotificationEnabled = async (): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(VACCINE_NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : true;
  } catch (error) {
    console.error('通知設定の読み込みエラー:', error);
    return true;
  }
};
