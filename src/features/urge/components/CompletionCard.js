import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FadeInView } from '../../../components/animations/FadeInView';
import { GlassCard } from '../../../components/ui/GlassCard';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { colors, spacing, typography } from '../../../theme';

function CompletionCardComponent({ onClose }) {
  return (
    <FadeInView distance={22} style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Settled</Text>
        </View>
        <Text style={styles.title}>You rode out the urge.</Text>
        <Text style={styles.body}>
          The spike passed without a bet. That is real progress, not luck.
        </Text>
      </GlassCard>

      <PrimaryButton
        onPress={onClose}
        style={styles.button}
        subtitle="Return to your dashboard"
        title="Back Home"
        tone="danger"
      />
    </FadeInView>
  );
}

export const CompletionCard = memo(CompletionCardComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    marginBottom: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 999,
    backgroundColor: 'rgba(114, 215, 140, 0.16)',
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.eyebrow,
    color: colors.success,
    letterSpacing: 1,
  },
  title: {
    ...typography.largeTitle,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  button: {
    width: '100%',
  },
});
