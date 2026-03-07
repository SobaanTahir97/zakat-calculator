import { Modal, View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface DisclaimerModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function DisclaimerModal({ visible, onDismiss }: DisclaimerModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.title}>Important Disclaimer</Text>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Religious Guidance</Text>
              <Text style={styles.bodyText}>
                This app is a calculation tool only and does not constitute a religious ruling
                (fatwa). Zakat obligations may vary based on individual circumstances, scholarly
                interpretation, and your specific madhab.
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Consult a Scholar</Text>
              <Text style={styles.bodyText}>
                Consult a qualified Islamic scholar before making financial decisions based on this
                calculator.
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Sourcing</Text>
              <Text style={styles.bodyText}>
                We aim to use authentic, widely accepted sources from Quran and hadith collections,
                but cannot guarantee completeness in every scenario.
              </Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Liability</Text>
              <Text style={styles.bodyText}>
                Developers and app distributors are not liable for losses or claims from app usage.
                Final zakat responsibility remains with the user.
              </Text>
            </View>
          </ScrollView>

          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>I Understand</Text>
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
