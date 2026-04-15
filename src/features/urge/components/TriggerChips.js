import React, { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from '../../../components/animations/AnimatedPressable';
import { colors, radii, spacing, typography } from '../../../theme';

function TriggerChip({ id, isSelected, label, onSelect }) {
  const handlePress = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <AnimatedPressable
      containerStyle={styles.itemSpacing}
      haptic={isSelected ? null : 'light'}
      onPress={handlePress}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const MemoizedTriggerChip = memo(TriggerChip);

function TriggerChipsComponent({ onSelect, options, selectedId }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {options.map((option) => (
        <MemoizedTriggerChip
          id={option.id}
          isSelected={selectedId === option.id}
          key={option.id}
          label={option.shortLabel}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
}

export const TriggerChips = memo(TriggerChipsComponent);

const styles = StyleSheet.create({
  content: {
    paddingRight: spacing.md,
  },
  itemSpacing: {
    marginRight: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(102, 224, 194, 0.34)',
  },
  chipLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: colors.accent,
  },
});
