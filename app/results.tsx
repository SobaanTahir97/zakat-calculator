import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import BreakdownCard from '../components/BreakdownCard';
import CurrencyAmount from '../components/CurrencyAmount';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { calculateZakat, parseAmount, formatAmount } from '../lib/calculate';
import { useForm } from '../context/FormContext';
import { useLanguage } from '../context/LanguageContext';

export default function ResultsScreen() {
  const { form } = useForm();
  const { t, textDir } = useLanguage();

  const result = useMemo(() => {
    const input = {
      cash: parseAmount(form.cash),
      goldWeight: parseAmount(form.gold),
      goldPricePerUnit: parseAmount(form.goldPricePerUnit),
      silverWeight: parseAmount(form.silver),
      silverPricePerUnit: parseAmount(form.silverPricePerUnit),
      stocks: parseAmount(form.stocks),
      receivables: parseAmount(form.receivables),
      debt: parseAmount(form.debt),
      nisabType: form.nisabType,
      methodology: form.methodology,
      weightUnit: form.weightUnit,
      agriculturalProduce: parseAmount(form.agriculturalProduce),
      irrigationType: form.irrigationType,
      rentalIncome: parseAmount(form.rentalIncome),
      professionalIncome: parseAmount(form.professionalIncome),
      businessInventory: parseAmount(form.businessInventory),
      deductDebts: form.deductDebts,
    };
    return calculateZakat(input);
  }, [
    form.cash, form.gold, form.goldPricePerUnit,
    form.silver, form.silverPricePerUnit,
    form.stocks, form.receivables, form.debt,
    form.nisabType, form.methodology, form.weightUnit,
    form.agriculturalProduce, form.irrigationType, form.rentalIncome,
    form.professionalIncome, form.businessInventory, form.deductDebts,
  ]);

  const currency = form.currency;
  const weightLabel = form.weightUnit === 'tola' ? 'tola' : 'g';
  const ghamidi = result.ghamidiBreakdown;
  const headlineAmount = ghamidi ? ghamidi.totalCombined : result.zakatDue;


  const ushrRate = form.irrigationType === 'rain-fed' ? '10%' : '5%';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultHeader}>
        <Text style={[styles.methodologyBadge, textDir]}>
          {form.methodology === 'ghamidi'
            ? t('results.ghamidiMethodology')
            : form.methodology === 'contemporary'
              ? t('results.contemporaryMethodology')
              : t('results.standardMethodology')}
        </Text>
        <Text style={[styles.label, textDir]}>{ghamidi ? t('results.totalZakatUshrDue') : t('results.zakatDue')}</Text>
        <CurrencyAmount
          amount={headlineAmount}
          currency={currency}
          amountStyle={styles.zakatAmount}
          prefixSize={20}
          prefixColor={colors.text.light}
          containerStyle={styles.zakatAmountRow}
        />

        {ghamidi && (ghamidi.wealthZakat > 0 || ghamidi.agriculturalUshr > 0) && (
          <View style={styles.statusGroup}>
            <View style={styles.statusAmountRow}>
              <Text style={[styles.statusLabel, textDir]}>{t('results.wealthZakat')}</Text>
              <CurrencyAmount
                amount={ghamidi.wealthZakat}
                currency={currency}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
            <View style={styles.statusAmountRow}>
              <Text style={[styles.statusLabel, textDir]}>
                {t('results.agriculturalUshr', { rate: ushrRate })}
              </Text>
              <CurrencyAmount
                amount={ghamidi.agriculturalUshr}
                currency={currency}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
          </View>
        )}

        {result.zakatable ? (
          <View style={styles.statusGroup}>
            <Text style={[styles.status, textDir]}>{t('results.aboveNisab')}</Text>
            <View style={styles.statusAmountRow}>
              <Text style={[styles.statusLabel, textDir]}>{t('results.netWealth')}</Text>
              <CurrencyAmount
                amount={result.netWealth}
                currency={currency}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
            <View style={styles.statusAmountRow}>
              <Text style={[styles.statusLabel, textDir]}>{t('results.nisab')}</Text>
              <CurrencyAmount
                amount={result.nisabThreshold}
                currency={currency}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
          </View>
        ) : (
          <Text style={[styles.status, textDir]}>
            {ghamidi && ghamidi.agriculturalUshr > 0
              ? t('results.belowNisabWithUshr')
              : t('results.belowNisab')}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textDir]}>{t('results.wealthSummary')}</Text>
        <BreakdownCard label={t('results.totalAssets')} amount={result.totalWealthBeforeDebt} currency={currency} />
        {result.debtDeducted ? (
          <BreakdownCard label={t('results.totalDebts')} amount={result.totalWealthBeforeDebt - result.netWealth} currency={currency} />
        ) : (
          <BreakdownCard label={t('results.totalDebtsShafii')} amount={parseAmount(form.debt)} currency={currency} />
        )}
        <BreakdownCard label={t('results.netWealth')} amount={result.netWealth} currency={currency} />
        <BreakdownCard label={t('results.nisabThreshold')} amount={result.nisabThreshold} currency={currency} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textDir]}>{t('results.assetBreakdown')}</Text>
        {result.breakdown.cash > 0 && (
          <BreakdownCard
            label={t('results.cashBank')}
            amount={result.breakdown.cash}
            percentage={Math.round((result.breakdown.cash / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {result.breakdown.goldValue > 0 && (
          <BreakdownCard
            label={t('results.gold', { weight: formatAmount(result.breakdown.goldWeight, currency).replace(/\.00$/, ''), unit: weightLabel })}
            amount={result.breakdown.goldValue}
            percentage={Math.round((result.breakdown.goldValue / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {result.breakdown.silverValue > 0 && (
          <BreakdownCard
            label={t('results.silver', { weight: formatAmount(result.breakdown.silverWeight, currency).replace(/\.00$/, ''), unit: weightLabel })}
            amount={result.breakdown.silverValue}
            percentage={Math.round((result.breakdown.silverValue / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {result.breakdown.stocks > 0 && (
          <BreakdownCard
            label={t('results.stocksInvestments')}
            amount={result.breakdown.stocks}
            percentage={Math.round((result.breakdown.stocks / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {result.breakdown.receivables > 0 && (
          <BreakdownCard
            label={t('results.moneyOwed')}
            amount={result.breakdown.receivables}
            percentage={Math.round((result.breakdown.receivables / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {(result.breakdown.rentalIncome ?? 0) > 0 && (
          <BreakdownCard
            label={t('results.rentalIncome')}
            amount={result.breakdown.rentalIncome!}
            percentage={Math.round((result.breakdown.rentalIncome! / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {(result.breakdown.professionalIncome ?? 0) > 0 && (
          <BreakdownCard
            label={t('results.professionalIncome')}
            amount={result.breakdown.professionalIncome!}
            percentage={Math.round((result.breakdown.professionalIncome! / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
        {(result.breakdown.businessInventory ?? 0) > 0 && (
          <BreakdownCard
            label={t('results.businessInventory')}
            amount={result.breakdown.businessInventory!}
            percentage={Math.round((result.breakdown.businessInventory! / result.totalWealthBeforeDebt) * 100)}
            currency={currency}
          />
        )}
      </View>

      {ghamidi && ghamidi.agriculturalUshr > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('results.agriculturalUshrSection')}</Text>
          <BreakdownCard
            label={t('results.produceValue')}
            amount={ghamidi.agriculturalProduce}
            currency={currency}
          />
          <BreakdownCard
            label={t('results.ushrDue', { rate: ushrRate })}
            amount={ghamidi.agriculturalUshr}
            currency={currency}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textDir]}>{t('results.references')}</Text>
        <Link href="/reference/zakat-obligation" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.zakatObligation')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/gold-silver" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.goldSilver')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/cash" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.cash')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/stocks" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.stocks')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/receivables" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.moneyOwedRef')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/debt" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.debtDeduction')}</Text>
          </Pressable>
        </Link>
        <Link href="/reference/ghamidi" asChild>
          <Pressable style={styles.refButton}>
            <Text style={[styles.refButtonText, textDir]}>{t('results.scholarGhamidi')}</Text>
          </Pressable>
        </Link>
        {form.methodology === 'ghamidi' && (
          <>
            <Link href="/reference/agricultural-produce" asChild>
              <Pressable style={styles.refButton}>
                <Text style={[styles.refButtonText, textDir]}>{t('results.agriculturalProduceRef')}</Text>
              </Pressable>
            </Link>
            <Link href="/reference/rental-income" asChild>
              <Pressable style={styles.refButton}>
                <Text style={[styles.refButtonText, textDir]}>{t('results.rentalIncomeRef')}</Text>
              </Pressable>
            </Link>
          </>
        )}
        {form.methodology === 'contemporary' && (
          <Link href="/reference/contemporary-methodology" asChild>
            <Pressable style={styles.refButton}>
              <Text style={[styles.refButtonText, textDir]}>{t('results.contemporaryRef')}</Text>
            </Pressable>
          </Link>
        )}
      </View>

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>{t('results.backToCalculator')}</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  resultHeader: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  methodologyBadge: {
    fontSize: typography.fontSize.xs,
    color: colors.text.light,
    opacity: 0.8,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: typography.fontWeight.medium,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.text.light,
    marginBottom: spacing.sm,
  },
  zakatAmountRow: {
    marginBottom: spacing.md,
  },
  zakatAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
  },
  statusGroup: {
    width: '100%',
    marginTop: spacing.sm,
  },
  status: {
    fontSize: typography.fontSize.sm,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.light,
    fontWeight: typography.fontWeight.medium,
  },
  statusAmount: {
    color: colors.text.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  refButton: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  refButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
