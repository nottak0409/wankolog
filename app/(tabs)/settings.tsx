import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from "../services/notificationService";
import { petService, medicalService } from "../database/services";
import theme from "../constants/theme";

const VACCINE_NOTIFICATION_KEY = 'vaccineNotificationEnabled';

export default function SettingsScreen() {
  const [vaccineNotificationEnabled, setVaccineNotificationEnabled] = useState(true);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
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
