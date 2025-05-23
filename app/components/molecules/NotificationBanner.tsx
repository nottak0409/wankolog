// お知らせ・通知バナー
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadow, borderRadius } from "../../constants/theme";

type Notification = {
	id: string;
	message: string;
	date: string; // "5/23 09:00" など
};

type NotificationBannerProps = {
	notifications: Notification[];
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
	notifications,
}) => {
	if (!notifications.length) return null;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>お知らせ・通知</Text>
			{notifications.map((n) => (
				<View style={styles.banner} key={n.id}>
					<Text style={styles.message}>{n.message}</Text>
					<Text style={styles.date}>{n.date}</Text>
				</View>
			))}
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
	banner: {
		backgroundColor: colors.background.main,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		marginBottom: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border.main,
		...shadow.sm,
	},
	message: {
		fontSize: 14,
		color: colors.text.primary,
		marginBottom: spacing.xs,
		lineHeight: 20,
	},
	date: {
		fontSize: 12,
		color: colors.text.secondary,
		textAlign: "right",
		backgroundColor: colors.background.secondary,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
		borderRadius: borderRadius.md,
		alignSelf: "flex-end",
	},
});

export default NotificationBanner;
