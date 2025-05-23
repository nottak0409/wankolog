import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../../constants/theme";

export const CalendarHeader = ({ title }: { title: string }) => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={styles.backButton}
			>
				<Ionicons
					name="chevron-back"
					size={24}
					color={theme.colors.primary}
				/>
			</TouchableOpacity>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border.main,
		backgroundColor: theme.colors.background.main,
	},
	backButton: {
		marginRight: theme.spacing.sm,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: theme.colors.text.primary,
	},
});
