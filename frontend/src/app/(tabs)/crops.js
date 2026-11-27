import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Page } from '../../components/ui';
import { getJson, getApiErrorMessage } from '../../lib/api';

const FALLBACK_CROPS = [
  {
    id: '1',
    title: 'કપાસ પાક',
    weatherTag: 'Sunny, 34°C',
    district: 'Ahmedabad',
    cropTag: 'કપાસ',
    soilType: 'માટીનો પ્રકાર: રેતાળ ગોરાડુ માટી',
    season: 'June - Early → November - Late',
  },
  {
    id: '2',
    title: 'મકાઈ પાક',
    weatherTag: 'Warm, 31°C',
    district: 'Ahmedabad',
    cropTag: 'મકાઈ',
    soilType: 'માટીનો પ્રકાર: રેતાળ કાંપ માટી',
    season: 'June - Mid → October - Early',
  },
  {
    id: '3',
    title: 'સૂર્યમુખી પાક',
    weatherTag: 'Bright, 33°C',
    district: 'Ahmedabad',
    cropTag: 'સૂર્યમુખી',
    soilType: 'માટીનો પ્રકાર: કાંપ વાળી ગોરાડુ માટી',
    season: 'January - Early → April - Late',
  },
];

export default function CropsScreen() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJson('crops/');
      const list = data.results || data || [];
      if (Array.isArray(list) && list.length > 0) {
        const formatted = list.map((item) => ({
          id: String(item.id),
          title: `${item.name_gu || item.name || item.crop_name || 'પાક'} પાક`,
          weatherTag: `${item.season_gu || item.growing_season || 'Kharif'}, 32°C`,
          district: item.display_category || item.crop_category || 'Gujarat',
          cropTag: item.name_gu || item.name || item.crop_name || 'પાક',
          soilType: `માટીનો પ્રકાર: ${item.suitable_soil || item.soil_requirements?.soil_type || 'ગોરાડુ માટી'}`,
          season: item.sowing_period || item.growing_season || 'June - November',
        }));
        setCrops(formatted);
      } else {
        setCrops(FALLBACK_CROPS);
      }
    } catch (err) {
      setCrops(FALLBACK_CROPS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const displayList = crops.length > 0 ? crops : FALLBACK_CROPS;

  return (
    <Page contentStyle={styles.pageContent}>
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
        <Text style={styles.headerTitle}>પાક માહિતી</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Location Tag Banner */}
      <View style={styles.locationBanner}>
        <Ionicons name="location-outline" size={17} color="#074E2B" />
        <Text style={styles.locationBannerText}>Ahmedabad</Text>
      </View>

      {/* Title */}
      <Text style={styles.sectionTitle}>એક પાક પસંદ કરો</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#074E2B" style={{ marginVertical: 10 }} />
      ) : null}

      {/* Crop Cards */}
      {displayList.map((crop) => (
        <Pressable
          key={crop.id}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/crop/[id]', params: { id: crop.id } })}
          style={({ pressed }) => [styles.cropCardPressable, pressed && styles.pressed]}
        >
          <Card style={styles.cropCard}>
            {/* Top Row: Title & Weather Tag */}
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cropTitle}>{crop.title}</Text>
              <Text style={styles.weatherTag}>{crop.weatherTag}</Text>
            </View>

            {/* Subtitle & Tag */}
            <View style={styles.subRow}>
              <Text style={styles.districtText}>{crop.district}</Text>
              <Text style={styles.cropTag}>{crop.cropTag}</Text>
            </View>

            {/* Soil Type */}
            <Text style={styles.soilTypeText}>{crop.soilType}</Text>

            {/* Season Range */}
            <Text style={styles.seasonText}>{crop.season}</Text>
          </Card>
        </Pressable>
      ))}
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
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F3EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  locationBannerText: {
    color: '#074E2B',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#16211A',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  cropCardPressable: {
    borderRadius: 22,
  },
  cropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E7EDE8',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropTitle: {
    color: '#16211A',
    fontSize: 19,
    fontWeight: '800',
  },
  weatherTag: {
    color: '#16211A',
    fontSize: 14,
    fontWeight: '700',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  districtText: {
    color: '#697770',
    fontSize: 14,
    fontWeight: '500',
  },
  cropTag: {
    color: '#697770',
    fontSize: 13,
    fontWeight: '600',
  },
  soilTypeText: {
    color: '#697770',
    fontSize: 14,
    marginTop: 2,
  },
  seasonText: {
    color: '#074E2B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});

