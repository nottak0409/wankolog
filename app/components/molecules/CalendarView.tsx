import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { CalendarDay, MarkedDates } from "../../types/calendar";
import theme from "../../constants/theme";

// カレンダーの日本語化設定
LocaleConfig.locales["ja"] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};

LocaleConfig.defaultLocale = "ja";

type CalendarViewProps = {
  onDayPress: (day: CalendarDay) => void;
  markedDates?: MarkedDates;
};

export const CalendarView = ({
  onDayPress,
  markedDates,
}: CalendarViewProps) => {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        firstDay={0} // 週の開始日を日曜日に設定
        theme={{
          backgroundColor: theme.colors.background.main,
          calendarBackground: theme.colors.background.main,
          textSectionTitleColor: theme.colors.text.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: "#ffffff",
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text.primary,
          textDisabledColor: theme.colors.text.secondary,
          dotColor: theme.colors.primary,
          selectedDotColor: "#ffffff",
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text.primary,
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.sm,
  },
});
