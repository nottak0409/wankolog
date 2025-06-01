import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { VaccineRecord } from "../../types/medical";
import theme from "../../constants/theme";

interface VaccineManagementProps {
  vaccines: VaccineRecord[];
  onNotificationToggle: (id: string, enabled: boolean) => void;
}

export const VaccineManagement: React.FC<VaccineManagementProps> = ({
  vaccines,
  onNotificationToggle,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💉 ワクチン管理</Text>
      {vaccines.map((vaccine) => (
        <View key={vaccine.id} style={styles.vaccineCard}>
          <View style={styles.header}>
            <Text style={styles.vaccineType}>{vaccine.type}</Text>
            <Switch
              value={vaccine.notificationEnabled}
              onValueChange={(value) => onNotificationToggle(vaccine.id, value)}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={
                vaccine.notificationEnabled
                  ? theme.colors.background.main
                  : "#f4f3f4"
              }
            />
          </View>
          <View style={styles.dates}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>前回接種日</Text>
              <Text style={styles.dateValue}>
                {formatDate(vaccine.lastDate)}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>次回予定日</Text>
              <Text style={styles.dateValue}>
                {formatDate(vaccine.nextDate)}
              </Text>
            </View>
          </View>
          {vaccine.notificationEnabled && (
            <Text style={styles.notificationText}>
              🔔 次回予定日の1週間前に通知が届きます
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  vaccineCard: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  vaccineType: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  dates: {
    marginTop: theme.spacing.sm,
  },
  dateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  dateValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: "500",
  },
  notificationText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
  },
});
