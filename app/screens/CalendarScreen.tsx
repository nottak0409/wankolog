import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
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
	const [selectedDate, setSelectedDate] = useState("");
	const [records, setRecords] = useState<Record[]>([]);

	const handleDayPress = (day: CalendarDay) => {
		setSelectedDate(day.dateString);
		setRecords(mockRecordsByDate[day.dateString] || []);
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
				<RecordList records={records} date={selectedDate} />
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
