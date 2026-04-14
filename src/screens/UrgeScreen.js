import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import GlassAction from '../components/GlassAction';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

const MESSAGES = [
  'You are chasing losses.',
  'This urge will pass.',
  'You are stronger.',
  'Pause. Breathe. Think.',
];

export default function UrgeScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [messageIdx, setMessageIdx] = useState(0);
  const [done, setDone] = useState(false);

  // Animations
  const containerOpacity = useSharedValue(0);
  const timerScale = useSharedValue(1);
  const doneScale = useSharedValue(0.5);

  useEffect(() => {
    // Fade in
    containerOpacity.value = withTiming(1, { duration: 400 });

    // Breathing timer animation
    timerScale.value = withRepeat(
      withTiming(1.05, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (done || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setDone(true);
          doneScale.value = withSpring(1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [done, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const message = MESSAGES[messageIdx % MESSAGES.length];

  const containerAnim = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const timerAnim = useAnimatedStyle(() => ({
    transform: [{ scale: timerScale.value }],
  }));

  const doneAnim = useAnimatedStyle(() => ({
    transform: [{ scale: doneScale.value }],
    opacity: containerOpacity.value,
  }));

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Background depth effect */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.depthBg} />
        </View>

        <Animated.View style={[styles.doneContent, doneAnim]}>
          <Text style={styles.doneEmoji}>✓</Text>
          <Text style={styles.doneTitle}>You made it</Text>
          <Text style={styles.doneSub}>The urge passed.</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background depth effect */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.depthBg} />
      </View>

      <Animated.View style={[styles.content, containerAnim]}>
        {/* Timer */}
        <Animated.Text style={[styles.timer, timerAnim]}>
          {timeStr}
        </Animated.Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <GlassAction
            text="Drink Water"
            onPress={() => setMessageIdx(idx => idx + 1)}
          />
          <GlassAction
            text="Walk"
            onPress={() => setMessageIdx(idx => idx + 1)}
          />
        </View>

        {/* Close hint */}
        <Text style={styles.closeHint}>Tap timer to close</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },

  depthBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  content: {
    alignItems: 'center',
    zIndex: 10,
  },

  timer: {
    ...TYPOGRAPHY.timer,
    color: COLORS.danger,
    marginBottom: SPACING.xxl,
  },

  message: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    maxWidth: 280,
  },

  actions: {
    flexDirection: 'row',
    marginBottom: SPACING.xxxl,
  },

  closeHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginTop: SPACING.xl,
  },

  // Done state
  doneContent: {
    alignItems: 'center',
    zIndex: 10,
  },

  doneEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },

  doneTitle: {
    ...TYPOGRAPHY.largeTitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  doneSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.subtext,
    marginBottom: SPACING.xxl,
  },
});