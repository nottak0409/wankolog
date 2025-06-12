import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { PetProfile, PetProfileFormData } from "../types/profile";
import { ProfileImagePicker } from "../components/molecules/ProfileImagePicker";
import { PetProfileForm } from "../components/molecules/PetProfileForm";
import { petService } from "../database/services";
import theme from "../constants/theme";


export default function PetProfileEditScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const handleImageSelected = (result: { uri: string }) => {
    setSelectedImage(result.uri);
  };

  const handleSubmit = async (formData: PetProfileFormData) => {
    try {
      setIsSubmitting(true);
      
      // フォームデータをPetProfileに変換
      const petData: Omit<PetProfile, 'id'> = {
        name: formData.name,
        gender: formData.gender,
        birthday: formData.birthday,
        breed: formData.breed,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        registrationNumber: formData.registrationNumber,
        microchipNumber: formData.microchipNumber,
        photo: selectedImage,
        notes: formData.notes,
      };

      // データベースに保存
      await petService.create(petData);
      
      Alert.alert("成功", "ペットプロフィールを保存しました", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("プロフィール保存エラー:", error);
      Alert.alert("エラー", "保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            currentImage={selectedImage}
            onImageSelected={handleImageSelected}
          />

          <PetProfileForm
            initialData={{
              name: "",
              gender: "male",
              birthday: new Date(),
              breed: "",
              weight: "",
              registrationNumber: "",
              microchipNumber: "",
              notes: "",
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    paddingVertical: theme.spacing.lg,
  },
});
