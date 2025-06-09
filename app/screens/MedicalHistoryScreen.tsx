import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MedicalHistoryCard } from "../components/molecules/MedicalHistoryCard";
import { VaccineManagement } from "../components/molecules/VaccineManagement";
import theme from "../constants/theme";
import type { VaccineRecord, MedicalRecord } from "../types/medical";

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const { vaccineId } = useLocalSearchParams<{ vaccineId: string }>();

  // モックデータ
  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: "1",
      petId: "pet-1",
      type: "checkup",
      date: new Date("2025-05-01"),
      description: "定期健康診断",
      nextAppointment: new Date("2025-11-01"),
    },
    {
      id: "2",
      petId: "pet-1",
      type: "treatment",
      date: new Date("2025-04-15"),
      description: "皮膚の治療",
      medications: [
        {
          id: "med-1",
          name: "皮膚軟膏",
          dosage: "1日2回",
          frequency: "2週間",
        },
      ],
      nextAppointment: new Date("2025-04-29"),
    },
  ];

  const mockVaccines: VaccineRecord[] = [
    {
      id: "1",
      petId: "pet-1",
      type: "混合ワクチン",
      lastDate: new Date("2025-05-01"),
      nextDate: new Date("2025-11-01"),
      notificationEnabled: true,
    },
    {
      id: "2",
      petId: "pet-1",
      type: "狂犬病",
      lastDate: new Date("2025-04-01"),
      nextDate: new Date("2026-04-01"),
      notificationEnabled: true,
    },
  ];

  // 通知からの遷移の場合は該当のワクチン情報までスクロール
  React.useEffect(() => {
    if (vaccineId) {
      // TODO: 該当のワクチン情報までスクロール
      console.log("Scroll to vaccine:", vaccineId);
    }
  }, [vaccineId]);

  const handleAdd = () => {
    router.push("/medical-record-edit");
  };

  const handleNotificationToggle = (vaccineId: string) => {
    console.log("Toggle notification for vaccine:", vaccineId);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MedicalHistoryCard records={mockMedicalRecords} />
        <VaccineManagement
          vaccines={mockVaccines}
          onNotificationToggle={handleNotificationToggle}
        />
        {/* スクロール領域の下部にパディングを追加 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="plus"
          size={24}
          color={theme.colors.background.main}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: "absolute",
    right: theme.spacing.md,
    bottom: theme.spacing.md + 64,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
