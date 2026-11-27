import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ActionButton,
  Card,
  colors,
  Heading,
  Loading,
  Notice,
  Page,
  SectionTitle,
} from '../../components/ui';
import { getApiErrorMessage, postForm } from '../../lib/api';

export default function DiagnoseScreen() {
  const [photo, setPhoto] = useState(null);
  const [cropName, setCropName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectPhoto = async (useCamera) => {
    setError('');
    const picker = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
    if (!picker.canceled && picker.assets?.[0]) {
      setPhoto(picker.assets[0]);
      setResult(null);
    }
  };

  const submitPhoto = async () => {
    if (!photo?.uri) {
      setError('પહેલા પાકના પાનનો ફોટો પસંદ કરો.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const name = photo.fileName || photo.uri.split('/').pop() || 'crop-photo.jpg';
      const response = await postForm('diseases/detect-ai/', {
        image: {
          uri: photo.uri,
          name,
          type: photo.mimeType || 'image/jpeg',
        },
        crop_name: cropName.trim() || undefined,
      });
      setResult(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const diagnosis = result?.preliminary_diagnostics;

  return (
    <Page>
      <Heading title="પાકનું નિદાન" subtitle="પાનનો સ્પષ્ટ ફોટો પસંદ કરીને પ્રાથમિક માર્ગદર્શન મેળવો" />

      <Card>
        <SectionTitle>પાકનો ફોટો</SectionTitle>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoGlyph}>✿</Text>
            <Text style={styles.photoHint}>રોગના લક્ષણો દેખાતાં પાનનો ફોટો પસંદ કરો</Text>
          </View>
        )}
        <View style={styles.buttonRow}>
          <View style={styles.buttonCell}>
            <ActionButton title="ફોટો પસંદ કરો" secondary onPress={() => selectPhoto(false)} />
          </View>
          <View style={styles.buttonCell}>
            <ActionButton title="કેમેરાથી લો" secondary onPress={() => selectPhoto(true)} />
          </View>
        </View>
        <TextInput
          accessibilityLabel="પાકનું નામ"
          onChangeText={setCropName}
          placeholder="પાકનું નામ (વૈકલ્પિક)"
          placeholderTextColor="#849188"
          style={styles.input}
          value={cropName}
        />
        <ActionButton title="ફોટો તપાસો" onPress={submitPhoto} disabled={loading || !photo} />
        {loading ? <Loading label="ફોટો backend પર મોકલાઈ રહ્યો છે…" /> : null}
        {error ? <Notice title="ફોટો તપાસી શકાયો નથી" message={error} /> : null}
      </Card>

      {result ? (
        <Card>
          <SectionTitle>પ્રાથમિક પરિણામ</SectionTitle>
          <Notice
            title="આ પરિણામ નિષ્ણાતની સલાહનો વિકલ્પ નથી"
            message="આ backend હાલમાં ફોટો સ્વીકારીને સંભવિત રોગો અને સામાન્ય માર્ગદર્શન આપે છે; સંપૂર્ણ AI મોડેલ જોડાયેલું નથી."
            tone="warning"
          />
          <Text style={styles.resultText}>
            પાક: {diagnosis?.crop_identified || cropName || 'ઓળખાયું નથી'}
          </Text>
          <Text style={styles.resultText}>
            વિશ્વાસ સ્કોર: {diagnosis?.confidence_score != null
              ? `${Math.round(diagnosis.confidence_score * 100)}%`
              : 'ઉપલબ્ધ નથી'}
          </Text>
          {diagnosis?.matched_diseases?.length ? (
            <View style={styles.resultList}>
              {diagnosis.matched_diseases.map((item) => (
                <View key={item.id || item.disease_name} style={styles.disease}>
                  <Text style={styles.diseaseName}>{item.disease_name || 'સંભવિત રોગ'}</Text>
                  {item.treatment ? <Text style={styles.resultMuted}>{item.treatment}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
          {diagnosis?.general_guidance ? (
            <Text style={styles.resultMuted}>{diagnosis.general_guidance}</Text>
          ) : null}
        </Card>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  photo: { backgroundColor: '#E7EFE9', borderRadius: 14, height: 220, width: '100%' },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#F4F8F5',
    borderColor: '#CEDDD2',
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 180,
    justifyContent: 'center',
    padding: 20,
  },
  photoGlyph: { color: colors.green, fontSize: 42 },
  photoHint: { color: colors.muted, fontSize: 13, marginTop: 8, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  buttonCell: { flex: 1 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    color: colors.text,
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 13,
  },
  resultText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  resultList: { gap: 10 },
  disease: { backgroundColor: '#F5F8F6', borderRadius: 12, gap: 5, padding: 12 },
  diseaseName: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
  resultMuted: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
