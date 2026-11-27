/**
 * RegisterPage: Farmer registration using existing Django RegisterSerializer fields.
 * Matches the app's green-and-white design system.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'hi', label: 'हिन्दी' },
];

const RegisterPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    phone_number: '',
    state: 'Gujarat',
    district: '',
    taluka: '',
    village: '',
    farm_size: '',
    preferred_language: 'gu',
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.username.trim()) errs.username = 'Username is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.password_confirm) errs.password_confirm = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const payload = { ...form };
      if (payload.farm_size) payload.farm_size = parseFloat(payload.farm_size);
      else delete payload.farm_size;
      // Remove empty optional fields
      ['phone_number', 'email', 'district', 'taluka', 'village'].forEach((k) => {
        if (!payload[k]) delete payload[k];
      });

      const res = await authApi.register(payload);
      const { tokens, profile } = res.data;
      // Auto-login after registration
      login(tokens, profile);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // Map field-level errors from DRF
        const fieldErrs = {};
        let hasFieldErr = false;
        Object.entries(data).forEach(([key, val]) => {
          const msg = Array.isArray(val) ? val.join(' ') : String(val);
          if (['full_name', 'username', 'email', 'password', 'password_confirm', 'phone_number', 'state', 'district', 'taluka', 'village', 'farm_size', 'preferred_language'].includes(key)) {
            fieldErrs[key] = msg;
            hasFieldErr = true;
          }
        });
        if (hasFieldErr) {
          setErrors(fieldErrs);
          // Also show non_field_errors
          if (data.non_field_errors) setGlobalError(Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : String(data.non_field_errors));
        } else {
          setGlobalError(Object.values(data).flat().join(' '));
        }
      } else {
        setGlobalError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full border ${errors[name] ? 'border-red-400' : 'border-[#E5E7EB]'} rounded-lg px-3 py-[10px] text-[14px] text-[#111827] bg-white outline-none focus:border-[#06291C] transition-colors`;

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/applogo.jpg" alt="SmartKrushi" className="w-[36px] h-[36px] rounded-lg" />
            <span className="text-[20px] font-extrabold text-[#06291C] tracking-tight">SmartKrushi</span>
          </div>
          <Link to="/login" className="text-[13px] font-semibold text-[#06291C] hover:underline">
            {t('auth.alreadyHaveAccount', 'Already have an account? Sign In')}
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-[520px]">
          <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-6 sm:p-8">
            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[44px] h-[44px] rounded-full bg-[#D4E8DC] flex items-center justify-center">
                <UserPlus className="w-[22px] h-[22px] text-[#06291C] stroke-[2]" />
              </div>
              <div>
                <h1 className="text-[20px] font-extrabold text-[#111827] tracking-tight">{t('auth.registerTitle', 'Create Account')}</h1>
                <p className="text-[13px] text-[#4B5563] mt-[2px]">{t('auth.registerSubtitle', 'Register as a farmer to get started')}</p>
              </div>
            </div>

            {globalError && (
              <div className="bg-[#F9DBDA] border border-[#F0AEAA] text-[#D7392E] text-[13px] font-semibold rounded-lg px-4 py-[10px] mb-4">
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">
                    {t('auth.fullName', 'Full Name')} <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ramesh Patel" className={inputClass('full_name')} />
                  {errors.full_name && <p className="text-[11px] text-red-500 mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">
                    {t('auth.username', 'Username')} <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="e.g. ramesh123" className={inputClass('username')} />
                  {errors.username && <p className="text-[11px] text-red-500 mt-1">{errors.username}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.email', 'Email')}</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="farmer@example.com" className={inputClass('email')} />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.phone', 'Phone Number')}</label>
                  <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="9876543210" className={inputClass('phone_number')} />
                  {errors.phone_number && <p className="text-[11px] text-red-500 mt-1">{errors.phone_number}</p>}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">
                    {t('auth.password', 'Password')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">
                    {t('auth.confirmPassword', 'Confirm Password')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} name="password_confirm" value={form.password_confirm} onChange={handleChange} placeholder="••••••••" className={inputClass('password_confirm')} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password_confirm && <p className="text-[11px] text-red-500 mt-1">{errors.password_confirm}</p>}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">{t('auth.locationDetails', 'Location & Farm Details')}</p>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.state', 'State')}</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass('state')} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.district', 'District')}</label>
                  <input type="text" name="district" value={form.district} onChange={handleChange} placeholder="e.g. Ahmedabad" className={inputClass('district')} />
                </div>
              </div>

              {/* Taluka & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.taluka', 'Taluka')}</label>
                  <input type="text" name="taluka" value={form.taluka} onChange={handleChange} placeholder="e.g. Daskroi" className={inputClass('taluka')} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.village', 'Village')}</label>
                  <input type="text" name="village" value={form.village} onChange={handleChange} placeholder="e.g. Bavla" className={inputClass('village')} />
                </div>
              </div>

              {/* Farm size & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.farmSize', 'Farm Size (hectares)')}</label>
                  <input type="number" name="farm_size" value={form.farm_size} onChange={handleChange} placeholder="e.g. 2.5" min="0" step="0.1" className={inputClass('farm_size')} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111827] mb-1 uppercase tracking-wide">{t('auth.language', 'Preferred Language')}</label>
                  <select name="preferred_language" value={form.preferred_language} onChange={handleChange} className={inputClass('preferred_language')}>
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#06291C] text-white text-[14px] font-semibold h-[46px] rounded-[10px] hover:bg-[#093B28] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : t('auth.register', 'Create Account')}
              </button>
            </form>

            <p className="mt-5 text-[12px] text-[#6B7280] text-center">
              {t('auth.terms', 'By continuing, you agree to our Terms of Service and Privacy Policy.')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
