import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "#2f95dc",
				tabBarInactiveTintColor: "gray",
			}}
		>
			<Tab.Screen
				name="ホーム"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="home" size={26} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="カレンダー"
				component={CalendarScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="calendar" size={26} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="履歴"
				component={HistoryScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="time" size={26} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="設定"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="settings" size={26} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}
