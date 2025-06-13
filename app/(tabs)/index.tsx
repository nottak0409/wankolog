import { StyleSheet, ScrollView, TouchableOpacity, AppState, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { colors, spacing } from "../constants/theme";
import DailySummaryCard from "../components/molecules/DailySummaryCard";
import WeeklySummaryCard from "../components/molecules/WeeklySummaryCard";
import PetProfileCard from "../components/molecules/PetProfileCard";
import { NotificationCard } from "../components/molecules/NotificationCard";
import { BannerAd } from "../components/ads";
import type { PetProfile } from "../types/profile";
import { petService, recordService } from "../database/services";
import { DailySummary } from "../types/record";
import { notificationItemService, NotificationItem } from "../services/notificationItemService";
import { getJapanToday } from "../utils/dateUtils";
import { debugLog } from "../utils/debugUtils";

export default function HomeScreen() {
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [todaySummary, setTodaySummary] = useState<DailySummary>({
    weight: undefined,
    mealsCount: 0,
    poopsCount: 0,
    exerciseMinutes: 0,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [weekSummaries, setWeekSummaries] = useState<Record<string, DailySummary>>({});
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
        debugLog.date('日付が変わりました (JST):', lastLoadedDate.current, '->', today);
        // 日付が変わったら今日のデータと週間データを再読み込み
        if (currentPet) {
          loadTodayRecords(currentPet.id);
          loadWeekSummaries(currentPet.id);
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
        debugLog.log('アプリがアクティブになりました');
        const today = getJapanToday(); // 日本時間の今日
        if (lastLoadedDate.current !== today && currentPet) {
          debugLog.date('日付が変わったため再読み込み (JST):', lastLoadedDate.current, '->', today);
          loadTodayRecords(currentPet.id);
          loadWeekSummaries(currentPet.id);
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
        await loadWeekSummaries(allPets[0].id); // 週間データも読み込み
      }
    } catch (error) {
      debugLog.error('Failed to load pets:', error);
    }
  };

  const loadTodayRecords = async (petId: string) => {
    try {
      const today = getJapanToday(); // 日本時間の今日を使用
      debugLog.log('今日のデータを読み込み中 (JST):', today);
      
      const summary = await recordService.getDailySummary(petId, today);
      setTodaySummary(summary);
      lastLoadedDate.current = today;
    } catch (error) {
      debugLog.error('Failed to load today records:', error);
    }
  };

  const loadWeekSummaries = async (petId: string) => {
    try {
      const summaries: Record<string, DailySummary> = {};
      
      debugLog.log('過去7日間のデータを読み込み中...');
      
      // 過去7日間のデータを取得（今日を含む）
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        // 日本時間ベースで計算
        const japanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        japanTime.setDate(japanTime.getDate() - i);
        const dateStr = japanTime.toISOString().split('T')[0];
        
        const summary = await recordService.getDailySummary(petId, dateStr);
        summaries[dateStr] = summary;
      }
      
      setWeekSummaries(summaries);
      debugLog.log('過去7日間のデータ読み込み完了:', Object.keys(summaries));
    } catch (error) {
      debugLog.error('Failed to load week summaries:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const generatedNotifications = await notificationItemService.generateNotifications();
      debugLog.notification('生成された通知:', generatedNotifications);
      
      // 却下された通知を除外
      const filteredNotifications = [];
      for (const notification of generatedNotifications) {
        const isDismissed = await notificationItemService.isDismissed(notification.id);
        if (!isDismissed) {
          filteredNotifications.push(notification);
        }
      }
      debugLog.notification('フィルタ後の通知:', filteredNotifications);
      setNotifications(filteredNotifications);
    } catch (error) {
      debugLog.error('Failed to load notifications:', error);
    }
  };

  const handleDismissNotification = async (notificationId: string) => {
    await notificationItemService.dismissNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // 過去7日間のサマリーを日付順（新しい順：今日から過去へ）で取得
  const getWeekSummaryData = () => {
    const weekData = [];
    
    // 過去7日間（今日を含む）を新しい順で生成（今日が最初）
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      const japanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
      japanTime.setDate(japanTime.getDate() - i);
      const dateStr = japanTime.toISOString().split('T')[0];
      
      const summary = weekSummaries[dateStr] || {
        weight: undefined,
        mealsCount: 0,
        poopsCount: 0,
        exerciseMinutes: 0,
      };
      
      // 日付ラベルを設定
      let dateLabel = dateStr;
      if (i === 0) {
        dateLabel = '今日';
      } else if (i === 1) {
        dateLabel = '昨日';
      } else {
        // MM/DD形式で表示
        const month = japanTime.getMonth() + 1;
        const day = japanTime.getDate();
        dateLabel = `${month}/${day}`;
      }
      
      weekData.push({
        date: dateLabel,
        dateStr: dateStr,
        weight: summary.weight || 0,
        mealsCount: summary.mealsCount,
        poopsCount: summary.poopsCount,
        exerciseMinutes: summary.exerciseMinutes,
      });
    }
    
    return weekData;
  };

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
      <WeeklySummaryCard data={getWeekSummaryData()} />
      
      {/* 記録追加ボタン */}
      <TouchableOpacity 
        style={styles.addRecordButton}
        onPress={() => router.push('/daily-record')}
      >
        <Text style={styles.addRecordButtonText}>記録を追加</Text>
      </TouchableOpacity>
      
      {/* バナー広告 */}
      <BannerAd />
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
