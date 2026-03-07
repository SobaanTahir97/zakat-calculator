import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import references from '../../data/references.json';

interface Reference {
  title: string;
  description: string;
  quran: {
    surah: string;
    ayah: string;
    arabic: string;
    translation: string;
  };
  hadith: {
    text: string;
    source: string;
    narrator: string;
  };
  explanation: string;
}

export default function ReferenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const reference = useMemo(() => {
    if (!id || !references[id as keyof typeof references]) {
      return null;
    }
    return references[id as keyof typeof references] as Reference;
  }, [id]);

  if (!reference) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Reference not found</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{reference.title}</Text>
        <Text style={styles.description}>{reference.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quran</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.reference}>
              {reference.quran.surah} {reference.quran.ayah}
            </Text>
          </View>

          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{reference.quran.arabic}</Text>
          </View>

          <View style={styles.translationContainer}>
            <Text style={styles.translationText}>
              "{reference.quran.translation}"
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hadith</Text>
        <View style={styles.card}>
          <View style={styles.hadithContent}>
            <Text style={styles.hadithText}>{reference.hadith.text}</Text>

            <View style={styles.hadithMeta}>
              <Text style={styles.metaLabel}>Source:</Text>
              <Text style={styles.metaValue}>{reference.hadith.source}</Text>
            </View>

            <View style={styles.hadithMeta}>
              <Text style={styles.metaLabel}>Narrator:</Text>
              <Text style={styles.metaValue}>{reference.hadith.narrator}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explanation</Text>
        <View style={styles.card}>
          <Text style={styles.explanationText}>{reference.explanation}</Text>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          This reference is provided for educational purposes. For personal
          guidance on zakat obligations, please consult with a qualified Islamic
          scholar.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.light,
    lineHeight: 24,
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
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  reference: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  arabicContainer: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  arabicText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 32,
  },
  translationContainer: {
    marginTop: spacing.lg,
  },
  translationText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  hadithContent: {
    gap: spacing.lg,
  },
  hadithText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    lineHeight: 24,
  },
  hadithMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    minWidth: 70,
  },
  metaValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    flex: 1,
  },
  explanationText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    lineHeight: 24,
  },
  disclaimer: {
    padding: spacing.lg,
    backgroundColor: colors.state.info,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.md,
  },
  disclaimerText: {
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
});
