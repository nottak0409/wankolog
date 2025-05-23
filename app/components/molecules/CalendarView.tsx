import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { CalendarDay, MarkedDates } from "../../types/calendar";
import theme from "../../constants/theme";

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
