import React from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface InlineReferenceLinkProps {
  referenceId: string;
  accessibilityLabel: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function InlineReferenceLink({
  referenceId,
  accessibilityLabel,
  size = 18,
  style,
}: InlineReferenceLinkProps) {
  return (
    <Link href={`/reference/${referenceId}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ])}
      >
        <Text style={styles.label}>i</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.primary.main,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.xs,
    marginTop: -1,
  },
});
