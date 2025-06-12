import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import { colors, spacing } from "../constants/theme";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import NotificationBanner from "../components/molecules/NotificationBanner";
import PetProfileCard from "../components/molecules/PetProfileCard";
import type { Notification } from "../types/notification";
import type { PetProfile } from "../types/profile";
import { petService, recordService } from "../database/services";

export default function HomeScreen() {
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const allPets = await petService.getAll();
      setPets(allPets);
      if (allPets.length > 0) {
        setCurrentPet(allPets[0]); // 最初のペットを選択
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  // 仮データ（後でデータベースから取得）
  const todaySummary = {
    weight: 6.2,
    mealsCount: 2,
    poopsCount: 1,
    exerciseMinutes: 30,
  };

  const weekSummary = [
    {
      date: "5/18",
      weight: 6.1,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 25,
    },
    {
      date: "5/19",
      weight: 6.2,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 30,
    },
    {
      date: "5/20",
      weight: 6.2,
      mealsCount: 2,
      poopsCount: 2,
      exerciseMinutes: 20,
    },
    {
      date: "5/21",
      weight: 6.3,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 35,
    },
    {
      date: "5/22",
      weight: 6.2,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 30,
    },
    {
      date: "5/23",
      weight: 6.2,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 30,
    },
    {
      date: "5/24",
      weight: 6.2,
      mealsCount: 2,
      poopsCount: 1,
      exerciseMinutes: 30,
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
        <Text style={styles.noPetText}>ペットを登録してください</Text>
      )}
      <DailySummaryCard {...todaySummary} />
      <WeeklySummaryCard data={weekSummary} />
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
  noPetText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 16,
    marginVertical: spacing.lg,
  },
});
