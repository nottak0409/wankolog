import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MedicalHistoryCard } from "../components/molecules/MedicalHistoryCard";
import { VaccineManagement } from "../components/molecules/VaccineManagement";
import { petService, medicalService } from "../database/services";
import { notificationService } from "../services/notificationService";
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

  // デバッグ用: スケジュールされた通知を表示
  const handleShowScheduledNotifications = async () => {
    try {
      await notificationService.logScheduledNotifications();
      const notifications = await notificationService.getScheduledNotifications();
      Alert.alert(
        "スケジュールされた通知",
        `${notifications.length}件の通知がスケジュールされています。\n\n詳細はコンソールを確認してください。`
      );
    } catch (error) {
      console.error('通知の取得エラー:', error);
    }
  };

  // デバッグ用: 既存のワクチン記録に対して通知を再スケジュール
  const handleRescheduleAllNotifications = async () => {
    if (!currentPet) return;
    
    try {
      // 全ての通知をキャンセル
      await notificationService.cancelAllNotifications();
      
      // 有効なワクチン記録に対して通知を再スケジュール
      for (const vaccine of vaccineRecords) {
        await notificationService.scheduleVaccineNotification(
          vaccine.id,
          vaccine.type,
          currentPet.name,
          vaccine.nextDate
        );
      }
      
      Alert.alert('成功', '通知を再スケジュールしました');
    } catch (error) {
      console.error('通知の再スケジュールエラー:', error);
      Alert.alert('エラー', '通知の再スケジュールに失敗しました');
    }
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
          onEditVaccine={handleEditVaccineRecord}
          onDeleteVaccine={handleDeleteVaccineRecord}
          onAddVaccine={handleAddVaccine}
        />
        {/* デバッグ用ボタン（開発環境のみ） */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>デバッグ機能</Text>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleShowScheduledNotifications}
            >
              <Text style={styles.debugButtonText}>スケジュールされた通知を表示</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleRescheduleAllNotifications}
            >
              <Text style={styles.debugButtonText}>通知を再スケジュール</Text>
            </TouchableOpacity>
          </View>
        )}
        
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
  debugSection: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderStyle: 'dashed',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: '#ff6b6b',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  debugButtonText: {
    color: theme.colors.background.main,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
