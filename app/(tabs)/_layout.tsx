import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colors, shadows } from "../constants/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: colors.background.main,
					borderTopColor: colors.border.main,
					paddingBottom: 0,
				},
				headerStyle: {
					backgroundColor: colors.background.main,
					...shadows.sm,
				},
				headerTitleStyle: {
					color: colors.text.primary,
					fontWeight: "600",
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.secondary,
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
						color: colors.text.primary,
					},
					headerStyle: {
						backgroundColor: colors.background.main,
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
