import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { CalendarScreen } from "../screens/CalendarScreen";
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import PetProfileScreen from "../screens/PetProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import theme from "../constants/theme";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.text.secondary,
				headerShown: false,
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
					tabBarLabel: "ホーム",
				}}
			/>
			<Tab.Screen
				name="Calendar"
				component={CalendarScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar" size={size} color={color} />
					),
					tabBarLabel: "カレンダー",
				}}
			/>
			<Tab.Screen
				name="History"
				component={HistoryScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="time" size={size} color={color} />
					),
					tabBarLabel: "履歴",
				}}
			/>
			<Tab.Screen
				name="PetProfile"
				component={PetProfileScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="paw" size={size} color={color} />
					),
					tabBarLabel: "プロフィール",
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
					tabBarLabel: "設定",
				}}
			/>
		</Tab.Navigator>
	);
};

export default MainTabNavigator;
