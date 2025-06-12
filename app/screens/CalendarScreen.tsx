import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, AppState } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarView } from "../components/molecules/CalendarView";
import { RecordList } from "../components/molecules/RecordList";
import { Record, RecordsByDate } from "../types/record";
import { CalendarDay, MarkedDates } from "../types/calendar";
import { petService, recordService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";
import { getJapanToday } from "../utils/dateUtils";
import { debugLog } from "../utils/debugUtils";

export const CalendarScreen = () => {
  const router = useRouter();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    // 初期値を日本時間の今日の日付に設定
    return getJapanToday();
  });
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsByDate, setRecordsByDate] = useState<RecordsByDate>({});
  const lastUpdateDate = useRef<string>('');

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // 日付変更を監視するためのタイマー（日本時間ベース）
  useEffect(() => {
    const checkDateChange = () => {
      const today = getJapanToday(); // 日本時間の今日
      if (lastUpdateDate.current && lastUpdateDate.current !== today) {
        debugLog.date('カレンダー画面: 日付が変わりました (JST):', lastUpdateDate.current, '->', today);
        // 日付が変わったらデータを再読み込み
        loadData();
        // 選択日付も今日に更新（ユーザーが他の日付を選択していない場合のみ）
        if (selectedDate === lastUpdateDate.current) {
          setSelectedDate(today);
        }
      }
      lastUpdateDate.current = today;
    };

    // 初回チェック
    checkDateChange();
    
    // 1分ごとに日付変更をチェック
    const interval = setInterval(checkDateChange, 60000);
    
    return () => clearInterval(interval);
  }, [selectedDate]);

  // アプリがアクティブになった時に日付をチェック（日本時間ベース）
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        debugLog.log('カレンダー画面: アプリがアクティブになりました');
        const today = getJapanToday(); // 日本時間の今日
        if (lastUpdateDate.current !== today) {
          debugLog.date('カレンダー画面: 日付が変わったため再読み込み (JST):', lastUpdateDate.current, '->', today);
          loadData();
          // 選択日付も今日に更新（ユーザーが他の日付を選択していない場合のみ）
          if (selectedDate === lastUpdateDate.current) {
            setSelectedDate(today);
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        const pet = pets[0];
        setCurrentPet(pet);
        
        // 過去60日の記録を取得（日本時間ベース）
        const endDate = getJapanToday(); // 日本時間の今日
        const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        debugLog.log('カレンダー画面: データを読み込み中 (JST):', endDate);
        const recordsByDateData = await recordService.getByDateRange(
          pet.id,
          startDate,
          endDate
        );
        
        setRecordsByDate(recordsByDateData);
        lastUpdateDate.current = endDate;
        
        // 今日の記録を自動選択
        setRecords(recordsByDateData[selectedDate] || []);
      }
    } catch (error) {
      debugLog.error("データの読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: CalendarDay) => {
    setSelectedDate(day.dateString);
    setRecords(recordsByDate[day.dateString] || []);
  };

  const handleAddRecord = () => {
    if (selectedDate) {
      router.push({
        pathname: "/daily-record",
        params: { date: selectedDate },
      });
    }
  };

  const handleEditRecord = (record: Record) => {
    router.push({
      pathname: "/daily-record",
      params: { 
        date: selectedDate,
        recordId: record.id 
      },
    });
  };

  const getMarkedDates = (): MarkedDates => {
    const dates: MarkedDates = {};
    Object.keys(recordsByDate).forEach((date) => {
      dates[date] = {
        marked: true,
        dotColor: theme.colors.primary,
      };
    });
    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
      };
    }
    return dates;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <CalendarView
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          selectedDate={selectedDate}
        />
        <View style={styles.recordSection}>
          <RecordList 
            records={records} 
            date={selectedDate}
            showEditButton={true}
            onEditRecord={handleEditRecord}
          />
          {selectedDate && currentPet && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddRecord}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  recordSection: {
    position: "relative",
    flex: 1,
  },
  addButton: {
    position: "absolute",
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.background.main,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
});

export default CalendarScreen;
