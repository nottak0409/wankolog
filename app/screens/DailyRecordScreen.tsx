import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import theme from "../constants/theme";

type RecordItem = {
  id: string;
  type: "meal" | "walk" | "weight" | "other";
  value: string;
  time?: string;
};

export default function DailyRecordScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [memo, setMemo] = useState("");

  const handleAddRecord = (type: RecordItem["type"]) => {
    const newRecord: RecordItem = {
      id: Date.now().toString(),
      type,
      value: "",
    };
    setRecords([...records, newRecord]);
  };

  const handleUpdateRecord = (id: string, value: string) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, value } : record
      )
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const getRecordIcon = (type: RecordItem["type"]) => {
    switch (type) {
      case "meal":
        return "food";
      case "walk":
        return "walk";
      case "weight":
        return "scale";
      default:
        return "note";
    }
  };

  const getRecordLabel = (type: RecordItem["type"]) => {
    switch (type) {
      case "meal":
        return "食事";
      case "walk":
        return "散歩";
      case "weight":
        return "体重";
      default:
        return "その他";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.recordButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddRecord("meal")}
        >
          <MaterialCommunityIcons
            name="food"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.addButtonText}>食事を記録</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddRecord("walk")}
        >
          <MaterialCommunityIcons
            name="walk"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.addButtonText}>散歩を記録</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddRecord("weight")}
        >
          <MaterialCommunityIcons
            name="scale"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.addButtonText}>体重を記録</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recordList}>
        {records.map((record) => (
          <View key={record.id} style={styles.recordItem}>
            <MaterialCommunityIcons
              name={getRecordIcon(record.type)}
              size={24}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.recordLabel}>
              {getRecordLabel(record.type)}
            </Text>
            <TextInput
              style={styles.recordInput}
              value={record.value}
              onChangeText={(text) => handleUpdateRecord(record.id, text)}
              placeholder="記録を入力"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        ))}
      </View>

      <View style={styles.photoSection}>
        <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
          <MaterialCommunityIcons
            name="camera"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.photoButtonText}>写真を追加</Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}
      </View>

      <View style={styles.memoSection}>
        <Text style={styles.sectionTitle}>メモ</Text>
        <TextInput
          style={styles.memoInput}
          value={memo}
          onChangeText={setMemo}
          placeholder="メモを入力"
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>保存</Text>
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
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  recordButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
  },
  addButton: {
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  addButtonText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.primary,
  },
  recordList: {
    padding: theme.spacing.md,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  recordLabel: {
    marginLeft: theme.spacing.sm,
    width: 60,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  recordInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text.primary,
  },
  photoSection: {
    padding: theme.spacing.md,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  photoButtonText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  memoSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  memoInput: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    height: 120,
    textAlignVertical: "top",
    color: theme.colors.text.primary,
  },
  submitButton: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  submitButtonText: {
    color: theme.colors.background.main,
    fontSize: 16,
    fontWeight: "600",
  },
});
