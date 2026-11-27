import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Sun,
  CloudRain,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { weatherApi } from '../api/services';
import {
  translateLocation,
  translateWeatherCondition,
  formatLocalizedDate,
  normalizeLang,
} from '../utils/translateData';

const WeatherDetailsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const { location } = useApp();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = () => {
    setLoading(true);
    setError(null);
    const lat = location?.latitude || 23.0225;
    const lon = location?.longitude || 72.5714;
    const district = location?.district || 'Ahmedabad';
    const state = location?.state || 'Gujarat';

    weatherApi
      .getDetails(lat, lon, district, state)
      .then((res) => {
        if (res.data && res.data.success) {
          setWeatherData(res.data);
        } else {
          setError('હવામાન વિગતો લોડ થઈ શકી નથી.');
        }
      })
      .catch((err) => {
        console.error('Weather details fetch error:', err);
        setError('સર્વર સાથે કનેક્ટ થવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [location]);

  const current = weatherData?.current;
  const forecast = weatherData?.forecast || [];
  const loc = weatherData?.location || location;

  const temp = current?.temperature !== undefined ? Math.round(current.temperature) : '--';
  const feelsLike = current?.feels_like !== undefined ? Math.round(current.feels_like) : null;
  const highTemp = current?.temp_max !== undefined && current.temp_max !== null ? Math.round(current.temp_max) : null;
  const lowTemp = current?.temp_min !== undefined && current.temp_min !== null ? Math.round(current.temp_min) : null;

  const formatTime = (isoStr) => {
    if (!isoStr) return '--:--';
    try {
      const parts = isoStr.split('T');
      if (parts[1]) {
        return parts[1].substring(0, 5);
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 md:pb-12">
      <div className="max-w-5xl mx-auto md:px-4 md:pt-4">
        {/* Top Header - Consistent with MobileHeader emerald theme */}
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
              {lang === 'en' ? 'Weather Details' : lang === 'hi' ? 'मौसम विवरण' : 'હવામાન વિગતો'}
            </h1>
            <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-200/90 font-medium">
              <MapPin className="w-3 h-3" />
              <span>{translateLocation(loc?.district || 'Ahmedabad', lang)}, {translateLocation(loc?.state || 'Gujarat', lang)}</span>
              {location?.isGps && (
                <span className="bg-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-bold">GPS</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDetails}
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
        {loading && !weatherData && (
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-150 text-center">
            <div className="w-12 h-12 border-4 border-[#0B5D34] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-[14px] font-bold text-gray-700">હવામાન માહિતી લોડ થઈ રહી છે...</p>
            <p className="text-[12px] text-gray-400 mt-1">Open-Meteo લાઇવ સર્વર સાથે સંપર્ક</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-red-200 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-[13px] font-semibold text-gray-800 mb-3">{error}</p>
            <button
              type="button"
              onClick={fetchDetails}
              className="px-4 py-2 bg-[#0B5D34] text-white text-[12px] font-bold rounded-xl shadow-xs"
            >
              ફરી પ્રયાસ કરો (Retry)
            </button>
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <>
            {/* Primary Current Weather Card */}
            <div className="bg-white rounded-[26px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-150/70">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[12px] font-semibold text-gray-500">વર્તમાન તાપમાન</span>
                  <div className="text-[46px] font-extrabold text-gray-900 tracking-tight leading-none mt-1">
                    {temp !== '--' && temp >= 0 ? `+${temp}°C` : `${temp}°C`}
                  </div>
                  {feelsLike !== null && (
                    <div className="text-[12px] font-medium text-gray-500 mt-1">
                      અનુભવાતું તાપમાન: <span className="font-bold text-gray-800">{feelsLike}°C</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 shadow-xs mb-1">
                    <Sun className="w-8 h-8 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="text-[14px] font-extrabold text-[#0B3B24]">
                    {translateWeatherCondition(current?.weather_condition || 'Clear sky', lang)}
                  </div>
                  {(highTemp !== null || lowTemp !== null) && (
                    <div className="text-[11px] font-bold text-gray-500 mt-0.5">
                      {highTemp !== null && `H: ${highTemp}°C`} {lowTemp !== null && `| L: ${lowTemp}°C`}
                    </div>
                  )}
                </div>
              </div>

              {/* Recorded At */}
              {current?.recorded_at && (
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>છેલ્લું અપડેટ: {new Date(current.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-emerald-700 font-semibold">{current.data_source || 'Live API'}</span>
                </div>
              )}
            </div>

            {/* Comprehensive Metrics 2-Column Grid */}
            <div>
              <h2 className="text-[15px] font-extrabold text-[#0B3B24] tracking-tight mb-2.5 px-1">
                વિગતવાર હવામાન માપદંડો
              </h2>

              <div className="grid grid-cols-2 gap-3 text-[13px]">
                
                {/* 1. Humidity */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">ભેજ (Humidity)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.humidity !== undefined ? `${current.humidity}%` : '--'}
                    </div>
                  </div>
                </div>

                {/* 2. Rainfall */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">વરસાદ (Rainfall)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.rainfall !== undefined ? `${current.rainfall} mm` : '0 mm'}
                    </div>
                  </div>
                </div>

                {/* 3. Wind Speed */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0B5D34] flex items-center justify-center shrink-0">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">પવનની ઝડપ</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.wind_speed !== undefined ? `${current.wind_speed} km/h` : '--'}
                    </div>
                  </div>
                </div>

                {/* 4. Wind Direction */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">પવનની દિશા</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.wind_direction !== undefined && current.wind_direction !== null
                        ? `${current.wind_direction}°`
                        : '--'}
                    </div>
                  </div>
                </div>

                {/* 5. Pressure */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">દબાણ (Pressure)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.pressure !== undefined && current.pressure !== null
                        ? `${current.pressure} hPa`
                        : '--'}
                    </div>
                  </div>
                </div>

                {/* 6. Visibility */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">દૃશ્યતા (Visibility)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.visibility || (current?.visibility_km ? `${current.visibility_km} km` : '--')}
                    </div>
                  </div>
                </div>

                {/* 7. Cloud Cover */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">વાદળો (Cloud Cover)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.cloud_cover !== undefined ? `${current.cloud_cover}%` : '0%'}
                    </div>
                  </div>
                </div>

                {/* 8. UV Index */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-150/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">યુવી ઇન્ડેક્સ (UV)</div>
                    <div className="text-[16px] font-extrabold text-gray-900 mt-0.5">
                      {current?.uv_index !== undefined ? current.uv_index : '0.0'}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sun Cycle Card (Sunrise / Sunset) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-150/70">
              <h3 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>સૂર્ય ચક્ર (Sun Cycle)</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-100/60">
                  <Sunrise className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-medium">સૂર્યોદય (Sunrise)</div>
                    <div className="text-[15px] font-extrabold text-gray-900">
                      {formatTime(current?.sunrise)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-orange-50/60 p-3 rounded-xl border border-orange-100/60">
                  <Sunset className="w-6 h-6 text-orange-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-medium">સૂર્યાસ્ત (Sunset)</div>
                    <div className="text-[15px] font-extrabold text-gray-900">
                      {formatTime(current?.sunset)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Weather Forecast */}
            {forecast.length > 0 && (
              <div>
                <h2 className="text-[15px] font-extrabold text-[#0B3B24] tracking-tight mb-2.5 px-1">
                  ૭-દિવસ હવામાન આગાહી (7-Day Forecast)
                </h2>

                <div className="space-y-2">
                  {forecast.map((f, idx) => (
                    <div
                      key={f.date || idx}
                      className="bg-white rounded-2xl p-3.5 px-4 shadow-xs border border-gray-150/70 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[13px] text-gray-900">
                          {idx === 0
                            ? (lang === 'en' ? 'Today' : lang === 'hi' ? 'आज' : 'આજે')
                            : formatLocalizedDate(f.date, lang, { includeYear: false, includeWeekday: true })}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {translateWeatherCondition(f.weather_condition, lang)}
                        </div>
                        {f.precipitation_probability_pct > 0 && (
                          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                            💧 {lang === 'en' ? 'Rain chance:' : lang === 'hi' ? 'बारिश की संभावना:' : 'વરસાદની સંભાવના:'} {f.precipitation_probability_pct}%
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-[15px] font-extrabold text-gray-900">
                          {f.temperature_max !== null ? `${Math.round(f.temperature_max)}°C` : '--'}
                        </div>
                        <div className="text-[11px] font-semibold text-gray-400">
                          {f.temperature_min !== null ? `${Math.round(f.temperature_min)}°C` : '--'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}

      </div>
      </div>

    </div>
  );
};

export default WeatherDetailsPage;
