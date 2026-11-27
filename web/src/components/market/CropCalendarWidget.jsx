import { useState, useEffect } from 'react';
import { Calendar, Sun, CloudRain, ThermometerSun, Sprout, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { marketApi } from '../../api/services';
import { translateSeason, translateCalendarMonths, translateCropName, normalizeLang } from '../../utils/translateData';

const SEASON_ICONS = {
  0: CloudRain,      // Kharif / ચોમાસુ
  1: Sun,            // Rabi / શિયાળુ
  2: ThermometerSun, // Zaid / ઉનાળુ
};

const CropCalendarWidget = () => {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    marketApi.calendar()
      .then((res) => {
        if (isMounted) setSeasons(res.data || []);
      })
      .catch((err) => console.error('Error loading crop calendar:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#0B3B24]" />
          <h2 className="text-[18px] font-extrabold text-[#0B3B24] tracking-tight">
            {lang === 'en' ? 'Gujarat Crop Calendar & Seasonal Sowing' : lang === 'hi' ? 'गुजरात फसल कैलेंडर और मौसमी बुवाई' : 'ગુજરાત પાક કેલેન્ડર અને ઋતુવાર વાવણી'}
          </h2>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          {lang === 'en' ? 'Agri University Advisory' : lang === 'hi' ? 'कृषि विश्वविद्यालय सलाह' : 'કૃષિ યુનિવર્સિટી ભલામણ'}
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-150 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B5D34] mx-auto mb-2" />
          <p className="text-[14px] font-bold text-gray-700">પાક કેલેન્ડર લોડ થઈ રહ્યું છે...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seasons.map((season, idx) => {
            const Icon = SEASON_ICONS[idx] || Sprout;
            const isKharif = idx === 0;
            const isRabi = idx === 1;

            return (
              <div
                key={season.id || idx}
                className="bg-white rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Season Badge & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isKharif ? 'bg-sky-100 text-sky-800' : isRabi ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[16px] text-[#0B3B24] leading-tight">
                          {translateSeason(season.season_en || season.season, lang)}
                        </h3>
                        <p className="text-[11px] font-semibold text-gray-500">
                          {translateCalendarMonths(season.months, lang)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Gujarat Crops */}
                  <div className="mt-3">
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-2">
                      {lang === 'en' ? 'Suitable Crops & Varieties:' : lang === 'hi' ? 'उपयुक्त फसलें और किस्में:' : 'અનુકૂળ પાકો અને જાતો:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(season.recommended_crops) && season.recommended_crops.map((crop, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-1 rounded-lg"
                        >
                          {typeof crop === 'object'
                            ? (lang === 'en' ? crop.name_en : lang === 'hi' ? translateCropName(crop.name_en, 'hi') : crop.name_gu)
                            : translateCropName(crop, lang)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sowing Tips */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-150 text-[11px] text-gray-600 leading-relaxed">
                    <strong className="text-gray-800 block mb-0.5">
                      {lang === 'en' ? '💡 Sowing Advice:' : lang === 'hi' ? '💡 बुवाई सलाह:' : '💡 વાવણી સલાહ:'}
                    </strong>
                    {lang === 'en' ? (season.sowing_tips || season.sowing_tips_gu) : (season.sowing_tips_gu || season.sowing_tips)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'en' ? 'Certified seeds recommended' : lang === 'hi' ? 'प्रमाणित बीज उपयोग की सलाह' : 'પ્રમાણિત બિયારણ વાપરવાની સલાહ'}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropCalendarWidget;
