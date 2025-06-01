import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { PetProfile, PetProfileFormData } from "../types/profile";
import { ProfileImagePicker } from "../components/molecules/ProfileImagePicker";
import { PetProfileForm } from "../components/molecules/PetProfileForm";
import theme from "../constants/theme";

// TODO: 後でグローバルステートから取得するように変更
const MOCK_PROFILE: PetProfile = {
  id: "1",
  name: "ポチ",
  gender: "male",
  birthday: new Date("2022-01-01"),
  breed: "柴犬",
  weight: 8.5,
  photo: undefined,
  registrationNumber: "R12345",
  microchipNumber: "MC98765",
  notes: "食物アレルギー（チキン）あり",
};

export default function PetProfileEditScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<PetProfile>(MOCK_PROFILE);

  const handleImageSelected = (result: { uri: string }) => {
    setProfile((prev) => ({
      ...prev,
      photo: result.uri,
    }));
  };

  const handleSubmit = async (formData: PetProfileFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: APIリクエストの実装
      // await updatePetProfile({ ...formData, photo: profile.photo });

      // 成功したら前の画面に戻る
      router.back();
    } catch (error) {
      // TODO: エラーハンドリング
      console.error("プロフィール更新エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "プロフィール編集",
          headerStyle: {
            backgroundColor: theme.colors.background.main,
          },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ProfileImagePicker
          currentImage={profile.photo}
          onImageSelected={handleImageSelected}
        />

        <PetProfileForm
          initialData={{
            name: profile.name,
            gender: profile.gender,
            birthday: profile.birthday,
            breed: profile.breed,
            weight: profile.weight?.toString(),
            registrationNumber: profile.registrationNumber,
            microchipNumber: profile.microchipNumber,
            notes: profile.notes,
          }}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: theme.spacing.lg,
  },
});
