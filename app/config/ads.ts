// AdMob Configuration
import { TestIds } from 'react-native-google-mobile-ads';
import { subscriptionService } from '../services/subscriptionService';

// Production Ad Unit IDs (replace with your actual IDs from AdMob)
// For now, using test IDs for development
const PRODUCTION_IDS = {
  BANNER_HOME: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with actual ID
  NATIVE_HISTORY: 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzz', // Replace with actual ID
};

// Development mode check
const __DEV__ = process.env.NODE_ENV !== 'production';

// Export the appropriate IDs based on environment
export const AD_UNIT_IDS = {
  BANNER_HOME: __DEV__ ? TestIds.BANNER : PRODUCTION_IDS.BANNER_HOME,
  NATIVE_HISTORY: __DEV__ ? TestIds.NATIVE : PRODUCTION_IDS.NATIVE_HISTORY,
};

// Ad configuration
export const AD_CONFIG = {
  // Banner ad sizes
  BANNER_SIZE: {
    width: 320,
    height: 50,
  },
  
  // Native ad configuration
  NATIVE_AD_FREQUENCY: 5, // Show native ad every 5 items in list
  
  // Ad request configuration
  REQUEST_OPTIONS: {
    requestNonPersonalizedAdsOnly: true, // GDPR compliance
    keywords: ['pet', 'dog', 'health', 'veterinary'], // Pet-related keywords
  },
};

// Premium subscription check
export const isPremiumUser = async (): Promise<boolean> => {
  return await subscriptionService.isPremiumUser();
};