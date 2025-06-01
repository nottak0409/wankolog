import React from "react";
import { Stack } from "expo-router";
import PetProfileEditScreen from "./screens/PetProfileEditScreen";

export default function PetProfileEditLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "プロフィール編集",
          presentation: "modal",
        }}
      />
      <PetProfileEditScreen />
    </>
  );
}
