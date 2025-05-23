// 愛犬プロフィールカード
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type PetProfileCardProps = {
	name: string;
	imageUrl: string;
};

const PetProfileCard: React.FC<PetProfileCardProps> = ({ name, imageUrl }) => {
	const router = useRouter();

	const handlePress = () => {
		router.push("/(tabs)/pet-profile" as never);
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: imageUrl }}
					style={styles.image}
					resizeMode="cover"
				/>
			</View>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.name}>{name}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginBottom: 16,
	},
	imageContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		overflow: "hidden",
		marginBottom: 8,
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
		fontSize: 20,
		fontWeight: "600",
		color: "#6b3c11",
		textDecorationLine: "underline",
	},
});

export default PetProfileCard;
