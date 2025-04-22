import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>ホーム</Text>
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
