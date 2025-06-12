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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { petService, medicalService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";
import type { VaccineRecord } from "../types/medical";

type VaccineRecordFormData = Omit<VaccineRecord, "id" | "petId">;

export default function VaccineRecordInputScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<VaccineRecord | null>(null);
  const [formData, setFormData] = useState<VaccineRecordFormData>({
    type: "",
    lastDate: new Date(),
    nextDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年後
  });

  const [showLastDatePicker, setShowLastDatePicker] = useState(false);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
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
      const vaccines = await medicalService.getVaccineRecordsByPetId(currentPet!.id);
      const record = vaccines.find(v => v.id === recordId);
      if (record) {
        setEditingRecord(record);
        setFormData({
          type: record.type,
          lastDate: record.lastDate,
          nextDate: record.nextDate,
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

    if (!formData.type.trim()) {
      Alert.alert("エラー", "ワクチンの種類を入力してください");
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingRecord) {
        // 編集モード
        await medicalService.updateVaccineRecord(editingRecord.id, {
          ...formData,
          petName: currentPet.name,
        });
        Alert.alert("成功", "ワクチン記録を更新しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // 新規作成モード
        await medicalService.createVaccineRecord({
          ...formData,
          petId: currentPet.id,
          petName: currentPet.name,
        });
        Alert.alert("成功", "ワクチン記録を保存しました", [
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
        <Text style={styles.petName}>{currentPet.name}のワクチン記録</Text>
        <Text style={styles.subtitle}>
          {editingRecord ? "記録を編集" : "新しい記録を追加"}
        </Text>
      </View>

      {/* ワクチンの種類 */}
      <View style={styles.typeSection}>
        <Text style={styles.sectionTitle}>ワクチンの種類</Text>
        <TextInput
          style={styles.typeInput}
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
          placeholder="例: 混合ワクチン、狂犬病ワクチン"
          placeholderTextColor={theme.colors.text.secondary}
        />
      </View>

      {/* 前回接種日 */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>前回接種日</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowLastDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.dateButtonText}>{formatDate(formData.lastDate)}</Text>
        </TouchableOpacity>

        {showLastDatePicker && (
          <DateTimePicker
            value={formData.lastDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowLastDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, lastDate: selectedDate });
              }
            }}
          />
        )}
      </View>

      {/* 次回予定日 */}
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>次回予定日</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNextDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.dateButtonText}>{formatDate(formData.nextDate)}</Text>
        </TouchableOpacity>

        {showNextDatePicker && (
          <DateTimePicker
            value={formData.nextDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowNextDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, nextDate: selectedDate });
              }
            }}
          />
        )}
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
  typeInput: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: 16,
    color: theme.colors.text.primary,
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