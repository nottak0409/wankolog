import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import { Record } from "../../types/record";

const getIconName = (type: Record["type"]) => {
	switch (type) {
		case "meal":
			return "restaurant";
		case "poop":
			return "fitness";
		case "exercise":
			return "walk";
		default:
			return "alert-circle";
	}
};

export const RecordList = ({ records }: { records: Record[] }) => {
	const renderItem = ({ item }: { item: Record }) => (
		<View style={styles.recordItem}>
			<View style={styles.iconContainer}>
				<Ionicons
					name={getIconName(item.type)}
					size={24}
					color={theme.colors.primary}
				/>
			</View>
			<View style={styles.recordContent}>
				<Text style={styles.time}>{item.time}</Text>
				<Text style={styles.detail}>{item.detail}</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>今日の記録</Text>
			<FlatList
				data={records}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.background.main,
		borderRadius: theme.borderRadius.md,
		margin: theme.spacing.md,
		padding: theme.spacing.md,
		...theme.shadows.sm,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: theme.colors.text.primary,
		marginBottom: theme.spacing.md,
	},
	listContent: {
		gap: theme.spacing.sm,
	},
	recordItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: theme.spacing.sm,
		backgroundColor: theme.colors.background.secondary,
		borderRadius: theme.borderRadius.sm,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: theme.colors.background.main,
		justifyContent: "center",
		alignItems: "center",
		marginRight: theme.spacing.md,
	},
	recordContent: {
		flex: 1,
	},
	time: {
		fontSize: 14,
		color: theme.colors.text.secondary,
		marginBottom: 2,
	},
	detail: {
		fontSize: 14,
		color: theme.colors.text.primary,
	},
});
