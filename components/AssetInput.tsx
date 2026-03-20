import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import CurrencyPrefix from './CurrencyPrefix';
import InlineReferenceLink from './InlineReferenceLink';
import type { Currency } from '../lib/goldRate';

interface AssetInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  currency?: Currency;
  unitLabel?: string;
  referenceId?: string;
  referenceAccessibilityLabel?: string;
  noBottomMargin?: boolean;
}

export default function AssetInput({
  label,
  value,
  onChangeText,
  placeholder = '0',
  helperText,
  error,
  currency = 'AED',
  unitLabel,
  referenceId,
  referenceAccessibilityLabel,
  noBottomMargin = false,
}: AssetInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    // Strip commas before sanitizing (commas are display-only).
    const stripped = text.replace(/,/g, '');
    // Allow only digits and decimal point, no negative numbers.
    const sanitized = stripped.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points.
    const parts = sanitized.split('.');
    const validated = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    onChangeText(validated);
  };

  // Format the raw value with commas for display.
  const displayValue = useMemo(() => {
    if (!value) return '';
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }, [value]);

  return (
    <View style={[styles.container, noBottomMargin && styles.containerCompact]}>
      <View style={styles.labelContainer}>
        <View style={styles.labelGroup}>
          <Text style={styles.label}>{label}</Text>
          {referenceId ? (
            <InlineReferenceLink
              referenceId={referenceId}
              accessibilityLabel={
                referenceAccessibilityLabel ?? `Open reference for ${label.toLowerCase()}`
              }
            />
          ) : null}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {unitLabel ? (
          <Text style={styles.unitLabel}>{unitLabel}</Text>
        ) : (
          <CurrencyPrefix size={14} color={colors.text.primary} currency={currency} forceTextFallback={false} />
        )}
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  containerCompact: {
    marginBottom: 0,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flexShrink: 1,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.state.error,
    fontWeight: typography.fontWeight.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputWrapperFocused: {
    borderColor: colors.primary.main,
    backgroundColor: colors.background.main,
  },
  inputWrapperError: {
    borderColor: colors.state.error,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  unitLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
