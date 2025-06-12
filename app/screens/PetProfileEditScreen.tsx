import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { PetProfile, PetProfileFormData } from "../types/profile";
import { ProfileImagePicker } from "../components/molecules/ProfileImagePicker";
import { PetProfileForm } from "../components/molecules/PetProfileForm";
import { petService } from "../database/services";
import theme from "../constants/theme";


export default function PetProfileEditScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPet, setCurrentPet] = useState<PetProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [initialFormData, setInitialFormData] = useState<PetProfileFormData>({
    name: "",
    gender: "male",
    birthday: new Date(),
    breed: "",
    weight: "",
    registrationNumber: "",
    microchipNumber: "",
    notes: "",
  });

  // ペットデータを読み込む
  const loadPetData = async () => {
    try {
      setLoading(true);
      const pets = await petService.getAll();
      if (pets.length > 0) {
        const pet = pets[0]; // 最初のペットを編集対象とする
        setCurrentPet(pet);
        setSelectedImage(pet.photo);
        setInitialFormData({
          name: pet.name,
          gender: pet.gender,
          birthday: pet.birthday,
          breed: pet.breed,
          weight: pet.weight ? pet.weight.toString() : "",
          registrationNumber: pet.registrationNumber || "",
          microchipNumber: pet.microchipNumber || "",
          notes: pet.notes || "",
        });
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

      if (currentPet) {
        // 既存のペットを更新
        await petService.update(currentPet.id, petData);
        Alert.alert("成功", "ペットプロフィールを更新しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // 新規ペットを作成
        await petService.create(petData);
        Alert.alert("成功", "ペットプロフィールを保存しました", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error("プロフィール保存エラー:", error);
      Alert.alert("エラー", "保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Stack.Screen
            options={{
              title: currentPet ? "プロフィール編集" : "プロフィール登録",
              headerStyle: {
                backgroundColor: theme.colors.background.main,
              },
              headerTintColor: theme.colors.text.primary,
            }}
          />
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: currentPet ? "プロフィール編集" : "プロフィール登録",
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
            initialData={initialFormData}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
