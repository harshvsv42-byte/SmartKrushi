import { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cropApi } from '../../api/services';

const STAGE_CONFIGS = [
  { stage: 'VEGETATIVE STAGE V5', percent: 64, barColor: 'bg-[#B9C6E3]' },
  { stage: 'TILLERING STAGE', percent: 28, barColor: 'bg-[#DFE4F2]' },
  { stage: 'FLOWERING / POD FORMATION', percent: 82, barColor: 'bg-[#A3B899]' },
  { stage: 'GRAIN FILLING', percent: 50, barColor: 'bg-[#C5D3E8]' },
];

const CropProgress = () => {
  const { i18n } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const response = await cropApi.list();
        if (isMounted) {
          const list = response.data.results || response.data || [];
          setCrops(list.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCrops();
    return () => {
      isMounted = false;
    };
  }, []);

  const getLocalizedName = (crop) => {
    const lang = i18n.language;
    if (lang === 'gu' && crop.name_gu) return crop.name_gu;
    if (lang === 'hi' && crop.name_hi) return crop.name_hi;
    return crop.name;
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[20px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h3 className="font-bold text-[14px] text-[#111827]">Crop Progress</h3>
        <TrendingUp className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#0A311F]" />
          <span className="text-[12px] text-[#4B5563]">Loading crops...</span>
        </div>
      ) : crops.length === 0 ? (
        <p className="text-[12px] text-[#4B5563]">No active crops registered.</p>
      ) : (
        <div className="space-y-[20px]">
          {crops.map((crop, idx) => {
            const config = STAGE_CONFIGS[idx % STAGE_CONFIGS.length];
            return (
              <div key={crop.id || idx}>
                <div className="flex justify-between items-center mb-[8px]">
                  <h4 className="font-bold text-[12px] text-[#111827]">
                    {getLocalizedName(crop)} ({crop.season?.toUpperCase() || 'KHARIF'})
                  </h4>
                  <span className="text-[12px] font-medium text-[#4B5563]">
                    {config.percent}% Mature
                  </span>
                </div>
                <div className="w-full bg-[#E5E9F3] h-[22px] rounded-[4px] flex items-center relative overflow-hidden">
                  <div
                    className={`${config.barColor} h-full absolute left-0 top-0 transition-all duration-500`}
                    style={{ width: `${config.percent}%` }}
                  ></div>
                  <span className="relative z-10 text-[9px] font-bold text-[#111827] ml-[10px] tracking-wider uppercase opacity-80">
                    {config.stage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropProgress;
