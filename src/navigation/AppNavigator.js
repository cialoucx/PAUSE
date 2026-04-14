import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Modal } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import UrgeScreen from '../screens/UrgeScreen';
import { COLORS } from '../utils/theme';
import { UrgeProvider, useUrgeModal } from '../context/UrgeContext';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, icon, label }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, focused && styles.iconActive]}>{icon}</Text>
      <Text style={[styles.iconLabel, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

function TabNavigator() {
  const { showUrge, setShowUrge } = useUrgeModal();

  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="⌂" label="HOME" /> }} 
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="◈" label="STATS" /> }} 
        />
      </Tab.Navigator>
      
      <Modal visible={showUrge} animationType="fade" transparent={false}>
        <UrgeScreen navigation={{ goBack: () => setShowUrge(false) }} />
      </Modal>
    </>
  );
}

export default function AppNavigator() {
  return (
    <UrgeProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </UrgeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10,10,10,0.97)',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  iconText: { fontSize: 18, color: COLORS.textMuted, marginBottom: 3 },
  iconActive: { color: COLORS.accentLight },
  iconLabel: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.5, fontWeight: '700' },
  labelActive: { color: COLORS.accentLight },
});