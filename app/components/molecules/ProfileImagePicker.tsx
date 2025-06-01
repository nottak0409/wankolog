import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult, ImagePickerOption } from "../../types/profile";
import theme from "../../constants/theme";

interface ProfileImagePickerProps {
  currentImage?: string;
  onImageSelected: (result: ImagePickerResult) => void;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  currentImage,
  onImageSelected,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const requestPermission = async (type: ImagePickerOption) => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const handleImagePick = async (type: ImagePickerOption) => {
    try {
      const hasPermission = await requestPermission(type);
      if (!hasPermission) {
        // TODO: エラーハンドリング（権限がない場合）
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      };

      const result =
        type === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        const asset = result.assets[0];
        onImageSelected({
          uri: asset.uri,
          type: "image/jpeg",
          fileName: `profile-${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      // TODO: エラーハンドリング
      console.error("画像選択エラー:", error);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => setModalVisible(true)}
      >
        {currentImage ? (
          <Image source={{ uri: currentImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons
              name="dog"
              size={48}
              color={theme.colors.secondary}
            />
          </View>
        )}
        <View style={styles.editBadge}>
          <MaterialCommunityIcons
            name="camera"
            size={20}
            color={theme.colors.background.main}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>写真を選択</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleImagePick("camera")}
            >
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.optionText}>カメラで撮影</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleImagePick("library")}
            >
              <MaterialCommunityIcons
                name="image"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.optionText}>ライブラリから選択</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, styles.cancelOption]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background.secondary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.background.main,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background.main,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  optionText: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  cancelOption: {
    backgroundColor: theme.colors.background.main,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
    marginTop: theme.spacing.md,
  },
  cancelText: {
    textAlign: "center",
    width: "100%",
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
});
