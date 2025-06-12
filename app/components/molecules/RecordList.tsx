import React from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import { Record } from "../../types/record";

const getIconName = (type: Record["type"]) => {
	switch (type) {
		case "meal":
			return "restaurant";
		case "poop":
			return "nutrition";
		case "exercise":
			return "walk";
		case "weight":
			return "scale";
		default:
			return "alert-circle";
	}
};

type RecordListProps = {
	records: Record[];
	date?: string;
	showEditButton?: boolean;
	onEditRecord?: (record: Record) => void;
};

export const RecordList = ({ records, date, showEditButton = false, onEditRecord }: RecordListProps) => {
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
				<Text style={styles.time}>
					{item.time}
					{item.amount && item.unit && !isNaN(item.amount) && (
						<Text style={styles.amount}> ({item.amount}{item.unit})</Text>
					)}
				</Text>
				<Text style={styles.detail}>{item.detail}</Text>
			</View>
			{showEditButton && onEditRecord && (
				<TouchableOpacity
					style={styles.editButton}
					onPress={() => onEditRecord(item)}
				>
					<Ionicons
						name="pencil"
						size={16}
						color={theme.colors.primary}
					/>
				</TouchableOpacity>
			)}
		</View>
	);

	const formatDate = (date?: string) => {
		if (!date) return "今日の記録";
		const d = new Date(date);
		return `${d.getMonth() + 1}月${d.getDate()}日の記録`;
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{formatDate(date)}</Text>
			{records.length > 0 ? (
				<FlatList
					data={records}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View style={styles.emptyContainer}>
					<Ionicons
						name="document-text-outline"
						size={32}
						color={theme.colors.text.secondary}
					/>
					<Text style={styles.emptyText}>記録はありません</Text>
				</View>
			)}
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
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing.xl,
	},
	emptyText: {
		fontSize: 14,
		color: theme.colors.text.secondary,
		marginTop: theme.spacing.sm,
	},
	amount: {
		fontSize: 12,
		color: theme.colors.text.secondary,
		fontWeight: "normal",
	},
	editButton: {
		padding: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		backgroundColor: theme.colors.background.main,
		marginLeft: theme.spacing.sm,
	},
});
