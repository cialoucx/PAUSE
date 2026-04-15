import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '../../../components/ui/GlassCard';
import { colors, spacing, typography } from '../../../theme';
import { CATEGORY_LABELS } from '../constants';

const ROTATION_INTERVAL_MS = 4800;

function MessageCarouselComponent({ messages }) {
  const initialIndexRef = useRef(Math.floor(Math.random() * messages.length));
  const [index, setIndex] = useState(initialIndexRef.current);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const advanceIndex = useCallback(() => {
    setIndex((current) => (current + 1) % messages.length);
  }, [messages.length]);

  const rotateMessage = useCallback(() => {
    opacity.value = withTiming(
      0,
      { duration: 220, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (!finished) {
          return;
        }

        translateY.value = 10;
        runOnJS(advanceIndex)();
        opacity.value = withTiming(1, {
          duration: 320,
          easing: Easing.out(Easing.cubic),
        });
        translateY.value = withTiming(0, {
          duration: 320,
          easing: Easing.out(Easing.cubic),
        });
      }
    );
  }, [advanceIndex, opacity, translateY]);

  useEffect(() => {
    const intervalId = setInterval(rotateMessage, ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [rotateMessage]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const message = messages[index];

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard style={styles.card}>
        <View style={styles.label}>
          <Text style={styles.labelText}>
            {CATEGORY_LABELS[message.category] ?? 'Pause'}
          </Text>
        </View>
        <Text style={styles.message}>{message.text}</Text>
      </GlassCard>
    </Animated.View>
  );
}

export const MessageCarousel = memo(MessageCarouselComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 166,
    justifyContent: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    marginBottom: spacing.md,
  },
  labelText: {
    ...typography.eyebrow,
    color: colors.accent,
    letterSpacing: 1,
  },
  message: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
