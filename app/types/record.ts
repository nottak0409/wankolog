export type Record = {
	id: string;
	date: string; // YYYY-MM-DD形式
	type: "meal" | "poop" | "exercise";
	time: string; // HH:mm形式
	detail: string;
};

export type RecordsByDate = {
	[date: string]: Record[];
};
