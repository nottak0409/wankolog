export const colors = {
	primary: "#6b3c11",
	secondary: "#a67c52",
	background: {
		main: "#fff",
		secondary: "#fff9f0",
	},
	border: {
		main: "#ede0d4",
	},
	text: {
		primary: "#333333",
		secondary: "#666666",
	},
};

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 20,
	xl: 24,
	xxl: 32,
};

export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 16,
	full: 9999,
};

export const shadows = {
	sm: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.18,
		shadowRadius: 1.0,
		elevation: 1,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
};

const theme = {
	colors,
	spacing,
	borderRadius,
	shadows,
};

export default theme;
