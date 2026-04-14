import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function GlassCard({ children }) {
  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
