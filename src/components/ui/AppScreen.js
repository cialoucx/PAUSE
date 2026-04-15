import React, { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

function BackgroundDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
    </View>
  );
}

const MemoizedBackgroundDecor = memo(BackgroundDecor);

function AppScreenComponent({
  children,
  contentContainerStyle,
  scrollable = false,
  style,
}) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      <MemoizedBackgroundDecor />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export const AppScreen = memo(AppScreenComponent);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  orbTop: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(102, 224, 194, 0.12)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: 90,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(255, 98, 90, 0.08)',
  },
});
