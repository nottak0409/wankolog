import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { petService, medicalService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";
import type { MedicalRecord, Medication } from "../types/medical";

type MedicalRecordFormData = Omit<MedicalRecord, "id" | "petId">;

export default function MedicalRecordInputScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    type: "checkup",
    date: new Date(),
    description: "",
    medications: [],
  });

  const [currentMedication, setCurrentMedication] = useState<
    Omit<Medication, "id">
  >({
    name: "",
    dosage: "",
    frequency: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPetData();
  }, []);

  useEffect(() => {
    if (recordId && currentPet) {
      loadRecordData();
    }
  }, [recordId, currentPet]);

  const loadPetData = async () => {
    try {
      const pets = await petService.getAll();
      if (pets.length > 0) {
        setCurrentPet(pets[0]);
      }
    } catch (error) {
      console.error("ペットデータの読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecordData = async () => {
    if (!recordId) return;
    
    try {
      const record = await medicalService.getMedicalRecordById(recordId);
      if (record) {
        setEditingRecord(record);
        setFormData({
          type: record.type,
          date: record.date,
          description: record.description,
          nextAppointment: record.nextAppointment,
          medications: record.medications || [],
        });
      }
    } catch (error) {
      console.error("記録データの読み込みエラー:", error);
    }
  };

  const handleSave = async () => {
    if (!currentPet) {
      Alert.alert("エラー", "ペットが登録されていません");
      return;
    }

    if (!formData.description) {
      Alert.alert("エラー", "診察内容を入力してください");
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingRecord) {
        // 編集モード
        await medicalService.updateMedicalRecord(editingRecord.id, formData);
        Alert.alert("成功", "記録を更新しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // 新規作成モード
        await medicalService.createMedicalRecord({
          ...formData,
          petId: currentPet.id,
        });
        Alert.alert("成功", "記録を保存しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error("記録保存エラー:", error);
      Alert.alert("エラー", "記録の保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMedication = () => {
    if (
      !currentMedication.name ||
      !currentMedication.dosage ||
      !currentMedication.frequency
    ) {
      Alert.alert("エラー", "投薬情報を全て入力してください");
      return;
    }

    setFormData({
      ...formData,
      medications: [
        ...(formData.medications || []),
        {
          ...currentMedication,
          id: Date.now().toString(),
        },
      ],
    });

    setCurrentMedication({
      name: "",
      dosage: "",
      frequency: "",
    });
    setShowMedicationModal(false);
  };

  const handleRemoveMedication = (id: string) => {
    setFormData({
      ...formData,
      medications: formData.medications?.filter((med) => med.id !== id) || [],
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.petName}>{currentPet.name}の医療記録</Text>
        <Text style={styles.subtitle}>
          {editingRecord ? "記録を編集" : "新しい記録を追加"}
        </Text>
      </View>

      {/* 記録タイプ選択 */}
      <View style={styles.typeSection}>
        <Text style={styles.sectionTitle}>記録タイプ</Text>
        <View style={styles.typeButtons}>
          {(["checkup", "treatment"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                formData.type === type && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type })}
            >
              <MaterialCommunityIcons
                name={type === "checkup" ? "stethoscope" : "medical-bag"}
                size={20}
                color={
                  formData.type === type
                    ? theme.colors.background.main
                    : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === type && styles.typeButtonTextActive,
                ]}
              >
                {type === "checkup" ? "健康診断" : "治療"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 日付入力 */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>診察日</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.dateButtonText}>{formatDate(formData.date)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, date: selectedDate });
              }
            }}
          />
        )}
      </View>

      {/* 詳細入力 */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>診察内容</Text>
        <TextInput
          style={styles.detailInput}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="診察内容を入力してください"
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* 次回予約日 */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>次回予約日（任意）</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNextDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.dateButtonText}>
            {formData.nextAppointment
              ? formatDate(formData.nextAppointment)
              : "未設定（タップして設定）"}
          </Text>
        </TouchableOpacity>

        {showNextDatePicker && (
          <DateTimePicker
            value={formData.nextAppointment || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowNextDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, nextAppointment: selectedDate });
              }
            }}
          />
        )}
      </View>

      {/* 投薬情報 */}
      <View style={styles.medicationSection}>
        <View style={styles.medicationHeader}>
          <Text style={styles.sectionTitle}>投薬情報</Text>
          <TouchableOpacity
            style={styles.addMedicationButton}
            onPress={() => setShowMedicationModal(true)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.addMedicationButtonText}>追加</Text>
          </TouchableOpacity>
        </View>

        {formData.medications?.map((medication) => (
          <View key={medication.id} style={styles.medicationItem}>
            <View style={styles.medicationIconContainer}>
              <MaterialCommunityIcons
                name="pill"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.medicationContent}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDetail}>
                {medication.dosage} - {medication.frequency}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteMedicationButton}
              onPress={() => handleRemoveMedication(medication.id)}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSave}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {editingRecord ? (
            submitting ? "更新中..." : "更新"
          ) : (
            submitting ? "保存中..." : "保存"
          )}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showMedicationModal}
        onRequestClose={() => setShowMedicationModal(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>投薬情報を追加</Text>
              <TouchableOpacity
                onPress={() => setShowMedicationModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>薬の名前</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentMedication.name}
                  onChangeText={(text) =>
                    setCurrentMedication({ ...currentMedication, name: text })
                  }
                  placeholder="薬の名前を入力"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
              
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>用量</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentMedication.dosage}
                  onChangeText={(text) =>
                    setCurrentMedication({ ...currentMedication, dosage: text })
                  }
                  placeholder="例: 1日2回"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
              
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>服用頻度</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentMedication.frequency}
                  onChangeText={(text) =>
                    setCurrentMedication({ ...currentMedication, frequency: text })
                  }
                  placeholder="例: 2週間"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleAddMedication}
            >
              <Text style={styles.modalAddButtonText}>追加</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  petName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  typeSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  typeButton: {
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    minWidth: 100,
    marginBottom: theme.spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: "center",
  },
  typeButtonTextActive: {
    color: theme.colors.background.main,
  },
  dateSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  dateButtonText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  detailSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  detailInput: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  medicationSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  addMedicationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addMedicationButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: "600",
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  medicationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.main,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  medicationDetail: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  deleteMedicationButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.main,
  },
  submitButton: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: theme.colors.background.main,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: theme.colors.background.main,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    maxWidth: 400,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.md,
  },
  modalInputContainer: {
    marginBottom: theme.spacing.md,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  modalInput: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  modalAddButton: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  modalAddButtonText: {
    color: theme.colors.background.main,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
