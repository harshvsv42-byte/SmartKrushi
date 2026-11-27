import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, Notice } from '../../components/ui';
import { getApiErrorMessage, getJson } from '../../lib/api';

const DEFAULT_LOCATION = {
  latitude: 23.0225,
  longitude: 72.5714,
  district: 'Ahmedabad',
};

const DISTRICTS = [
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Rajkot', latitude: 22.3039, longitude: 70.8022 },
  { name: 'Surat', latitude: 21.1702, longitude: 72.8311 },
  { name: 'Vadodara', latitude: 22.3072, longitude: 73.1812 },
  { name: 'Junagadh', latitude: 21.5222, longitude: 70.4579 },
  { name: 'Amreli', latitude: 21.6032, longitude: 71.2221 },
  { name: 'Mehsana', latitude: 23.5880, longitude: 72.3693 },
  { name: 'Bhavnagar', latitude: 21.7645, longitude: 72.1519 },
  { name: 'Jamnagar', latitude: 22.4707, longitude: 70.0577 },
  { name: 'Anand', latitude: 22.5645, longitude: 72.9289 },
  { name: 'Gandhinagar', latitude: 23.2156, longitude: 72.6369 },
];

export default function HomeScreen() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const loadWeather = useCallback(async (target = location) => {
    setLoadingWeather(true);
    setWeatherError('');
    try {
      const data = await getJson('weather/current/', {
        latitude: target.latitude,
        longitude: target.longitude,
        district: target.district,
      });
      setWeather(data);
    } catch (error) {
      setWeatherError(getApiErrorMessage(error));
    } finally {
      setLoadingWeather(false);
    }
  }, [location]);

  useEffect(() => {
    loadWeather(location);
  }, [location]);

  const handleSelectLocation = (dist) => {
    const newLoc = {
      district: dist.name,
      latitude: dist.latitude,
      longitude: dist.longitude,
    };
    setLocation(newLoc);
    setLocationModalVisible(false);
  };

  const openWeather = () => {
    router.push({
      pathname: '/weather',
      params: {
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        district: location.district,
      },
    });
  };

  const openSoil = () => {
    router.push({
      pathname: '/soil',
      params: {
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        district: location.district,
      },
    });
  };

  const openCategory = (cat) => {
    if (cat === 'માટી') {
      openSoil();
    } else if (cat === 'સમયગાળો') {
      router.push('/crops');
    } else if (cat === 'ઓછું જોખમ') {
      router.push('/market');
    } else if (cat === 'સુરક્ષા') {
      router.push('/diagnose');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark Green Header Section */}
        <View style={styles.headerContainer}>
          {/* Top greeting & profile row */}
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.push('/profile')}
              accessibilityRole="button"
              style={styles.greetingWrap}
            >
              <Text style={styles.greetingTitle}>નમસ્તે, સુપ્રભાત</Text>
              <View style={styles.datePickerRow}>
                <Text style={styles.dateText}>શનિવાર, 10 ઑક્ટોબર, 2026</Text>
                <Feather name="chevron-down" size={14} color="#D2E4D9" style={{ marginLeft: 3 }} />
              </View>
            </Pressable>

            <View style={styles.headerRightActions}>
              <View style={styles.langBadge}>
                <Text style={styles.langText}>GU</Text>
              </View>
              <Pressable
                onPress={() => router.push('/profile')}
                accessibilityRole="button"
                accessibilityLabel="Open User Profile"
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' }}
                  style={styles.avatarImg}
                />
              </Pressable>
            </View>
          </View>

          {/* Location button - Opens Location Selector Modal */}
          <Pressable
            onPress={() => setLocationModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Change Location"
            style={styles.locationPill}
          >
            <Ionicons name="location-outline" size={15} color="#FFFFFF" />
            <Text style={styles.locationPillText}>{location.district} (સ્થાન બદલો)</Text>
          </Pressable>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={19} color="#9DBAA9" />
            <TextInput
              placeholder="અહીં શોધો..."
              placeholderTextColor="#81A690"
              style={styles.searchInput}
            />
            <Feather name="mic" size={18} color="#9DBAA9" />
          </View>
        </View>


        {/* Main Content Area */}
        <View style={styles.bodyContent}>
          {/* Weather Card */}
          <Pressable
            accessibilityRole="button"
            onPress={openWeather}
            style={({ pressed }) => [styles.weatherCard, pressed && styles.cardPressed]}
          >
            {/* Top row with location & temperature */}
            <View style={styles.weatherTopRow}>
              <View style={styles.tempCol}>
                <View style={styles.weatherLocRow}>
                  <Ionicons name="location-outline" size={17} color="#202A24" />
                  <Text style={styles.weatherLocText}>{weather?.district || location.district}</Text>
                </View>
                <Text style={styles.giantTemp}>
                  +{weather?.temperature != null ? Math.round(weather.temperature) : 33}
                  <Text style={styles.tempUnit}>°C</Text>
                </Text>
              </View>

              {/* Sun/Cloud Graphic & High/Low */}
              <View style={styles.weatherIconCol}>
                <View style={styles.sunCloudGraphic}>
                  <View style={styles.sunCircle} />
                  <View style={styles.cloudShape}>
                    <Ionicons name="cloud" size={38} color="#9FD4F6" />
                  </View>
                </View>
                <View style={styles.highLowWrap}>
                  <Text style={styles.highLowText}>H: 36°C</Text>
                  <Text style={styles.highLowText}>L: 25°C</Text>
                </View>
              </View>
            </View>

            {/* Dotted divider */}
            <View style={styles.dottedLine} />

            {/* 4 Grid Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>ભેજ</Text>
                <Text style={styles.metricValue}>{weather?.humidity != null ? `${weather.humidity}%` : '38%'}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>વરસાદ</Text>
                <Text style={styles.metricValue}>{weather?.rainfall != null ? `${weather.rainfall}ml` : '0ml'}</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>દબાણ</Text>
                <Text style={styles.metricValue}>{weather?.pressure != null ? `${weather.pressure} hpa` : '1008 hpa'}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>પવનની ઝડપ</Text>
                <Text style={styles.metricValue}>{weather?.wind_speed != null ? `${weather.wind_speed}m/s` : '6m/s'}</Text>
              </View>
            </View>

            {/* Sunrise / Sunset Arc */}
            <View style={styles.arcContainer}>
              <View style={styles.arcLabelWrap}>
                <Text style={styles.arcTime}>6:34 AM</Text>
                <Text style={styles.arcSub}>સૂર્યોદય</Text>
              </View>

              <View style={styles.arcCurveWrap}>
                <View style={styles.arcDashedLine} />
                <View style={styles.sunIconBadge}>
                  <Ionicons name="sunny" size={18} color="#FFB300" />
                </View>
              </View>

              <View style={styles.arcLabelWrap}>
                <Text style={styles.arcTime}>6:18 PM</Text>
                <Text style={styles.arcSub}>સૂર્યાસ્ત</Text>
              </View>
            </View>
          </Pressable>

          {weatherError ? (
            <Notice title="હવામાન લોડ થયું નથી" message={weatherError} onRetry={() => loadWeather()} />
          ) : null}

          {/* Categories Header */}
          <Text style={styles.sectionHeading}>કેટેગરી પ્રમાણે રોકાણ</Text>

          {/* 4 Category Grid Cards */}
          <View style={styles.categoryGrid}>
            {/* Card 1: સમયગાળો */}
            <Pressable
              onPress={() => openCategory('સમયગાળો')}
              style={({ pressed }) => [styles.categoryCard, pressed && styles.cardPressed]}
            >
              <View style={[styles.catIconBadge, { backgroundColor: '#E4F2FA' }]}>
                <Ionicons name="time" size={24} color="#0288D1" />
              </View>
              <Text style={styles.categoryTitle}>સમયગાળો</Text>
            </Pressable>

            {/* Card 2: માટી (SOIL) - OPENS SOIL DETAILS */}
            <Pressable
              onPress={() => openCategory('માટી')}
              style={({ pressed }) => [styles.categoryCard, pressed && styles.cardPressed]}
            >
              <View style={[styles.catIconBadge, { backgroundColor: '#E2F3E7' }]}>
                <FontAwesome5 name="seedling" size={20} color="#0B5D34" />
              </View>
              <Text style={styles.categoryTitle}>માટી</Text>
            </Pressable>

            {/* Card 3: ઓછું જોખમ */}
            <Pressable
              onPress={() => openCategory('ઓછું જોખમ')}
              style={({ pressed }) => [styles.categoryCard, pressed && styles.cardPressed]}
            >
              <View style={[styles.catIconBadge, { backgroundColor: '#F0EBF7' }]}>
                <MaterialCommunityIcons name="briefcase-variant-outline" size={24} color="#0288D1" />
              </View>
              <Text style={styles.categoryTitle}>ઓછું જોખમ</Text>
            </Pressable>

            {/* Card 4: સુરક્ષા */}
            <Pressable
              onPress={() => openCategory('સુરક્ષા')}
              style={({ pressed }) => [styles.categoryCard, pressed && styles.cardPressed]}
            >
              <View style={[styles.catIconBadge, { backgroundColor: '#E2F3E7' }]}>
                <MaterialCommunityIcons name="shield-check-outline" size={24} color="#0B5D34" />
              </View>
              <Text style={styles.categoryTitle}>સુરક્ષા</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>


      {/* Location Selector Modal */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>જિલ્લો પસંદ કરો (Select District)</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {DISTRICTS.map((dist) => {
                const isSelected = location.district === dist.name;
                return (
                  <TouchableOpacity
                    key={dist.name}
                    onPress={() => handleSelectLocation(dist)}
                    style={[styles.districtItem, isSelected && styles.districtItemSelected]}
                  >
                    <Text style={[styles.districtTextItem, isSelected && styles.districtTextSelected]}>
                      {dist.name} (Gujarat)
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#074E2B" />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#A0ACA5" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#074E2B',
  },
  scrollContent: {
    backgroundColor: '#F3F5F4',
  },
  headerContainer: {
    backgroundColor: '#074E2B',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingWrap: {
    gap: 2,
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#D2E4D9',
    fontSize: 13,
    fontWeight: '500',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langBadge: {
    backgroundColor: '#0D683B',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#19804B',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
    gap: 5,
  },
  locationPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#053E22',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    padding: 0,
  },
  bodyContent: {
    backgroundColor: '#F3F5F4',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.995 }],
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempCol: {
    justifyContent: 'center',
  },
  weatherLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherLocText: {
    color: '#1C2721',
    fontSize: 16,
    fontWeight: '800',
  },
  giantTemp: {
    color: '#16231C',
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    marginTop: 4,
  },
  tempUnit: {
    fontSize: 24,
    fontWeight: '600',
  },
  weatherIconCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sunCloudGraphic: {
    width: 60,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCircle: {
    position: 'absolute',
    right: 6,
    top: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB300',
  },
  cloudShape: {
    position: 'absolute',
    left: 2,
    bottom: 2,
  },
  highLowWrap: {
    alignItems: 'flex-end',
  },
  highLowText: {
    color: '#697770',
    fontSize: 13,
    fontWeight: '600',
  },
  dottedLine: {
    borderWidth: 0.6,
    borderColor: '#E3EBE6',
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    color: '#697770',
    fontSize: 12,
  },
  metricValue: {
    color: '#16231C',
    fontSize: 15,
    fontWeight: '800',
  },
  arcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  arcLabelWrap: {
    alignItems: 'center',
  },
  arcTime: {
    color: '#16231C',
    fontSize: 13,
    fontWeight: '800',
  },
  arcSub: {
    color: '#697770',
    fontSize: 11,
  },
  arcCurveWrap: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  arcDashedLine: {
    position: 'absolute',
    width: '100%',
    height: 24,
    borderTopWidth: 2,
    borderColor: '#C5D6CC',
    borderStyle: 'dashed',
    borderRadius: 20,
    top: 8,
  },
  sunIconBadge: {
    backgroundColor: '#FFF9E6',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    top: -4,
  },
  sectionHeading: {
    color: '#16231C',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E7EDE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  catIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    color: '#16231C',
    fontSize: 14,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7EDE8',
  },
  modalTitle: {
    color: '#074E2B',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    color: '#697770',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 4,
  },
  modalList: {
    marginTop: 12,
  },
  districtItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: '#F8FAF9',
  },

  districtItemSelected: {
    backgroundColor: '#E7F3EC',
    borderWidth: 1,
    borderColor: '#074E2B',
  },
  districtTextItem: {
    color: '#16231C',
    fontSize: 15,
    fontWeight: '600',
  },
  districtTextSelected: {
    color: '#074E2B',
    fontWeight: '800',
  },
});


