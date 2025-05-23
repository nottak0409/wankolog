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
		backgroundColor: "#fff9f0", // クリーム色
		borderRadius: 20,
		padding: 20,
		marginVertical: 12,
		shadowColor: "#8b4513",
		shadowOpacity: 0.15,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 3,
		borderWidth: 1,
		borderColor: "#ede0d4",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		color: "#8b4513",
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
		flexWrap: "wrap",
		padding: 4,
	},
	item: {
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		minWidth: "45%",
		shadowColor: "#8b4513",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderWidth: 1,
		borderColor: "#ede0d4",
	},
	label: {
		fontSize: 15,
		color: "#a67c52",
		marginBottom: 4,
	},
	value: {
		fontSize: 18,
		fontWeight: "600",
		color: "#8b4513",
	},
});

export default DailySummaryCard;
