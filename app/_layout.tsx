import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function Layout() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "#007AFF",
				tabBarInactiveTintColor: "#8E8E93",
				headerStyle: {
					backgroundColor: "#fff",
				},
				headerTintColor: "#000",
			}}
		>
			<Tab.Screen
				name="ホーム"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="home-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="カレンダー"
				component={CalendarScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="calendar-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="履歴"
				component={HistoryScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="time-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="設定"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="settings-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}
