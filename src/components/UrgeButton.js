import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { COLORS, RADIUS } from '../utils/theme';

export default function UrgeButton({
  onPress,
  label = 'I Feel Like\nGambling',
  variant = 'danger',
  size = 'large',
  disabled = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ring1Anim = useRef(new Animated.Value(1)).current;
  const ring2Anim = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.35)).current;
  const ring2Opacity = useRef(new Animated.Value(0.18)).current;

  // Pulsing rings animation
  useEffect(() => {
    if (variant !== 'danger' || size !== 'large') return;
    const pulse1 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Anim, { toValue: 1.12, duration: 1800, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Anim, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0.35, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(ring2Anim, { toValue: 1.22, duration: 1800, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Anim, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.18, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    pulse1.start();
    pulse2.start();
    return () => { pulse1.stop(); pulse2.stop(); };
  }, [variant, size]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true, tension: 300, friction: 10 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const isLargeDanger = variant === 'danger' && size === 'large';

  return (
    <View style={isLargeDanger ? styles.ringWrapper : null}>
      {isLargeDanger && (
        <>
          <Animated.View style={[
            styles.pulseRing, styles.pulseRing1,
            { transform: [{ scale: ring1Anim }], opacity: ring1Opacity }
          ]} />
          <Animated.View style={[
            styles.pulseRing, styles.pulseRing2,
            { transform: [{ scale: ring2Anim }], opacity: ring2Opacity }
          ]} />
        </>
      )}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            styles[variant],
            size === 'large' ? styles.large : styles.medium,
            disabled && styles.disabled,
          ]}
          onPress={disabled ? null : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={[styles.labelText, size === 'medium' && styles.labelMedium]}>
            {label}
          </Text>
          {isLargeDanger && (
            <Text style={styles.sublabel}>Tap for intervention</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const BTN = 210;

const styles = StyleSheet.create({
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BTN + 60,
    height: BTN + 60,
  },
  pulseRing: {
    position: 'absolute',
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
  },
  pulseRing1: {
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  pulseRing2: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  button: {
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: BTN,
    height: BTN,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 30,
    elevation: 14,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  accent: {
    backgroundColor: COLORS.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderMid,
  },
  disabled: { opacity: 0.4 },
  labelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 28,
  },
  labelMedium: {
    fontSize: 16,
    fontWeight: '600',
  },
  sublabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
    letterSpacing: 0.3,
  },
});