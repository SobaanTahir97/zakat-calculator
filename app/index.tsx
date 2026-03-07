import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AssetInput from '../components/AssetInput';
import NisabSelector from '../components/NisabSelector';
import CalculationExplanationCard from '../components/CalculationExplanationCard';
import CurrencyPrefix from '../components/CurrencyPrefix';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useForm } from '../context/FormContext';

export default function HomeScreen() {
  const { form, updateField } = useForm();
  const insets = useSafeAreaInsets();

  const toggleNisabType = () => {
    const newType = form.nisabType === 'gold' ? 'silver' : 'gold';
    updateField('nisabType', newType);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, spacing.md) + spacing.md,
          },
        ]}
      >
        <Text style={styles.title}>Zakat Calculator</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>UAE</Text>
          <CurrencyPrefix size={14} color={colors.text.light} />
          <Text style={styles.subtitle}>Dirham</Text>
        </View>
      </View>

      <View style={styles.section}>
        <CalculationExplanationCard />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Assets</Text>
        <AssetInput
          label="Cash & Bank Balance"
          value={form.cash}
          onChangeText={(text) => updateField('cash', text)}
          placeholder="0"
          helperText="Savings, current, fixed deposits"
          referenceId="cash"
          referenceAccessibilityLabel="Open reference for cash and bank balances"
        />
        <AssetInput
          label="Gold Value"
          value={form.gold}
          onChangeText={(text) => updateField('gold', text)}
          placeholder="0"
          helperText="Current total value"
          referenceId="gold-silver"
          referenceAccessibilityLabel="Open reference for gold and silver"
        />
        <AssetInput
          label="Silver Value"
          value={form.silver}
          onChangeText={(text) => updateField('silver', text)}
          placeholder="0"
          helperText="Current total value"
        />
        <AssetInput
          label="Stocks & Investments"
          value={form.stocks}
          onChangeText={(text) => updateField('stocks', text)}
          placeholder="0"
          helperText="Current market value"
          referenceId="stocks"
          referenceAccessibilityLabel="Open reference for stocks and investments"
          noBottomMargin={true}
        />
      </View>

      <View style={[styles.section, styles.sectionCompact]}>
        <Text style={styles.sectionTitle}>Deductions</Text>
        <AssetInput
          label="Short-term Debts"
          value={form.debt}
          onChangeText={(text) => updateField('debt', text)}
          placeholder="0"
          helperText="Due within 12 months"
          noBottomMargin={true}
        />
      </View>

      <View style={[styles.section, styles.sectionCompact]}>
        <NisabSelector
          nisabType={form.nisabType}
          pricePerGram={form.pricePerGram}
          goldRateStatus={form.goldRateStatus}
          goldRateSource={form.goldRateSource}
          goldRateUpdatedAt={form.goldRateUpdatedAt}
          onToggleNisabType={toggleNisabType}
          onPriceChange={(text) => updateField('pricePerGram', text)}
        />
      </View>

      <Link href="/results" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Calculate Zakat</Text>
        </Pressable>
      </Link>

      <Link href="/about" asChild>
        <Pressable style={StyleSheet.flatten([styles.button, styles.secondaryButton])}>
          <Text style={styles.secondaryButtonText}>About & Disclaimer</Text>
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
});
