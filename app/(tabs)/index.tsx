import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { colors, spacing } from "../constants/theme";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import NotificationBanner from "../components/molecules/NotificationBanner";
import PetProfileCard from "../components/molecules/PetProfileCard";
import type { Notification } from "../types/notification";
import type { PetProfile } from "../types/profile";
import { petService, recordService } from "../database/services";
import { DailySummary } from "../types/record";

export default function HomeScreen() {
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [todaySummary, setTodaySummary] = useState<DailySummary>({
    weight: undefined,
    mealsCount: 0,
    poopsCount: 0,
    exerciseMinutes: 0,
  });
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  const loadPets = useCallback(async () => {
    try {
      const allPets = await petService.getAll();
      if (allPets.length > 0) {
        setCurrentPet(allPets[0]); // 最初のペットを選択
        await loadTodayRecords(allPets[0].id);
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  }, []);

  const loadTodayRecords = async (petId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const summary = await recordService.getDailySummary(petId, today);
      setTodaySummary(summary);
    } catch (error) {
      console.error('Failed to load today records:', error);
    }
  };

  // 過去一週間のサマリー（実装可能だが今回は仮データを使用）
  const weekSummary = [
    {
      date: "今日",
      weight: 0,
      mealsCount: todaySummary.mealsCount,
      poopsCount: todaySummary.poopsCount,
      exerciseMinutes: todaySummary.exerciseMinutes,
    },
  ];

  const notifications: Notification[] = [
    {
      id: "1",
      message: "ワクチン接種の予定日が近づいています",
      date: "5/24 09:00",
      type: "medical_history",
      data: {
        vaccineId: "vaccine-1",
      },
    },
    {
      id: "2",
      message: "ごはんの記録を忘れずに！",
      date: "5/23 18:00",
      type: "daily_record",
      data: {
        recordDate: new Date().toISOString().split("T")[0],
      },
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentPet ? (
        <PetProfileCard
          name={currentPet.name}
          imageUrl={currentPet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"}
        />
      ) : (
        <TouchableOpacity 
          onPress={() => router.push('/pet-profile-edit')}
          style={styles.noPetContainer}
        >
          <Text style={styles.noPetText}>ペットを登録してください</Text>
          <Text style={styles.noPetSubText}>タップして新規登録</Text>
        </TouchableOpacity>
      )}
      <DailySummaryCard {...todaySummary} />
      <WeeklySummaryCard data={weekSummary} />
      
      {/* 記録追加ボタン */}
      <TouchableOpacity 
        style={styles.addRecordButton}
        onPress={() => router.push('/daily-record')}
      >
        <Text style={styles.addRecordButtonText}>記録を追加</Text>
      </TouchableOpacity>
      
      <NotificationBanner notifications={notifications} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  noPetContainer: {
    backgroundColor: colors.background.main,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noPetText: {
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  noPetSubText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 14,
  },
  addRecordButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  addRecordButtonText: {
    color: colors.background.main,
    fontSize: 16,
    fontWeight: '600',
  },
});
