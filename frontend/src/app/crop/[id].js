import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Loading, Notice, Page } from '../../components/ui';
import { getApiErrorMessage, getJson } from '../../lib/api';

const DEFAULT_CROP = {
  title: 'કપાસ પાક',
  region: 'Ahmedabad',
  weather: 'Sunny, 34°C',
  mainCrop: 'કપાસ',
  soilType: 'રેતાળ ગોરાડુ માટી',
  recommendation: 'સ્થિર pH અને પૂરા મોસમની સિંચાઈ સાથે ઉચ્ચ ઉપજ આપતો કપાસ પાક.',
  rainfall: '12 mm',
  humidity: '62%',
  ph: '6.8',
  irrigation: 'સાધારણ',
};

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams();
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCrop = useCallback(async () => {
    if (!id || id === 'cotton' || id === 'maize' || id === 'sunflower' || id === 'vegetables' || id === 'spices') {
      setCrop(DEFAULT_CROP);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getJson(`crops/${encodeURIComponent(String(id))}/`);
      setCrop({
        title: `${data.crop_name || 'કપાસ'} પાક`,
        region: 'Ahmedabad',
        weather: 'Sunny, 34°C',
        mainCrop: data.crop_name || 'કપાસ',
        soilType: data.suitable_soil || 'રેતાળ ગોરાડુ માટી',
        recommendation: data.crop_description || 'સ્થિર pH અને પૂરા મોસમની સિંચાઈ સાથે ઉચ્ચ ઉપજ આપતો કપાસ પાક.',
        rainfall: '12 mm',
        humidity: '62%',
        ph: String(data.suitable_ph_min || '6.8'),
        irrigation: data.water_requirement || 'સાધારણ',
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      setCrop(DEFAULT_CROP);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCrop();
  }, [loadCrop]);

  const display = crop || DEFAULT_CROP;

  return (
    <Page contentStyle={styles.pageContent}>
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
        <Text style={styles.headerTitle}>{display.title}</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? <Loading label="પાકની વિગતો લોડ થઈ રહી છે…" /> : null}
      {error ? <Notice title="વિગતો લોડ થઈ નથી" message={error} onRetry={loadCrop} tone="warning" /> : null}

      {/* Card 1: પ્રદેશ */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>પ્રદેશ</Text>
        <Text style={styles.cardValue}>{display.region}</Text>
      </Card>

      {/* Card 2: હવામાન */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>હવામાન</Text>
        <Text style={styles.cardValue}>{display.weather}</Text>
      </Card>

      {/* Card 3: મુખ્ય પાક */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>મુખ્ય પાક</Text>
        <Text style={styles.cardValue}>{display.mainCrop}</Text>
      </Card>

      {/* Card 4: માટીનો પ્રકાર */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>માટીનો પ્રકાર</Text>
        <Text style={styles.cardValue}>{display.soilType}</Text>
      </Card>

      {/* Card 5: ભલામણો */}
      <Card style={styles.infoCard}>
        <Text style={styles.cardLabel}>ભલામણો</Text>
        <Text style={styles.recommendationText}>{display.recommendation}</Text>
      </Card>

      {/* 2-Column Row 1: વરસાદ & ભેજ */}
      <View style={styles.gridRow}>
        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>વરસાદ</Text>
          <Text style={styles.cardValue}>{display.rainfall}</Text>
        </Card>

        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>ભેજ</Text>
          <Text style={styles.cardValue}>{display.humidity}</Text>
        </Card>
      </View>

      {/* 2-Column Row 2: pH & સિંચાઈ */}
      <View style={styles.gridRow}>
        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>pH</Text>
          <Text style={styles.cardValue}>{display.ph}</Text>
        </Card>

        <Card style={[styles.infoCard, styles.halfCard]}>
          <Text style={styles.cardLabel}>સિંચાઈ</Text>
          <Text style={styles.cardValue}>{display.irrigation}</Text>
        </Card>
      </View>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E7EDE8',
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
  recommendationText: {
    color: '#16211A',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
});

