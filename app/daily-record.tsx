import React from "react";
import DailyRecordScreen from "./screens/DailyRecordScreen";
import { Stack } from "expo-router";
import theme from "./constants/theme";

export default function DailyRecordLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "記録を追加",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
          presentation: "modal",
        }}
      />
      <DailyRecordScreen />
    </>
  );
}
