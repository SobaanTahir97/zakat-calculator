import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import DisclaimerModal from '../components/DisclaimerModal';
import InlineReferenceLink from '../components/InlineReferenceLink';

export default function AboutScreen() {
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  return (
    <>
      <DisclaimerModal visible={disclaimerVisible} onDismiss={() => setDisclaimerVisible(false)} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>About This App</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose</Text>
          <Text style={styles.sectionText}>
            Zakat Calculator UAE is a simple tool for estimating annual zakat obligations using the
            standard 2.5% rule above nisab.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <InlineReferenceLink
              referenceId="zakat-obligation"
              accessibilityLabel="Open zakat obligation reference"
            />
          </View>
          <Text style={styles.sectionText}>
            Enter your cash, gold, silver, and investment holdings. The app compares total net
            wealth against the nisab minimum and calculates zakat due at 2.5%.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources</Text>
          <Text style={styles.sectionText}>
            References are sourced from established Quran and hadith collections, and shown per
            category for transparency.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version</Text>
          <Text style={styles.sectionText}>v1.1.0</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.disclaimerButton} onPress={() => setDisclaimerVisible(true)}>
            <Text style={styles.disclaimerButtonText}>View Full Disclaimer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.main,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  buttonContainer: {
    paddingVertical: spacing.xl,
  },
  disclaimerButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  disclaimerButtonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
