import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SessionScreen from './src/screens/SessionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { PuttHistoryProvider } from './src/contexts/SessionContext';
import { BluetoothProvider } from './src/contexts/BluetoothContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <BluetoothProvider>
        <PuttHistoryProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: {
                  backgroundColor: '#ffffff',
                  borderTopWidth: 1,
                  borderTopColor: '#e5e7eb',
                  paddingBottom: 5,
                  paddingTop: 5,
                },
                headerStyle: {
                  backgroundColor: '#2563eb',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <TabIcon name="🏠" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Session"
                component={SessionScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <TabIcon name="🎯" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <TabIcon name="📊" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <TabIcon name="⚙️" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </PuttHistoryProvider>
      </BluetoothProvider>
    </SafeAreaProvider>
  );
}

// Simple tab icon component using emojis
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => (
  <Text style={{ fontSize: size * 0.8 }}>{name}</Text>
);
