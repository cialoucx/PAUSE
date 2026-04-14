import { Pressable, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function GlassAction({ text, onPress }) {
  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={handlePress}
    >
      <BlurView intensity={30} tint="dark" style={styles.action}>
        <Text style={styles.actionText}>{text}</Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
});
