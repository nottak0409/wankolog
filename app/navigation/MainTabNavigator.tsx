import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PetProfileScreen from "../screens/PetProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "#8b4513",
				tabBarInactiveTintColor: "#a67c52",
				tabBarStyle: {
					backgroundColor: "#fff9f0",
					borderTopColor: "#ede0d4",
				},
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
			<Tab.Screen
				name="プロフィール"
				component={PetProfileScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="paw" size={26} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}
