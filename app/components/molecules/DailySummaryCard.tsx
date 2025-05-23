// 今日の記録概要カード
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadow, borderRadius } from "../../constants/theme";

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
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.lg,
		padding: spacing.lg,
		marginVertical: spacing.md,
		borderWidth: 1,
		borderColor: colors.border.main,
		...shadow.md,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: spacing.md,
		color: colors.text.secondary,
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
		flexWrap: "wrap",
		padding: spacing.xs,
	},
	item: {
		alignItems: "center",
		backgroundColor: colors.background.main,
		padding: spacing.md,
		borderRadius: borderRadius.lg,
		marginHorizontal: spacing.xs,
		marginVertical: spacing.xs,
		minWidth: "45%",
		borderWidth: 1,
		borderColor: colors.border.main,
		...shadow.sm,
	},
	label: {
		fontSize: 15,
		color: colors.secondary,
		marginBottom: spacing.xs,
	},
	value: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.secondary,
	},
});

export default DailySummaryCard;
