import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Droplets,
  Layers,
  Sparkles,
  Sprout,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soilApi } from '../api/services';
import {
  translateLocation,
  translateSoilType,
  translateSoilTexture,
  translateStatus,
  translateCropName,
  translateSeason,
  normalizeLang,
} from '../utils/translateData';

const SoilDetailsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const { location, requestDeviceLocation, isLoadingLocation } = useApp();

  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSoilData = () => {
    setLoading(true);
    setError(null);

    const lat = location?.latitude || 23.0225;
    const lon = location?.longitude || 72.5714;
    const district = location?.district || 'Ahmedabad';

    soilApi
      .getByCoordinates(lat, lon, district)
      .then((res) => {
        if (res.data && res.data.success) {
          setSoilData(res.data);
        } else {
          setError('આ સ્થાન માટે જમીનની માહિતી મળી શકી નથી.');
        }
      })
      .catch((err) => {
        console.error('Soil fetch error:', err);
        setError('સર્વર સાથે કનેક્ટ થવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSoilData();
  }, [location]);

  const handleRefreshLocation = () => {
    requestDeviceLocation(true);
  };

  const nutrients = soilData?.nutrients || {};
  const physical = soilData?.physical_composition || {};
  const suitableCrops = soilData?.suitable_crops || [];
  const soilRecs = soilData?.soil_recommendations || [];
  const fertilizerRecs = soilData?.fertilizer_recommendations || [];

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 md:pb-12">
      <div className="max-w-5xl mx-auto md:px-4 md:pt-4">
        {/* Top Header */}
        <header className="bg-[#0B5D34] text-white pt-4 pb-8 px-4 rounded-b-[32px] md:rounded-3xl shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="પાછા જાઓ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-extrabold tracking-tight">
              {lang === 'en' ? 'Soil Analysis' : lang === 'hi' ? 'मिट्टी विश्लेषण' : 'જમીન વિશ્લેષણ'}
            </h1>
            <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-200/90 font-medium">
              <MapPin className="w-3 h-3" />
              <span>
                {translateLocation(soilData?.location?.district || location?.district || 'Ahmedabad', lang)}, {translateLocation(soilData?.location?.state || 'Gujarat', lang)}
              </span>
              {location?.isGps && (
                <span className="bg-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-bold">GPS</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={fetchSoilData}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="રીફ્રેશ કરો"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-4 -mt-5 space-y-4">

        {/* Loading State */}
        {loading && !soilData && (
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-150 text-center">
            <div className="w-12 h-12 border-4 border-[#0B5D34] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-[14px] font-bold text-gray-700">જમીન વિશ્લેષણ લોડ થઈ રહ્યું છે...</p>
            <p className="text-[12px] text-gray-400 mt-1">તમારા સ્થાનિક વિસ્તારનું માટી પરીક્ષણ</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-red-200 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-[13px] font-semibold text-gray-800 mb-3">{error}</p>
            <button
              type="button"
              onClick={fetchSoilData}
              className="px-4 py-2 bg-[#0B5D34] text-white text-[12px] font-bold rounded-xl shadow-xs"
            >
              ફરી પ્રયાસ કરો (Retry)
            </button>
          </div>
        )}

        {/* Soil Content */}
        {soilData && (
          <>
            {/* Primary Soil Type Card */}
            <div className="bg-white rounded-[26px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-150/70">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[12px] font-semibold text-gray-500">
                    {lang === 'en' ? 'Local Soil Type' : lang === 'hi' ? 'स्थानीय मिट्टी का प्रकार' : 'સ્થાનિક માટીનો પ્રકાર'}
                  </span>
                  <h2 className="text-[22px] font-extrabold text-[#0B3B24] tracking-tight mt-0.5">
                    {translateSoilType(soilData.soil_type, lang)} {lang === 'en' ? 'Soil' : lang === 'hi' ? 'मिट्टी' : 'માટી'}
                  </h2>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {translateSoilType(soilData.soil_type, lang)} ({translateSoilTexture(soilData.soil_texture || 'Clay Loam', lang)})
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      soilData.overall_health_score === 'Good'
                        ? 'bg-emerald-100 text-[#0B5D34]'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {soilData.overall_health_score === 'Good'
                      ? (lang === 'en' ? '✓ Fertile Soil' : lang === 'hi' ? '✓ उपजाऊ मिट्टी' : '✓ ફળદ્રુપ જમીન')
                      : (lang === 'en' ? '⚠ Improvement Needed' : lang === 'hi' ? '⚠ सुधार आवश्यक' : '⚠️ સુધારણા જરૂરી')}
                  </span>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {lang === 'en' ? 'Fertility:' : lang === 'hi' ? 'उर्वरता:' : 'ફળદ્રુપતા:'}{' '}
                    <strong className="text-gray-700">{translateStatus(soilData.soil_fertility || 'Medium', lang)}</strong>
                  </div>
                </div>
              </div>

              {/* GPS status and refresh option */}
              <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
                <span>
                  {lang === 'en' ? 'Location:' : lang === 'hi' ? 'स्थान:' : 'સ્થાન:'}{' '}
                  <strong>{translateLocation(soilData.location?.district, lang)}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleRefreshLocation}
                  disabled={isLoadingLocation}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>જીપીએસ અપડેટ કરો</span>
                </button>
              </div>
            </div>

            {/* pH & Organic Quality Metrics */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
              <h3 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>જમીન ગુણવત્તા & pH સ્તર</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                
                {/* pH Meter Card */}
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] text-emerald-800 font-medium">જમીન pH સ્તર</span>
                  <div className="text-[24px] font-extrabold text-[#0B5D34] mt-0.5 leading-tight">
                    {soilData.soil_ph} <span className="text-[14px]">pH</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    {translateStatus(soilData.ph_category || 'Neutral / Optimal', lang)}
                  </span>
                </div>

                {/* Organic Carbon */}
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
                  <span className="text-[11px] text-amber-800 font-medium">
                    {lang === 'en' ? 'Organic Carbon (OC)' : lang === 'hi' ? 'जैविक कार्बन (OC)' : 'સેન્દ્રિય કાર્બન (OC)'}
                  </span>
                  <div className="text-[24px] font-extrabold text-amber-900 mt-0.5 leading-tight">
                    {nutrients.organic_carbon?.value !== undefined ? `${nutrients.organic_carbon.value}%` : '--'}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                    {translateStatus(nutrients.organic_carbon?.status || 'Medium', lang)}
                  </span>
                </div>

              </div>
            </div>

            {/* Primary N-P-K Nutrients Grid */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
              <h3 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>મુખ્ય પોષક તત્ત્વો (NPK Nutrients)</span>
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                
                {/* Nitrogen */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-bold block">નાઇટ્રોજન (N)</span>
                  <div className="text-[18px] font-extrabold text-gray-900 mt-1">
                    {nutrients.nitrogen?.value || '--'}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium block">kg/ha</span>
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 bg-blue-100 text-blue-800">
                    {nutrients.nitrogen?.status ? translateStatus(nutrients.nitrogen.status, lang) : translateStatus('Normal', lang)}
                  </span>
                </div>

                {/* Phosphorus */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-bold block">
                    {lang === 'en' ? 'Phosphorus (P)' : lang === 'hi' ? 'फॉस्फोरस (P)' : 'ફોસ્ફરસ (P)'}
                  </span>
                  <div className="text-[18px] font-extrabold text-gray-900 mt-1">
                    {nutrients.phosphorus?.value || '--'}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium block">kg/ha</span>
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 bg-emerald-100 text-[#0B5D34]">
                    {nutrients.phosphorus?.status ? translateStatus(nutrients.phosphorus.status, lang) : translateStatus('Normal', lang)}
                  </span>
                </div>

                {/* Potassium */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-bold block">
                    {lang === 'en' ? 'Potassium (K)' : lang === 'hi' ? 'पोटाश (K)' : 'પોટેશિયમ (K)'}
                  </span>
                  <div className="text-[18px] font-extrabold text-gray-900 mt-1">
                    {nutrients.potassium?.value || '--'}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium block">kg/ha</span>
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 bg-purple-100 text-purple-800">
                    {nutrients.potassium?.status ? translateStatus(nutrients.potassium.status, lang) : translateStatus('Normal', lang)}
                  </span>
                </div>

              </div>
            </div>

            {/* Physical & Moisture Properties */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
              <h3 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>ભૌતિક ગુણધર્મો & જળધારણ શક્તિ</span>
              </h3>

              <div className="space-y-2 text-[12px]">
                <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                  <span className="text-gray-500 font-medium">અંદાજિત માટી ભેજ</span>
                  <span className="font-extrabold text-[#0B5D34]">
                    {soilData.moisture_percentage !== undefined ? `${soilData.moisture_percentage}%` : '32%'}
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                  <span className="text-gray-500 font-medium">
                    {lang === 'en' ? 'Water Holding Capacity' : lang === 'hi' ? 'जल धारण क्षमता' : 'જળધારણ શક્તિ'}
                  </span>
                  <span className="font-bold text-gray-800">{translateStatus(soilData.water_holding_capacity || 'Medium to High', lang)}</span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                  <span className="text-gray-500 font-medium">
                    {lang === 'en' ? 'Drainage Capacity' : lang === 'hi' ? 'जल निकासी क्षमता' : 'નિતાર ક્ષમતા'}
                  </span>
                  <span className="font-bold text-gray-800">{translateStatus(soilData.drainage || 'Moderate', lang)}</span>
                </div>

                {nutrients.electrical_conductivity?.value && (
                  <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                    <span className="text-gray-500 font-medium">ક્ષારતા (EC)</span>
                    <span className="font-bold text-gray-800">{nutrients.electrical_conductivity.value} dS/m (સામાન્ય)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Suitable Crops For This Soil */}
            {suitableCrops.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
                <h3 className="text-[13px] font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#0B5D34]" />
                  <span>આ માટી માટે સૌથી અનુકૂળ પાક (Suitable Crops)</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {suitableCrops.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => navigate(`/crops/${c.id}`)}
                      className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-left hover:border-emerald-300 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-[13px] text-gray-900">{translateCropName(c.crop_name, lang)}</div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          {translateSeason(c.growing_season, lang)} • {c.crop_duration_days} {lang === 'en' ? 'days' : lang === 'hi' ? 'दिन' : 'દિવસ'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Agronomic Recommendations (Fertilizer & Soil) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
              <h3 className="text-[13px] font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>કૃષિ સલાહ & ખાતર ભલામણ (Recommendations)</span>
              </h3>

              <div className="space-y-2 text-[12px]">
                {fertilizerRecs.length > 0 ? (
                  fertilizerRecs.map((rec, i) => (
                    <div key={i} className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-950">
                      <strong>💡 ખાતર સલાહ:</strong> {rec.action || rec.message || JSON.stringify(rec)}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-900">
                    ✓ જમીનમાં મુખ્ય પોષક તત્ત્વો સંતુલિત છે. ભલામણ કરેલ સામાન્ય NPK માત્રા આપવી.
                  </div>
                )}

                {soilData.irrigation_recommendations && (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900">
                    <strong>💧 સિંચાઈ સલાહ:</strong> {soilData.irrigation_recommendations}
                  </div>
                )}
              </div>
            </div>

            {/* Data Source Footnote */}
            <div className="text-center text-[11px] text-gray-400 py-1">
              માટી વિશ્લેષણ ડેટા સ્ત્રોત: {soilData.data_source || 'ICAR Soil Health Card Database'}
            </div>

          </>
        )}

      </div>
      </div>

    </div>
  );
};

export default SoilDetailsPage;
