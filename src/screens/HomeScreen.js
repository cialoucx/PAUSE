import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUrgeModal } from '../context/UrgeContext';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import { getStreakDays, getDailySavings, resetStreak, getStreakStart } from '../storage/storage';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function HomeScreen() {
  const [streakDays, setStreakDays] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const { setShowUrge } = useUrgeModal();

  useFocusEffect(
    useCallback(() => { loadData(); }, [])
  );

  async function loadData() {
    const [days, savings] = await Promise.all([getStreakDays(), getDailySavings()]);
    const start = await getStreakStart();
    if (!start) await resetStreak();
    setStreakDays(days);
    setMoneySaved(days * savings);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View>
        <Text style={styles.caption}>Today</Text>

        <Text style={styles.title}>
          🔥 {streakDays} days clean
        </Text>

        <GlassCard>
          <Text style={styles.money}>
            ₱{moneySaved.toLocaleString()} saved
          </Text>
        </GlassCard>
      </View>

      {/* Spacer */}
      <View />

      {/* Main Button */}
      <PremiumButton onPress={() => setShowUrge(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: 100,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },

  caption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
  },

  title: {
    ...TYPOGRAPHY.largeTitle,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  money: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});