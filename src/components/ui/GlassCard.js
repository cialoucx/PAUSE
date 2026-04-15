import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, shadows } from '../../theme';

function GlassCardComponent({ children, intensity = 32, style }) {
  return (
    <View style={[styles.shell, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
}

export const GlassCard = memo(GlassCardComponent);

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  blur: {
    padding: 20,
    backgroundColor: colors.surface,
  },
});
