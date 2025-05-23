import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CalendarHeader } from "../components/molecules/CalendarHeader";
import { CalendarView } from "../components/molecules/CalendarView";
import { RecordList } from "../components/molecules/RecordList";
import { Record } from "../types/record";
import { CalendarDay, MarkedDates } from "../types/calendar";
import theme from "../constants/theme";

const mockRecords: Record[] = [
	{
		id: "1",
		type: "meal",
		time: "08:00",
		detail: "朝ごはん - ドッグフード 100g",
	},
	{
		id: "2",
		type: "poop",
		time: "09:30",
		detail: "普通の硬さ、茶色",
	},
	{
		id: "3",
		type: "exercise",
		time: "16:00",
		detail: "散歩 30分、1.5km",
	},
];

export const CalendarScreen = () => {
	const [selectedDate, setSelectedDate] = useState("");
	const [records, setRecords] = useState<Record[]>(mockRecords);

	const handleDayPress = (day: CalendarDay) => {
		setSelectedDate(day.dateString);
		// TODO: 選択された日付に基づいてレコードを取得する
		// setRecords(fetchRecordsForDate(day.dateString));
	};

	const getMarkedDates = (): MarkedDates => {
		// TODO: 記録のある日付にマーカーを表示する
		return {
			[selectedDate]: {
				selected: true,
				marked: true,
				dotColor: theme.colors.primary,
			},
		};
	};

	return (
		<View style={styles.container}>
			<CalendarHeader title="カレンダー" />
			<ScrollView style={styles.content}>
				<CalendarView
					onDayPress={handleDayPress}
					markedDates={getMarkedDates()}
				/>
				<RecordList records={records} />
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
});

export default CalendarScreen;
