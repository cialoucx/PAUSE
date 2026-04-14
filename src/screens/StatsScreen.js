import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StatCard, AppBadge } from '../components/Card';
import {
  getStreakDays, getUrgeLogs,
  getMostFrequentTrigger, getPeakUrgeHour,
  clearAllData, resetStreak, getDailySavings,
} from '../storage/storage';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    streakDays: 0, totalUrges: 0, resisted: 0,
    relapsed: 0, topTrigger: null, peakHour: null,
    moneySaved: 0, resistanceRate: 0,
  });

  useFocusEffect(useCallback(() => { loadStats(); }, []));

  async function loadStats() {
    const [days, logs, savings] = await Promise.all([
      getStreakDays(), getUrgeLogs(), getDailySavings(),
    ]);
    const resisted = logs.filter(l => l.outcome === 'resisted').length;
    const relapsed = logs.filter(l => l.outcome === 'relapsed').length;
    const rate = logs.length > 0 ? Math.round((resisted / logs.length) * 100) : 0;
    setStats({
      streakDays: days,
      totalUrges: logs.length,
      resisted, relapsed,
      topTrigger: getMostFrequentTrigger(logs),
      peakHour: getPeakUrgeHour(logs),
      moneySaved: days * savings,
      resistanceRate: rate,
    });
  }

  function handleReset() {
    Alert.alert('Reset All Data', 'Clears your streak, logs, and all statistics. Cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset Everything', style: 'destructive',
        onPress: async () => { await clearAllData(); await resetStreak(); loadStats(); },
      },
    ]);
  }

  const triggerMap = {
    boredom: 'Boredom', stress: 'Stress', money: 'Money Pressure',
    habit: 'Habit', social: 'Social / FOMO', loneliness: 'Loneliness',
    thrill: 'Thrill-seeking', other: 'Other',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppBadge label="FOCUSGUARD" />
        <Text style={styles.title}>Patterns &{'\n'}Progress</Text>
        <Text style={styles.sub}>Understanding triggers is half the battle.</Text>

        <View style={styles.row}>
          <StatCard label="Streak" value={String(stats.streakDays)} sublabel="days clean" accent />
          <View style={{ width: SPACING.sm }} />
          <StatCard
            label="Resistance"
            value={stats.resistanceRate > 0 ? `${stats.resistanceRate}%` : '—'}
            sublabel="urges resisted"
            accent={stats.resistanceRate >= 70}
          />
        </View>

        <View style={[styles.row, { marginTop: SPACING.sm }]}>
          <StatCard label="Total Urges" value={String(stats.totalUrges)} sublabel="logged" />
          <View style={{ width: SPACING.sm }} />
          <StatCard
            label="Money Saved"
            value={`₱${stats.moneySaved >= 1000 ? (stats.moneySaved/1000).toFixed(0)+'k' : stats.moneySaved}`}
            sublabel="estimated"
          />
        </View>

        {/* Resistance bar */}
        {stats.totalUrges > 0 && (
          <View style={styles.barCard}>
            <Text style={styles.cardTitle}>RESISTANCE RECORD</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${stats.resistanceRate}%` }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={styles.barLeft}>{stats.resisted} resisted</Text>
              <Text style={styles.barRight}>{stats.relapsed} relapses</Text>
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.cardTitle}>INSIGHTS</Text>
          <InsightRow
            label="Top Trigger"
            note="Most common cause"
            value={stats.topTrigger ? triggerMap[stats.topTrigger] || stats.topTrigger : '—'}
          />
          <View style={styles.divider} />
          <InsightRow
            label="Peak Urge Time"
            note="When most vulnerable"
            value={stats.peakHour ?? '—'}
          />
          <View style={styles.divider} />
          <InsightRow
            label="Total Logged"
            note="All urge events"
            value={String(stats.totalUrges)}
          />
        </View>

        {stats.totalUrges === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              📊 No urges logged yet.{'\n\n'}
              When you feel an urge, tap the button on the home screen. Stats will build over time.
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset All Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InsightRow({ label, note, value }) {
  return (
    <View style={styles.insightRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.insightLabel}>{label}</Text>
        <Text style={styles.insightNote}>{note}</Text>
      </View>
      <Text style={styles.insightValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: 32, fontWeight: '300', color: COLORS.textPrimary, lineHeight: 40, marginBottom: 4 },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  row: { flexDirection: 'row' },
  barCard: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 22, padding: SPACING.md, marginTop: SPACING.sm,
  },
  cardTitle: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 2, fontWeight: '700', marginBottom: 4 },
  barBg: { height: 6, backgroundColor: COLORS.dangerDim, borderRadius: 3, marginVertical: SPACING.sm, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: COLORS.success, borderRadius: 3 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLeft: { fontSize: 11, color: COLORS.success },
  barRight: { fontSize: 11, color: COLORS.danger },
  insightCard: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 22, padding: SPACING.md, marginTop: SPACING.sm,
  },
  insightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  insightLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500', marginBottom: 2 },
  insightNote: { fontSize: 11, color: COLORS.textMuted },
  insightValue: { fontSize: 15, fontWeight: '600', color: COLORS.accentLight },
  divider: { height: 1, backgroundColor: COLORS.border },
  emptyCard: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 22, padding: SPACING.lg, marginTop: SPACING.md,
  },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, textAlign: 'center' },
  resetBtn: { marginTop: SPACING.xxl, alignItems: 'center', padding: SPACING.md },
  resetText: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'underline' },
});