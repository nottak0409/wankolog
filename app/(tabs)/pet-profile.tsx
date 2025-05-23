import React from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";

export default function PetProfileScreen() {
	// 仮データ（後でReduxやAPI連携に差し替え）
	const petData = {
		name: "ポチ",
		breed: "柴犬",
		birthday: "2022年5月1日",
		gender: "オス",
		imageUrl:
			"https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: petData.imageUrl }}
						style={styles.image}
						resizeMode="cover"
					/>
				</View>
				<Text style={styles.name}>{petData.name}</Text>
			</View>
			<View style={styles.infoContainer}>
				<View style={styles.infoRow}>
					<Text style={styles.label}>犬種</Text>
					<Text style={styles.value}>{petData.breed}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>誕生日</Text>
					<Text style={styles.value}>{petData.birthday}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>性別</Text>
					<Text style={styles.value}>{petData.gender}</Text>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff9f0",
	},
	content: {
		alignItems: "center",
		padding: 20,
	},
	imageContainer: {
		width: 160,
		height: 160,
		borderRadius: 80,
		overflow: "hidden",
		marginBottom: 16,
		backgroundColor: "#fff",
		shadowColor: "#8b4513",
		shadowOpacity: 0.15,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 4,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	name: {
		fontSize: 24,
		fontWeight: "600",
		color: "#6b3c11",
	},
	infoContainer: {
		padding: 20,
	},
	infoRow: {
		flexDirection: "row",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#ede0d4",
	},
	label: {
		width: 80,
		fontSize: 16,
		color: "#8b4513",
	},
	value: {
		flex: 1,
		fontSize: 16,
		color: "#6b3c11",
		marginLeft: 12,
	},
});
