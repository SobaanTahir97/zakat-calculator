import { Modal, View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function DisclaimerModal({ visible, onDismiss }: DisclaimerModalProps) {
  const { t, textDir } = useLanguage();


  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={[styles.title, textDir]}>{t('disclaimer.title')}</Text>

            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionTitle, textDir]}>{t('disclaimer.religiousGuidance')}</Text>
              <Text style={[styles.bodyText, textDir]}>
                {t('disclaimer.religiousGuidanceText')}
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionTitle, textDir]}>{t('disclaimer.consultScholar')}</Text>
              <Text style={[styles.bodyText, textDir]}>
                {t('disclaimer.consultScholarText')}
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionTitle, textDir]}>{t('disclaimer.sourcing')}</Text>
              <Text style={[styles.bodyText, textDir]}>
                {t('disclaimer.sourcingText')}
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionTitle, textDir]}>{t('disclaimer.liability')}</Text>
              <Text style={[styles.bodyText, textDir]}>
                {t('disclaimer.liabilityText')}
              </Text>
            </View>
          </ScrollView>

          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>{t('disclaimer.iUnderstand')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    maxHeight: '85%',
    width: '94%',
    maxWidth: 480,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  contentContainer: {
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  sectionBlock: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  bodyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
