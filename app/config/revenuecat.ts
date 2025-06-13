// RevenueCat Configuration
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys (replace with your actual keys)
const REVENUECAT_CONFIG = {
  // Get these from RevenueCat dashboard
  IOS_API_KEY: 'appl_xxxxxxxxxxxxxxxxx', // Replace with actual iOS key
  ANDROID_API_KEY: 'goog_xxxxxxxxxxxxxxxxx', // Replace with actual Android key
  
  // Product IDs (must match App Store/Google Play)
  PRODUCT_IDS: {
    PREMIUM_MONTHLY: 'com.wankolog.premium_monthly',
    PREMIUM_YEARLY: 'com.wankolog.premium_yearly',
  },
  
  // Offering ID (configured in RevenueCat)
  OFFERING_ID: 'premium_offering',
  
  // Entitlement ID (configured in RevenueCat)
  ENTITLEMENT_ID: 'premium',
};

// Development mode check
const __DEV__ = process.env.NODE_ENV !== 'production';

export const initializeRevenueCat = async (userId?: string) => {
  try {
    // Configure RevenueCat
    if (__DEV__) {
      // Use debug mode for development
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    
    // Initialize with platform-specific API key
    const apiKey = Platform.OS === 'ios' 
      ? REVENUECAT_CONFIG.IOS_API_KEY 
      : REVENUECAT_CONFIG.ANDROID_API_KEY;
    
    await Purchases.configure({ apiKey });
    
    // Set user ID if provided (optional)
    if (userId) {
      await Purchases.logIn(userId);
    }
    
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('RevenueCat initialization failed:', error);
  }
};

export const REVENUE_CAT_CONFIG = REVENUECAT_CONFIG;