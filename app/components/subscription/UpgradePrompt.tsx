import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { subscriptionService, SUBSCRIPTION_TIERS } from '../../services/subscriptionService';
import theme from '../../constants/theme';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  feature: 'pets' | 'data' | 'export' | 'ads';
  onUpgrade?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  visible,
  onClose,
  feature,
  onUpgrade
}) => {
  const promptMessage = subscriptionService.getUpgradePrompt(feature);

  const handleUpgrade = () => {
    onUpgrade?.();
    onClose();
    // Navigate to premium upgrade screen
    // This will be handled by the parent component
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="crown"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>プレミアムプラン</Text>
          </View>
          
          <Text style={styles.message}>{promptMessage}</Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>プレミアム機能</Text>
            {SUBSCRIPTION_TIERS[0].features.slice(0, 4).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.pricingContainer}>
            <Text style={styles.priceText}>
              月額 {SUBSCRIPTION_TIERS[0].price} から
            </Text>
            <Text style={styles.priceSubText}>
              年額プランで17%お得
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
            >
              <Text style={styles.upgradeButtonText}>プレミアムにアップグレード</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>後で</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  priceSubText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: theme.colors.background.main,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
});