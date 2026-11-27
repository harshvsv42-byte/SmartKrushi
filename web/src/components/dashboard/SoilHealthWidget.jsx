import { useState, useEffect } from 'react';
import { Beaker, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soilApi } from '../../api/services';

const SoilBar = ({ label, value, max, color, unit = '' }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-[6px]">
        <span className="text-[#111827]">{label}</span>
        <span className="text-[#111827]">
          {value !== null && value !== undefined ? `${value}${unit}` : '—'}
        </span>
      </div>
      <div className="w-full bg-[#E5E9ED] h-[6px] rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const SoilHealthWidget = ({ districtName }) => {
  const { t } = useTranslation();
  const [soil, setSoil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    soilApi.get(districtName)
      .then((res) => {
        if (cancelled) return;
        setSoil(res.data?.data !== undefined ? res.data.data : res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err.response?.data?.error || 'Soil data unavailable.';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [districtName]);

  const moistureLow = soil?.moisture_percent !== null && soil?.moisture_percent < 30;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[18px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h3 className="font-bold text-[#111827] text-[14px]">{t('dashboard.soil.health')}</h3>
        <Beaker className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-[24px]">
          <Loader2 className="w-[22px] h-[22px] animate-spin text-[#4B5563]" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-[12px] text-[#D7392E] font-medium py-[8px]">{error}</p>
      )}

      {!isLoading && !error && !soil && (
        <p className="text-[12px] text-[#6B7280] py-[8px]">
          No soil data found for your location.
        </p>
      )}

      {!isLoading && soil && (
        <div className="space-y-[18px]">
          {soil.soil_type && (
            <div className="flex justify-between text-[11px] mb-[2px]">
              <span className="text-[#6B7280] font-semibold">Soil Type</span>
              <span className="text-[#111827] font-bold">{soil.soil_type}</span>
            </div>
          )}

          <SoilBar
            label={t('dashboard.soil.nitrogen')}
            value={soil.nitrogen}
            max={200}
            unit=" kg/ha"
            color="bg-[#0A311F]"
          />

          <div>
            <div className="flex justify-between text-[11px] font-bold mb-[6px]">
              <span className="text-[#111827]">Moisture</span>
              <span className={moistureLow ? 'text-[#D7392E]' : 'text-[#111827]'}>
                {soil.moisture_percent !== null && soil.moisture_percent !== undefined
                  ? `${moistureLow ? 'Low ' : ''}(${soil.moisture_percent}%)`
                  : '—'}
              </span>
            </div>
            <div className="w-full bg-[#E5E9ED] h-[6px] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${moistureLow ? 'bg-[#D7392E]' : 'bg-[#486354]'}`}
                style={{ width: `${Math.min(soil.moisture_percent || 0, 100)}%` }}
              />
            </div>
            {moistureLow && (
              <p className="text-[10px] text-[#D7392E] font-semibold mt-[4px]">
                {t('dashboard.soil.warning')}
              </p>
            )}
          </div>

          <SoilBar
            label="pH Level"
            value={soil.ph_level}
            max={14}
            color="bg-[#486354]"
          />

          {soil.phosphorus !== null && soil.phosphorus !== undefined && (
            <SoilBar
              label="Phosphorus"
              value={soil.phosphorus}
              max={100}
              unit=" kg/ha"
              color="bg-[#B9C6E3]"
            />
          )}
          {soil.potassium !== null && soil.potassium !== undefined && (
            <SoilBar
              label="Potassium"
              value={soil.potassium}
              max={300}
              unit=" kg/ha"
              color="bg-[#62776D]"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SoilHealthWidget;
