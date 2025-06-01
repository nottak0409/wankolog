import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { MedicalHistoryCard } from "../components/molecules/MedicalHistoryCard";
import { VaccineManagement } from "../components/molecules/VaccineManagement";
import { MedicalRecord, VaccineRecord } from "../types/medical";
import theme from "../constants/theme";

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    petId: "1",
    date: new Date("2025-05-15"),
    type: "checkup",
    description: "年次健康診断。体重が若干増加傾向。食事量の調整を推奨。",
    medications: [
      {
        id: "m1",
        name: "整腸薬",
        dosage: "1錠",
        frequency: "1日2回 食後",
      },
    ],
    nextAppointment: new Date("2025-11-15"),
  },
  {
    id: "2",
    petId: "1",
    date: new Date("2025-04-20"),
    type: "treatment",
    description: "軽度の皮膚炎の治療。患部の洗浄と軟膏の処方。",
    medications: [
      {
        id: "m2",
        name: "皮膚炎軟膏",
        dosage: "適量",
        frequency: "1日2回 患部に塗布",
      },
    ],
  },
  {
    id: "3",
    petId: "1",
    date: new Date("2025-03-01"),
    type: "vaccine",
    description: "狂犬病予防接種 定期接種",
    nextAppointment: new Date("2026-03-01"),
  },
];

const mockVaccineRecords: VaccineRecord[] = [
  {
    id: "v1",
    petId: "1",
    type: "狂犬病予防",
    lastDate: new Date("2025-03-01"),
    nextDate: new Date("2026-03-01"),
    notificationEnabled: true,
  },
  {
    id: "v2",
    petId: "1",
    type: "混合ワクチン",
    lastDate: new Date("2024-12-15"),
    nextDate: new Date("2025-12-15"),
    notificationEnabled: false,
  },
  {
    id: "v3",
    petId: "1",
    type: "ボルデテラ",
    lastDate: new Date("2025-01-10"),
    nextDate: new Date("2026-01-10"),
    notificationEnabled: true,
  },
];

export default function MedicalHistoryScreen() {
  const [vaccineRecords, setVaccineRecords] =
    useState<VaccineRecord[]>(mockVaccineRecords);

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    setVaccineRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, notificationEnabled: enabled } : record
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏥 通院・治療履歴</Text>
        {mockMedicalRecords.map((record) => (
          <MedicalHistoryCard key={record.id} record={record} />
        ))}
      </View>

      <View style={styles.section}>
        <VaccineManagement
          vaccines={vaccineRecords}
          onNotificationToggle={handleNotificationToggle}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
  },
});
