import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import InlineReferenceLink from './InlineReferenceLink';
import { useLanguage } from '../context/LanguageContext';
import type { Methodology } from '../lib/calculate';

interface Props {
  methodology?: Methodology;
  deductDebts?: boolean;
}

interface Step {
  text: string;
  source: string;
}

function getSteps(
  methodology: Methodology,
  deductDebts: boolean,
  t: (key: string) => string,
): Step[] {
  const base: Step[] = [
    { text: t('calculation.step1'), source: t('calculation.source1') },
    {
      text: deductDebts ? t('calculation.step2Deduct') : t('calculation.step2NoDeduct'),
      source: deductDebts ? t('calculation.source2Deduct') : t('calculation.source2NoDeduct'),
    },
    { text: t('calculation.step3'), source: t('calculation.source3') },
  ];

  if (methodology === 'ghamidi') {
    return [
      ...base,
      { text: t('calculation.step4Ghamidi'), source: t('calculation.source4Ghamidi') },
      { text: t('calculation.step5Ghamidi'), source: t('calculation.source5Ghamidi') },
    ];
  }

  if (methodology === 'contemporary') {
    return [
      ...base,
      { text: t('calculation.step4Contemporary'), source: t('calculation.source4Contemporary') },
      { text: t('calculation.step5Contemporary'), source: t('calculation.source5Contemporary') },
    ];
  }

  return base;
}

export default function CalculationExplanationCard({ methodology = 'standard', deductDebts = true }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { t, textDir } = useLanguage();
  const steps = useMemo(() => getSteps(methodology, deductDebts, t), [methodology, deductDebts, t]);


  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded((prev) => !prev)}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, textDir]}>{t('calculation.title')}</Text>
          <InlineReferenceLink
            referenceId="zakat-obligation"
            accessibilityLabel="Open zakat obligation reference"
          />
        </View>
        <Text style={styles.chevron}>{expanded ? t('calculation.hide') : t('calculation.show')}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.step}>{step.text}</Text>
              <Text style={styles.source}>{step.source}</Text>
            </View>
          ))}

          <View style={styles.formulaContainer}>
            <Text style={styles.formula}>{deductDebts ? t('calculation.formulaNet') : t('calculation.formulaNetNoDebt')}</Text>
            <Text style={styles.formula}>
              {t('calculation.formulaZakat')}
            </Text>
            {methodology === 'ghamidi' && (
              <Text style={styles.formula}>
                {t('calculation.formulaUshr')}
              </Text>
            )}
            {methodology === 'contemporary' && (
              <Text style={styles.formula}>
                {t('calculation.formulaContemporary')}
              </Text>
            )}
          </View>

          <View style={styles.nisabRow}>
            <Text style={[styles.nisabText, textDir]}>{t('calculation.nisabNote')}</Text>
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
  stepRow: {
    gap: 2,
  },
  step: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  source: {
    color: colors.text.light,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    lineHeight: 16,
    paddingLeft: spacing.sm,
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
