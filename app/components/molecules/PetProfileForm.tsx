import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PetProfileFormData,
  PetProfileValidation,
  MOCK_BREED_OPTIONS,
} from "../../types/profile";
import theme from "../../constants/theme";

interface PetProfileFormProps {
  initialData?: Partial<PetProfileFormData>;
  onSubmit: (data: PetProfileFormData) => void;
  isSubmitting?: boolean;
}

export const PetProfileForm: React.FC<PetProfileFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<PetProfileFormData>({
    name: initialData?.name || "",
    gender: initialData?.gender || "male",
    birthday: initialData?.birthday || new Date(),
    breed: initialData?.breed || "",
    weight: initialData?.weight || "",
    registrationNumber: initialData?.registrationNumber || "",
    microchipNumber: initialData?.microchipNumber || "",
    notes: initialData?.notes || "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBreedPicker, setShowBreedPicker] = useState(false);
  const [validation, setValidation] = useState<PetProfileValidation>({
    name: true,
    gender: true,
    birthday: true,
    breed: true,
  });
  const [isFormTouched, setIsFormTouched] = useState(false);

  // initialDataが変更された時にformDataを更新
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        gender: initialData.gender || "male",
        birthday: initialData.birthday || new Date(),
        breed: initialData.breed || "",
        weight: initialData.weight || "",
        registrationNumber: initialData.registrationNumber || "",
        microchipNumber: initialData.microchipNumber || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newValidation = {
      name: formData.name.length > 0,
      gender: ["male", "female"].includes(formData.gender),
      birthday: true, // 常に日付が選択される
      breed: formData.breed.length > 0,
    };
    setValidation(newValidation);
    return Object.values(newValidation).every((v) => v);
  };

  const handleSubmit = () => {
    setIsFormTouched(true);
    if (validateForm()) {
      onSubmit(formData);
    }
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
      {/* 基本情報セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報</Text>

        {/* 名前 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>名前 *</Text>
          <TextInput
            style={[styles.input, isFormTouched && !validation.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="名前を入力"
            placeholderTextColor={theme.colors.text.secondary}
          />
          {isFormTouched && !validation.name && (
            <Text style={styles.errorText}>名前を入力してください</Text>
          )}
        </View>

        {/* 性別 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>性別 *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === "male" && styles.genderButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, gender: "male" })}
            >
              <MaterialCommunityIcons
                name="gender-male"
                size={24}
                color={
                  formData.gender === "male"
                    ? theme.colors.background.main
                    : theme.colors.text.primary
                }
              />
              <Text
                style={[
                  styles.genderText,
                  formData.gender === "male" && styles.genderTextActive,
                ]}
              >
                オス
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === "female" && styles.genderButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, gender: "female" })}
            >
              <MaterialCommunityIcons
                name="gender-female"
                size={24}
                color={
                  formData.gender === "female"
                    ? theme.colors.background.main
                    : theme.colors.text.primary
                }
              />
              <Text
                style={[
                  styles.genderText,
                  formData.gender === "female" && styles.genderTextActive,
                ]}
              >
                メス
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 誕生日 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>誕生日 *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.birthday)}</Text>
            <MaterialCommunityIcons
              name="calendar"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* 犬種 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>犬種 *</Text>
          <TouchableOpacity
            style={[styles.input, isFormTouched && !validation.breed && styles.inputError]}
            onPress={() => setShowBreedPicker(true)}
          >
            <Text style={formData.breed ? styles.selectedText : styles.placeholderText}>
              {formData.breed || "犬種を選択"}
            </Text>
          </TouchableOpacity>
          {isFormTouched && !validation.breed && (
            <Text style={styles.errorText}>犬種を選択してください</Text>
          )}
        </View>

        {/* 体重（任意） */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>体重（kg）</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="0.0"
            keyboardType="decimal-pad"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>
      </View>

      {/* その他情報セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>その他情報</Text>

        {/* 登録番号（任意） */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>登録番号</Text>
          <TextInput
            style={styles.input}
            value={formData.registrationNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, registrationNumber: text })
            }
            placeholder="登録番号を入力"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        {/* マイクロチップ番号（任意） */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>マイクロチップ番号</Text>
          <TextInput
            style={styles.input}
            value={formData.microchipNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, microchipNumber: text })
            }
            placeholder="マイクロチップ番号を入力"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        {/* 特記事項（任意） */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>特記事項</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="アレルギーなどの特記事項を入力"
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthday}
          mode="date"
          display="spinner"
          onChange={(event: any, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData({ ...formData, birthday: selectedDate });
            }
          }}
        />
      )}


      {/* 保存ボタン */}
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "保存中..." : "保存"}
        </Text>
      </TouchableOpacity>

      {/* 犬種選択モーダル */}
      <Modal
        visible={showBreedPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBreedPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowBreedPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowBreedPicker(false)}>
                <Text style={styles.modalCancelText}>キャンセル</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>犬種を選択</Text>
              <TouchableOpacity onPress={() => setShowBreedPicker(false)}>
                <Text style={styles.modalDoneText}>完了</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={MOCK_BREED_OPTIONS}
              style={styles.breedList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.breedItem,
                    formData.breed === item.name && styles.breedItemSelected
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, breed: item.name });
                    if (isFormTouched) {
                      setValidation({ ...validation, breed: true });
                    }
                    setShowBreedPicker(false);
                  }}
                >
                  <Text style={[
                    styles.breedItemText,
                    formData.breed === item.name && styles.breedItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                  <Text style={styles.breedGroupText}>{item.group}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.background.main,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: theme.colors.error || "#ff6b6b",
  },
  errorText: {
    color: theme.colors.error || "#ff6b6b",
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  genderText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  genderTextActive: {
    color: theme.colors.background.main,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
  },
  submitButtonText: {
    color: theme.colors.background.main,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  selectedText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.main,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalCancelText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  modalDoneText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  breedList: {
    maxHeight: 400,
  },
  breedItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
  },
  breedItemSelected: {
    backgroundColor: theme.colors.background.secondary,
  },
  breedItemText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  breedItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  breedGroupText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.main,
  },
});
