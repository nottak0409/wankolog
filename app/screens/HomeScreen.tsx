import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import NotificationBanner from "../components/molecules/NotificationBanner";
import theme from "../constants/theme";
import type { WeekData } from "../components/molecules/WeeklySummaryCard";

const mockWeekData: WeekData[] = [
	{
		date: "5/17",
		weight: 5.2,
		mealsCount: 2,
		poopsCount: 2,
		exerciseMinutes: 30,
	},
	{
		date: "5/18",
		weight: 5.1,
		mealsCount: 2,
		poopsCount: 1,
		exerciseMinutes: 45,
	},
	{
		date: "5/19",
		weight: 5.2,
		mealsCount: 2,
		poopsCount: 2,
		exerciseMinutes: 20,
	},
	{
		date: "5/20",
		weight: 5.1,
		mealsCount: 2,
		poopsCount: 2,
		exerciseMinutes: 40,
	},
	{
		date: "5/21",
		weight: 5.2,
		mealsCount: 2,
		poopsCount: 1,
		exerciseMinutes: 30,
	},
	{
		date: "5/22",
		weight: 5.1,
		mealsCount: 2,
		poopsCount: 2,
		exerciseMinutes: 35,
	},
	{
		date: "5/23",
		weight: 5.2,
		mealsCount: 2,
		poopsCount: 2,
		exerciseMinutes: 30,
	},
];

const HomeScreen = () => {
	const todayData =
		mockWeekData.length > 0
			? mockWeekData[mockWeekData.length - 1]
			: {
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
				/>
				<WeeklySummaryCard data={mockWeekData} />
				<NotificationBanner
					notifications={[
						{
							id: "1",
							message:
								"来週の火曜日に3種混合ワクチンの接種日です",
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
