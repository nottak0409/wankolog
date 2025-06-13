import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { subscriptionService, SUBSCRIPTION_TIERS } from '../services/subscriptionService';
import theme from '../constants/theme';

export default function PremiumUpgradeScreen() {
  const router = useRouter();
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const availableOfferings = await subscriptionService.getOfferings();
      setOfferings(availableOfferings);
      
      // Auto-select the first monthly package if available
      if (availableOfferings.length > 0 && availableOfferings[0].availablePackages.length > 0) {
        const monthlyPackage = availableOfferings[0].availablePackages.find(
          pkg => pkg.packageType === 'MONTHLY'
        );
        setSelectedPackage(monthlyPackage || availableOfferings[0].availablePackages[0]);
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
      Alert.alert('エラー', '料金プランの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('エラー', 'プランを選択してください。');
      return;
    }

    try {
      setPurchasing(true);
      const success = await subscriptionService.purchaseSubscription(selectedPackage);
      
      if (success) {
        Alert.alert(
          '購入完了',
          'プレミアムプランへのアップグレードが完了しました！',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('エラー', '購入に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('エラー', '購入処理中にエラーが発生しました。');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setRestoring(true);
      const success = await subscriptionService.restorePurchases();
      
      if (success) {
        Alert.alert(
          '復元完了',
          'プレミアムプランが復元されました！',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('情報', '復元可能な購入が見つかりませんでした。');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('エラー', '購入の復元に失敗しました。');
    } finally {
      setRestoring(false);
    }
  };

  const formatPrice = (pkg: PurchasesPackage): string => {
    return pkg.product.priceString || '¥400';
  };

  const getPackageTitle = (pkg: PurchasesPackage): string => {
    if (pkg.packageType === 'ANNUAL') {
      return 'プレミアム（年額）';
    } else if (pkg.packageType === 'MONTHLY') {
      return 'プレミアム（月額）';
    }
    return 'プレミアムプラン';
  };

  const getPackageDuration = (pkg: PurchasesPackage): string => {
    if (pkg.packageType === 'ANNUAL') {
      return '年';
    } else if (pkg.packageType === 'MONTHLY') {
      return '月';
    }
    return '';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>料金プランを読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="crown"
          size={64}
          color={theme.colors.primary}
        />
        <Text style={styles.title}>わんこログ プレミアム</Text>
        <Text style={styles.subtitle}>
          より多くの機能で、愛犬の健康管理を充実させましょう
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>プレミアム機能</Text>
        {SUBSCRIPTION_TIERS[0].features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Pricing Plans */}
      <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>料金プラン</Text>
        {offerings.map((offering) =>
          offering.availablePackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.identifier}
              style={[
                styles.planItem,
                selectedPackage?.identifier === pkg.identifier && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{getPackageTitle(pkg)}</Text>
                {pkg.packageType === 'ANNUAL' && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>17%お得</Text>
                  </View>
                )}
              </View>
              <Text style={styles.planPrice}>
                {formatPrice(pkg)}/{getPackageDuration(pkg)}
              </Text>
              <Text style={styles.planDescription}>
                {pkg.packageType === 'ANNUAL'
                  ? '年額プランで長期利用がお得'
                  : '月額プランで気軽に始められます'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Purchase Button */}
      <TouchableOpacity
        style={[styles.purchaseButton, purchasing && styles.buttonDisabled]}
        onPress={handlePurchase}
        disabled={purchasing || !selectedPackage}
      >
        {purchasing ? (
          <ActivityIndicator color={theme.colors.background.main} />
        ) : (
          <Text style={styles.purchaseButtonText}>
            {selectedPackage ? `${formatPrice(selectedPackage)}で開始` : 'プランを選択してください'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Restore Button */}
      <TouchableOpacity
        style={[styles.restoreButton, restoring && styles.buttonDisabled]}
        onPress={handleRestorePurchases}
        disabled={restoring}
      >
        {restoring ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Text style={styles.restoreButtonText}>購入を復元</Text>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.termsText}>
        定期購読は自動更新されます。解約はApp Store設定から行えます。
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  plansContainer: {
    marginBottom: theme.spacing.xl,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  planItem: {
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  savingsBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  savingsText: {
    color: theme.colors.background.main,
    fontSize: 12,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  purchaseButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  purchaseButtonText: {
    color: theme.colors.background.main,
    fontSize: 18,
    fontWeight: '600',
  },
  restoreButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  restoreButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});