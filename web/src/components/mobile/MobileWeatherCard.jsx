import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateLocation } from '../../utils/translateData';

const MobileWeatherCard = ({ weather, districtName = 'Ahmedabad', isLoading = false, onCardClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      navigate('/weather');
    }
  };

  // Dynamic values or safe fallbacks
  const temp = weather?.temperature !== undefined ? Math.round(weather.temperature) : 35;
  const tempDisplay = temp >= 0 ? `+${temp}°C` : `${temp}°C`;
  const highTemp = weather?.temp_max !== undefined && weather.temp_max !== null ? Math.round(weather.temp_max) : 36;
  const lowTemp = weather?.temp_min !== undefined && weather.temp_min !== null ? Math.round(weather.temp_min) : 26;
  const humidity = weather?.humidity !== undefined ? `${weather.humidity}%` : '32%';
  const rainfall = weather?.rainfall_mm !== undefined ? `${weather.rainfall_mm}mm` : (weather?.rainfall !== undefined ? `${weather.rainfall}mm` : '0mm');
  const pressure = weather?.pressure !== undefined ? `${weather.pressure} hpa` : '1008 hpa';
  const windSpeed = weather?.wind_speed !== undefined ? `${weather.wind_speed} km/h` : '5.6 km/h';
  const rawLocationLabel = weather?.district || weather?.location || districtName || 'Ahmedabad';
  const locationLabel = translateLocation(rawLocationLabel, i18n.language);

  return (
    <div
      onClick={handleClick}
      className="relative -mt-6 mx-4 z-20 cursor-pointer active:scale-[0.99] transition-transform"
      role="button"
      tabIndex={0}
      title="હવામાન વિગતો જુઓ (Click for Weather Details)"
    >
      <div className="bg-white rounded-[26px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-150/70">
        
        {/* Top Header: Location & Weather Illustration */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-gray-800">
            <MapPin className="w-4 h-4 text-gray-700 shrink-0" />
            <span className="font-bold text-[15px] tracking-tight text-gray-900">{locationLabel}</span>
          </div>

          {/* Sun & Cloud Illustration matching screenshot */}
          <div className="relative w-12 h-10 flex items-center justify-end">
            <div className="absolute top-0 right-1 w-6 h-6 rounded-full bg-amber-400 shadow-sm animate-pulse"></div>
            <div className="absolute bottom-0 right-3 w-8 h-5 bg-sky-200/90 rounded-full shadow-xs"></div>
            <div className="absolute bottom-1 right-5 w-5 h-4 bg-sky-100/90 rounded-full"></div>
            {/* Sparkles */}
            <div className="absolute -top-1 right-7 text-amber-300 text-[9px]">✦</div>
          </div>
        </div>

        {/* Temperature & High/Low Row */}
        <div className="flex items-baseline justify-between mt-1">
          <div className="text-[38px] font-extrabold text-gray-900 tracking-tight leading-none">
            {isLoading ? <span className="text-gray-300 animate-pulse">--°C</span> : tempDisplay}
          </div>

          <div className="text-right text-[12px] font-semibold text-gray-500 leading-tight">
            <div>H: {highTemp}°C</div>
            <div>L: {lowTemp}°C</div>
          </div>
        </div>

        {/* Dotted Divider */}
        <div className="border-t border-dashed border-gray-200 my-3.5"></div>

        {/* 2x2 Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[13px]">
          
          {/* Row 1: Humidity & Rainfall */}
          <div>
            <div className="text-gray-400 text-[11px] font-medium">{t('home.weather.humidity', 'ભેજ')}</div>
            <div className="font-bold text-gray-800 text-[14px] mt-0.5">{humidity}</div>
          </div>

          <div>
            <div className="text-gray-400 text-[11px] font-medium">{t('home.weather.rainfall', 'વરસાદ')}</div>
            <div className="font-bold text-gray-800 text-[14px] mt-0.5">{rainfall}</div>
          </div>

          {/* Row 2: Pressure & Wind Speed */}
          <div>
            <div className="text-gray-400 text-[11px] font-medium">{t('home.weather.pressure', 'દબાણ')}</div>
            <div className="font-bold text-gray-800 text-[14px] mt-0.5">{pressure}</div>
          </div>

          <div>
            <div className="text-gray-400 text-[11px] font-medium">{t('home.weather.windSpeed', 'પવનની ઝડપ')}</div>
            <div className="font-bold text-gray-800 text-[14px] mt-0.5">{windSpeed}</div>
          </div>

        </div>

        {/* Sun Tracker Arc (Sunrise / Sunset) */}
        <div className="mt-4 pt-2 relative">
          
          {/* Sunrise / Sunset Times */}
          <div className="flex items-end justify-between text-[11px] mb-1">
            <div>
              <div className="font-bold text-gray-800 text-[12px]">6:32 AM</div>
              <div className="text-gray-400 text-[10px]">{t('home.weather.sunrise', 'સૂર્યોદય')}</div>
            </div>

            <div>
              <div className="font-bold text-gray-800 text-[12px] text-right">6:24 PM</div>
              <div className="text-gray-400 text-[10px] text-right">{t('home.weather.sunset', 'સૂર્યાસ્ત')}</div>
            </div>
          </div>

          {/* Curved Dashed Path with Sun */}
          <div className="relative w-full h-8 flex items-center justify-center -mt-3">
            <svg viewBox="0 0 200 40" className="w-full h-8 overflow-visible">
              <path
                d="M 20 35 Q 100 5 180 35"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
            </svg>
            
            {/* Bright Sun positioned near peak */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 shadow-md flex items-center justify-center text-white border-2 border-white">
              <Sun className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MobileWeatherCard;
