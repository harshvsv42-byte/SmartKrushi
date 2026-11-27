import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ExpoProjectNotice() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Start the native app from the mobile folder</Text>
        <Text style={styles.body}>
          This folder is the Vite website. The Android React Native app is in the sibling mobile folder.
        </Text>
        <Text selectable style={styles.command}>cd ..\mobile</Text>
        <Text selectable style={styles.command}>npx expo start --clear</Text>
        <Text style={styles.body}>
          To run the website, use npm run dev in this folder. Start the Django backend separately if the app needs live API data.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#F0F4F1',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    gap: 16,
    maxWidth: 480,
    padding: 24,
    width: '100%',
  },
  title: {
    color: '#0B3B24',
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    color: '#526158',
    fontSize: 14,
    lineHeight: 22,
  },
  command: {
    backgroundColor: '#E9F5ED',
    borderRadius: 10,
    color: '#0B5D34',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    padding: 12,
  },
});
