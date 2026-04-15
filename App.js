import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar style="light" />
      <Text style={{ color: '#66E0C2', fontSize: 18 }}>Hello from App!</Text>
    </View>
  );
}
