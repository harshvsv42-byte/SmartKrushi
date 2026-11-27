import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, ConditionCard, Loading, Notice, Page } from '../components/ui';
import { getApiErrorMessage, getJson } from '../lib/api';

const AHMEDABAD = { latitude: 23.0225, longitude: 72.5714, district: 'Ahmedabad', state: 'Gujarat' };

export default function WeatherScreen() {
  const params = useLocalSearchParams();
  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  const location = {
    latitude: Number.isFinite(latitude) ? latitude : AHMEDABAD.latitude,
    longitude: Number.isFinite(longitude) ? longitude : AHMEDABAD.longitude,
    district: typeof params.district === 'string' ? params.district : AHMEDABAD.district,
    state: AHMEDABAD.state,
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getJson('weather/details/', location));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [location.district, location.latitude, location.longitude, location.state]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const current = data?.current || {};

  return (
    <Page refreshing={loading} onRefresh={loadWeather} contentStyle={styles.pageContent}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#16211A" />
        </Pressable>
        <Text style={styles.headerTitle}>હવામાન વિગતો</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Location Details Card */}
      <Card style={styles.locationCard}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={22} color="#16211A" style={{ marginTop: 1 }} />
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationTitle}>{data?.location?.district || 'Ahmedabad'}, India</Text>
            <Text style={styles.coordsText}>
              {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
            </Text>
          </View>
        </View>
      </Card>

      {loading && !data ? <Loading label="હવામાન લોડ થઈ રહ્યું છે…" /> : null}
      {error ? <Notice title="હવામાન ઉપલબ્ધ નથી" message={error} onRetry={loadWeather} /> : null}

      {/* Main Weather Overview Card */}
      <Card style={styles.weatherCard}>
        <View style={styles.weatherMainRow}>
          <View style={styles.weatherLeft}>
            <Text style={styles.conditionTitle}>{current.weather_condition || 'Clear'}</Text>
            <Text style={styles.giantTemp}>
              +{current.temperature != null ? Math.round(current.temperature) : 33}
              <Text style={styles.tempUnit}>°C</Text>
            </Text>
          </View>

          <View style={styles.weatherRight}>
            <View style={styles.sunCloudIcon}>
              <View style={styles.sunCircle} />
              <Ionicons name="cloud" size={44} color="#A3D9F8" style={styles.cloudIcon} />
            </View>
            <View style={styles.tempStatsCol}>
              <Text style={styles.tempStatText}>
                Feels like {current.feels_like != null ? Math.round(current.feels_like) : 35}°C
              </Text>
              <Text style={styles.tempStatText}>
                H: {current.temp_max != null ? Math.round(current.temp_max) : 36}°C
              </Text>
              <Text style={styles.tempStatText}>
                L: {current.temp_min != null ? Math.round(current.temp_min) : 25}°C
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Section: Current Conditions */}
      <Text style={styles.sectionTitle}>વર્તમાન સ્થિતિ</Text>

      {/* 4 Grid Cards */}
      <View style={styles.gridContainer}>
        {/* Card 1: ભેજ */}
        <ConditionCard
          iconName="water-outline"
          iconType="ionicons"
          label="ભેજ"
          value={current.humidity != null ? `${current.humidity}%` : '38%'}
        />

        {/* Card 2: પવનની ઝડપ */}
        <ConditionCard
          iconName="wind"
          iconType="feather"
          label="પવનની ઝડપ"
          value={current.wind_speed != null ? `${current.wind_speed} km/h` : '6 km/h'}
        />

        {/* Card 3: દબાણ */}
        <ConditionCard
          iconName="speedometer-outline"
          iconType="ionicons"
          label="દબાણ"
          value={current.pressure != null ? `${current.pressure} hPa` : '1008 hPa'}
        />

        {/* Card 4: વરસાદ */}
        <ConditionCard
          iconName="cloud-outline"
          iconType="ionicons"
          label="વરસાદ"
          value={current.rainfall_mm != null ? `${current.rainfall_mm} mm` : '0 mm'}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
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
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  locationTextWrap: {
    gap: 2,
  },
  locationTitle: {
    color: '#16211A',
    fontSize: 18,
    fontWeight: '800',
  },
  coordsText: {
    color: '#718278',
    fontSize: 13,
    fontWeight: '500',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  weatherMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    justifyContent: 'center',
  },
  conditionTitle: {
    color: '#16211A',
    fontSize: 20,
    fontWeight: '800',
  },
  giantTemp: {
    color: '#16211A',
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 60,
    marginTop: 10,
  },
  tempUnit: {
    fontSize: 26,
    fontWeight: '600',
  },
  weatherRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  sunCloudIcon: {
    width: 68,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCircle: {
    position: 'absolute',
    right: 4,
    top: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB300',
  },
  cloudIcon: {
    position: 'absolute',
    left: 2,
    bottom: 0,
  },
  tempStatsCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tempStatText: {
    color: '#697770',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#16211A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

