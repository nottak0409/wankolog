// 今週の記録カード（横スクロール）
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, shadow, borderRadius } from "../../constants/theme";

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
		marginVertical: spacing.md,
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
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
	dayCard: {
		backgroundColor: colors.background.main,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		marginRight: spacing.md,
		minWidth: 110,
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border.main,
		...shadow.sm,
	},
	date: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: spacing.sm,
		color: colors.text.secondary,
		backgroundColor: colors.background.secondary,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
		borderRadius: borderRadius.md,
	},
	item: {
		fontSize: 13,
		color: colors.secondary,
		marginBottom: spacing.xs,
		lineHeight: 20,
	},
});

export default WeeklySummaryCard;
