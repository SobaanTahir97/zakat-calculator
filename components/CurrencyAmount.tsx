import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { formatAmount } from '../lib/calculate';
import { colors, spacing, typography } from '../constants/theme';
import CurrencyPrefix from './CurrencyPrefix';
import type { Currency } from '../lib/goldRate';

interface CurrencyAmountProps {
  amount: number;
  currency?: Currency;
  amountStyle?: StyleProp<TextStyle>;
  prefixSize?: number;
  prefixColor?: string;
  fallbackText?: string;
  forceTextFallback?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CurrencyAmount({
  amount,
  currency = 'AED',
  amountStyle,
  prefixSize = 16,
  prefixColor = colors.text.primary,
  fallbackText = 'AED',
  forceTextFallback = false,
  containerStyle,
}: CurrencyAmountProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      <CurrencyPrefix
        size={prefixSize}
        color={prefixColor}
        currency={currency}
        fallbackText={fallbackText}
        forceTextFallback={forceTextFallback}
      />
      <Text style={[styles.amountText, amountStyle]}>{formatAmount(amount, currency)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
});
