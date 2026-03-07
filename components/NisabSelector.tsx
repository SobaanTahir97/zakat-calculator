import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AssetInput from './AssetInput';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import InlineReferenceLink from './InlineReferenceLink';

interface NisabSelectorProps {
  nisabType: 'gold' | 'silver';
  pricePerGram: string;
  goldRateStatus: 'idle' | 'loading' | 'ready' | 'error';
  goldRateSource?: string;
  goldRateUpdatedAt?: string;
  onToggleNisabType: () => void;
  onPriceChange: (value: string) => void;
}

function formatAsOf(value?: string): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NisabSelector({
  nisabType,
  pricePerGram,
  goldRateStatus,
  goldRateSource,
  goldRateUpdatedAt,
  onToggleNisabType,
  onPriceChange,
}: NisabSelectorProps) {
  const statusText =
    goldRateStatus === 'loading'
      ? 'Fetching live gold rate...'
      : goldRateStatus === 'ready'
      ? `Auto-filled from ${goldRateSource ?? 'spot proxy'}${
          formatAsOf(goldRateUpdatedAt) ? ` (${formatAsOf(goldRateUpdatedAt)})` : ''
        }`
      : goldRateStatus === 'error'
      ? 'Live rate unavailable. Enter price manually.'
      : 'Enter the current local rate per gram.';

  const statusColor =
    goldRateStatus === 'ready'
      ? colors.state.success
      : goldRateStatus === 'error'
      ? colors.state.warning
      : colors.text.secondary;

  return (
    <View>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Nisab Threshold</Text>
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
            Gold (85g)
          </Text>
        </Pressable>
        <Pressable
          style={[styles.nisabButton, nisabType === 'silver' && styles.nisabButtonActive]}
          onPress={onToggleNisabType}
        >
          <Text
            style={[styles.nisabButtonText, nisabType === 'silver' && styles.nisabButtonTextActive]}
          >
            Silver (595g)
          </Text>
        </Pressable>
      </View>

      <AssetInput
        label="Price per Gram"
        value={pricePerGram}
        onChangeText={onPriceChange}
        placeholder="0"
        helperText="Manual value is always allowed."
        noBottomMargin={true}
      />

      <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
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
    marginBottom: spacing.md,
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
  statusText: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginBottom: 0,
  },
});
