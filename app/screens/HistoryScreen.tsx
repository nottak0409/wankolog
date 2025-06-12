import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { petService, recordService } from "../database/services";
import { Record, RecordsByDate } from "../types/record";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";

export default function HistoryScreen() {
  const router = useRouter();
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsByDate, setRecordsByDate] = useState<RecordsByDate>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        const pet = pets[0];
        setCurrentPet(pet);
        
        // 過去30日の記録を取得
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        const recordsByDateData = await recordService.getByDateRange(
          pet.id,
          startDate,
          endDate
        );
        
        setRecordsByDate(recordsByDateData);
        
        // 全記録も取得（フラットリスト用）
        const allRecords = await recordService.getByPetId(pet.id);
        setRecords(allRecords);
      }
    } catch (error) {
      console.error("データの読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
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

  const dateKeys = Object.keys(recordsByDate).sort().reverse();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>記録履歴</Text>
        <Text style={styles.subtitle}>{currentPet.name}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/daily-record")}
        >
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={theme.colors.background.main}
          />
          <Text style={styles.addButtonText}>記録を追加</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dateKeys.length === 0 ? (
          <View style={styles.noRecordsContainer}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={48}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.noRecordsText}>まだ記録がありません</Text>
            <Text style={styles.noRecordsSubText}>
              右上のボタンから記録を追加してみましょう
            </Text>
          </View>
        ) : (
          dateKeys.map((date) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              {recordsByDate[date].map((record) => (
                <View key={record.id} style={styles.recordItem}>
                  <View style={styles.recordIconContainer}>
                    <MaterialCommunityIcons
                      name={getRecordIcon(record.type)}
                      size={24}
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
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
  header: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  addButtonText: {
    color: theme.colors.background.main,
    marginLeft: theme.spacing.xs,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  noRecordsContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  noRecordsText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  noRecordsSubText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  dateSection: {
    marginBottom: theme.spacing.lg,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.sm,
  },
  recordItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.main,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  recordContent: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  recordType: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  recordTime: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  recordDetail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  recordAmount: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: "normal",
  },
});
