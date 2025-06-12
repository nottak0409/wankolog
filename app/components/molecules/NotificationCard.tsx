import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../../constants/theme';
import { NotificationItem } from '../../services/notificationItemService';

interface NotificationCardProps {
  notifications: NotificationItem[];
  onDismiss: (notificationId: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notifications,
  onDismiss
}) => {
  const router = useRouter();

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>お知らせ</Text>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={48}
            color={theme.colors.text.secondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>お知らせはありません</Text>
          <Text style={styles.emptySubText}>
            新しい通知があるとここに表示されます
          </Text>
        </View>
      </View>
    );
  }

  const getIconName = (type: NotificationItem['type']) => {
    switch (type) {
      case 'vaccine':
        return 'needle';
      case 'daily_record':
        return 'calendar-today';
      default:
        return 'bell';
    }
  };

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return theme.colors.primary;
      case 'low':
        return theme.colors.text.secondary;
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (notification.actionType === 'navigate' && notification.actionTarget) {
      router.push(notification.actionTarget as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>お知らせ</Text>
      
      {notifications.map((notification, index) => (
        <TouchableOpacity
          key={notification.id}
          style={[
            styles.notificationItem,
            { backgroundColor: getPriorityColor(notification.priority) + '10' } // 背景に薄い色を追加
          ]}
          onPress={() => handleNotificationPress(notification)}
          activeOpacity={0.7}
        >
          <View style={styles.notificationContent}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: getPriorityColor(notification.priority) + '20' }
            ]}>
              <MaterialCommunityIcons
                name={getIconName(notification.type)}
                size={20}
                color={getPriorityColor(notification.priority)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.notificationTitle}>
                {notification.title}
              </Text>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => onDismiss(notification.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  notificationItem: {
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  dismissButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptySubText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});