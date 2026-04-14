import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

const INTERVENTIONS = ['Drink Water', 'Walk', 'Breathe', 'Call Friend'];
const CBT_MESSAGES = [
  'You are chasing losses.',
  'This urge will pass.',
  'You are stronger.',
  'Pause. Breathe. Think.',
  'One moment. One choice.',
];

export default function UrgeScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [phase, setPhase] = useState('countdown'); // countdown, done, logging
  const [messageIdx, setMessageIdx] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (phase !== 'countdown' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.icon}>✓</Text>
          <Text style={styles.doneTitle}>You made it!</Text>
          <Text style={styles.doneSub}>The urge passed. You stayed in control.</Text>
          
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        
        {/* Timer */}
        <Animated.Text style={[styles.timer, { transform: [{ scale: pulseAnim }] }]}>
          {formattedTime}
        </Animated.Text>

        {/* CBT Message */}
        <Text style={styles.message}>{CBT_MESSAGES[messageIdx % CBT_MESSAGES.length]}</Text>

        {/* Intervention Actions */}
        <View style={styles.interventions}>
          {INTERVENTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setMessageIdx(idx => idx + 1);
              }}
            >
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leave Option */}
        <TouchableOpacity
          style={styles.leaveBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.leaveText}>Leave Intervention</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 96,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: SPACING.xxxl || 64,
    letterSpacing: -2,
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl || 64,
    lineHeight: 32,
  },
  interventions: {
    width: '100%',
    marginBottom: SPACING.xxxl || 64,
  },
  actionBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md * 1.5,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  leaveBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.lg,
    width: '100%',
  },
  leaveText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  // Done screen
  icon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  doneTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  doneSub: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 26,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md * 1.5,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.lg,
  },
  doneBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});
