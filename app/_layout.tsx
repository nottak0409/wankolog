import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import theme from "./constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
          contentStyle: {
            backgroundColor: theme.colors.background.secondary,
          },
          headerBackTitle: "",
          headerLargeTitle: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pet-profile-edit"
          options={{
            title: "愛犬プロフィール編集",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="notification-settings"
          options={{
            title: "通知設定",
            presentation: "modal",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
