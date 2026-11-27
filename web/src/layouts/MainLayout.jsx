import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link, NavLink } from 'react-router-dom';
import {
  Home,
  Sprout,
  Layers,
  CloudSun,
  Stethoscope,
  TrendingUp,
  Info,
  User,
  LogOut,
  Globe,
  Check,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getProfileImageUrl } from '../utils/imageUrl';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileFacilityDrawer from '../components/mobile/MobileFacilityDrawer';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { setLanguage: setGlobalLanguage } = useApp();

  const [cropsDrawerOpen, setCropsDrawerOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (lng) => {
    if (setGlobalLanguage) setGlobalLanguage(lng);
    else i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav.home', 'હોમ (Home)'), icon: Home },
    { to: '/crops', label: t('nav.crops', 'પાક (Crops)'), icon: Sprout },
    { to: '/soil', label: t('nav.soil', 'જમીન (Soil)'), icon: Layers },
    { to: '/weather', label: t('nav.weather', 'હવામાન (Weather)'), icon: CloudSun },
    { to: '/diagnostics', label: t('nav.diagnostics', 'રોગ નિદાન (Diagnostics)'), icon: Stethoscope },
    { to: '/market', label: t('nav.market', 'બજાર ભાવ (Market)'), icon: TrendingUp },
    { to: '/about', label: t('nav.about', 'અમારા વિશે (About)'), icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F1] flex flex-col text-gray-900 font-sans selection:bg-emerald-200">
      
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP NAVIGATION BAR (visible on md: and larger screens)
         ───────────────────────────────────────────────────────────── */}
      <header className="hidden md:block bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/applogo.jpg"
              alt="SmartKrushi Logo"
              className="w-11 h-11 rounded-xl shadow-xs object-cover border border-emerald-900/20 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-extrabold text-[#0B5D34] tracking-tight leading-tight">
                  SmartKrushi
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  AI Krushi
                </span>
              </div>
              <p className="text-[12px] font-semibold text-emerald-800/80 -mt-0.5">
                સ્માર્ટ કૃષિ સહાયક
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B5D34] text-white shadow-xs'
                      : 'text-gray-700 hover:text-[#0B5D34] hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: Language & Auth Profile */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[12px] font-bold text-gray-700 cursor-pointer transition-colors"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-[#0B5D34]" />
                <span className="uppercase">{i18n.language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-150 py-1.5 z-50 text-[13px]">
                  <button
                    onClick={() => handleLanguageChange('gu')}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      i18n.language === 'gu' ? 'font-bold text-[#0B5D34]' : 'text-gray-700'
                    }`}
                  >
                    <span>ગુજરાતી</span>
                    {i18n.language === 'gu' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      i18n.language === 'hi' ? 'font-bold text-[#0B5D34]' : 'text-gray-700'
                    }`}
                  >
                    <span>हिन्दी</span>
                    {i18n.language === 'hi' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      i18n.language === 'en' ? 'font-bold text-[#0B5D34]' : 'text-gray-700'
                    }`}
                  >
                    <span>English</span>
                    {i18n.language === 'en' && <Check className="w-3.5 h-3.5 text-[#0B5D34]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated Farmer Profile / Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <img
                    src={getProfileImageUrl(user)}
                    alt="Farmer Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600 shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">
                      {user?.full_name || user?.username || 'ખેડૂત મિત્ર'}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700 leading-tight">
                      {user?.district ? `${user.district}, ${user.state || 'ગુજરાત'}` : (user?.phone_number || 'પ્રોફાઇલ જુઓ')}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-[13px] font-bold text-[#0B5D34] hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {t('auth.login', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-[13px] font-bold text-white bg-[#0B5D34] hover:bg-[#084828] rounded-lg shadow-xs transition-colors"
                >
                  {t('auth.register', 'Register')}
                </Link>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT OUTLET (Full Responsive Width)
         ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. DESKTOP FOOTER (visible on md: and larger screens)
         ───────────────────────────────────────────────────────────── */}
      <footer className="hidden md:block bg-white border-t border-emerald-900/10 mt-12 py-8 text-gray-600 text-[13px]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/applogo.jpg" alt="SmartKrushi" className="w-8 h-8 rounded-lg object-cover border border-emerald-900/15" />
            <div>
              <span className="font-bold text-[#0B5D34]">SmartKrushi</span> — સ્માર્ટ કૃષિ સહાયક
              <p className="text-[11px] text-gray-500">ગુજરાતના ખેડૂતો માટે ડિજિટલ કૃષિ અને હવામાન સેવા</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] font-semibold text-gray-600">
            <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <PhoneCall className="w-3.5 h-3.5" />
              કિસાન કોલ સેન્ટર: 1800-180-1551 (ટોલ ફ્રી)
            </span>
            <Link to="/about" className="hover:text-[#0B5D34] transition-colors">અમારા વિશે</Link>
            <Link to="/market" className="hover:text-[#0B5D34] transition-colors">બજાર ભાવ</Link>
            <Link to="/weather" className="hover:text-[#0B5D34] transition-colors">હવામાન</Link>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE APP BOTTOM NAVIGATION BAR (hidden on desktop md:)
         ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden">
        <MobileBottomNav
          onOpenCrops={() => setCropsDrawerOpen(true)}
        />
      </div>

      {/* Crops Directory Drawer for Mobile */}
      {cropsDrawerOpen && (
        <MobileFacilityDrawer
          activeType="crops"
          onClose={() => setCropsDrawerOpen(false)}
        />
      )}

    </div>
  );
};

export default MainLayout;
