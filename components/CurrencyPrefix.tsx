import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '../constants/theme';
import type { Currency } from '../lib/goldRate';

interface CurrencyPrefixProps {
  size?: number;
  color?: string;
  currency?: Currency;
  fallbackText?: string;
  forceTextFallback?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function DirhamSymbol({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M8 4V28M8 4H15.5C22 4 27 9 27 16C27 23 22 28 15.5 28H8M5 12.25H29M5 17.75H29"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function CurrencyPrefix({
  size = 16,
  color = colors.text.primary,
  currency = 'AED',
  fallbackText,
  forceTextFallback = false,
  containerStyle,
  textStyle,
}: CurrencyPrefixProps) {
  if (currency === 'PKR' || forceTextFallback) {
    const text = currency === 'PKR' ? 'Rs' : (fallbackText ?? 'AED');
    return <Text style={[styles.fallbackText, { color }, textStyle]}>{text}</Text>;
  }

  return (
    <View style={[styles.iconContainer, containerStyle]}>
      <DirhamSymbol size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  fallbackText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginRight: spacing.sm,
  },
});
