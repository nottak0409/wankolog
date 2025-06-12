import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./constants/theme";
import { initDatabase } from "./database/init";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initDB();
  }, []);

  return (
    <PaperProvider>
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
            headerTitleStyle: {
              fontSize: 17,
              fontWeight: "600",
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={28}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            ),
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pet-profile-edit"
            options={{ title: "愛犬プロフィール編集" }}
          />
          <Stack.Screen
            name="notification-settings"
            options={{ title: "通知設定" }}
          />
          <Stack.Screen name="daily-record" options={{ title: "記録の追加" }} />
          <Stack.Screen
            name="medical-record-edit"
            options={{ title: "通院・治療の記録" }}
          />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
