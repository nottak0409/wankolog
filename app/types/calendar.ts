export type CalendarDay = {
	dateString: string;
	day: number;
	month: number;
	year: number;
	timestamp: number;
};

export type MarkedDates = {
	[date: string]: {
		selected?: boolean;
		marked?: boolean;
		dotColor?: string;
	};
};
