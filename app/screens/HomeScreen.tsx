import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import NotificationBanner from "../components/molecules/NotificationBanner";
import theme from "../constants/theme";

type DailySummary = {
  date: string;
  weight?: number;
  mealsCount: number;
  poopsCount: number;
  exerciseMinutes: number;
};

// 今日の日付から1週間分の日付を生成
const generateLastWeekDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const mockWeekData: DailySummary[] = generateLastWeekDates().map((date) => ({
  date,
  weight: 5.2,
  mealsCount: 2,
  poopsCount: Math.floor(Math.random() * 3) + 1,
  exerciseMinutes: 30 + Math.floor(Math.random() * 30),
}));

const HomeScreen = () => {
  const todayData =
    mockWeekData.length > 0
      ? mockWeekData[mockWeekData.length - 1]
      : {
          date: new Date().toISOString().split("T")[0],
          weight: undefined,
          mealsCount: 0,
          poopsCount: 0,
          exerciseMinutes: 0,
        };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <DailySummaryCard
          weight={todayData.weight}
          mealsCount={todayData.mealsCount}
          poopsCount={todayData.poopsCount}
          exerciseMinutes={todayData.exerciseMinutes}
          date={todayData.date}
        />
        <WeeklySummaryCard data={mockWeekData} />
        <NotificationBanner
          notifications={[
            {
              id: "1",
              message: "来週の火曜日に3種混合ワクチンの接種日です",
              date: "5/30 10:00",
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
});

export default HomeScreen;
