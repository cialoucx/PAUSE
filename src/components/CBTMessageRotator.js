import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CBT_MESSAGES } from '../data/cbtMessages';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const ROTATION_INTERVAL = 4000;

const CATEGORY_LABELS = {
  urge_surfing:  'URGE SURFING',
  cognitive:     'REALITY CHECK',
  self_efficacy: 'YOU CAN DO THIS',
  consequences:  'THINK AHEAD',
  mindfulness:   'BREATHE',
};

export default function CBTMessageRotator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * CBT_MESSAGES.length));
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -8, duration: 350, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % CBT_MESSAGES.length);
        slideAnim.setValue(8);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
      });
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const message = CBT_MESSAGES[index];

  return (
    <Animated.View style={[
      styles.container,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <View style={styles.card}>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{CATEGORY_LABELS[message.category] || message.category.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: SPACING.lg,
  },
  tagRow: {
    marginBottom: SPACING.sm,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 9,
    color: COLORS.accentLight,
    letterSpacing: 2,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 22,
    fontWeight: '300',
    color: COLORS.textPrimary,
    lineHeight: 34,
    letterSpacing: 0.2,
  },
});