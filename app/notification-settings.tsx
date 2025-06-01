import React from "react";
import { Stack } from "expo-router";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";

export default function NotificationSettingsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "通知設定",
        }}
      />
      <NotificationSettingsScreen />
    </>
  );
}
