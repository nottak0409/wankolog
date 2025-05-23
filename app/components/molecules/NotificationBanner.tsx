// お知らせ・通知バナー
import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
	banner: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#ede0d4",
		shadowColor: "#8b4513",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 3,
	},
	message: {
		fontSize: 14,
		color: "#6b3c11",
		marginBottom: 6,
		lineHeight: 20,
	},
	date: {
		fontSize: 12,
		color: "#8b4513",
		textAlign: "right",
		backgroundColor: "#fff9f0",
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 12,
		alignSelf: "flex-end",
	},
});

export default NotificationBanner;
