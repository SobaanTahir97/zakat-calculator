import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import CurrencyAmount from './CurrencyAmount';
import type { Currency } from '../lib/goldRate';

interface BreakdownCardProps {
  label: string;
  amount: number;
  percentage?: number;
  currency?: Currency;
}

export default function BreakdownCard({
  label,
  amount,
  percentage,
  currency = 'AED',
}: BreakdownCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <CurrencyAmount
          amount={amount}
          currency={currency}
          amountStyle={styles.amount}
          prefixSize={14}
          prefixColor={colors.text.primary}
        />
      </View>
      {percentage !== undefined && (
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  percentageBadge: {
    backgroundColor: colors.secondary.soft,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  percentageText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondary.dark,
  },
});
