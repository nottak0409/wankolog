import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarView } from "../components/molecules/CalendarView";
import { RecordList } from "../components/molecules/RecordList";
import { Record, RecordsByDate } from "../types/record";
import { CalendarDay, MarkedDates } from "../types/calendar";
import theme from "../constants/theme";

const mockRecordsByDate: RecordsByDate = {
  "2025-05-23": [
    {
      id: "1",
      date: "2025-05-23",
      type: "meal",
      time: "08:00",
      detail: "朝ごはん - ドッグフード 100g",
    },
    {
      id: "2",
      date: "2025-05-23",
      type: "poop",
      time: "09:30",
      detail: "普通の硬さ、茶色",
    },
    {
      id: "3",
      date: "2025-05-23",
      type: "exercise",
      time: "16:00",
      detail: "散歩 30分、1.5km",
    },
  ],
  "2025-05-22": [
    {
      id: "4",
      date: "2025-05-22",
      type: "meal",
      time: "07:30",
      detail: "朝ごはん - ドッグフード 100g",
    },
    {
      id: "5",
      date: "2025-05-22",
      type: "exercise",
      time: "15:00",
      detail: "散歩 45分、2km",
    },
  ],
};

export const CalendarScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState<Record[]>([]);

  const handleDayPress = (day: CalendarDay) => {
    setSelectedDate(day.dateString);
    setRecords(mockRecordsByDate[day.dateString] || []);
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
    Object.keys(mockRecordsByDate).forEach((date) => {
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <CalendarView
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
        />
        <View style={styles.recordSection}>
          <RecordList records={records} date={selectedDate} />
          {selectedDate && (
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
