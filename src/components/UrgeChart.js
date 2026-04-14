import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
} from 'victory-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function UrgeChart({ data, insight }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Urges</Text>

      <View style={styles.chartContainer}>
        <VictoryChart padding={{ top: 10, bottom: 30, left: 40, right: 20 }}>
          {/* Grid Lines */}
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              grid: { stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 },
              tickLabels: { fill: COLORS.subtext, fontSize: 9 },
            }}
            tickFormat={(t) => `${t}`}
          />

          {/* Day Labels */}
          <VictoryAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: COLORS.subtext, fontSize: 9 },
              ticks: { stroke: 'transparent' },
            }}
          />

          {/* Area under line (gradient) */}
          <VictoryArea
            data={data}
            x="day"
            y="urges"
            style={{
              data: {
                fill: 'url(#urgeGradient)',
                stroke: COLORS.primary,
                strokeWidth: 2.5,
              },
            }}
            interpolation="natural"
          />

          {/* Data points */}
          <VictoryScatter
            data={data}
            x="day"
            y="urges"
            size={3}
            style={{
              data: {
                fill: COLORS.primary,
                stroke: COLORS.background,
                strokeWidth: 1,
              },
            }}
          />
        </VictoryChart>

        {/* Gradient Definition */}
        <Defs>
          <LinearGradient id="urgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
      </View>

      {/* Insight Text */}
      {insight && (
        <Text style={styles.insight}>{insight}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  chartContainer: {
    height: 200,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderRadius: RADIUS.sm,
  },

  insight: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});
