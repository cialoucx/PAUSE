import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../animations/AnimatedPressable';
import { colors, radii, shadows, spacing, typography } from '../../theme';

function PrimaryButtonComponent({
  onPress,
  title,
  subtitle,
  tone = 'danger',
  style,
}) {
  const isGhost = tone === 'ghost';

  return (
    <AnimatedPressable
      containerStyle={style}
      haptic={tone === 'danger' ? 'medium' : 'light'}
      onPress={onPress}
      style={[styles.button, tone === 'danger' ? styles.danger : styles.ghost]}
    >
      <View>
        <Text style={[styles.title, isGhost && styles.ghostTitle]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, isGhost && styles.ghostSubtitle]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

export const PrimaryButton = memo(PrimaryButtonComponent);

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...shadows.dangerGlow,
  },
  ghost: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
    marginTop: spacing.xxs,
  },
  ghostTitle: {
    color: colors.textPrimary,
  },
  ghostSubtitle: {
    color: colors.textTertiary,
  },
});
