import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import theme from "../../constants/theme";

export type WeekData = {
	date: string;
	weight: number;
	mealsCount: number;
	poopsCount: number;
	exerciseMinutes: number;
};

type WeeklySummaryCardProps = {
	data: WeekData[];
};

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ data }) => {
	console.log(data);
	if (!data || data.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>今週の記録</Text>
				<Text style={styles.noDataText}>記録がありません</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>今週の記録</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.cardsContainer}>
					{data.map((day, index) => (
						<View key={day.date} style={styles.dayCard}>
							<Text style={styles.dateText}>{day.date}</Text>
							<View style={styles.dataRow}>
								<Text style={styles.label}>体重</Text>
								<Text style={styles.value}>{day.weight}kg</Text>
							</View>
							<View style={styles.dataRow}>
								<Text style={styles.label}>食事</Text>
								<Text style={styles.value}>
									{day.mealsCount}回
								</Text>
							</View>
							<View style={styles.dataRow}>
								<Text style={styles.label}>うんち</Text>
								<Text style={styles.value}>
									{day.poopsCount}回
								</Text>
							</View>
							<View style={styles.dataRow}>
								<Text style={styles.label}>運動</Text>
								<Text style={styles.value}>
									{day.exerciseMinutes}分
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.background.main,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.md,
		...theme.shadows.sm,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: theme.colors.text.primary,
		marginBottom: theme.spacing.md,
	},
	cardsContainer: {
		flexDirection: "row",
		gap: theme.spacing.sm,
	},
	dayCard: {
		width: 140,
		backgroundColor: theme.colors.background.secondary,
		borderRadius: theme.borderRadius.sm,
		padding: theme.spacing.md,
	},
	dateText: {
		fontSize: 14,
		fontWeight: "600",
		color: theme.colors.primary,
		marginBottom: theme.spacing.sm,
	},
	dataRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing.xs,
	},
	label: {
		fontSize: 12,
		color: theme.colors.text.secondary,
	},
	value: {
		fontSize: 12,
		fontWeight: "600",
		color: theme.colors.text.primary,
	},
	noDataText: {
		fontSize: 14,
		color: theme.colors.text.secondary,
		textAlign: "center",
		padding: theme.spacing.md,
	},
});

export default WeeklySummaryCard;
