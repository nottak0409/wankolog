import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";
import type { Notification } from "../../types/notification";

type NotificationBannerProps = {
  notifications: Notification[];
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
}) => {
  const router = useRouter();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  const handlePress = (notification: Notification) => {
    if (notification.type === "daily_record" && notification.data?.recordDate) {
      router.push({
        pathname: "/daily-record",
        params: { date: notification.data.recordDate },
      });
    } else if (
      notification.type === "medical_history" &&
      notification.data?.vaccineId
    ) {
      router.push({
        pathname: "/(tabs)/history",
        params: { vaccineId: notification.data.vaccineId },
      });
    }
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={styles.notificationItem}
          onPress={() => handlePress(notification)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.date}>{notification.date}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
    marginBottom: theme.spacing.sm,
  },
});

export default NotificationBanner;
