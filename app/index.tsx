import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AssetInput from '../components/AssetInput';
import NisabSelector from '../components/NisabSelector';
import CalculationExplanationCard from '../components/CalculationExplanationCard';
import CurrencyPicker from '../components/CurrencyPicker';
import CurrencyPrefix from '../components/CurrencyPrefix';
import LanguagePicker from '../components/LanguagePicker';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useForm } from '../context/FormContext';
import { useLanguage } from '../context/LanguageContext';
import { parseAmount, formatAmount, metalValue } from '../lib/calculate';
import type { Currency, RateStatus } from '../lib/goldRate';
import { tabletContainerStyle } from '../lib/responsive';

function formatAsOf(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function rateStatusTextTranslated(
  status: RateStatus,
  t: (key: string, params?: Record<string, string | number>) => string,
  source?: string,
  updatedAt?: string,
  unitLabel?: string,
): string {
  if (status === 'loading') return t('home.fetchingRate');
  if (status === 'ready') {
    const formatted = formatAsOf(updatedAt);
    return formatted
      ? t('home.rateAutoFilled', { source: source ?? 'spot proxy', date: formatted })
      : t('home.rateAutoFilledNoDate', { source: source ?? 'spot proxy' });
  }
  if (status === 'error') return t('home.rateUnavailable');
  return t('home.enterRate', { unit: unitLabel ?? 'gram' });
}

function rateStatusColor(status: RateStatus): string {
  if (status === 'ready') return colors.state.success;
  if (status === 'error') return colors.state.warning;
  return colors.text.secondary;
}

export default function HomeScreen() {
  const { form, updateField, refreshMetalRates } = useForm();
  const { t, textDir } = useLanguage();
  const insets = useSafeAreaInsets();

  const toggleNisabType = () => {
    const newType = form.nisabType === 'gold' ? 'silver' : 'gold';
    updateField('nisabType', newType);
  };

  const toggleWeightUnit = () => {
    const newUnit = form.weightUnit === 'gram' ? 'tola' : 'gram';
    updateField('weightUnit', newUnit);
  };

  const handleCurrencyChange = (currency: Currency) => {
    updateField('currency', currency);
  };

  const currencyCountry = form.currency === 'AED' ? t('currency.aedCountry') : t('currency.pkrCountry');
  const currencyName = form.currency === 'AED' ? t('currency.aedName') : t('currency.pkrName');
  const weightLabel = form.weightUnit === 'tola' ? 'tola' : 'g';
  const unitLabel = form.weightUnit === 'tola' ? 'Tola' : 'Gram';

  // Compute gold/silver values for display (respects tola→gram conversion)
  const goldWeight = parseAmount(form.gold);
  const silverWeight = parseAmount(form.silver);
  const goldValue = metalValue(goldWeight, parseAmount(form.goldPricePerUnit), form.weightUnit);
  const silverValue = metalValue(silverWeight, parseAmount(form.silverPricePerUnit), form.weightUnit);

  const hasAnyAssetEntered =
    parseAmount(form.cash) > 0 ||
    goldWeight > 0 ||
    silverWeight > 0 ||
    parseAmount(form.stocks) > 0 ||
    parseAmount(form.receivables) > 0 ||
    (form.methodology === 'ghamidi' &&
      (parseAmount(form.agriculturalProduce) > 0 || parseAmount(form.rentalIncome) > 0)) ||
    (form.methodology === 'contemporary' &&
      (parseAmount(form.professionalIncome) > 0 || parseAmount(form.businessInventory) > 0));


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={tabletContainerStyle}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, spacing.md) + spacing.md,
          },
        ]}
      >
        <Text style={[styles.title, textDir]}>{t('home.title')}</Text>
        <View style={styles.subtitleRow}>
          <LanguagePicker />
          <Text style={styles.subtitleSeparator}>·</Text>
          <CurrencyPicker currency={form.currency} onCurrencyChange={handleCurrencyChange} />
          <Text style={styles.subtitleSeparator}>·</Text>
          <Text style={styles.subtitle}>{currencyCountry}</Text>
          <CurrencyPrefix size={14} color={colors.text.light} currency={form.currency} />
          <Text style={styles.subtitle}>{currencyName}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <CalculationExplanationCard methodology={form.methodology} deductDebts={form.deductDebts} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textDir]}>{t('home.methodology')}</Text>
        <View style={styles.methodologyContainer}>
          <Pressable
            style={[styles.methodologyButton, form.methodology === 'standard' && styles.methodologyButtonActive]}
            onPress={() => updateField('methodology', 'standard')}
          >
            <Text style={[styles.methodologyButtonText, form.methodology === 'standard' && styles.methodologyButtonTextActive]}>
              {t('home.standard')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.methodologyButton, form.methodology === 'ghamidi' && styles.methodologyButtonActive]}
            onPress={() => updateField('methodology', 'ghamidi')}
          >
            <Text style={[styles.methodologyButtonText, form.methodology === 'ghamidi' && styles.methodologyButtonTextActive]}>
              {t('home.ghamidi')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.methodologyButton, form.methodology === 'contemporary' && styles.methodologyButtonActive]}
            onPress={() => updateField('methodology', 'contemporary')}
          >
            <Text style={[styles.methodologyButtonText, form.methodology === 'contemporary' && styles.methodologyButtonTextActive]}>
              {t('home.contemporary')}
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.methodologyDescription, textDir]}>
          {t(`home.${form.methodology}Desc`)}
        </Text>
        {form.methodology !== 'standard' && (
          <Text style={[styles.methodologyHint, textDir]}>
            {form.methodology === 'ghamidi' ? t('home.ghamidiHint') : t('home.contemporaryHint')}
          </Text>
        )}
        <View style={styles.nisabInMethodology}>
          <NisabSelector
            nisabType={form.nisabType}
            weightUnit={form.weightUnit}
            onToggleNisabType={toggleNisabType}
            onToggleWeightUnit={toggleWeightUnit}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textDir]}>{t('home.yourAssets')}</Text>
        <AssetInput
          label={t('home.cashLabel')}
          value={form.cash}
          onChangeText={(text) => updateField('cash', text)}
          placeholder="0"
          helperText={t('home.cashHelper')}
          currency={form.currency}
          referenceId="cash"
          referenceAccessibilityLabel="Open reference for cash and bank balances"
        />

        {/* Gold section */}
        <AssetInput
          label={t('home.goldLabel')}
          value={form.gold}
          onChangeText={(text) => updateField('gold', text)}
          placeholder="0"
          helperText={
            goldValue > 0
              ? t('home.goldValueHelper', { value: formatAmount(goldValue, form.currency) })
              : t('home.goldHelper', { unit: weightLabel })
          }
          unitLabel={weightLabel}
          referenceId="gold-silver"
          referenceAccessibilityLabel="Open reference for gold and silver"
        />
        <AssetInput
          label={t('home.goldRate', { unit: unitLabel.toLowerCase() })}
          value={form.goldPricePerUnit}
          onChangeText={(text) => updateField('goldPricePerUnit', text)}
          placeholder="0"
          currency={form.currency}
          noBottomMargin={true}
        />
        <View style={styles.rateStatusRow}>
          <Text style={[styles.rateStatus, { color: rateStatusColor(form.goldRateStatus) }, textDir]}>
            {rateStatusTextTranslated(form.goldRateStatus, t, form.goldRateSource, form.goldRateUpdatedAt, unitLabel.toLowerCase())}
          </Text>
          {form.goldRateStatus === 'error' && (
            <Pressable style={styles.retryButton} onPress={refreshMetalRates} accessibilityRole="button">
              <Text style={styles.retryButtonText}>{t('home.retryRate')}</Text>
            </Pressable>
          )}
        </View>
        {form.goldRateStatus === 'error' && (
          <Text style={[styles.rateActionHint, textDir]}>{t('home.rateUnavailableAction')}</Text>
        )}

        {/* Silver section */}
        <AssetInput
          label={t('home.silverLabel')}
          value={form.silver}
          onChangeText={(text) => updateField('silver', text)}
          placeholder="0"
          helperText={
            silverValue > 0
              ? t('home.silverValueHelper', { value: formatAmount(silverValue, form.currency) })
              : t('home.silverHelper', { unit: weightLabel })
          }
          unitLabel={weightLabel}
          referenceId="gold-silver"
          referenceAccessibilityLabel="Open reference for gold and silver"
        />
        <AssetInput
          label={t('home.silverRate', { unit: unitLabel.toLowerCase() })}
          value={form.silverPricePerUnit}
          onChangeText={(text) => updateField('silverPricePerUnit', text)}
          placeholder="0"
          currency={form.currency}
          noBottomMargin={true}
        />
        <View style={styles.rateStatusRow}>
          <Text style={[styles.rateStatus, { color: rateStatusColor(form.silverRateStatus) }, textDir]}>
            {rateStatusTextTranslated(form.silverRateStatus, t, form.silverRateSource, form.silverRateUpdatedAt, unitLabel.toLowerCase())}
          </Text>
          {form.silverRateStatus === 'error' && (
            <Pressable style={styles.retryButton} onPress={refreshMetalRates} accessibilityRole="button">
              <Text style={styles.retryButtonText}>{t('home.retryRate')}</Text>
            </Pressable>
          )}
        </View>
        {form.silverRateStatus === 'error' && (
          <Text style={[styles.rateActionHint, textDir]}>{t('home.rateUnavailableAction')}</Text>
        )}

        <AssetInput
          label={t('home.stocksLabel')}
          value={form.stocks}
          onChangeText={(text) => updateField('stocks', text)}
          placeholder="0"
          helperText={t('home.stocksHelper')}
          currency={form.currency}
          referenceId="stocks"
          referenceAccessibilityLabel="Open reference for stocks and investments"
        />
        <AssetInput
          label={t('home.receivablesLabel')}
          value={form.receivables}
          onChangeText={(text) => updateField('receivables', text)}
          placeholder="0"
          helperText={t('home.receivablesHelper')}
          currency={form.currency}
          referenceId="receivables"
          referenceAccessibilityLabel="Open reference for receivables"
          noBottomMargin={true}
        />
      </View>

      {form.methodology === 'contemporary' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('home.contemporaryAssets')}</Text>
          <Text style={[styles.sectionDescription, textDir]}>
            {t('home.contemporaryAssetsDesc')}
          </Text>
          <AssetInput
            label={t('home.professionalIncome')}
            value={form.professionalIncome}
            onChangeText={(text) => updateField('professionalIncome', text)}
            placeholder="0"
            helperText={t('home.professionalHelper')}
            currency={form.currency}
            referenceId="contemporary-methodology"
            referenceAccessibilityLabel="Open reference for contemporary methodology"
          />
          <AssetInput
            label={t('home.businessInventory')}
            value={form.businessInventory}
            onChangeText={(text) => updateField('businessInventory', text)}
            placeholder="0"
            helperText={t('home.businessHelper')}
            currency={form.currency}
            referenceId="contemporary-methodology"
            referenceAccessibilityLabel="Open reference for contemporary methodology"
            noBottomMargin={true}
          />
        </View>
      )}

      {form.methodology === 'ghamidi' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('home.ghamidiAssets')}</Text>
          <Text style={[styles.sectionDescription, textDir]}>
            {t('home.ghamidiAssetsDesc')}
          </Text>
          <AssetInput
            label={t('home.agriculturalProduce')}
            value={form.agriculturalProduce}
            onChangeText={(text) => updateField('agriculturalProduce', text)}
            placeholder="0"
            helperText={
              form.irrigationType === 'irrigated'
                ? t('home.agriculturalHelperIrrigated')
                : t('home.agriculturalHelperRainFed')
            }
            currency={form.currency}
            referenceId="agricultural-produce"
            referenceAccessibilityLabel="Open reference for agricultural produce"
          />
          <View style={styles.irrigationContainer}>
            <Pressable
              style={[styles.methodologyButton, form.irrigationType === 'irrigated' && styles.methodologyButtonActive]}
              onPress={() => updateField('irrigationType', 'irrigated')}
            >
              <Text style={[styles.methodologyButtonText, form.irrigationType === 'irrigated' && styles.methodologyButtonTextActive]}>
                {t('home.irrigated')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.methodologyButton, form.irrigationType === 'rain-fed' && styles.methodologyButtonActive]}
              onPress={() => updateField('irrigationType', 'rain-fed')}
            >
              <Text style={[styles.methodologyButtonText, form.irrigationType === 'rain-fed' && styles.methodologyButtonTextActive]}>
                {t('home.rainFed')}
              </Text>
            </Pressable>
          </View>
          <AssetInput
            label={t('home.rentalIncome')}
            value={form.rentalIncome}
            onChangeText={(text) => updateField('rentalIncome', text)}
            placeholder="0"
            helperText={t('home.rentalHelper')}
            currency={form.currency}
            referenceId="rental-income"
            referenceAccessibilityLabel="Open reference for rental income"
            noBottomMargin={true}
          />
        </View>
      )}

      <View style={[styles.section, styles.sectionCompact]}>
        <Text style={[styles.sectionTitle, textDir]}>{t('home.deductions')}</Text>
        <AssetInput
          label={t('home.debtLabel')}
          value={form.debt}
          onChangeText={(text) => updateField('debt', text)}
          placeholder="0"
          helperText={t('home.debtHelper')}
          currency={form.currency}
          referenceId="debt"
          referenceAccessibilityLabel="Open reference for debt deduction"
          noBottomMargin={true}
        />
        <Pressable
          style={styles.shafiiToggle}
          onPress={() => updateField('deductDebts', !form.deductDebts)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !form.deductDebts }}
        >
          <View style={[styles.checkbox, !form.deductDebts && styles.checkboxChecked]}>
            {!form.deductDebts && <Text style={styles.checkboxMark}>{'\u2713'}</Text>}
          </View>
          <Text style={[styles.shafiiToggleText, textDir]}>
            {t('home.doNotDeductDebts')}{'\n'}
            <Text style={styles.shafiiToggleSubtext}>
              {t('home.shafiiNote')}
            </Text>
          </Text>
        </Pressable>
        {!form.deductDebts && (
          <Text style={[styles.shafiiNote, textDir]}>
            {t('home.debtIgnoredNote')}
          </Text>
        )}
      </View>

      {hasAnyAssetEntered ? (
        <Link href="/results" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{t('home.calculateZakat')}</Text>
          </Pressable>
        </Link>
      ) : (
        <>
          <Pressable
            style={StyleSheet.flatten([styles.button, styles.buttonDisabled])}
            disabled={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
          >
            <Text style={styles.buttonText}>{t('home.calculateZakat')}</Text>
          </Pressable>
          <Text style={[styles.emptyStateHint, textDir]}>{t('home.enterAssetFirst')}</Text>
        </>
      )}

      <Link href="/about" asChild>
        <Pressable style={StyleSheet.flatten([styles.button, styles.secondaryButton])}>
          <Text style={styles.secondaryButtonText}>{t('home.aboutDisclaimer')}</Text>
        </Pressable>
      </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  contentContainer: {
    paddingBottom: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
    marginBottom: spacing.xs,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subtitleSeparator: {
    color: colors.text.light,
    fontSize: typography.fontSize.base,
    opacity: 0.6,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.light,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sectionCompact: {
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  methodologyContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  methodologyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: colors.background.surface,
  },
  methodologyButtonActive: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  methodologyButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  methodologyButtonTextActive: {
    color: colors.text.light,
  },
  methodologyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  methodologyHint: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  nisabInMethodology: {
    marginTop: spacing.md,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  irrigationContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rateStatus: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    flex: 1,
  },
  rateStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  retryButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.surface,
    marginBottom: spacing.md,
  },
  retryButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  rateActionHint: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  shafiiToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.gray[400],
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkboxMark: {
    color: colors.text.light,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
  },
  shafiiToggleText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  shafiiToggleSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },
  shafiiNote: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.xs,
    color: colors.state.warning,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginTop: 0,
    marginBottom: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonDisabled: {
    backgroundColor: colors.gray[400],
    opacity: 0.7,
  },
  emptyStateHint: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
});
