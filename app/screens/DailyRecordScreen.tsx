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

type RecordFormData = {
  type: "meal" | "poop" | "exercise";
  time: string;
  detail: string;
};

export default function DailyRecordScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recordData, setRecordData] = useState<RecordFormData>({
    type: "meal",
    time: new Date().toTimeString().slice(0, 5), // HH:mm形式
    detail: "",
  });

  useEffect(() => {
    loadPetData();
  }, []);

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
      
      await recordService.create({
        petId: currentPet.id,
        type: recordData.type,
        date: currentDate,
        time: recordData.time,
        detail: recordData.detail,
      });

      Alert.alert("成功", "記録を保存しました", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("記録保存エラー:", error);
      Alert.alert("エラー", "記録の保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const getRecordIcon = (type: "meal" | "poop" | "exercise") => {
    switch (type) {
      case "meal":
        return "food";
      case "poop":
        return "toilet";
      case "exercise":
        return "run";
      default:
        return "note";
    }
  };

  const getRecordLabel = (type: "meal" | "poop" | "exercise") => {
    switch (type) {
      case "meal":
        return "食事";
      case "poop":
        return "うんち";
      case "exercise":
        return "運動";
      default:
        return "その他";
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
          {(["meal", "poop", "exercise"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                recordData.type === type && styles.typeButtonActive,
              ]}
              onPress={() => setRecordData({ ...recordData, type })}
            >
              <MaterialCommunityIcons
                name={getRecordIcon(type)}
                size={24}
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

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? "保存中..." : "保存"}
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
  },
  typeButton: {
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    minWidth: 80,
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
});
