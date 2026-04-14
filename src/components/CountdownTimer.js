import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const TOTAL_SECONDS = 10 * 60;
const RING_SIZE = 200;
const RADIUS_VAL = RING_SIZE / 2 - 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS_VAL;

export default function CountdownTimer({ onComplete, running = true }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); onComplete?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / TOTAL_SECONDS; // 1 → 0
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const ringColor = secondsLeft < 60
    ? COLORS.danger
    : secondsLeft < 180
    ? '#6b8a84'
    : COLORS.timerAccent;

  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.container}>
        {/* SVG-style ring using borders — RN compatible */}
        <View style={[styles.outerRing, { borderColor: COLORS.timerRing }]} />
        <View style={[styles.progressIndicator, { borderColor: ringColor }]} />
        <View style={styles.inner}>
          <Text style={styles.timeText}>{timeStr}</Text>
          <Text style={styles.unitText}>{secondsLeft === 0 ? 'done' : 'remaining'}</Text>
        </View>
      </View>
      {/* Progress bar */}
      <View style={styles.progressBg}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${Math.min((1 - progress) * 100, 100)}%`,
              backgroundColor: ringColor,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    backgroundColor: COLORS.timerBg,
  },
  progressIndicator: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inner: { alignItems: 'center' },
  timeText: {
    fontSize: 52,
    fontWeight: '100',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  progressBg: {
    width: RING_SIZE,
    height: 2,
    backgroundColor: COLORS.border,
    borderRadius: 1,
    marginTop: SPACING.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    borderRadius: 1,
  },
});