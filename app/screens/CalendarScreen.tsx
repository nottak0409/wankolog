import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarView } from "../components/molecules/CalendarView";
import { RecordList } from "../components/molecules/RecordList";
import { Record, RecordsByDate } from "../types/record";
import { CalendarDay, MarkedDates } from "../types/calendar";
import { petService, recordService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";

export const CalendarScreen = () => {
  const router = useRouter();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsByDate, setRecordsByDate] = useState<RecordsByDate>({});

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        const pet = pets[0];
        setCurrentPet(pet);
        
        // 過去60日の記録を取得
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        const recordsByDateData = await recordService.getByDateRange(
          pet.id,
          startDate,
          endDate
        );
        
        setRecordsByDate(recordsByDateData);
      }
    } catch (error) {
      console.error("データの読み込みエラー:", error);
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
        />
        <View style={styles.recordSection}>
          <RecordList records={records} date={selectedDate} />
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
