import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { petService, recordService } from "../database/services";
import { Record } from "../types/record";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";
import { useFocusEffect } from "expo-router";

type RecordFormData = {
  type: "meal" | "poop" | "exercise" | "weight";
  time: string;
  detail: string;
  amount?: number;
  unit?: string;
};

export default function DailyRecordScreen() {
  const { date, recordId } = useLocalSearchParams<{ date: string; recordId?: string }>();
  const router = useRouter();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingRecords, setExistingRecords] = useState<Record[]>([]);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [recordData, setRecordData] = useState<RecordFormData>({
    type: "meal",
    time: new Date().toTimeString().slice(0, 5), // HH:mm形式
    detail: "",
    amount: undefined,
    unit: undefined,
  });

  useEffect(() => {
    loadPetData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (currentPet) {
        loadExistingRecords();
      }
    }, [currentPet, date])
  );

  useEffect(() => {
    if (recordId && existingRecords.length > 0) {
      const recordToEdit = existingRecords.find(r => r.id === recordId);
      if (recordToEdit) {
        setEditingRecord(recordToEdit);
        setRecordData({
          type: recordToEdit.type,
          time: recordToEdit.time,
          detail: recordToEdit.detail,
          amount: recordToEdit.amount,
          unit: recordToEdit.unit,
        });
      }
    }
  }, [recordId, existingRecords]);

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

  const loadExistingRecords = async () => {
    if (!currentPet) return;
    
    try {
      const currentDate = date || new Date().toISOString().split('T')[0];
      const records = await recordService.getByDate(currentPet.id, currentDate);
      setExistingRecords(records);
    } catch (error) {
      console.error("既存記録の読み込みエラー:", error);
    }
  };

  const handleSubmit = async () => {
    if (!currentPet) {
      Alert.alert("エラー", "ペットが登録されていません");
      return;
    }

    if (!recordData.detail.trim()) {
      Alert.alert("エラー", "記録の詳細を入力してください");
      return;
    }

    try {
      setSubmitting(true);
      
      const currentDate = date || new Date().toISOString().split('T')[0];
      
      if (editingRecord) {
        // 編集モード
        await recordService.update(editingRecord.id, {
          type: recordData.type,
          time: recordData.time,
          detail: recordData.detail,
          amount: recordData.amount,
          unit: recordData.unit,
        });
        Alert.alert("成功", "記録を更新しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // 新規作成モード
        await recordService.create({
          petId: currentPet.id,
          type: recordData.type,
          date: currentDate,
          time: recordData.time,
          detail: recordData.detail,
          amount: recordData.amount,
          unit: recordData.unit,
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

  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setRecordData({
      type: record.type,
      time: record.time,
      detail: record.detail,
      amount: record.amount,
      unit: record.unit,
    });
  };

  const handleDeleteRecord = async (recordToDelete: Record) => {
    Alert.alert(
      "削除確認",
      "この記録を削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await recordService.delete(recordToDelete.id);
              await loadExistingRecords();
              Alert.alert("成功", "記録を削除しました");
            } catch (error) {
              console.error("記録削除エラー:", error);
              Alert.alert("エラー", "記録の削除に失敗しました");
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setEditingRecord(null);
    setRecordData({
      type: "meal",
      time: new Date().toTimeString().slice(0, 5),
      detail: "",
      amount: undefined,
      unit: undefined,
    });
  };

  const getRecordIcon = (type: "meal" | "poop" | "exercise" | "weight") => {
    switch (type) {
      case "meal":
        return "food";
      case "poop":
        return "toilet";
      case "exercise":
        return "run";
      case "weight":
        return "scale";
      default:
        return "note";
    }
  };

  const getRecordLabel = (type: "meal" | "poop" | "exercise" | "weight") => {
    switch (type) {
      case "meal":
        return "食事";
      case "poop":
        return "うんち";
      case "exercise":
        return "運動";
      case "weight":
        return "体重";
      default:
        return "その他";
    }
  };

  const getDefaultUnit = (type: "meal" | "poop" | "exercise" | "weight") => {
    switch (type) {
      case "meal":
        return "g";
      case "exercise":
        return "minutes";
      case "weight":
        return "kg";
      default:
        return "";
    }
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
        <Text style={styles.date}>
          {date || new Date().toLocaleDateString("ja-JP")}
        </Text>
        <Text style={styles.petName}>{currentPet.name}の記録</Text>
      </View>

      {/* 記録タイプ選択 */}
      <View style={styles.typeSection}>
        <Text style={styles.sectionTitle}>記録タイプ</Text>
        <View style={styles.typeButtons}>
          {(["meal", "poop", "exercise", "weight"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                recordData.type === type && styles.typeButtonActive,
              ]}
              onPress={() => setRecordData({ 
                ...recordData, 
                type,
                unit: getDefaultUnit(type) 
              })}
            >
              <MaterialCommunityIcons
                name={getRecordIcon(type)}
                size={20}
                color={
                  recordData.type === type
                    ? theme.colors.background.main
                    : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  recordData.type === type && styles.typeButtonTextActive,
                ]}
              >
                {getRecordLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 時刻入力 */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>時刻</Text>
        <TextInput
          style={styles.timeInput}
          value={recordData.time}
          onChangeText={(text) => setRecordData({ ...recordData, time: text })}
          placeholder="HH:mm"
          placeholderTextColor={theme.colors.text.secondary}
        />
      </View>

      {/* 数量入力（食事、運動、体重の場合） */}
      {(recordData.type === "meal" || recordData.type === "exercise" || recordData.type === "weight") && (
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>
            {recordData.type === "meal" && "食事量"}
            {recordData.type === "exercise" && "運動時間"}
            {recordData.type === "weight" && "体重"}
          </Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              value={recordData.amount?.toString() || ""}
              onChangeText={(text) => {
                const numericValue = text.trim() === "" ? undefined : parseFloat(text);
                setRecordData({ 
                  ...recordData, 
                  amount: isNaN(numericValue!) ? undefined : numericValue 
                });
              }}
              placeholder="数値を入力"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Text style={styles.unitText}>{recordData.unit}</Text>
          </View>
        </View>
      )}

      {/* 詳細入力 */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>詳細</Text>
        <TextInput
          style={styles.detailInput}
          value={recordData.detail}
          onChangeText={(text) => setRecordData({ ...recordData, detail: text })}
          placeholder="記録の詳細を入力してください"
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* 既存記録一覧 */}
      {existingRecords.length > 0 && (
        <View style={styles.existingRecordsSection}>
          <Text style={styles.sectionTitle}>今日の記録</Text>
          {existingRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordIconContainer}>
                <MaterialCommunityIcons
                  name={getRecordIcon(record.type)}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.recordContent}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordType}>
                    {getRecordLabel(record.type)}
                    {record.amount && record.unit && !isNaN(record.amount) && (
                      <Text style={styles.recordAmount}>
                        {" "}({record.amount}{record.unit})
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.recordTime}>{record.time}</Text>
                </View>
                <Text style={styles.recordDetail}>{record.detail}</Text>
              </View>
              <View style={styles.recordActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditRecord(record)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={18}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRecord(record)}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={18}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {editingRecord && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={resetForm}
          >
            <Text style={styles.cancelButtonText}>新規作成に戻る</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting 
              ? (editingRecord ? "更新中..." : "保存中...") 
              : (editingRecord ? "更新" : "保存")
            }
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
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
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  petName: {
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
    minWidth: 70,
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
  timeSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  timeInput: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
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
  amountSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  unitText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    minWidth: 40,
  },
  existingRecordsSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  recordIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.main,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  recordContent: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  recordType: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  recordTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  recordDetail: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  recordAmount: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: "normal",
  },
  recordActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  editButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.main,
  },
  deleteButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.main,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  cancelButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
