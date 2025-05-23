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
		marginVertical: 16,
		backgroundColor: "#fff9f0",
		borderRadius: 24,
		padding: 16,
		borderWidth: 1,
		borderColor: "#ede0d4",
		shadowColor: "#8b4513",
		shadowOpacity: 0.15,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 14,
		color: "#8b4513",
		textAlign: "center",
	},
	dayCard: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 16,
		marginRight: 14,
		minWidth: 110,
		alignItems: "center",
		shadowColor: "#8b4513",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 3,
		borderWidth: 1,
		borderColor: "#ede0d4",
	},
	date: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 8,
		color: "#8b4513",
		backgroundColor: "#fff9f0",
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 12,
	},
	item: {
		fontSize: 13,
		color: "#a67c52",
		marginBottom: 4,
		lineHeight: 20,
	},
});

export default WeeklySummaryCard;
