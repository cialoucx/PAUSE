import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function Card({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },

  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
  },

  value: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
  },
});