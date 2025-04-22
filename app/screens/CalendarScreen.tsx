import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

export default function CalendarScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>カレンダー</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
