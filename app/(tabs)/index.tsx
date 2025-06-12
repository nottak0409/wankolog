import { StyleSheet, ScrollView, TouchableOpacity, AppState, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { colors, spacing } from "../constants/theme";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import PetProfileCard from "../components/molecules/PetProfileCard";
import { NotificationCard } from "../components/molecules/NotificationCard";
import type { PetProfile } from "../types/profile";
import { petService, recordService } from "../database/services";
import { DailySummary } from "../types/record";
import { notificationItemService, NotificationItem } from "../services/notificationItemService";
import { getJapanToday } from "../utils/dateUtils";

export default function HomeScreen() {
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [todaySummary, setTodaySummary] = useState<DailySummary>({
    weight: undefined,
    mealsCount: 0,
    poopsCount: 0,
    exerciseMinutes: 0,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const lastLoadedDate = useRef<string>('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadPets();
      loadNotifications();
    }, [])
  );

  // 日付変更を監視するためのタイマー（日本時間ベース）
  useEffect(() => {
    const checkDateChange = () => {
      const today = getJapanToday(); // 日本時間の今日
      if (lastLoadedDate.current && lastLoadedDate.current !== today) {
        console.log('日付が変わりました (JST):', lastLoadedDate.current, '->', today);
        // 日付が変わったら今日のデータを再読み込み
        if (currentPet) {
          loadTodayRecords(currentPet.id);
        }
        loadNotifications(); // 通知も再生成
      }
      lastLoadedDate.current = today;
    };

    // 初回チェック
    checkDateChange();
    
    // 1分ごとに日付変更をチェック
    const interval = setInterval(checkDateChange, 60000);
    
    return () => clearInterval(interval);
  }, [currentPet]);

  // アプリがアクティブになった時に日付をチェック（日本時間ベース）
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('アプリがアクティブになりました');
        const today = getJapanToday(); // 日本時間の今日
        if (lastLoadedDate.current !== today && currentPet) {
          console.log('日付が変わったため再読み込み (JST):', lastLoadedDate.current, '->', today);
          loadTodayRecords(currentPet.id);
          loadNotifications();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [currentPet]);

  const loadPets = async () => {
    try {
      const allPets = await petService.getAll();
      if (allPets.length > 0) {
        setCurrentPet(allPets[0]); // 最初のペットを選択
        await loadTodayRecords(allPets[0].id);
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const loadTodayRecords = async (petId: string) => {
    try {
      const today = getJapanToday(); // 日本時間の今日を使用
      console.log('今日のデータを読み込み中 (JST):', today);
      
      const summary = await recordService.getDailySummary(petId, today);
      setTodaySummary(summary);
      lastLoadedDate.current = today;
    } catch (error) {
      console.error('Failed to load today records:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const generatedNotifications = await notificationItemService.generateNotifications();
      console.log('生成された通知:', generatedNotifications);
      
      // 却下された通知を除外
      const filteredNotifications = [];
      for (const notification of generatedNotifications) {
        const isDismissed = await notificationItemService.isDismissed(notification.id);
        if (!isDismissed) {
          filteredNotifications.push(notification);
        }
      }
      console.log('フィルタ後の通知:', filteredNotifications);
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleDismissNotification = async (notificationId: string) => {
    await notificationItemService.dismissNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // 過去一週間のサマリー（実装可能だが今回は仮データを使用）
  const weekSummary = [
    {
      date: "今日",
      weight: 0,
      mealsCount: todaySummary.mealsCount,
      poopsCount: todaySummary.poopsCount,
      exerciseMinutes: todaySummary.exerciseMinutes,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentPet ? (
        <PetProfileCard
          name={currentPet.name}
          imageUrl={currentPet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"}
        />
      ) : (
        <TouchableOpacity 
          onPress={() => router.push('/pet-profile-edit')}
          style={styles.noPetContainer}
        >
          <Text style={styles.noPetText}>ペットを登録してください</Text>
          <Text style={styles.noPetSubText}>タップして新規登録</Text>
        </TouchableOpacity>
      )}

      <NotificationCard
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

      <DailySummaryCard {...todaySummary} />
      <WeeklySummaryCard data={weekSummary} />
      
      {/* 記録追加ボタン */}
      <TouchableOpacity 
        style={styles.addRecordButton}
        onPress={() => router.push('/daily-record')}
      >
        <Text style={styles.addRecordButtonText}>記録を追加</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  noPetContainer: {
    backgroundColor: colors.background.main,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noPetText: {
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  noPetSubText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 14,
  },
  addRecordButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  addRecordButtonText: {
    color: colors.background.main,
    fontSize: 16,
    fontWeight: '600',
  },
});
