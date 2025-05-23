import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top"]}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						backgroundColor: "#fff",
						borderTopColor: "#ede0d4",
						paddingBottom: 0,
					},
					tabBarActiveTintColor: "#6b3c11",
					tabBarInactiveTintColor: "#a67c52",
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "ホーム",
						tabBarIcon: ({ color }) => (
							<FontAwesome name="home" size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="calendar"
					options={{
						title: "カレンダー",
						tabBarIcon: ({ color }) => (
							<FontAwesome
								name="calendar"
								size={24}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="history"
					options={{
						title: "履歴",
						tabBarIcon: ({ color }) => (
							<FontAwesome name="list" size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="pet-profile"
					options={{
						title: "プロフィール",
						tabBarIcon: ({ color }) => (
							<FontAwesome name="paw" size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						title: "設定",
						tabBarIcon: ({ color }) => (
							<FontAwesome name="cog" size={24} color={color} />
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}
