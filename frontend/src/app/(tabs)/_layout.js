import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

import { colors } from '../../components/ui';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#074E2B',
        tabBarInactiveTintColor: '#819087',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: 6 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E4ECE6',
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'index') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={23} color={color} />;
          }
          if (route.name === 'crops') {
            return <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={23} color={color} />;
          }
          if (route.name === 'market') {
            return <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={23} color={color} />;
          }
          if (route.name === 'diagnose') {
            return <Ionicons name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} size={23} color={color} />;
          }
          if (route.name === 'profile') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={23} color={color} />;
          }
          return <Ionicons name="ellipse-outline" size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'હોમ',
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: 'પાક માહિતી',
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'બજાર કિંમત',
        }}
      />
      <Tabs.Screen
        name="diagnose"
        options={{
          title: 'નિદાન',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'પ્રોફાઇલ',
        }}
      />
    </Tabs>

  );
}

