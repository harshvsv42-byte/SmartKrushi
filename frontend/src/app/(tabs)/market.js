import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Card,
  colors,
  Heading,
  Loading,
  Metric,
  Notice,
  Page,
  SectionTitle,
} from '../../components/ui';
import { getApiErrorMessage, getJson } from '../../lib/api';

export default function MarketScreen() {
  const [statistics, setStatistics] = useState(null);
  const [crops, setCrops] = useState([]);
  const [statsError, setStatsError] = useState('');
  const [cropsError, setCropsError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setStatsError('');
    setCropsError('');
    const [statsResult, cropsResult] = await Promise.allSettled([
      getJson('dashboard/crop-statistics/'),
      getJson('crops/'),
    ]);

    if (statsResult.status === 'fulfilled') {
      setStatistics(statsResult.value);
    } else {
      setStatsError(getApiErrorMessage(statsResult.reason));
    }

    if (cropsResult.status === 'fulfilled') {
      const data = cropsResult.value;
      setCrops(Array.isArray(data) ? data : data?.results || []);
    } else {
      setCropsError(getApiErrorMessage(cropsResult.reason));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const topCrops = statistics?.top_crops_by_production || [];

  return (
    <Page refreshing={loading} onRefresh={loadData}>
      <Heading title="બજાર અને ખેતી માહિતી" subtitle="ઉપલબ્ધ પાક અને ઉત્પાદન માહિતી" />

      <Card>
        <SectionTitle>પાક ઉત્પાદનના આંકડા</SectionTitle>
        {loading && !statistics ? <Loading label="આંકડા લોડ થઈ રહ્યા છે…" /> : null}
        {statsError ? (
          <Notice title="આંકડા ઉપલબ્ધ નથી" message={statsError} onRetry={loadData} />
        ) : null}
        {statistics ? (
          <>
            <View style={styles.metrics}>
              <Metric label="માસ્ટર પાક" value={statistics.total_master_crops ?? '—'} />
              <Metric label="ઉત્પાદન નોંધ" value={statistics.top_crops_by_production?.length ?? '—'} />
            </View>
            {topCrops.length ? (
              <View style={styles.list}>
                {topCrops.slice(0, 5).map((crop, index) => (
                  <View key={`${crop.crop_name}-${index}`} style={styles.listRow}>
                    <View style={styles.rank}><Text style={styles.rankText}>{index + 1}</Text></View>
                    <Text style={styles.cropName}>{crop.crop_name || '—'}</Text>
                    <Text style={styles.production}>
                      {crop.total_production != null ? `${crop.total_production} t` : '—'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.muted}>હાલમાં ઉત્પાદનના રેકોર્ડ ઉપલબ્ધ નથી.</Text>
            )}
          </>
        ) : null}
      </Card>

      <Card>
        <SectionTitle>હાલ ઉપલબ્ધ પાક</SectionTitle>
        {loading && !crops.length ? <Loading label="પાકની માહિતી લોડ થઈ રહી છે…" /> : null}
        {cropsError ? <Notice title="પાક લોડ થયા નથી" message={cropsError} onRetry={loadData} /> : null}
        {!cropsError && crops.slice(0, 8).map((crop) => (
          <View key={crop.id} style={styles.cropRow}>
            <Text style={styles.cropName}>{crop.crop_name || 'પાક'}</Text>
            <Text style={styles.muted}>{crop.growing_season || 'મોસમ ઉપલબ્ધ નથી'}</Text>
          </View>
        ))}
      </Card>

      <Notice
        title="લાઇવ બજાર ભાવ ઉપલબ્ધ નથી"
        message="આ પ્રોજેક્ટના backend માં હાલમાં market price અને government scheme API નથી. અહીં બતાવેલા આંકડા backend ના પાક ઉત્પાદન રેકોર્ડ છે; તે આજના બજાર ભાવ નથી."
        tone="warning"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 9 },
  list: { gap: 9 },
  listRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 9,
  },
  rank: {
    alignItems: 'center',
    backgroundColor: colors.paleGreen,
    borderRadius: 10,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  rankText: { color: colors.green, fontSize: 12, fontWeight: '800' },
  cropName: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '700' },
  production: { color: colors.green, fontSize: 12, fontWeight: '800' },
  cropRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  muted: { color: colors.muted, fontSize: 12 },
});
