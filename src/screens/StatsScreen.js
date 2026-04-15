import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FadeInView } from '../components/animations/FadeInView';
import { AppScreen } from '../components/ui/AppScreen';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricCard } from '../components/ui/MetricCard';
import { TrendChart } from '../features/stats/components/TrendChart';
import { buildStatsSnapshot, formatCurrency } from '../features/stats/selectors';
import {
  clearAllData,
  getDailySavings,
  getStreakDays,
  getUrgeLogs,
  resetStreak,
} from '../storage/storage';
import { colors, spacing, typography } from '../theme';

const INITIAL_STATS = Object.freeze({
  moneySaved: 0,
  peakHour: null,
  relapsed: 0,
  resistanceRate: 0,
  resisted: 0,
  streakDays: 0,
  topTrigger: null,
  totalUrges: 0,
  trend: [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 0 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ],
});

const TRIGGER_LABELS = {
  boredom: 'Boredom',
  stress: 'Stress',
  money: 'Money pressure',
  habit: 'Habit',
  social: 'Social pressure',
  loneliness: 'Loneliness',
  excitement: 'Thrill-seeking',
  other: 'Other',
};

function InsightRow({ label, value }) {
  return (
    <View style={styles.insightRow}>
      <Text style={styles.insightLabel}>{label}</Text>
      <Text style={styles.insightValue}>{value}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const [stats, setStats] = useState(INITIAL_STATS);

  const refreshStats = useCallback(async () => {
    try {
      const [dailySavings, logs, streakDays] = await Promise.all([
        getDailySavings(),
        getUrgeLogs(),
        getStreakDays(),
      ]);

      setStats(buildStatsSnapshot({ dailySavings, logs, streakDays }));
    } catch (error) {
      console.warn('refreshStats error', error);
      Alert.alert(
        'Unable to load statistics',
        'Please try again in a moment.'
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshStats();
    }, [refreshStats])
  );

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset all data?',
      'This clears your streak, saved stats, and logged urges.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await resetStreak();
              await refreshStats();
            } catch (error) {
              console.warn('handleReset error', error);
              Alert.alert(
                'Reset failed',
                'Your data could not be cleared right now. Please try again.'
              );
            }
          },
        },
      ]
    );
  }, [refreshStats]);

  const moneySavedLabel = useMemo(
    () => formatCurrency(stats.moneySaved),
    [stats.moneySaved]
  );
  const successRateLabel = useMemo(
    () => `${stats.resistanceRate}%`,
    [stats.resistanceRate]
  );
  const topTriggerLabel = useMemo(
    () =>
      stats.topTrigger ? TRIGGER_LABELS[stats.topTrigger] ?? stats.topTrigger : 'No pattern yet',
    [stats.topTrigger]
  );

  return (
    <AppScreen scrollable>
      <FadeInView style={styles.header}>
        <Text style={styles.eyebrow}>Pause Analytics</Text>
        <Text style={styles.title}>Patterns and progress</Text>
        <Text style={styles.subtitle}>
          Lightweight summaries only. No heavy charting library re-renders.
        </Text>
      </FadeInView>

      <FadeInView delay={60} style={styles.metricsRow}>
        <MetricCard
          footer="Days clean"
          label="Streak"
          style={styles.metricCard}
          tone="accent"
          value={String(stats.streakDays)}
        />
        <MetricCard
          footer="Estimated saved"
          label="Savings"
          style={styles.metricCard}
          value={moneySavedLabel}
        />
      </FadeInView>

      <FadeInView delay={100} style={styles.metricsRow}>
        <MetricCard
          footer="Completed sessions"
          label="Success rate"
          style={styles.metricCard}
          value={successRateLabel}
        />
        <MetricCard
          footer="Logged urges"
          label="Entries"
          style={styles.metricCard}
          value={String(stats.totalUrges)}
        />
      </FadeInView>

      <FadeInView delay={140}>
        <TrendChart data={stats.trend} />
      </FadeInView>

      <FadeInView delay={180}>
        <GlassCard style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Key signals</Text>
          <InsightRow label="Top trigger" value={topTriggerLabel} />
          <InsightRow
            label="Peak hour"
            value={stats.peakHour ?? 'No pattern yet'}
          />
          <InsightRow
            label="Resisted vs relapsed"
            value={`${stats.resisted} / ${stats.relapsed}`}
          />
        </GlassCard>
      </FadeInView>

      {stats.totalUrges === 0 ? (
        <FadeInView delay={220}>
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No urge sessions logged yet</Text>
            <Text style={styles.emptyBody}>
              Open the intervention from home when the next spike hits. The chart and patterns will build automatically.
            </Text>
          </GlassCard>
        </FadeInView>
      ) : null}

      <Pressable onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset all data</Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xl,
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
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  insightsCard: {
    marginTop: spacing.md,
  },
  insightsTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  insightLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  insightValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
  emptyCard: {
    marginTop: spacing.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  resetButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  resetText: {
    ...typography.caption,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
