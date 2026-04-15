import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, spacing, typography } from '../../theme';

function MetricCardComponent({ label, value, footer, style, tone = 'default' }) {
  const accentStyle = tone === 'accent' ? styles.valueAccent : undefined;

  return (
    <GlassCard style={style}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accentStyle]}>{value}</Text>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </GlassCard>
  );
}

export const MetricCard = memo(MetricCardComponent);

const styles = StyleSheet.create({
  label: {
    ...typography.eyebrow,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  value: {
    ...typography.metric,
    color: colors.textPrimary,
  },
  valueAccent: {
    color: colors.accent,
  },
  footer: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
