import React, { memo, useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 220,
  mass: 0.7,
};

function AnimatedPressableComponent({
  children,
  disabled = false,
  haptic = 'light',
  onPress,
  style,
  containerStyle,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (disabled) {
      return;
    }

    if (haptic) {
      const feedbackStyle =
        haptic === 'medium'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light;

      Haptics.impactAsync(feedbackStyle).catch(() => {});
    }

    onPress?.();
  }, [disabled, haptic, onPress]);

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={containerStyle}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export const AnimatedPressable = memo(AnimatedPressableComponent);
