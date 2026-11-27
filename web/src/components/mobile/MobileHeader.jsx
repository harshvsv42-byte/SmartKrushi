import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Mic, ChevronDown, Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import farmerAvatar from '../../assets/farmer_avatar.jpg';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { locationApi } from '../../api/services';
import { getProfileImageUrl } from '../../utils/imageUrl';
import { formatLocalizedDate, translateLocation } from '../../utils/translateData';

const MobileHeader = ({
  selectedDistrict,
  onSelectDistrict,
  onSearch,
  searchQuery,
  setSearchQuery
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { location, setLanguage: setGlobalLanguage, requestDeviceLocation, setManualDistrict } = useApp();
  const navigate = useNavigate();

  const [districtsModalOpen, setDistrictsModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [districtsList, setDistrictsList] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const langRef = useRef(null);

  const currentDistrict = selectedDistrict || location;

  useEffect(() => {
    locationApi.listDistricts().then((res) => {
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        if (list.length > 0) setDistrictsList(list);
      }
    }).catch((err) => console.log('Error fetching districts:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format dynamic date in active language
  const formattedDate = formatLocalizedDate(new Date(), i18n.language);

  const handleLanguageChange = (lng) => {
    setGlobalLanguage(lng);
    setLangMenuOpen(false);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'gu' ? 'gu-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      if (onSearch) onSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <header className="bg-[#0B5D34] text-white pt-4 pb-10 px-5 rounded-b-[32px] relative z-10 transition-colors shadow-sm">
      
      {/* Brand & Greeting Row */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/applogo.jpg" alt="SmartKrushi Logo" className="w-8 h-8 rounded-lg shadow-xs object-cover border border-white/20" />
          <span className="font-extrabold text-[15px] tracking-tight text-emerald-100">SmartKrushi</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-200/90 bg-black/20 px-2 py-0.5 rounded-full">
          સ્માર્ટ કૃષિ સહાયક
        </span>
      </div>

      {/* Greeting and Profile Top Row */}
      <div className="flex items-start justify-between mt-1">
        
        {/* Left Side: Greeting, Date, Location */}
        <div>
          <h1 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
            {t('home.greeting', 'નમસ્તે, સુપ્રભાત')}
          </h1>

          {/* Date with dropdown indicator */}
          <div className="flex items-center gap-1 text-[13px] text-white/90 font-medium mt-0.5 cursor-pointer">
            <span>{formattedDate}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </div>
          {/* Location Chip */}
          <button
            type="button"
            onClick={() => setDistrictsModalOpen(true)}
            className="flex items-center gap-1.5 text-[12px] text-white/95 mt-1.5 bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-semibold">{translateLocation(currentDistrict?.district || currentDistrict?.name || 'Ahmedabad', i18n.language)}</span>
            <span className="text-emerald-200/90 text-[11px]">({t('home.changeLocation', 'સ્થાન બદલો')})</span>
          </button>
        </div>

        {/* Right Side: Language & User Avatar */}
        <div className="flex items-center gap-2.5 pt-1">
          
          {/* Language Badge */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#084828] border border-white/25 flex items-center justify-center text-white text-[12px] font-extrabold shadow-xs hover:bg-[#063b21] transition-all cursor-pointer"
              title="Change Language"
            >
              {i18n.language.toUpperCase()}
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 text-gray-800 z-50 text-[13px]">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('gu')}
                  className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                    i18n.language === 'gu' ? 'font-bold text-[#0B5D34]' : ''
                  }`}
                >
                  <span>ગુજરાતી</span>
                  {i18n.language === 'gu' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('hi')}
                  className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                    i18n.language === 'hi' ? 'font-bold text-[#0B5D34]' : ''
                  }`}
                >
                  <span>हिन्दी</span>
                  {i18n.language === 'hi' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                    i18n.language === 'en' ? 'font-bold text-[#0B5D34]' : ''
                  }`}
                >
                  <span>English</span>
                  {i18n.language === 'en' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                </button>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/60 shadow-sm hover:scale-105 transition-transform"
            title="Profile"
          >
            <img
              src={getProfileImageUrl(user)}
              alt="Farmer Profile"
              className="w-full h-full object-cover"
            />
          </Link>

        </div>

      </div>

      {/* Pill Search Bar */}
      <div className="mt-4 relative">
        <div className="flex items-center bg-[#084828]/90 border border-emerald-700/50 rounded-full px-3.5 py-2.5 shadow-inner">
          <Search className="w-4 h-4 text-emerald-200 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder={t('home.searchPlaceholder', 'અહીં શોધો...')}
            className="w-full bg-transparent text-white placeholder-emerald-200/70 text-[13px] outline-none font-medium"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-1 text-emerald-200 hover:text-white rounded-full transition-colors ${
              isListening ? 'animate-pulse text-red-400' : ''
            }`}
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* District Selector Modal */}
      {districtsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-gray-900 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-[16px] text-[#0B5D34]">જિલ્લો પસંદ કરો (Select District)</h3>
              <button
                type="button"
                onClick={() => setDistrictsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-2 space-y-1 flex-1">
              {districtsList.map((d) => (
                <button
                  key={d.id || d.name}
                  type="button"
                  onClick={() => {
                    const chosen = {
                      name: d.district_name || d.name,
                      district_name: d.district_name || d.name,
                      id: d.id,
                      latitude: d.latitude,
                      longitude: d.longitude,
                      state: d.state_name || (typeof d.state === 'string' ? d.state : 'Gujarat')
                    };
                    if (onSelectDistrict) onSelectDistrict(chosen);
                    if (setManualDistrict) setManualDistrict(chosen);
                    setDistrictsModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] flex items-center justify-between transition-colors ${
                    (currentDistrict?.id === d.id || currentDistrict?.district === (d.district_name || d.name) || currentDistrict?.name === (d.district_name || d.name))
                      ? 'bg-emerald-50 text-[#0B5D34] font-bold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{translateLocation(d.district_name || d.name, i18n.language)} ({translateLocation(typeof d.state === 'string' ? d.state : 'Gujarat', i18n.language)})</span>
                  {(currentDistrict?.id === d.id || currentDistrict?.district === (d.district_name || d.name) || currentDistrict?.name === (d.district_name || d.name)) && (
                    <Check className="w-4 h-4 text-[#0B5D34]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  if (requestDeviceLocation) {
                    requestDeviceLocation(true);
                  }
                  setDistrictsModalOpen(false);
                }}
                className="w-full py-2 bg-[#0B5D34] text-white text-[13px] font-semibold rounded-xl hover:bg-[#084828] transition-colors"
              >
                મારું વર્તમાન સ્થાન વાપરો (Use Current GPS)
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default MobileHeader;