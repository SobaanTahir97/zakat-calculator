import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import InlineReferenceLink from './InlineReferenceLink';
import { useLanguage } from '../context/LanguageContext';
import type { WeightUnit } from '../lib/calculate';

interface NisabSelectorProps {
  nisabType: 'gold' | 'silver';
  weightUnit: WeightUnit;
  onToggleNisabType: () => void;
  onToggleWeightUnit: () => void;
}

export default function NisabSelector({
  nisabType,
  weightUnit,
  onToggleNisabType,
  onToggleWeightUnit,
}: NisabSelectorProps) {
  const { t, textDir } = useLanguage();


  const goldLabel = weightUnit === 'tola' ? t('nisab.goldTola') : t('nisab.goldGram');
  const silverLabel = weightUnit === 'tola' ? t('nisab.silverTola') : t('nisab.silverGram');

  return (
    <View>
      <View style={styles.sectionTitleRow}>
        <Text style={[styles.sectionTitle, textDir]}>{t('nisab.title')}</Text>
        <InlineReferenceLink
          referenceId="gold-silver"
          accessibilityLabel="Open nisab and gold silver reference"
        />
      </View>

      <View style={styles.nisabContainer}>
        <Pressable
          style={[styles.nisabButton, nisabType === 'gold' && styles.nisabButtonActive]}
          onPress={onToggleNisabType}
        >
          <Text style={[styles.nisabButtonText, nisabType === 'gold' && styles.nisabButtonTextActive]}>
            {goldLabel}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.nisabButton, nisabType === 'silver' && styles.nisabButtonActive]}
          onPress={onToggleNisabType}
        >
          <Text
            style={[styles.nisabButtonText, nisabType === 'silver' && styles.nisabButtonTextActive]}
          >
            {silverLabel}
          </Text>
        </Pressable>
      </View>

      <View style={styles.unitContainer}>
        <Pressable
          style={[styles.unitButton, weightUnit === 'gram' && styles.unitButtonActive]}
          onPress={weightUnit !== 'gram' ? onToggleWeightUnit : undefined}
        >
          <Text style={[styles.unitButtonText, weightUnit === 'gram' && styles.unitButtonTextActive]}>
            {t('nisab.gram')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.unitButton, weightUnit === 'tola' && styles.unitButtonActive]}
          onPress={weightUnit !== 'tola' ? onToggleWeightUnit : undefined}
        >
          <Text style={[styles.unitButtonText, weightUnit === 'tola' && styles.unitButtonTextActive]}>
            {t('nisab.tola')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  nisabContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  nisabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: colors.background.surface,
  },
  nisabButtonActive: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  nisabButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  nisabButtonTextActive: {
    color: colors.text.light,
  },
  unitContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: colors.background.surface,
  },
  unitButtonActive: {
    backgroundColor: colors.secondary.main,
    borderColor: colors.secondary.dark,
  },
  unitButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  unitButtonTextActive: {
    color: colors.text.light,
  },
});
