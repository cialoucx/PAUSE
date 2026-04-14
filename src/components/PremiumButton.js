import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function PremiumButton({ onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = async () => {
    scale.value = withSpring(0.95);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text style={styles.text}>I feel like gambling</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 22,
    backgroundColor: '#ff453a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff453a',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
