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
		marginVertical: 12,
	},
	title: {
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#222",
	},
	banner: {
		backgroundColor: "#fef9c3",
		borderRadius: 8,
		padding: 10,
		marginBottom: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#facc15",
	},
	message: {
		fontSize: 13,
		color: "#7c5700",
		marginBottom: 2,
	},
	date: {
		fontSize: 11,
		color: "#bfa600",
		textAlign: "right",
	},
});

export default NotificationBanner;
