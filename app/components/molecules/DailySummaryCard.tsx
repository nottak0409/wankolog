// 今日の記録概要カード
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type DailySummaryCardProps = {
	weight?: number;
	mealsCount?: number;
	poopsCount?: number;
	exerciseMinutes?: number;
};

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
	weight,
	mealsCount,
	poopsCount,
	exerciseMinutes,
}) => {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>今日の記録</Text>
			<View style={styles.row}>
				<View style={styles.item}>
					<Text style={styles.label}>📏 体重</Text>
					<Text style={styles.value}>
						{weight ? `${weight} kg` : "--"}
					</Text>
				</View>
				<View style={styles.item}>
					<Text style={styles.label}>🍽 食事</Text>
					<Text style={styles.value}>{mealsCount ?? "--"} 回</Text>
				</View>
				<View style={styles.item}>
					<Text style={styles.label}>💩 うんち</Text>
					<Text style={styles.value}>{poopsCount ?? "--"} 回</Text>
				</View>
				<View style={styles.item}>
					<Text style={styles.label}>🏃‍♂️ 運動</Text>
					<Text style={styles.value}>
						{exerciseMinutes ?? "--"} 分
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		padding: 16,
		marginVertical: 12,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#222",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	item: {
		alignItems: "center",
		flex: 1,
	},
	label: {
		fontSize: 13,
		color: "#555",
		marginBottom: 2,
	},
	value: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
});

export default DailySummaryCard;
