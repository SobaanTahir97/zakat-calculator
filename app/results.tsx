import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import BreakdownCard from '../components/BreakdownCard';
import CurrencyAmount from '../components/CurrencyAmount';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { calculateZakat, parseAmount } from '../lib/calculate';
import { useForm } from '../context/FormContext';

export default function ResultsScreen() {
  const { form } = useForm();

  const result = useMemo(() => {
    const input = {
      cash: parseAmount(form.cash),
      gold: parseAmount(form.gold),
      silver: parseAmount(form.silver),
      stocks: parseAmount(form.stocks),
      debt: parseAmount(form.debt),
      nisabType: form.nisabType,
      pricePerGram: parseAmount(form.pricePerGram),
    };
    return calculateZakat(input);
  }, [form]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultHeader}>
        <Text style={styles.label}>Zakat Due</Text>
        <CurrencyAmount
          amount={result.zakatDue}
          amountStyle={styles.zakatAmount}
          prefixSize={20}
          prefixColor={colors.text.light}
          containerStyle={styles.zakatAmountRow}
        />

        {result.zakatable ? (
          <View style={styles.statusGroup}>
            <Text style={styles.status}>Net wealth is above the nisab threshold.</Text>
            <View style={styles.statusAmountRow}>
              <Text style={styles.statusLabel}>Net Wealth</Text>
              <CurrencyAmount
                amount={result.netWealth}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
            <View style={styles.statusAmountRow}>
              <Text style={styles.statusLabel}>Nisab</Text>
              <CurrencyAmount
                amount={result.nisabThreshold}
                amountStyle={styles.statusAmount}
                prefixSize={13}
                prefixColor={colors.text.light}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.status}>Wealth is below nisab threshold.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wealth Summary</Text>
        <BreakdownCard label="Total Assets" amount={result.totalWealthBeforeDebt} />
        <BreakdownCard label="Total Debts" amount={parseAmount(form.debt)} />
        <BreakdownCard label="Net Wealth" amount={result.netWealth} />
        <BreakdownCard label="Nisab Threshold" amount={result.nisabThreshold} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Breakdown</Text>
        {result.breakdown.cash > 0 && (
          <BreakdownCard
            label="Cash & Bank Balance"
            amount={result.breakdown.cash}
            percentage={Math.round((result.breakdown.cash / result.totalWealthBeforeDebt) * 100)}
          />
        )}
        {result.breakdown.gold > 0 && (
          <BreakdownCard
            label="Gold Value"
            amount={result.breakdown.gold}
            percentage={Math.round((result.breakdown.gold / result.totalWealthBeforeDebt) * 100)}
          />
        )}
        {result.breakdown.silver > 0 && (
          <BreakdownCard
            label="Silver Value"
            amount={result.breakdown.silver}
            percentage={Math.round((result.breakdown.silver / result.totalWealthBeforeDebt) * 100)}
          />
        )}
        {result.breakdown.stocks > 0 && (
          <BreakdownCard
            label="Stocks & Investments"
            amount={result.breakdown.stocks}
            percentage={Math.round((result.breakdown.stocks / result.totalWealthBeforeDebt) * 100)}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>References</Text>
        <Link href="/reference/zakat-obligation" asChild>
          <Pressable style={styles.refButton}>
            <Text style={styles.refButtonText}>Zakat Obligation</Text>
          </Pressable>
        </Link>
        <Link href="/reference/gold-silver" asChild>
          <Pressable style={styles.refButton}>
            <Text style={styles.refButtonText}>Gold & Silver</Text>
          </Pressable>
        </Link>
        <Link href="/reference/cash" asChild>
          <Pressable style={styles.refButton}>
            <Text style={styles.refButtonText}>Cash</Text>
          </Pressable>
        </Link>
        <Link href="/reference/stocks" asChild>
          <Pressable style={styles.refButton}>
            <Text style={styles.refButtonText}>Stocks & Investments</Text>
          </Pressable>
        </Link>
      </View>

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Back to Calculator</Text>
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
