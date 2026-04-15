import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FadeInView } from '../components/animations/FadeInView';
import { AppScreen } from '../components/ui/AppScreen';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricCard } from '../components/ui/MetricCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useUrgeModal } from '../context/UrgeContext';
import {
  getDailySavings,
  getStreakDays,
  getStreakStart,
  resetStreak,
} from '../storage/storage';
import { colors, spacing, typography } from '../theme';

const INITIAL_HOME_SNAPSHOT = Object.freeze({
  moneySaved: 0,
  streakDays: 0,
});

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomeScreen() {
  const [snapshot, setSnapshot] = useState(INITIAL_HOME_SNAPSHOT);
  const { setShowUrge } = useUrgeModal();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHomeSnapshot = async () => {
        const [dailySavings, streakDays, streakStart] = await Promise.all([
          getDailySavings(),
          getStreakDays(),
          getStreakStart(),
        ]);

        if (!streakStart) {
          await resetStreak();
        }

        if (isActive) {
          setSnapshot({
            moneySaved: streakDays * dailySavings,
            streakDays,
          });
        }
      };

      loadHomeSnapshot();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleOpenUrge = useCallback(() => {
    setShowUrge(true);
  }, [setShowUrge]);

  const moneySavedLabel = useMemo(
    () => formatMoney(snapshot.moneySaved),
    [snapshot.moneySaved]
  );

  return (
    <AppScreen contentContainerStyle={styles.container}>
      <FadeInView style={styles.hero}>
        <Text style={styles.eyebrow}>Pause</Text>
        <Text style={styles.title}>Pause before the bet.</Text>
        <Text style={styles.subtitle}>
          One tap opens a guided 10-minute intervention designed to outlast the spike.
        </Text>
      </FadeInView>

      <FadeInView delay={60} style={styles.metricsRow}>
        <MetricCard
          footer="Current streak"
          label="Clean days"
          style={styles.metricCard}
          tone="accent"
          value={String(snapshot.streakDays)}
        />
        <MetricCard
          footer="Estimated saved"
          label="Money back"
          style={styles.metricCard}
          value={moneySavedLabel}
        />
      </FadeInView>

      <FadeInView delay={120}>
        <GlassCard style={styles.supportCard}>
          <Text style={styles.supportTitle}>Fastest path in a hard moment</Text>
          <Text style={styles.supportBody}>
            Keep the home screen simple. Open the reset immediately, breathe, and let the timer do the work.
          </Text>
        </GlassCard>
      </FadeInView>

      <View style={styles.ctaWrap}>
        <PrimaryButton
          onPress={handleOpenUrge}
          subtitle="Instant full-screen intervention"
          title="Start a 10-minute reset"
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
  },
  hero: {
    marginTop: spacing.lg,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.largeTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    maxWidth: 360,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  metricCard: {
    flex: 1,
  },
  supportCard: {
    marginTop: spacing.xl,
  },
  supportTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  supportBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  ctaWrap: {
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
