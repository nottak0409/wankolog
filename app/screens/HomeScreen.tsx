import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import NotificationBanner from "../components/molecules/NotificationBanner";

export default function HomeScreen() {
	// 仮データ（後でReduxやAPI連携に差し替え）
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
		{ date: "5/24" },
	];

	const notifications = [
		{
			id: "1",
			message: "ワクチン接種の予定日が近づいています",
			date: "5/24 09:00",
		},
		{ id: "2", message: "ごはんの記録を忘れずに！", date: "5/23 18:00" },
	];

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
		>
			<Text style={styles.header}>わんこログ 🐶</Text>
			<DailySummaryCard {...todaySummary} />
			<WeeklySummaryCard week={weekSummary} />
			<NotificationBanner notifications={notifications} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		padding: 20,
		paddingBottom: 40,
	},
	header: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 12,
		color: "#222",
		textAlign: "left",
	},
});
