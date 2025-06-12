import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { VaccineRecord } from "../../types/medical";
import theme from "../../constants/theme";

interface VaccineManagementProps {
  vaccines: VaccineRecord[];
  onNotificationToggle: (id: string, enabled: boolean) => void;
  onEditVaccine?: (vaccine: VaccineRecord) => void;
  onDeleteVaccine?: (vaccine: VaccineRecord) => void;
  onAddVaccine?: () => void;
}

export const VaccineManagement: React.FC<VaccineManagementProps> = ({
  vaccines,
  onNotificationToggle,
  onEditVaccine,
  onDeleteVaccine,
  onAddVaccine,
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>💉 ワクチン管理</Text>
        {onAddVaccine && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddVaccine}
          >
            <MaterialCommunityIcons
              name="plus"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        )}
      </View>
      {vaccines.map((vaccine) => (
        <View key={vaccine.id} style={styles.vaccineCard}>
          <View style={styles.header}>
            <Text style={styles.vaccineType}>{vaccine.type}</Text>
            <View style={styles.headerActions}>
              {(onEditVaccine || onDeleteVaccine) && (
                <View style={styles.actionButtons}>
                  {onEditVaccine && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onEditVaccine(vaccine)}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={16}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                  {onDeleteVaccine && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onDeleteVaccine(vaccine)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={16}
                        color={theme.colors.error}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: "600",
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
});
