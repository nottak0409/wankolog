import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function HistoryScreen() {
	return (
		<View style={styles.container}>
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
