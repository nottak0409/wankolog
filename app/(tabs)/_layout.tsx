import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopColor: "#ede0d4",
					paddingBottom: 0,
				},
				headerStyle: {
					backgroundColor: "#fff",
					elevation: 1,
					shadowColor: "#8b4513",
					shadowOpacity: 0.1,
					shadowRadius: 4,
					shadowOffset: { width: 0, height: 2 },
				},
				headerTitleStyle: {
					color: "#6b3c11",
					fontWeight: "600",
				},
				tabBarActiveTintColor: "#6b3c11",
				tabBarInactiveTintColor: "#a67c52",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "ホーム",
					headerTitle: "わんこログ 🐶",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="home" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "カレンダー",
					headerTitle: "カレンダー",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="calendar" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "履歴",
					headerTitle: "履歴",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="list" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="pet-profile"
				options={{
					title: "プロフィール",
					headerTitle: "愛犬プロフィール",
					headerTitleStyle: {
						color: "#6b3c11",
					},
					headerStyle: {
						backgroundColor: "#fff",
					},
					tabBarIcon: ({ color }) => (
						<FontAwesome name="paw" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "設定",
					headerTitle: "設定",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="cog" size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
