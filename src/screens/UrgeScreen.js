import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppScreen } from '../components/ui/AppScreen';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { CompletionCard } from '../features/urge/components/CompletionCard';
import { CountdownDial } from '../features/urge/components/CountdownDial';
import { CopingActionList } from '../features/urge/components/CopingActionList';
import { MessageCarousel } from '../features/urge/components/MessageCarousel';
import { TriggerChips } from '../features/urge/components/TriggerChips';
import {
  COPING_ACTIONS,
  URGE_DURATION_SECONDS,
  URGE_MESSAGES,
  URGE_TRIGGERS,
} from '../features/urge/constants';
import { resetStreak, saveUrgeLog } from '../storage/storage';
import { colors, spacing, typography } from '../theme';

export default function UrgeScreen({ onClose }) {
  const [phase, setPhase] = useState('active');
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const hasLoggedOutcomeRef = useRef(false);

  const persistOutcome = useCallback(
    async (outcome) => {
      if (hasLoggedOutcomeRef.current) {
        return true;
      }

      try {
        hasLoggedOutcomeRef.current = true;

        await saveUrgeLog({
          intensity: outcome === 'relapsed' ? 8 : 5,
          outcome,
          trigger: selectedTrigger || 'other',
        });

        if (outcome === 'relapsed') {
          await resetStreak();
        }

        return true;
      } catch (error) {
        hasLoggedOutcomeRef.current = false;
        console.warn('persistOutcome error', error);
        Alert.alert(
          'Unable to save this session',
          'Your progress could not be saved right now. Please try again before leaving this screen.'
        );
        return false;
      }
    },
    [selectedTrigger]
  );

  const handleTimerComplete = useCallback(async () => {
    const saved = await persistOutcome('resisted');
    if (!saved) {
      return;
    }

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    ).catch(() => {});
    setPhase('complete');
  }, [persistOutcome]);

  const handleActionPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const handleSelectTrigger = useCallback((nextTrigger) => {
    setSelectedTrigger((current) =>
      current === nextTrigger ? null : nextTrigger
    );
  }, []);

  const handleDismiss = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const closeWithOutcome = useCallback(
    async (outcome) => {
      const saved = await persistOutcome(outcome);
      if (saved) {
        onClose?.();
      }
    },
    [onClose, persistOutcome]
  );

  const handleLeavePress = useCallback(() => {
    Alert.alert(
      'End this session?',
      'Choose the outcome that fits this moment so your stats stay accurate.',
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'I resisted',
          onPress: () => {
            closeWithOutcome('resisted');
          },
        },
        {
          text: 'I gambled',
          style: 'destructive',
          onPress: () => {
            closeWithOutcome('relapsed');
          },
        },
      ]
    );
  }, [closeWithOutcome]);

  return (
    <AppScreen contentContainerStyle={styles.container} scrollable>
      <View style={styles.inner}>
        <View>
          <Text style={styles.eyebrow}>Intervention</Text>
          <Text style={styles.title}>Stay here until the spike drops.</Text>
          <Text style={styles.subtitle}>
            The timer and the messages update in isolated components, so the screen stays smooth while the urge fades.
          </Text>
        </View>

        {phase === 'complete' ? (
          <CompletionCard onClose={handleDismiss} />
        ) : (
          <>
            <CountdownDial
              durationSeconds={URGE_DURATION_SECONDS}
              onComplete={handleTimerComplete}
            />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>What triggered this?</Text>
              <TriggerChips
                onSelect={handleSelectTrigger}
                options={URGE_TRIGGERS}
                selectedId={selectedTrigger}
              />
            </View>

            <MessageCarousel messages={URGE_MESSAGES} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fast grounding actions</Text>
              <CopingActionList actions={COPING_ACTIONS} onPress={handleActionPress} />
            </View>

            <PrimaryButton
              onPress={handleLeavePress}
              style={styles.leaveButton}
              subtitle="Log the outcome and exit"
              title="End this session"
              tone="ghost"
            />
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: spacing.xl,
  },
  inner: {
    flexGrow: 1,
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
    marginBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    ...typography.eyebrow,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  leaveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
