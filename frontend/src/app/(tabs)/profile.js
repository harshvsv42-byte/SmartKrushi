import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '../../lib/api';
import { Card, colors, Heading, Page, SectionTitle } from '../../components/ui';

const links = [
  { title: 'હવામાન વિગતો', subtitle: 'સ્થાનિક હવામાન અને આગાહી', route: '/weather', glyph: '☀' },
  { title: 'માટી આરોગ્ય', subtitle: 'માટી અને પોષક તત્ત્વોની માહિતી', route: '/soil', glyph: '▤' },
  { title: 'પાક માર્ગદર્શિકા', subtitle: 'પાક અને મોસમ પ્રમાણે માહિતી', route: '/crops', glyph: '♧' },
];

export default function ProfileScreen() {
  return (
    <Page>
      <Heading title="પ્રોફાઇલ અને સેટિંગ્સ" subtitle="તમારી ખેતી એપ્લિકેશનની માહિતી" />

      <Card style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>ક</Text></View>
        <Text style={styles.name}>ખેડૂત મિત્ર</Text>
        <Text style={styles.subtext}>Smart Agriculture Assistant</Text>
      </Card>

      <Card>
        <SectionTitle>ઝડપી લિંક્સ</SectionTitle>
        {links.map((link) => (
          <Pressable
            accessibilityRole="button"
            key={link.route}
            onPress={() => router.push(link.route)}
            style={styles.linkRow}
          >
            <View style={styles.linkIcon}><Text style={styles.linkGlyph}>{link.glyph}</Text></View>
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>{link.title}</Text>
              <Text style={styles.subtext}>{link.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </Card>

      <Card>
        <SectionTitle>API જોડાણ</SectionTitle>
        <Text style={styles.subtext}>Backend સરનામું</Text>
        <Text selectable style={styles.apiUrl}>{API_BASE_URL}</Text>
        <Text style={styles.hint}>
          ભૌતિક Android ફોન માટે mobile/.env માં કમ્પ્યુટરનું Wi-Fi IPv4 સરનામું સેટ કરો.
        </Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  avatarText: { color: colors.white, fontSize: 28, fontWeight: '800' },
  name: { color: colors.darkGreen, fontSize: 18, fontWeight: '800', marginTop: 10 },
  subtext: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  linkRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 11,
    paddingVertical: 10,
  },
  linkIcon: {
    alignItems: 'center',
    backgroundColor: colors.paleGreen,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  linkGlyph: { color: colors.green, fontSize: 22, fontWeight: '800' },
  linkText: { flex: 1, gap: 3 },
  linkTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  chevron: { color: '#809087', fontSize: 24 },
  apiUrl: { color: colors.green, fontSize: 12, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 11, lineHeight: 17 },
});
