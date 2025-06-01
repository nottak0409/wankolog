import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import theme from "../constants/theme";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "設定",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          router.push("/notification-settings");
        }}
      >
        <View style={styles.menuContent}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.menuText}>通知設定</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
});
