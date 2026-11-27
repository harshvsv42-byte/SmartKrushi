import MarketPricesWidget from '../components/market/MarketPricesWidget';
import GovernmentSchemesWidget from '../components/market/GovernmentSchemesWidget';
import CropCalendarWidget from '../components/market/CropCalendarWidget';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const MarketPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 md:pb-12">
      <div className="max-w-5xl mx-auto md:px-4 md:pt-4">

        {/* Green Header — same style as Home, Weather, Soil */}
        <header className="bg-[#0B5D34] text-white pt-4 pb-8 px-5 rounded-b-[32px] md:rounded-3xl shadow-sm">
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
                {t('market.title', 'ગુજરાત બજાર ભાવ')}
              </h1>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-200 font-semibold">
                  LIVE APMC MANDI
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </div>
          </div>

          <p className="text-center text-[12px] text-emerald-200/80 font-medium mt-3">
            {t('market.subtitle', 'ગોંડલ, રાજકોટ, ઊંઝા, મહુવા સહિત ગુજરાતના તમામ APMC ભાવ')}
          </p>
        </header>

        {/* Content Area */}
        <div className="px-4 mt-4 space-y-5">

          {/* Market Prices (full width, most important) */}
          <MarketPricesWidget />

          {/* Government Schemes */}
          <GovernmentSchemesWidget />

          {/* Crop Calendar */}
          <CropCalendarWidget />

        </div>
      </div>
    </div>
  );
};

export default MarketPage;
