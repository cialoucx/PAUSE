import React, { memo, useCallback, useEffect } from 'react';
import { BackHandler, Modal, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableFreeze } from 'react-native-screens';
import { UrgeProvider, useUrgeModal } from '../context/UrgeContext';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import UrgeScreen from '../screens/UrgeScreen';
import { colors, radii, spacing, typography } from '../theme';

try {
  enableFreeze(true);
} catch (error) {
  console.warn('enableFreeze unavailable', error);
}

const Tab = createBottomTabNavigator();

const NAV_THEME = {
  dark: true,
  colors: {
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.danger,
  },
};

function TabLabel({ focused, label }) {
  return (
    <View style={styles.tabLabelWrap}>
      <View style={[styles.tabDot, focused && styles.tabDotActive]} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

const MemoizedTabLabel = memo(TabLabel);

function TabNavigator() {
  const { setShowUrge, showUrge } = useUrgeModal();

  const renderHomeTab = useCallback(
    ({ focused }) => <MemoizedTabLabel focused={focused} label="Home" />,
    []
  );
  const renderStatsTab = useCallback(
    ({ focused }) => <MemoizedTabLabel focused={focused} label="Stats" />,
    []
  );
  const handleCloseUrge = useCallback(() => {
    setShowUrge(false);
  }, [setShowUrge]);

  useEffect(() => {
    if (!showUrge) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleCloseUrge();
        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [handleCloseUrge, showUrge]);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          lazy: true,
          freezeOnBlur: true,
          tabBarShowLabel: false,
          sceneContainerStyle: styles.scene,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          component={HomeScreen}
          name="Home"
          options={{ tabBarIcon: renderHomeTab }}
        />
        <Tab.Screen
          component={StatsScreen}
          name="Stats"
          options={{ tabBarIcon: renderStatsTab }}
        />
      </Tab.Navigator>

      <Modal animationType="none" onRequestClose={handleCloseUrge} visible={showUrge}>
        <UrgeScreen onClose={handleCloseUrge} />
      </Modal>
    </>
  );
}

export default function AppNavigator() {
  return (
    <UrgeProvider>
      <NavigationContainer theme={NAV_THEME}>
        <TabNavigator />
      </NavigationContainer>
    </UrgeProvider>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 78,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  tabLabelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.tabInactive,
  },
  tabDotActive: {
    width: 18,
    backgroundColor: colors.accent,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.tabInactive,
  },
  tabLabelActive: {
    color: colors.textPrimary,
  },
});
