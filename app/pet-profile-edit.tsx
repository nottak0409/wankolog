import React from "react";
import PetProfileEditScreen from "./screens/PetProfileEditScreen";
import { Stack } from "expo-router";
import theme from "./constants/theme";

export default function PetProfileEditLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "愛犬プロフィール編集",
          presentation: "modal",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
          headerBackTitle: "",
        }}
      />
      <PetProfileEditScreen />
    </>
  );
}
