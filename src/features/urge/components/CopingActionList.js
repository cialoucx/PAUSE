import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../../../components/animations/AnimatedPressable';
import { GlassCard } from '../../../components/ui/GlassCard';
import { colors, spacing, typography } from '../../../theme';

function CopingActionItem({ action, onPress }) {
  const handlePress = useCallback(() => {
    onPress(action.id);
  }, [action.id, onPress]);

  return (
    <AnimatedPressable
      containerStyle={styles.itemSpacing}
      haptic="light"
      onPress={handlePress}
      style={styles.pressable}
    >
      <GlassCard intensity={28}>
        <Text style={styles.title}>{action.title}</Text>
        <Text style={styles.subtitle}>{action.subtitle}</Text>
      </GlassCard>
    </AnimatedPressable>
  );
}

const MemoizedCopingActionItem = memo(CopingActionItem);

function CopingActionListComponent({ actions, onPress }) {
  return (
    <View>
      {actions.map((action) => (
        <MemoizedCopingActionItem
          action={action}
          key={action.id}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

export const CopingActionList = memo(CopingActionListComponent);

const styles = StyleSheet.create({
  itemSpacing: {
    marginBottom: spacing.sm,
  },
  pressable: {
    borderRadius: 22,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
