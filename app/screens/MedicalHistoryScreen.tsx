import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MedicalHistoryCard } from "../components/molecules/MedicalHistoryCard";
import { VaccineManagement } from "../components/molecules/VaccineManagement";
import { petService, medicalService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";
import type { VaccineRecord, MedicalRecord } from "../types/medical";

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const { vaccineId } = useLocalSearchParams<{ vaccineId: string }>();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    if (vaccineId) {
      // TODO: 該当のワクチン情報までスクロール
      console.log("Scroll to vaccine:", vaccineId);
    }
  }, [vaccineId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        const pet = pets[0];
        setCurrentPet(pet);
        
        // 医療記録を取得
        const records = await medicalService.getMedicalRecordsByPetId(pet.id);
        setMedicalRecords(records);
        
        // ワクチン記録を取得
        const vaccines = await medicalService.getVaccineRecordsByPetId(pet.id);
        setVaccineRecords(vaccines);
      }
    } catch (error) {
      console.error("データの読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    router.push("/medical-record-edit");
  };

  const handleNotificationToggle = async (vaccineId: string, enabled: boolean) => {
    try {
      await medicalService.updateVaccineRecord(vaccineId, {
        notificationEnabled: enabled
      });
      await loadData(); // データを再読み込み
    } catch (error) {
      console.error("通知設定の更新エラー:", error);
    }
  };

  const handleEditMedicalRecord = (record: MedicalRecord) => {
    router.push({
      pathname: "/medical-record-edit",
      params: { recordId: record.id },
    });
  };

  const handleDeleteMedicalRecord = async (record: MedicalRecord) => {
    Alert.alert(
      "削除確認",
      "この医療記録を削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await medicalService.deleteMedicalRecord(record.id);
              await loadData();
              Alert.alert("成功", "医療記録を削除しました");
            } catch (error) {
              console.error("医療記録削除エラー:", error);
              Alert.alert("エラー", "医療記録の削除に失敗しました");
            }
          }
        }
      ]
    );
  };

  const handleEditVaccineRecord = (vaccine: VaccineRecord) => {
    router.push({
      pathname: "/vaccine-record-edit",
      params: { recordId: vaccine.id },
    });
  };

  const handleDeleteVaccineRecord = async (vaccine: VaccineRecord) => {
    Alert.alert(
      "削除確認",
      "このワクチン記録を削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await medicalService.deleteVaccineRecord(vaccine.id);
              await loadData();
              Alert.alert("成功", "ワクチン記録を削除しました");
            } catch (error) {
              console.error("ワクチン記録削除エラー:", error);
              Alert.alert("エラー", "ワクチン記録の削除に失敗しました");
            }
          }
        }
      ]
    );
  };

  const handleAddVaccine = () => {
    router.push("/vaccine-record-edit");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (!currentPet) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>ペットが登録されていません</Text>
        <Text style={styles.emptySubText}>まずペットを登録してください</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MedicalHistoryCard 
          records={medicalRecords}
          onEditRecord={handleEditMedicalRecord}
          onDeleteRecord={handleDeleteMedicalRecord}
        />
        <VaccineManagement
          vaccines={vaccineRecords}
          onNotificationToggle={handleNotificationToggle}
          onEditVaccine={handleEditVaccineRecord}
          onDeleteVaccine={handleDeleteVaccineRecord}
          onAddVaccine={handleAddVaccine}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
