import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";

type DailySummaryCardProps = {
  weight?: number;
  mealsCount: number;
  poopsCount: number;
  exerciseMinutes: number;
  date?: string;
};

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  weight,
  mealsCount,
  poopsCount,
  exerciseMinutes,
  date = new Date().toISOString().split("T")[0],
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/daily-record",
      params: { date },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>今日の記録概要</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Ionicons name="scale" size={24} color={theme.colors.primary} />
          <Text style={styles.label}>体重</Text>
          <Text style={styles.value}>{weight ? `${weight}kg` : "未計測"}</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
          <Text style={styles.label}>食事</Text>
          <Text style={styles.value}>{mealsCount}回</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="fitness" size={24} color={theme.colors.primary} />
          <Text style={styles.label}>うんち</Text>
          <Text style={styles.value}>{poopsCount}回</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="walk" size={24} color={theme.colors.primary} />
          <Text style={styles.label}>運動</Text>
          <Text style={styles.value}>{exerciseMinutes}分</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
});

export default DailySummaryCard;
