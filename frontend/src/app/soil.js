import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Loading, Notice, Page } from '../components/ui';
import { getApiErrorMessage, getJson } from '../lib/api';

const LOCATION = { latitude: 23.0225, longitude: 72.5714, district: 'Ahmedabad' };

export default function SoilScreen() {
  const params = useLocalSearchParams();
  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  const location = {
    latitude: Number.isFinite(latitude) ? latitude : LOCATION.latitude,
    longitude: Number.isFinite(longitude) ? longitude : LOCATION.longitude,
    district: typeof params.district === 'string' ? params.district : LOCATION.district,
  };
  const [soil, setSoil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSoil = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSoil(await getJson('soil/by-coordinates/', location));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [location.district, location.latitude, location.longitude]);

  useEffect(() => {
    loadSoil();
  }, [loadSoil]);

  const district = soil?.district || location.district || 'Ahmedabad';
  const nutrients = soil?.nutrients || {};

  return (
    <Page refreshing={loading} onRefresh={loadSoil} contentStyle={styles.pageContent}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#16211A" />
        </Pressable>
        <Text style={styles.headerTitle}>માટી ડેટા</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Screen Subheader */}
      <View style={styles.subheaderWrap}>
        <Text style={styles.reportTitle}>{district} માટી રિપોર્ટ</Text>
        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={16} color="#074E2B" />
          <Text style={styles.locSubtext}>{district}, India</Text>
        </View>
      </View>

      {loading && !soil ? <Loading label="માટી વિશ્લેષણ લોડ થઈ રહ્યું છે…" /> : null}
      {error ? <Notice title="માટી માહિતી ઉપલબ્ધ નથી" message={error} onRetry={loadSoil} /> : null}

      {/* Card 1: સ્થાન */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>સ્થાન</Text>
        <Text style={styles.cardValue}>{district}, India</Text>
      </Card>

      {/* Card 2: માટીનો પ્રકાર */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>માટીનો પ્રકાર</Text>
        <Text style={styles.cardValue}>
          {soil?.soil_type || soil?.soil_classification || 'રેતાળ ગોરાડુ માટી'}
        </Text>
      </Card>

      {/* Card Row: pH & ભેજ */}
      <View style={styles.gridRow}>
        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>pH</Text>
          <Text style={styles.cardValue}>{soil?.soil_ph ?? 7.2}</Text>
        </Card>

        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>ભેજ</Text>
          <Text style={styles.cardValue}>
            {soil?.moisture_percentage != null ? `${soil.moisture_percentage}%` : '24%'}
          </Text>
        </Card>
      </View>

      {/* Card 5: નાઇટ્રોજન */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>નાઇટ્રોજન</Text>
        <Text style={styles.cardValue}>
          {nutrients.nitrogen?.value ? `${nutrients.nitrogen.value} mg/kg` : '18 mg/kg'}
        </Text>
      </Card>

      {/* Card 6: ફોસ્ફરસ */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>ફોસ્ફરસ</Text>
        <Text style={styles.cardValue}>
          {nutrients.phosphorus?.value ? `${nutrients.phosphorus.value} mg/kg` : '12 mg/kg'}
        </Text>
      </Card>

      {/* Card 7: પોટેશિયમ */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>પોટેશિયમ</Text>
        <Text style={styles.cardValue}>
          {nutrients.potassium?.value ? `${nutrients.potassium.value} mg/kg` : '110 mg/kg'}
        </Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  topHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    alignItems: 'center',
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pressed: { opacity: 0.6 },
  headerTitle: {
    color: '#16211A',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subheaderWrap: {
    gap: 4,
    marginVertical: 4,
  },
  reportTitle: {
    color: '#074E2B',
    fontSize: 22,
    fontWeight: '800',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locSubtext: {
    color: '#697770',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E7EDE8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardLabel: {
    color: '#697770',
    fontSize: 13,
    fontWeight: '600',
  },
  cardValue: {
    color: '#16211A',
    fontSize: 20,
    fontWeight: '800',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
});

