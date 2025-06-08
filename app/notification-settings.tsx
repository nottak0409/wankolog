import React from "react";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";
import { Stack } from "expo-router";
import theme from "./constants/theme";

export default function NotificationSettingsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "通知設定",
          presentation: "modal",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
          headerBackTitle: "",
        }}
      />
      <NotificationSettingsScreen />
    </>
  );
}
