import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Loader2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { weatherApi } from '../../api/services';

const CONDITION_ICON_MAP = {
  sunny: Sun,
  partly_cloudy: Cloud,
  cloudy: Cloud,
  overcast: Cloud,
  drizzle: CloudRain,
  rainy: CloudRain,
  thunderstorm: CloudRain,
  snow: CloudSnow,
  mist: Wind,
};

const ConditionIcon = ({ code, className }) => {
  const Icon = CONDITION_ICON_MAP[code] || Cloud;
  return <Icon className={className} />;
};

const WeatherWidget = ({ lat, lon }) => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // Use the detailed endpoint to get both current weather and forecast
    weatherApi.getDetails(lat, lon)
      .then((res) => {
        if (cancelled) return;
        const data = res.data || {};
        setWeather(data.current || data);
        setForecast(data.forecast || []);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err.response?.data?.error || 'Weather data unavailable.';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lon]);

  const getDayLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[18px]">
      <div className="flex justify-between items-center mb-[14px]">
        <h3 className="font-bold text-[#111827] text-[14px]">{t('sidebar.weather')}</h3>
        <Cloud className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-[24px]">
          <Loader2 className="w-[22px] h-[22px] animate-spin text-[#4B5563]" />
        </div>
      )}

      {!isLoading && error && (
        <div className="py-[8px]">
          <p className="text-[12px] text-[#D7392E] font-medium">{error}</p>
          <p className="text-[11px] text-[#6B7280] mt-[4px]">
            Ensure your location is enabled and the weather API key is configured.
          </p>
        </div>
      )}

      {!isLoading && weather && (
        <div className="space-y-[4px]">
          {/* Today */}
          <div className="flex justify-between items-center bg-[#F3F6F4] p-[10px] rounded-lg mb-[6px]">
            <div>
              <span className="text-[13px] font-semibold text-[#111827]">{t('dashboard.weather.today')}</span>
              {weather.location && (
                <div className="flex items-center gap-[4px] mt-[2px]">
                  <MapPin className="w-[10px] h-[10px] text-[#4B5563]" />
                  <span className="text-[11px] text-[#4B5563]">{weather.location}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-[10px]">
              <ConditionIcon code={weather.condition_code} className="w-[16px] h-[16px] text-[#111827] stroke-[2]" />
              <span className="text-[13px] font-bold text-[#111827]">{weather.temperature}°C</span>
            </div>
          </div>

          {/* Humidity + Wind row */}
          <div className="flex justify-between px-[10px] py-[4px]">
            <span className="text-[11px] text-[#4B5563]">
              {t('dashboard.weather.humidity')}: <strong>{weather.humidity}%</strong>
            </span>
            <span className="text-[11px] text-[#4B5563]">
              {t('dashboard.weather.wind')}: <strong>{weather.wind_speed} km/h</strong>
            </span>
          </div>

          {/* 5-day forecast */}
          {forecast.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-[6px] px-[10px]">
              <span className="text-[12px] font-medium text-[#4B5563]">{getDayLabel(item.date)}</span>
              <div className="flex items-center gap-[22px] justify-end">
                <ConditionIcon code={item.condition_code} className="w-[16px] h-[16px] text-[#4B5563] stroke-[2]" />
                <span className="text-[12px] font-medium text-[#111827] w-[36px] text-right">
                  {item.temp_max}°C
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
