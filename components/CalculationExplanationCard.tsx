import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import InlineReferenceLink from './InlineReferenceLink';

export default function CalculationExplanationCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded((prev) => !prev)}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>How Calculation Works</Text>
          <InlineReferenceLink
            referenceId="zakat-obligation"
            accessibilityLabel="Open zakat obligation reference"
          />
        </View>
        <Text style={styles.chevron}>{expanded ? 'Hide' : 'Show'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.step}>1. Add assets: cash, gold/silver, and investments.</Text>
          <Text style={styles.step}>2. Subtract short-term debts due within 12 months.</Text>
          <Text style={styles.step}>3. If net wealth is at or above nisab, zakat is 2.5%.</Text>

          <View style={styles.formulaContainer}>
            <Text style={styles.formula}>net_wealth = assets - short_term_debt</Text>
            <Text style={styles.formula}>
              {'zakat_due = net_wealth * 0.025 (if net_wealth >= nisab)'}
            </Text>
          </View>

          <View style={styles.nisabRow}>
            <Text style={styles.nisabText}>Nisab uses gold (85g) or silver (595g).</Text>
            <InlineReferenceLink
              referenceId="gold-silver"
              accessibilityLabel="Open gold and silver nisab reference"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  chevron: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  step: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  formulaContainer: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.sm,
  },
  formula: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.mono,
    lineHeight: 20,
  },
  nisabRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nisabText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
});
