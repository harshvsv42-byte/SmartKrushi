import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#074E2B" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F5F4' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="weather" />
        <Stack.Screen name="soil" />
        <Stack.Screen name="crop/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>

    </SafeAreaProvider>
  );
}

