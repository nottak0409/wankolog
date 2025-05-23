export const colors = {
	// メインカラー
	primary: "#6b3c11", // ブラウン
	secondary: "#a67c52", // ライトブラウン

	// 背景色
	background: {
		main: "#fff", // 白
		secondary: "#fff9f0", // クリームホワイト
	},

	// ボーダー
	border: {
		main: "#ede0d4", // ベージュ
	},

	// シャドウ
	shadow: {
		color: "#8b4513", // ダークブラウン
		opacity: {
			light: 0.1,
			medium: 0.15,
		},
	},

	// テキスト
	text: {
		primary: "#6b3c11", // ブラウン
		secondary: "#8b4513", // ダークブラウン
	},
} as const;

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 20,
	xl: 24,
	xxl: 32,
} as const;

export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 16,
	full: 9999,
} as const;

export const shadow = {
	sm: {
		shadowColor: colors.shadow.color,
		shadowOpacity: colors.shadow.opacity.light,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	md: {
		shadowColor: colors.shadow.color,
		shadowOpacity: colors.shadow.opacity.medium,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 4,
	},
} as const;
