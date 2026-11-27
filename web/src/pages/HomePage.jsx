import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileWeatherCard from '../components/mobile/MobileWeatherCard';
import MobileCategoryGrid from '../components/mobile/MobileCategoryGrid';
import GujaratMandiTicker from '../components/market/GujaratMandiTicker';
import MobileFeaturedOffers from '../components/mobile/MobileFeaturedOffers';
import MobileFacilityDrawer from '../components/mobile/MobileFacilityDrawer';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    location,
    selectedDistrict,
    setSelectedDistrict,
    weather: weatherData,
    loadingWeather: isLoadingWeather,
    permissionStatus,
    permissionError,
    requestDeviceLocation,
    setManualDistrict
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawer, setActiveDrawer] = useState(null); // 'alerts', 'offer', etc.
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleSelectDistrict = (district) => {
    if (setManualDistrict) {
      setManualDistrict(district);
    } else if (setSelectedDistrict) {
      setSelectedDistrict(district);
    }
  };

  const handleSelectCategory = (type) => {
    if (type === 'calendar' || type === 'duration' || type === 'crops') {
      navigate('/crops');
    } else if (type === 'soil') {
      navigate('/soil');
    } else if (type === 'diagnostics' || type === 'protection') {
      navigate('/diagnostics');
    } else {
      setActiveDrawer(type);
    }
  };

  const activeDistrictName = selectedDistrict?.district || selectedDistrict?.district_name || selectedDistrict?.name || location?.district || 'Ahmedabad';

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-16 md:pb-12">
      <div className="w-full max-w-5xl mx-auto md:px-4">
        {/* 1. Header (Emerald Green, Greetings, Search, Location, Profile Avatar) */}
        <MobileHeader
          selectedDistrict={selectedDistrict}
          onSelectDistrict={handleSelectDistrict}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Location Permission Notification Banner if Denied / Error */}
        {(permissionStatus === 'denied' || permissionError) && (
          <div className="mx-4 mt-2 mb-1 p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-2 shadow-xs text-amber-900">
            <div className="flex items-center gap-2 text-[12px] leading-tight">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                સ્થાનિક હવામાન અને માટીની વિગતો માટે સ્થાન (GPS) જરૂરી છે.
              </span>
            </div>
            <button
              type="button"
              onClick={() => requestDeviceLocation(true)}
              className="flex items-center gap-1 shrink-0 px-2.5 py-1 bg-[#0B5D34] text-white text-[11px] font-bold rounded-lg hover:bg-[#084828] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>પરવાનગી આપો</span>
            </button>
          </div>
        )}

        {/* 2. Elevated Weather Card */}
        <MobileWeatherCard
          weather={weatherData}
          districtName={activeDistrictName}
          isLoading={isLoadingWeather}
          onCardClick={() => navigate('/weather')}
        />

        {/* 3. Live Gujarat APMC Mandi Bhav Ticker */}
        <GujaratMandiTicker />

        {/* 4. Facility Grid on Phone, 4 cols on Desktop */}
        <MobileCategoryGrid
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Best Offers (Carousel on Phone, Grid on Desktop) */}
        <MobileFeaturedOffers
          onOpenOffer={(offer) => setSelectedOffer(offer)}
        />
      </div>

      {/* 5. Interactive Facility Drawer / Modal */}
      {activeDrawer && (
        <MobileFacilityDrawer
          activeType={activeDrawer}
          onClose={() => setActiveDrawer(null)}
          districtName={activeDistrictName}
        />
      )}

      {/* 6. Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-5 shadow-2xl overflow-hidden border border-gray-150">
            <div className="relative h-40 -mx-5 -mt-5 mb-4 overflow-hidden">
              <img src={selectedOffer.image} alt={selectedOffer.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {selectedOffer.tag}
              </span>
              <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold text-[16px]">
                {selectedOffer.title}
              </h3>
            </div>
            <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
              {selectedOffer.subtitle}
              <br /><br />
              આ યોજના હેઠળ ગુજરાતના ખેડૂતોને સીધી આર્થિક સહાય અને ઉચ્ચ ગુણવત્તાવાળા બિયારણો પર સબસિડી મળવાપાત્ર છે.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedOffer(null);
                  navigate('/market');
                }}
                className="flex-1 py-2.5 bg-[#0B5D34] text-white rounded-xl text-[13px] font-bold"
              >
                અરજી કરો (Apply Now)
              </button>
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-[13px] font-semibold"
              >
                બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;