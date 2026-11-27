/**
 * LoginPage: Password-based authentication.
 * Preserves existing design and language switcher.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username) {
      setError(t('auth.invalidUsername', 'Please enter your username or phone number.'));
      return;
    }
    if (!password) {
      setError(t('auth.invalidPassword', 'Please enter your password.'));
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.login(username, password);
      const { tokens, profile } = res.data;
      login(tokens, profile);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      let msg = t('auth.loginFailed', 'Login failed. Please try again.');
      if (typeof data?.error === 'string') {
        msg = data.error;
      } else if (typeof data?.detail === 'string') {
        msg = data.detail;
      } else if (data && typeof data === 'object') {
        msg = Object.values(data).flat().join(' ');
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/applogo.jpg" alt="SmartKrushi" className="w-[36px] h-[36px] rounded-lg object-cover shadow-xs border border-gray-200" />
            <span className="text-[20px] font-extrabold text-[#06291C] tracking-tight">SmartKrushi</span>
          </Link>
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
            >
              <span className="text-[13px] font-semibold text-[#4B5563]">🌐</span>
              <span className="text-[11px] font-bold uppercase text-[#4B5563]">{i18n.language}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-[#E5E7EB] z-50 py-1">
                <button onClick={() => changeLanguage('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'en' ? 'font-bold text-[#06291C]' : 'text-gray-700'}`}>English</button>
                <button onClick={() => changeLanguage('gu')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'gu' ? 'font-bold text-[#06291C]' : 'text-gray-700'}`}>ગુજરાતી</button>
                <button onClick={() => changeLanguage('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'hi' ? 'font-bold text-[#06291C]' : 'text-gray-700'}`}>हिन्दी</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-[32px]">
            <div className="flex items-center gap-[12px] mb-[28px]">
              <div className="w-[44px] h-[44px] rounded-full bg-[#D4E8DC] flex items-center justify-center">
                <Phone className="w-[22px] h-[22px] text-[#06291C] stroke-[2]" />
              </div>
              <div>
                <h1 className="text-[20px] font-extrabold text-[#111827] tracking-tight">{t('auth.title', 'Sign In')}</h1>
                <p className="text-[13px] text-[#4B5563] mt-[2px]">{t('auth.subtitle', 'Enter your credentials to continue')}</p>
              </div>
            </div>
            <form onSubmit={handleLogin}>
              <label className="block text-[12px] font-bold text-[#111827] mb-[6px] uppercase tracking-wide">{t('auth.usernameLabel', 'Username or Phone')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder={t('auth.usernamePlaceholder', 'e.g. farmer@example.com')}
                className="flex-1 w-full border border-[#E5E7EB] rounded-lg px-[12px] py-[12px] text-[14px] text-[#111827] bg-white outline-none focus:border-[#06291C] transition-colors mb-4"
                required
              />
              <label className="block text-[12px] font-bold text-[#111827] mb-[6px] uppercase tracking-wide">{t('auth.passwordLabel', 'Password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder={t('auth.passwordPlaceholder', '••••••••')}
                className="flex-1 w-full border border-[#E5E7EB] rounded-lg px-[12px] py-[12px] text-[14px] text-[#111827] bg-white outline-none focus:border-[#06291C] transition-colors mb-4"
                required
              />
              {error && (
                <p className="mt-[8px] text-[12px] text-[#D7392E] font-medium">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-[20px] w-full bg-[#06291C] text-white text-[14px] font-semibold h-[46px] rounded-[10px] hover:bg-[#093B28] transition-colors flex items-center justify-center gap-[8px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : t('auth.login', 'Login')}
              </button>
            </form>
            <p className="mt-[20px] text-[12px] text-[#6B7280] text-center">
              {t('auth.terms', 'By continuing, you agree to our Terms of Service and Privacy Policy.')}
            </p>
            <p className="mt-[12px] text-[13px] text-center">
              <Link to="/register" className="text-[#06291C] font-semibold hover:underline">
                {t('auth.noAccount', "Don't have an account? Register")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
