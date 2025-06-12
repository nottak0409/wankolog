import React, { useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { petService } from "../database/services";
import { PetProfile } from "../types/profile";
import theme from "../constants/theme";

export default function PetProfileScreen() {
  const [petData, setPetData] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPetData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        setPetData(pets[0]); // 最初のペットを表示
      }
    } catch (error) {
      console.error("ペットデータの読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPetData();
    }, [])
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatGender = (gender: "male" | "female") => {
    return gender === "male" ? "オス" : "メス";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (!petData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>ペットが登録されていません</Text>
        <Text style={styles.emptySubText}>右上の編集ボタンから登録してください</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {petData.photo ? (
              <Image
                source={{ uri: petData.photo }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>写真なし</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{petData.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>犬種</Text>
            <Text style={styles.value}>{petData.breed}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>誕生日</Text>
            <Text style={styles.value}>{formatDate(petData.birthday)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>性別</Text>
            <Text style={styles.value}>{formatGender(petData.gender)}</Text>
          </View>
          {petData.weight && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>体重</Text>
              <Text style={styles.value}>{petData.weight}kg</Text>
            </View>
          )}
          {petData.registrationNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>登録番号</Text>
              <Text style={styles.value}>{petData.registrationNumber}</Text>
            </View>
          )}
          {petData.microchipNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>マイクロチップ</Text>
              <Text style={styles.value}>{petData.microchipNumber}</Text>
            </View>
          )}
          {petData.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>特記事項</Text>
              <Text style={styles.value}>{petData.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
    ...theme.shadows.sm,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    ...theme.shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  infoContainer: {
    padding: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  label: {
    width: 80,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
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
  noImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.main,
  },
  noImageText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
