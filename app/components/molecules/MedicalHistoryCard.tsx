import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MedicalRecord } from "../../types/medical";
import theme from "../../constants/theme";

interface MedicalHistoryCardProps {
  record?: MedicalRecord;
  records?: MedicalRecord[];
  onEditRecord?: (record: MedicalRecord) => void;
  onDeleteRecord?: (record: MedicalRecord) => void;
}

export const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  record,
  records = [],
  onEditRecord,
  onDeleteRecord,
}) => {
  const recordsToDisplay = record ? [record] : records;

  const getIcon = (type: string) => {
    switch (type) {
      case "vaccine":
        return "needle";
      case "checkup":
        return "stethoscope";
      case "treatment":
        return "medical-bag";
      default:
        return "hospital-box";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>通院・治療履歴</Text>
      {recordsToDisplay.map((record) => (
        <View key={record.id} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={getIcon(record.type)}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{formatDate(record.date)}</Text>
              <Text style={styles.type}>
                {record.type === "vaccine"
                  ? "ワクチン接種"
                  : record.type === "checkup"
                  ? "健康診断"
                  : "治療"}
              </Text>
            </View>
            {(onEditRecord || onDeleteRecord) && (
              <View style={styles.actionButtons}>
                {onEditRecord && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEditRecord(record)}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                )}
                {onDeleteRecord && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDeleteRecord(record)}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={18}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>{record.description}</Text>
            {record.medications && record.medications.length > 0 && (
              <View style={styles.medicationContainer}>
                <Text style={styles.medicationTitle}>💊 処方薬</Text>
                {record.medications.map((med) => (
                  <Text key={med.id} style={styles.medication}>
                    {med.name} ({med.dosage}) - {med.frequency}
                  </Text>
                ))}
              </View>
            )}
            {record.nextAppointment && (
              <View style={styles.nextAppointment}>
                <Text style={styles.nextAppointmentText}>
                  ⏰ 次回予約: {formatDate(record.nextAppointment)}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  type: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  content: {
    paddingLeft: theme.spacing.xl,
  },
  description: {
    fontSize: 15,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  medicationContainer: {
    marginTop: theme.spacing.sm,
  },
  medicationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  medication: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    marginBottom: 2,
  },
  nextAppointment: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  nextAppointmentText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.main,
  },
});
