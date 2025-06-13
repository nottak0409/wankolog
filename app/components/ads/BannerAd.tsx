import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_CONFIG, isPremiumUser } from '../../config/ads';
import { colors } from '../../constants/theme';

interface BannerAdProps {
  unitId?: string;
  size?: BannerAdSize;
}

export const BannerAd: React.FC<BannerAdProps> = ({ 
  unitId = AD_UNIT_IDS.BANNER_HOME,
  size = BannerAdSize.BANNER 
}) => {
  const [showAd, setShowAd] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

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
    <View style={[styles.container, adLoaded && styles.containerWithAd]}>
      <GoogleBannerAd
        unitId={unitId}
        size={size}
        requestOptions={AD_CONFIG.REQUEST_OPTIONS}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
          setAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          setAdLoaded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    minHeight: 0,
  },
  containerWithAd: {
    minHeight: AD_CONFIG.BANNER_SIZE.height,
    paddingVertical: 8,
  },
});