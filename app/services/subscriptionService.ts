// Subscription Service
// This will integrate with RevenueCat in the future

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

  // Get current subscription status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // TODO: Integrate with RevenueCat to get real subscription status
    // For now, return mock free tier
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

  // Mock purchase methods (to be replaced with RevenueCat)
  async purchaseSubscription(tierId: string): Promise<boolean> {
    // TODO: Implement actual purchase flow with RevenueCat
    console.log(`Purchasing subscription: ${tierId}`);
    
    // Mock successful purchase
    this.currentStatus = {
      isPremium: true,
      tier: tierId as any,
      expiresAt: new Date(Date.now() + (tierId === 'premium_yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      productId: tierId
    };
    
    return true;
  }

  async restorePurchases(): Promise<boolean> {
    // TODO: Implement restore purchases with RevenueCat
    console.log('Restoring purchases...');
    return false;
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