import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import DisclaimerModal from '../components/DisclaimerModal';
import InlineReferenceLink from '../components/InlineReferenceLink';
import { useLanguage } from '../context/LanguageContext';
import { tabletContainerStyle } from '../lib/responsive';

export default function AboutScreen() {
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const { t, textDir } = useLanguage();


  return (
    <>
      <DisclaimerModal visible={disclaimerVisible} onDismiss={() => setDisclaimerVisible(false)} />
      <ScrollView style={styles.container}>
        <View style={tabletContainerStyle}>
        <Text style={[styles.title, textDir]}>{t('about.title')}</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('about.purpose')}</Text>
          <Text style={[styles.sectionText, textDir]}>
            {t('about.purposeText')}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, textDir]}>{t('about.howItWorks')}</Text>
            <InlineReferenceLink
              referenceId="zakat-obligation"
              accessibilityLabel="Open zakat obligation reference"
            />
          </View>
          <Text style={[styles.sectionText, textDir]}>
            {t('about.howItWorksText')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('about.sources')}</Text>
          <Text style={[styles.sectionText, textDir]}>
            {t('about.sourcesText')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textDir]}>{t('about.version')}</Text>
          <Text style={styles.sectionText}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.disclaimerButton} onPress={() => setDisclaimerVisible(true)}>
            <Text style={styles.disclaimerButtonText}>{t('about.viewDisclaimer')}</Text>
          </Pressable>
        </View>
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
