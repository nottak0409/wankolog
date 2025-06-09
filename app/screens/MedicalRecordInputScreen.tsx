import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  TextInput,
  SegmentedButtons,
  Portal,
  Modal,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import theme from "../constants/theme";
import type { MedicalRecord, Medication } from "../types/medical";

type MedicalRecordFormData = Omit<MedicalRecord, "id" | "petId">;

export default function MedicalRecordInputScreen() {
  const router = useRouter();
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

  const handleSave = () => {
    if (!formData.description) {
      Alert.alert("エラー", "診察内容を入力してください");
      return;
    }
    // TODO: APIで保存処理
    console.log("Save medical record:", formData);
    router.back();
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SegmentedButtons
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as "checkup" | "treatment" })
          }
          buttons={[
            { value: "checkup", label: "健康診断" },
            { value: "treatment", label: "治療" },
          ]}
          style={styles.segment}
        />

        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          診察日: {formatDate(formData.date)}
        </Button>

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

        <TextInput
          label="診察内容"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="outlined"
          onPress={() => setShowNextDatePicker(true)}
          style={styles.dateButton}
        >
          次回予約日:{" "}
          {formData.nextAppointment
            ? formatDate(formData.nextAppointment)
            : "未設定"}
        </Button>

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

        <View style={styles.medicationSection}>
          <Button
            mode="contained"
            onPress={() => setShowMedicationModal(true)}
            style={styles.addButton}
          >
            投薬情報を追加
          </Button>

          {formData.medications?.map((medication) => (
            <View key={medication.id} style={styles.medicationItem}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDetail}>
                  {medication.dosage} - {medication.frequency}
                </Text>
              </View>
              <Button
                mode="text"
                textColor={theme.colors.primary}
                onPress={() => handleRemoveMedication(medication.id)}
              >
                削除
              </Button>
            </View>
          ))}
        </View>

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          保存
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showMedicationModal}
          onDismiss={() => setShowMedicationModal(false)}
          contentContainerStyle={styles.modal}
        >
          <TextInput
            label="薬の名前"
            value={currentMedication.name}
            onChangeText={(text) =>
              setCurrentMedication({ ...currentMedication, name: text })
            }
            style={styles.modalInput}
          />
          <TextInput
            label="用量"
            value={currentMedication.dosage}
            onChangeText={(text) =>
              setCurrentMedication({ ...currentMedication, dosage: text })
            }
            style={styles.modalInput}
          />
          <TextInput
            label="服用頻度"
            value={currentMedication.frequency}
            onChangeText={(text) =>
              setCurrentMedication({ ...currentMedication, frequency: text })
            }
            style={styles.modalInput}
          />
          <Button mode="contained" onPress={handleAddMedication}>
            追加
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  content: {
    padding: theme.spacing.md,
  },
  segment: {
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
  },
  dateButton: {
    marginBottom: theme.spacing.md,
  },
  medicationSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    marginBottom: theme.spacing.md,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  medicationDetail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
  modal: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  modalInput: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
  },
});
