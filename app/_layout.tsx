import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./constants/theme";
import { initDatabase } from "./database/init";
import { notificationService } from "./services/notificationService";
import { subscriptionService } from "./services/subscriptionService";
import { initializeRevenueCat } from "./config/revenuecat";
import * as Notifications from 'expo-notifications';
import { debugLog } from "./utils/debugUtils";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      try {
        // データベースの初期化
        debugLog.db('Initializing database...');
        await initDatabase();
        debugLog.db('Database initialized successfully');
        
        // 通知権限の要求
        await notificationService.requestPermissions();
        
        // RevenueCatの初期化（開発環境では設定なしでもクラッシュしない）
        try {
          await initializeRevenueCat();
          await subscriptionService.initialize();
          debugLog.log('RevenueCat初期化完了');
        } catch (error) {
          debugLog.log('RevenueCat初期化スキップ:', error);
        }
        
        // 通知リスナーの設定
        const notificationListener = notificationService.addNotificationListener(
          (notification) => {
            debugLog.notification('通知を受信:', notification);
          }
        );
        
        const responseListener = notificationService.addNotificationResponseListener(
          (response) => {
            debugLog.notification('通知に対するユーザーのアクション:', response);
            
            // ワクチン通知の場合、履歴画面に遷移
            if (response.notification.request.content.data?.type === 'vaccine_reminder') {
              router.push('/history');
            }
          }
        );
        
        // クリーンアップ関数を返す
        return () => {
          notificationListener && Notifications.removeNotificationSubscription(notificationListener);
          responseListener && Notifications.removeNotificationSubscription(responseListener);
        };
        
      } catch (error) {
        debugLog.error('Failed to initialize app:', error);
      }
    };
    
    const cleanup = initApp();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
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
          <Stack.Screen
            name="vaccine-record-edit"
            options={{ title: "ワクチン記録" }}
          />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
