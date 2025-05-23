import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: "#fff",
					},
					contentStyle: {
						backgroundColor: "#fff",
					},
				}}
			>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</SafeAreaProvider>
	);
}
