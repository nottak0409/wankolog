// Subscription Service with RevenueCat Integration
import Purchases, { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REVENUE_CAT_CONFIG } from '../config/revenuecat';

export interface SubscriptionStatus {
  isPremium: boolean;
  expiresAt?: Date;
  tier: 'free' | 'premium_monthly' | 'premium_yearly';
  productId?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
}

// Available subscription tiers
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'premium_monthly',
    name: 'プレミアム（月額）',
    price: '¥400',
    duration: '月',
    features: [
      '複数ペット管理（無制限）',
      'データの無制限保存・閲覧',
      '広告非表示',
      'CSVエクスポート機能',
      '詳細な健康レポート生成',
      '獣医師との共有機能（PDF出力）',
      'クラウドバックアップ・復元',
      'プレミアムテーマ・アイコン'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'プレミアム（年額）',
    price: '¥4,000',
    duration: '年',
    features: [
      '複数ペット管理（無制限）',
      'データの無制限保存・閲覧',
      '広告非表示',
      'CSVエクスポート機能',
      '詳細な健康レポート生成',
      '獣医師との共有機能（PDF出力）',
      'クラウドバックアップ・復元',
      'プレミアムテーマ・アイコン',
      '年額プランで17%お得！'
    ]
  }
];

// Free tier limitations
export const FREE_TIER_LIMITS = {
  MAX_PETS: 1,
  DATA_RETENTION_DAYS: 30,
  EXPORT_ENABLED: false,
};

// Storage keys
const STORAGE_KEYS = {
  SUBSCRIPTION_STATUS: 'subscription_status',
  LAST_SYNC: 'last_subscription_sync',
};

class SubscriptionService {
  private static instance: SubscriptionService;
  private currentStatus: SubscriptionStatus = {
    isPremium: false,
    tier: 'free'
  };

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // Initialize RevenueCat and sync subscription status
  async initialize(): Promise<void> {
    try {
      // Load cached status first
      await this.loadCachedStatus();
      
      // Sync with RevenueCat
      await this.syncSubscriptionStatus();
    } catch (error) {
      console.error('Subscription service initialization failed:', error);
    }
  }

  // Load subscription status from local storage
  private async loadCachedStatus(): Promise<void> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS);
      if (cached) {
        const status = JSON.parse(cached);
        // Convert string dates back to Date objects
        if (status.expiresAt) {
          status.expiresAt = new Date(status.expiresAt);
        }
        this.currentStatus = status;
      }
    } catch (error) {
      console.error('Failed to load cached subscription status:', error);
    }
  }

  // Sync subscription status with RevenueCat
  private async syncSubscriptionStatus(): Promise<void> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      await this.updateStatusFromCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Failed to sync subscription status:', error);
    }
  }

  // Update status from RevenueCat customer info
  private async updateStatusFromCustomerInfo(customerInfo: CustomerInfo): Promise<void> {
    const premiumEntitlement = customerInfo.entitlements.active[REVENUE_CAT_CONFIG.ENTITLEMENT_ID];
    
    const newStatus: SubscriptionStatus = {
      isPremium: !!premiumEntitlement,
      tier: 'free',
      expiresAt: undefined,
      productId: undefined,
    };

    if (premiumEntitlement) {
      newStatus.expiresAt = premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : undefined;
      newStatus.productId = premiumEntitlement.productIdentifier;
      
      // Determine tier based on product ID
      if (premiumEntitlement.productIdentifier === REVENUE_CAT_CONFIG.PRODUCT_IDS.PREMIUM_YEARLY) {
        newStatus.tier = 'premium_yearly';
      } else {
        newStatus.tier = 'premium_monthly';
      }
    }

    // Update current status and save to storage
    this.currentStatus = newStatus;
    await this.saveStatusToStorage(newStatus);
  }

  // Save status to local storage
  private async saveStatusToStorage(status: SubscriptionStatus): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, JSON.stringify(status));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save subscription status:', error);
    }
  }

  // Get current subscription status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // Check if we need to sync (every 24 hours or if no cache)
    const shouldSync = await this.shouldSyncWithRevenueCat();
    if (shouldSync) {
      await this.syncSubscriptionStatus();
    }
    
    return this.currentStatus;
  }

  // Check if user is premium
  async isPremiumUser(): Promise<boolean> {
    const status = await this.getSubscriptionStatus();
    return status.isPremium && (!status.expiresAt || status.expiresAt > new Date());
  }

  // Check if user can add more pets
  async canAddPet(currentPetCount: number): Promise<boolean> {
    const isPremium = await this.isPremiumUser();
    if (isPremium) {
      return true;
    }
    return currentPetCount < FREE_TIER_LIMITS.MAX_PETS;
  }

  // Check if user can access data older than free tier limit
  async canAccessOldData(date: Date): Promise<boolean> {
    const isPremium = await this.isPremiumUser();
    if (isPremium) {
      return true;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - FREE_TIER_LIMITS.DATA_RETENTION_DAYS);
    return date >= cutoffDate;
  }

  // Check if user can export data
  async canExportData(): Promise<boolean> {
    const isPremium = await this.isPremiumUser();
    return isPremium;
  }

  // Check if ads should be shown
  async shouldShowAds(): Promise<boolean> {
    const isPremium = await this.isPremiumUser();
    return !isPremium;
  }

  // Get upgrade prompts for different features
  getUpgradePrompt(feature: 'pets' | 'data' | 'export' | 'ads'): string {
    switch (feature) {
      case 'pets':
        return 'プレミアムプランにアップグレードして、複数のペットを管理しませんか？';
      case 'data':
        return 'プレミアムプランで過去のデータをすべて閲覧できます。';
      case 'export':
        return 'データのエクスポート機能はプレミアムプランでご利用いただけます。';
      case 'ads':
        return 'プレミアムプランにアップグレードして広告を非表示にしませんか？';
      default:
        return 'プレミアムプランでより多くの機能をお楽しみください。';
    }
  }

  // Check if sync is needed
  private async shouldSyncWithRevenueCat(): Promise<boolean> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!lastSync) return true;
      
      const lastSyncDate = new Date(lastSync);
      const now = new Date();
      const hoursSinceSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);
      
      // Sync every 24 hours
      return hoursSinceSync >= 24;
    } catch {
      return true; // Sync on error
    }
  }

  // Get available offerings from RevenueCat
  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current ? [offerings.current] : Object.values(offerings.all);
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return [];
    }
  }

  // Purchase subscription
  async purchaseSubscription(packageToPurchase: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      await this.updateStatusFromCustomerInfo(customerInfo);
      
      const isSuccess = this.currentStatus.isPremium;
      console.log('Purchase result:', { success: isSuccess, status: this.currentStatus });
      
      return isSuccess;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      await this.updateStatusFromCustomerInfo(customerInfo);
      
      console.log('Purchases restored:', this.currentStatus);
      return this.currentStatus.isPremium;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      return false;
    }
  }

  // Development helper: toggle premium status
  async togglePremiumForTesting(): Promise<void> {
    if (__DEV__) {
      this.currentStatus.isPremium = !this.currentStatus.isPremium;
      if (this.currentStatus.isPremium) {
        this.currentStatus.tier = 'premium_monthly';
        this.currentStatus.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else {
        this.currentStatus.tier = 'free';
        this.currentStatus.expiresAt = undefined;
      }
      console.log('Premium status toggled:', this.currentStatus);
    }
  }
}

export const subscriptionService = SubscriptionService.getInstance();