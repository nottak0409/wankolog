import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";

type DailySummary = {
  date: string;
  weight?: number;
  mealsCount: number;
  poopsCount: number;
  exerciseMinutes: number;
};

type WeeklySummaryCardProps = {
  data: DailySummary[];
};

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ data }) => {
  const router = useRouter();

  const handleDayPress = (date: string) => {
    router.push({
      pathname: "/daily-record",
      params: { date },
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // NaNチェック
      if (isNaN(date.getTime())) {
        return dateStr; // 変換できない場合は元の文字列を返す
      }
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>今週の記録</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((record) => (
          <TouchableOpacity
            key={record.date}
            style={styles.dayCard}
            onPress={() => handleDayPress(record.date)}
          >
            <Text style={styles.date}>{formatDate(record.date)}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.label}>体重</Text>
                <Text style={styles.value}>
                  {record.weight ? `${record.weight}kg` : "未計測"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.label}>食事</Text>
                <Text style={styles.value}>{record.mealsCount}回</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.label}>うんち</Text>
                <Text style={styles.value}>{record.poopsCount}回</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.label}>運動</Text>
                <Text style={styles.value}>{record.exerciseMinutes}分</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingRight: theme.spacing.md,
  },
  dayCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    width: 150,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  statsContainer: {
    gap: theme.spacing.xs,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
});

export default WeeklySummaryCard;
