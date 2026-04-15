import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { GlassCard } from '../../../components/ui/GlassCard';
import { colors, spacing, typography } from '../../../theme';

function buildChartGeometry(data, width, height) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const horizontalPadding = 18;
  const topPadding = 18;
  const bottomPadding = 18;
  const usableWidth = Math.max(width - horizontalPadding * 2, 1);
  const usableHeight = Math.max(height - topPadding - bottomPadding, 1);
  const step = data.length > 1 ? usableWidth / (data.length - 1) : usableWidth;

  const points = data.map((item, index) => {
    const x = horizontalPadding + index * step;
    const y =
      topPadding + usableHeight - (item.value / maxValue) * usableHeight;
    return { x, y, value: item.value, label: item.label };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(height - bottomPadding).toFixed(2)} L ${points[0].x.toFixed(2)} ${(height - bottomPadding).toFixed(2)} Z`;

  return { areaPath, linePath, maxValue, points };
}

function TrendChartComponent({ data }) {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = Math.max(windowWidth - 80, 260);
  const chartHeight = 184;

  const geometry = useMemo(
    () => buildChartGeometry(data, chartWidth, chartHeight),
    [chartHeight, chartWidth, data]
  );

  const guideValues = useMemo(
    () => [geometry.maxValue, Math.ceil(geometry.maxValue / 2), 0],
    [geometry.maxValue]
  );

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Urge trend</Text>
      <Text style={styles.subtitle}>Last 7 days of logged moments</Text>

      <Svg height={chartHeight} width={chartWidth}>
        <Defs>
          <LinearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.36" />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {guideValues.map((value, index) => {
          const y = 18 + ((chartHeight - 36) * index) / (guideValues.length - 1);
          return (
            <Line
              key={`${value}-${index}`}
              stroke={colors.chartTrack}
              strokeDasharray="4 6"
              strokeWidth="1"
              x1="18"
              x2={chartWidth - 18}
              y1={y}
              y2={y}
            />
          );
        })}

        <Path d={geometry.areaPath} fill="url(#trendFill)" />
        <Path
          d={geometry.linePath}
          fill="none"
          stroke={colors.accent}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />

        {geometry.points.map((point) => (
          <Circle
            cx={point.x}
            cy={point.y}
            fill={colors.background}
            key={point.label}
            r="4.5"
            stroke={colors.accent}
            strokeWidth="2"
          />
        ))}
      </Svg>

      <View style={styles.labelRow}>
        {data.map((item) => (
          <View key={item.label} style={styles.labelItem}>
            <Text style={styles.labelDay}>{item.label}</Text>
            <Text style={styles.labelValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

export const TrendChart = memo(TrendChartComponent);

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  labelItem: {
    alignItems: 'center',
    flex: 1,
  },
  labelDay: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  labelValue: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.xxs,
  },
});
