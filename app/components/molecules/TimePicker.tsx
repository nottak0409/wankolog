import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { TimePickerProps } from "../../types/notification";
import theme from "../../constants/theme";

export const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempHour, setTempHour] = useState(time.split(":")[0]);
  const [tempMinute, setTempMinute] = useState(time.split(":")[1]);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );

  const handleConfirm = () => {
    onTimeChange(`${tempHour}:${tempMinute}`);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>時間を選択</Text>

            <View style={styles.pickerContainer}>
              {/* 時間選択 */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>時</Text>
                <View style={styles.pickerValues}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        hour === tempHour && styles.selectedItem,
                      ]}
                      onPress={() => setTempHour(hour)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          hour === tempHour && styles.selectedItemText,
                        ]}
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 分選択 */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>分</Text>
                <View style={styles.pickerValues}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        minute === tempMinute && styles.selectedItem,
                      ]}
                      onPress={() => setTempMinute(minute)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          minute === tempMinute && styles.selectedItemText,
                        ]}
                      >
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  確定
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: "center",
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
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  pickerValues: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: theme.spacing.sm,
    marginVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary,
  },
  pickerItemText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  selectedItemText: {
    color: theme.colors.background.main,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.background.secondary,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
  confirmButtonText: {
    color: theme.colors.background.main,
  },
});
