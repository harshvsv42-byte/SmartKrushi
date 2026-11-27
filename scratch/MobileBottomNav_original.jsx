import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Sprout, BarChart3, User } from 'lucide-react';

const MobileBottomNav = ({ onOpenCrops }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isMarket = location.pathname === '/market';
  const isProfile = location.pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgb(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),8px)] pt-2 max-w-[440px] mx-auto md:rounded-b-[36px]">
      <div className="grid grid-cols-4 items-center">
        
        {/* 1. હોમ (Home) */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? 'text-[#0B5D34]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'fill-current stroke-[#0B5D34]' : ''}`} />
          <span className={`text-[11px] mt-1 font-bold ${isHome ? 'text-[#0B5D34]' : 'text-gray-500'}`}>
            {t('home.bottomNav.home', 'હોમ')}
          </span>
        </Link>

        {/* 2. બધા ખેતરો (All Farms / Crops) */}
        <button
          type="button"
          onClick={onOpenCrops}
          className="flex flex-col items-center justify-center py-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <Sprout className="w-5 h-5" />
          <span className="text-[11px] mt-1 font-semibold text-gray-500">
            {t('home.bottomNav.allFarms', 'બધા ખેતરો')}
          </span>
        </button>

        {/* 3. આંકડા (Stats / Market) */}
        <Link
          to="/market"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isMarket ? 'text-[#0B5D34]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className={`text-[11px] mt-1 font-semibold ${isMarket ? 'text-[#0B5D34]' : 'text-gray-500'}`}>
            {t('home.bottomNav.stats', 'આંકડા')}
          </span>
        </Link>

        {/* 4. મારો પ્રોફાઇલ (My Profile) */}
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isProfile ? 'text-[#0B5D34]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className={`text-[11px] mt-1 font-semibold ${isProfile ? 'text-[#0B5D34]' : 'text-gray-500'}`}>
            {t('home.bottomNav.myProfile', 'મારો પ્રોફાઇલ')}
          </span>
        </Link>

      </div>
    </nav>
  );
};

export default MobileBottomNav;