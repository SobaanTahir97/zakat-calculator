import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import type { Currency } from '../lib/goldRate';

interface CurrencyPickerProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function CurrencyPicker({ currency, onCurrencyChange }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const currencyOptions = useMemo(() => [
    { value: 'AED' as Currency, label: 'AED', description: t('currency.uaeDirham') },
    { value: 'PKR' as Currency, label: 'PKR', description: t('currency.pakistaniRupee') },
  ], [t]);

  const selected = currencyOptions.find((o) => o.value === currency)!;

  return (
    <View>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{selected.label}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            {currencyOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.option, option.value === currency && styles.optionActive]}
                onPress={() => {
                  onCurrencyChange(option.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[styles.optionLabel, option.value === currency && styles.optionLabelActive]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[styles.optionDesc, option.value === currency && styles.optionDescActive]}
                >
                  {option.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  triggerText: {
    color: colors.text.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  chevron: {
    color: colors.text.light,
    fontSize: 10,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dropdown: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    width: 240,
    gap: spacing.xs,
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  optionActive: {
    backgroundColor: colors.primary.main,
  },
  optionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  optionLabelActive: {
    color: colors.text.light,
  },
  optionDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  optionDescActive: {
    color: colors.text.light,
  },
});
