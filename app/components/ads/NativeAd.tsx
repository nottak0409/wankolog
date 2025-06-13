import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_CONFIG, isPremiumUser } from '../../config/ads';
import { colors, spacing } from '../../constants/theme';

interface NativeAdProps {
  unitId?: string;
}

export const NativeAd: React.FC<NativeAdProps> = ({ 
  unitId = AD_UNIT_IDS.NATIVE_HISTORY 
}) => {
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    // Check if user is premium
    const checkPremiumStatus = async () => {
      const isPremium = await isPremiumUser();
      setShowAd(!isPremium);
    };
    
    checkPremiumStatus();
  }, []);

  if (!showAd) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.nativeAdContainer}>
        <Text style={styles.adLabel}>広告</Text>
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={AD_CONFIG.REQUEST_OPTIONS}
          onAdLoaded={() => {
            console.log('Native ad loaded');
          }}
          onAdFailedToLoad={(error: any) => {
            console.error('Native ad failed to load:', error);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  nativeAdContainer: {
    backgroundColor: colors.background.main,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.main,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  adContent: {
    minHeight: 250, // MEDIUM_RECTANGLE size
    alignItems: 'center',
    justifyContent: 'center',
  },
});