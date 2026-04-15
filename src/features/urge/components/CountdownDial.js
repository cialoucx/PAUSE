import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '../../../components/ui/GlassCard';
import { colors, radii, spacing, typography } from '../../../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_SIZE = 248;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function CountdownDialComponent({ durationSeconds, onComplete }) {
  const [displaySeconds, setDisplaySeconds] = useState(durationSeconds);
  const progress = useSharedValue(1);
  const pulse = useSharedValue(1);
  const endTimeRef = useRef(0);
  const completedRef = useRef(false);
  const startPulseLoopRef = useRef(null);

  // Define startPulseLoop with a ref so it can reference itself
  const startPulseLoop = useCallback((expand) => {
    'worklet';
    pulse.value = withTiming(
      expand ? 1.018 : 1,
      {
        duration: 1600,
        easing: Easing.inOut(Easing.quad),
      },
      (finished) => {
        if (finished && startPulseLoopRef.current) {
          startPulseLoopRef.current(!expand);
        }
      }
    );
  }, [pulse]);

  // Store the function in ref so the callback can access the latest version
  useEffect(() => {
    startPulseLoopRef.current = startPulseLoop;
  }, [startPulseLoop]);

  useEffect(() => {
    completedRef.current = false;
    endTimeRef.current = Date.now() + durationSeconds * 1000;
    setDisplaySeconds(durationSeconds);

    progress.value = 1;
    pulse.value = 1;

    progress.value = withTiming(0, {
      duration: durationSeconds * 1000,
      easing: Easing.linear,
    });
    startPulseLoop(true);

    const timerId = setInterval(() => {
      const nextSeconds = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );

      setDisplaySeconds((current) =>
        current === nextSeconds ? current : nextSeconds
      );

      if (nextSeconds === 0 && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
      cancelAnimation(progress);
      cancelAnimation(pulse);
    };
  }, [durationSeconds, onComplete, progress, pulse]);

  const ringAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    stroke: interpolateColor(
      progress.value,
      [0, 0.18, 1],
      [colors.danger, colors.warning, colors.accent]
    ),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const formattedTime = useMemo(() => formatTime(displaySeconds), [displaySeconds]);

  return (
    <Animated.View style={pulseStyle}>
      <GlassCard intensity={40} style={styles.card}>
        <View style={styles.ringFrame}>
          <Svg height={RING_SIZE} width={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={colors.chartTrack}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
            />
            <AnimatedCircle
              animatedProps={ringAnimatedProps}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="transparent"
              rotation="-90"
              originX={RING_SIZE / 2}
              originY={RING_SIZE / 2}
              strokeDasharray={CIRCUMFERENCE}
              strokeLinecap="round"
              strokeWidth={STROKE_WIDTH}
            />
          </Svg>

          <View pointerEvents="none" style={styles.timerCopy}>
            <Text style={styles.eyebrow}>10-minute reset</Text>
            <Text style={styles.time}>{formattedTime}</Text>
            <Text style={styles.subtext}>Stay with the urge. It will drop.</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export const CountdownDial = memo(CountdownDialComponent);

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: radii.lg,
  },
  ringFrame: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCopy: {
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.timer,
    color: colors.textPrimary,
  },
  subtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
