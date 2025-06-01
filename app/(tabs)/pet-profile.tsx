import React from "react";
import { Stack } from "expo-router";
import PetProfileScreen from "../screens/PetProfileScreen";
import theme from "../constants/theme";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PetProfileLayout() {
  const router = useRouter();

  const handleEditPress = () => {
    router.push("/pet-profile-edit");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "愛犬プロフィール",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleEditPress}
              style={{ padding: theme.spacing.sm }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <PetProfileScreen />
    </>
  );
}
