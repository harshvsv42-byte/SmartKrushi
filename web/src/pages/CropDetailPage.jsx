import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  Thermometer,
  Droplets,
  Sprout,
  ShieldAlert,
  Bug,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cropApi } from '../api/services';
import {
  translateTimelineText,
  translateCropName,
  translateSeason,
  translateStatus,
  translateSuitableSoil,
  normalizeLang,
} from '../utils/translateData';

const CropDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { selectedLanguage } = useApp();
  const lang = normalizeLang(selectedLanguage || i18n.language);

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCropDetails = () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    cropApi
      .getDetails(id, selectedLanguage)
      .then((res) => {
        if (res.data) {
          setCrop(res.data);
        } else {
          setError('પાક વિગતો મળી નથી.');
        }
      })
      .catch((err) => {
        console.error('Failed to load crop details:', err);
        setError('પાક વિગતો લોડ કરવામાં સમસ્યા આવી.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCropDetails();
  }, [id, selectedLanguage]);

  if (loading) {
    return (
      <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#0B5D34] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[14px] font-bold text-gray-700">સંપૂર્ણ પાક વિગતો લોડ થઈ રહી છે...</p>
        <p className="text-[12px] text-gray-400 mt-1">Django એગ્રીકલ્ચર ડેટાબેઝ</p>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="w-full bg-[#F0F4F1] min-h-screen p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        <h2 className="text-[16px] font-bold text-gray-800 mb-1">{error || 'પાક મળ્યો નથી'}</h2>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={fetchCropDetails}
            className="px-4 py-2 bg-[#0B5D34] text-white text-[12px] font-bold rounded-xl"
          >
            ફરી પ્રયાસ કરો
          </button>
          <button
            type="button"
            onClick={() => navigate('/crops')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-[12px] font-semibold rounded-xl"
          >
            પાક યાદી પર પાછા જાઓ
          </button>
        </div>
      </div>
    );
  }

  const displayName = translateCropName(crop.display_name || crop.crop_name, lang);
  const categoryName = crop.display_category || crop.crop_category;
  const seasonName = translateSeason(crop.display_season || crop.growing_season, lang);
  const duration = crop.crop_duration_days || 120;
  const timeline = crop.timeline || {};
  const soilReq = crop.soil_requirements || {};
  const tempReq = crop.temperature_requirements || {};
  const waterReq = crop.water_requirements || {};
  const diseaseInfo = crop.disease_and_pest_info || {};

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20">
      
      {/* Top Header */}
      <header className="bg-[#0B5D34] text-white pt-4 pb-8 px-4 rounded-b-[32px] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="પાછા જાઓ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-200/90 bg-emerald-800/60 px-3 py-1 rounded-full">
            {categoryName}
          </span>

          <button
            type="button"
            onClick={fetchCropDetails}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="રીફ્રેશ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-center">
          <h1 className="text-[24px] font-extrabold tracking-tight">
            {displayName}
          </h1>
          {crop.scientific_name && (
            <p className="text-[12px] text-emerald-200/80 italic mt-0.5">
              {crop.scientific_name}
            </p>
          )}
        </div>
      </header>

      {/* Main Details Body */}
      <div className="px-4 -mt-5 space-y-4">

        {/* 1. Quick Info Pills Row */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-150/70 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-100/60">
            <span className="text-[10px] text-emerald-800 font-semibold block">ઋતુ (Season)</span>
            <span className="text-[12px] font-extrabold text-[#0B5D34] mt-0.5 block truncate">
              {seasonName}
            </span>
          </div>

          <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-100/60">
            <span className="text-[10px] text-amber-800 font-semibold block">સમયગાળો (Duration)</span>
            <span className="text-[12px] font-extrabold text-amber-900 mt-0.5 block truncate">
              {duration} દિવસ
            </span>
          </div>

          <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-100/60">
            <span className="text-[10px] text-blue-800 font-semibold block">પાણી જરૂરિયાત</span>
            <span className="text-[12px] font-extrabold text-blue-900 mt-0.5 block truncate">
              {translateStatus(crop.water_requirement || 'Medium', lang)}
            </span>
          </div>
        </div>

        {/* 2. Crop Description / Overview */}
        {crop.crop_description && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
            <h3 className="text-[13px] font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>પાક પરિચય (Crop Overview)</span>
            </h3>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              {crop.crop_description}
            </p>
          </div>
        )}

        {/* 3. Cultivation Timeline (સમયગાળો & તબક્કા) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
          <h3 className="text-[14px] font-extrabold text-[#0B3B24] tracking-tight mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0B5D34]" />
            <span>
              {lang === 'en' ? 'Crop Duration & Cultivation Timeline' : lang === 'hi' ? 'फसल अवधि और खेती समयसारणी' : 'પાક સમયગાળો અને ખેતી સમયપત્રક'}
            </span>
          </h3>

          <div className="space-y-2.5">
            {/* Sowing Period */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0B5D34] flex items-center justify-center font-bold text-[12px] shrink-0">
                ૧
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'en' ? 'Sowing Time' : lang === 'hi' ? 'बुवाई का समय' : 'વાવણી સમય'}
                </span>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">
                  {translateTimelineText(timeline.sowing_period || crop.sowing_period || 'June - July', lang)}
                </p>
              </div>
            </div>

            {/* Germination Phase */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[12px] shrink-0">
                ૨
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'en' ? 'Germination Period' : lang === 'hi' ? 'अंकुरण अवधि' : 'અંકુરણ સમય'}
                </span>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">
                  {translateTimelineText(timeline.germination_period || '5 - 10 days', lang)}
                </p>
              </div>
            </div>

            {/* Vegetative Growth */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[12px] shrink-0">
                ૩
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'en' ? 'Growing Period' : lang === 'hi' ? 'विकास अवधि' : 'વિકાસ તબક્કો'}
                </span>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">
                  {translateTimelineText(timeline.growing_period || `${duration - 40} days`, lang)}
                </p>
              </div>
            </div>

            {/* Harvesting Time */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[12px] shrink-0">
                ૪
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'en' ? 'Harvest Period' : lang === 'hi' ? 'कटाई का समय' : 'કાપણી સમય'}
                </span>
                <p className="text-[13px] font-extrabold text-gray-900 mt-0.5">
                  {translateTimelineText(timeline.harvesting_period || crop.harvesting_period || 'October - November', lang)}
                </p>
              </div>
            </div>

            {/* Total Duration Summary */}
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-center">
              <span className="text-[11px] text-emerald-800 font-semibold block">
                {lang === 'en' ? 'Total Crop Duration' : lang === 'hi' ? 'कुल फसल अवधि' : 'કુલ પાક સમયગાળો'}
              </span>
              <span className="text-[16px] font-extrabold text-[#0B5D34]">
                {translateTimelineText(timeline.total_crop_duration || `${duration} days`, lang)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Soil & Climate Requirements */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
          <h3 className="text-[14px] font-extrabold text-[#0B3B24] tracking-tight mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>જમીન અને આબોહવા જરૂરિયાત (Soil & Climate)</span>
          </h3>

          <div className="space-y-2 text-[12px]">
            <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
              <span className="text-gray-500 font-medium">
                {lang === 'en' ? 'Suitable Soil' : lang === 'hi' ? 'उपयुक्त मिट्टी' : 'અનુકૂળ જમીન'}
              </span>
              <span className="font-bold text-gray-800 text-right">
                {translateSuitableSoil(crop.suitable_soil || 'Black, Loamy, Alluvial', lang)}
              </span>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
              <span className="text-gray-500 font-medium">જમીન pH સ્તર</span>
              <span className="font-bold text-gray-800">
                {crop.suitable_ph_min} - {crop.suitable_ph_max} pH (તટસ્થ/આલ્કલાઇન)
              </span>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
              <span className="text-gray-500 font-medium">અનુકૂળ તાપમાન</span>
              <span className="font-bold text-gray-800">
                {crop.temperature_min}°C થી {crop.temperature_max}°C
              </span>
            </div>

            {crop.display_climate && (
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 font-medium block">આબોહવા:</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{crop.display_climate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Water & Irrigation */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
          <h3 className="text-[14px] font-extrabold text-[#0B3B24] tracking-tight mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>પાણી અને સિંચાઈ પદ્ધતિ (Water & Irrigation)</span>
          </h3>

          <div className="space-y-2 text-[12px]">
            <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
              <span className="text-gray-500 font-medium">
                {lang === 'en' ? 'Water Requirement' : lang === 'hi' ? 'पानी की आवश्यकता' : 'પાણીની જરૂરિયાત'}
              </span>
              <span className="font-bold text-gray-800">{translateStatus(crop.water_requirement || 'Medium', lang)}</span>
            </div>

            {crop.rainfall_requirement && (
              <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium">અપેક્ષિત વરસાદ</span>
                <span className="font-bold text-gray-800">{crop.rainfall_requirement}</span>
              </div>
            )}

            {crop.irrigation_method && (
              <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="text-gray-500 font-medium">સિંચાઈ પદ્ધતિ</span>
                <span className="font-bold text-gray-800">{crop.irrigation_method}</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. Fertilizer Requirements */}
        {crop.fertilizer_requirement && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
            <h3 className="text-[14px] font-extrabold text-[#0B3B24] tracking-tight mb-2 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>ખાતર અને પોષણ (Fertilizer Requirements)</span>
            </h3>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/70 text-[12px] text-gray-800">
              <strong className="text-[#0B5D34] block mb-1">ભલામણ કરેલ ખાતર માત્રા:</strong>
              {crop.fertilizer_requirement}
            </div>
          </div>
        )}

        {/* 7. Pest & Disease Protection */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
          <h3 className="text-[14px] font-extrabold text-[#0B3B24] tracking-tight mb-2.5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>રોગ અને જીવાત સંરક્ષણ (Plant Protection)</span>
          </h3>

          {crop.common_diseases && (
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-[12px] mb-2">
              <span className="text-red-900 font-bold block mb-1">સામાન્ય રોગો (Common Diseases):</span>
              <p className="text-gray-700">{crop.common_diseases}</p>
            </div>
          )}

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[12px]">
            <span className="text-amber-900 font-bold block mb-1">સંરક્ષણ ભલામણ (Recommendations):</span>
            <p className="text-gray-700">
              પ્રમાણિત બીજ પસંદ કરો, યોગ્ય પાક ફેરબદલી અપનાવો અને રોગના પ્રારંભિક લક્ષણો જણાતાં લીમડાનું તેલ અથવા ભલામણ કરેલ જૈવિક કીટનાશકનો છંટકાવ કરો.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CropDetailPage;
