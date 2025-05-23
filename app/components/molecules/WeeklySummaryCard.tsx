// 今週の記録カード（横スクロール）
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

type DaySummary = {
	date: string; // "5/20" など
	weight?: number;
	mealsCount?: number;
	poopsCount?: number;
	exerciseMinutes?: number;
};

type WeeklySummaryCardProps = {
	week: DaySummary[];
};

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ week }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>今週の記録</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{week.map((day, idx) => (
					<View style={styles.dayCard} key={idx}>
						<Text style={styles.date}>{day.date}</Text>
						<Text style={styles.item}>
							📏 {day.weight ?? "--"}kg
						</Text>
						<Text style={styles.item}>
							🍽 {day.mealsCount ?? "--"}回
						</Text>
						<Text style={styles.item}>
							💩 {day.poopsCount ?? "--"}回
						</Text>
						<Text style={styles.item}>
							🏃‍♂️ {day.exerciseMinutes ?? "--"}分
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 12,
	},
	title: {
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#222",
	},
	dayCard: {
		backgroundColor: "#f1f5f9",
		borderRadius: 10,
		padding: 12,
		marginRight: 10,
		minWidth: 90,
		alignItems: "center",
	},
	date: {
		fontSize: 13,
		fontWeight: "bold",
		marginBottom: 4,
		color: "#555",
	},
	item: {
		fontSize: 12,
		color: "#444",
		marginBottom: 2,
	},
});

export default WeeklySummaryCard;
