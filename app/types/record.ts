export type Record = {
	id: string;
	date: string; // YYYY-MM-DD形式
	type: "meal" | "poop" | "exercise" | "weight";
	time: string; // HH:mm形式
	detail: string; // 自由記述
	amount?: number; // 食事量(g)、体重(kg)、運動時間(分)など
	unit?: string; // "g", "kg", "minutes"など
};

export type RecordsByDate = {
	[date: string]: Record[];
};

// サマリー用の型
export type DailySummary = {
	weight?: number; // 最新の体重記録
	mealsCount: number; // 食事回数
	poopsCount: number; // うんち回数
	exerciseMinutes: number; // 運動時間の合計
};
