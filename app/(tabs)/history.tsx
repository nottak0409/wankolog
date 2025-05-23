import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function HistoryScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.header}>履歴</Text>
			<View style={styles.content}>
				<Text style={styles.placeholder}>履歴機能は開発中です</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff9f0",
	},
	header: {
		fontSize: 24,
		fontWeight: "600",
		color: "#6b3c11",
		textAlign: "center",
		backgroundColor: "#fff",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ede0d4",
		shadowColor: "#8b4513",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	placeholder: {
		fontSize: 18,
		color: "#a67c52",
		textAlign: "center",
	},
});
