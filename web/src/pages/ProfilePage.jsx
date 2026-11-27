/**
 * ProfilePage: displays and edits user profile data from the Django backend.
 * Follows the existing app design system exactly.
 * Edit button in top-right enables inline editing with Save/Cancel.
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, Save, X, Loader2, Camera, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { profileApi } from '../api/services';
import { getProfileImageUrl } from '../utils/imageUrl';
import { translateLocation, translateCropName, getLanguageLabel, transliterateText, normalizeLang } from '../utils/translateData';

const LANGUAGE_OPTIONS = [
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
];

const Field = ({ label, value, name, isEditing, onChange, type = 'text', options }) => (
  <div className="flex flex-col gap-[4px]">
    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">{label}</label>
    {isEditing ? (
      options ? (
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className="border border-[#E5E7EB] rounded-lg px-[12px] py-[8px] text-[14px] text-[#111827] outline-none focus:border-[#06291C] transition-colors bg-white"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="border border-[#E5E7EB] rounded-lg px-[12px] py-[8px] text-[14px] text-[#111827] outline-none focus:border-[#06291C] transition-colors"
        />
      )
    ) : (
      <p className="text-[14px] text-[#111827] font-medium py-[8px]">
        {value || <span className="text-[#9CA3AF] italic">—</span>}
      </p>
    )}
  </div>
);

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { selectedLanguage, setLanguage } = useApp();
  const lang = normalizeLang(selectedLanguage || i18n.language);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const startEdit = () => {
    setFormData({
      full_name: user?.full_name || '',
      phone_number: user?.phone_number || '',
      state: user?.state || '',
      district: user?.district || '',
      taluka: user?.taluka || '',
      village: user?.village || '',
      farm_size: user?.farm_size ?? '',
      primary_crops: user?.primary_crops || '',
      preferred_language: user?.preferred_language || 'gu',
    });
    setImageFile(null);
    setImagePreview(null);
    setSuccessMsg('');
    setErrorMsg('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({});
    setImageFile(null);
    setImagePreview(null);
    setErrorMsg('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = { ...formData };
      if (imageFile) payload.profile_image = imageFile;

      const res = await profileApi.update(payload);
      updateProfile(res.data);
      if (res.data?.preferred_language && setLanguage) {
        setLanguage(res.data.preferred_language);
      }
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      setSuccessMsg(t('profile.saveSuccess', 'Profile updated successfully!'));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.values(data).flat().join(' ')
        : t('profile.saveError', 'Failed to save profile. Please try again.');
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const rawDisplayName = user?.full_name || user?.phone_number || '—';
  const displayName = user?.full_name ? transliterateText(user.full_name, lang) : rawDisplayName;
  const profileImageUrl = imagePreview || getProfileImageUrl(user, null);

  return (
    <div className="w-full relative px-4 py-6 md:py-10">
      <div className="max-w-[760px] mx-auto">

        {/* Page Header Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-5 sm:p-7 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-[#E5E9F3] flex items-center justify-center overflow-hidden border-2 border-emerald-600 shadow-sm">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#0A311F]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isEditing) startEdit();
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                className="absolute -bottom-1 -right-1 w-[26px] h-[26px] bg-[#06291C] rounded-full flex items-center justify-center border-2 border-white shadow-xs cursor-pointer hover:bg-emerald-800 transition-colors"
                title="Change photo"
              >
                <Camera className="w-[13px] h-[13px] text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div>
              <h1 className="text-[20px] font-extrabold text-[#111827] tracking-tight">{displayName}</h1>
              <p className="text-[13px] text-[#4B5563] mt-[2px]">{user?.phone_number || user?.email}</p>
              {user?.district && (
                <p className="text-[12px] font-semibold text-emerald-800 mt-[2px]">
                  📍 {translateLocation(user.district, lang)}{user.state ? `, ${translateLocation(user.state, lang)}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div className="flex items-center gap-[8px]">
            {!isEditing ? (
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={startEdit}
                  className="flex items-center gap-[6px] bg-[#E5E9F3] text-[#111827] text-[13px] font-semibold px-[14px] py-[8px] rounded-lg hover:bg-[#D4DBEB] transition-colors"
                >
                  <Edit2 className="w-[14px] h-[14px]" />
                  {t('profile.edit', 'Edit')}
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-[6px] bg-red-50 text-red-700 border border-red-200 text-[13px] font-semibold px-[14px] py-[8px] rounded-lg hover:bg-red-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-[14px] h-[14px]" />
                  {t('auth.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-[6px] bg-white border border-[#E5E7EB] text-[#4B5563] text-[13px] font-semibold px-[16px] py-[8px] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-[14px] h-[14px]" />
                  {t('profile.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-[6px] bg-[#06291C] text-white text-[13px] font-semibold px-[16px] py-[8px] rounded-lg hover:bg-[#093B28] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-[14px] h-[14px] animate-spin" />
                  ) : (
                    <Save className="w-[14px] h-[14px]" />
                  )}
                  {t('profile.save', 'Save')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMsg && (
          <div className="bg-[#D4E8DC] border border-[#A8D4BA] text-[#21513B] text-[13px] font-semibold rounded-lg px-[16px] py-[10px] mb-[16px]">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-[#F9DBDA] border border-[#F0AEAA] text-[#D7392E] text-[13px] font-semibold rounded-lg px-[16px] py-[10px] mb-[16px]">
            {errorMsg}
          </div>
        )}

        {/* Profile Fields */}
        <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[24px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <Field
              label={t('profile.fullName', 'Full Name')}
              name="full_name"
              value={isEditing ? formData.full_name : transliterateText(user?.full_name, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.phone', 'Phone Number')}
              name="phone_number"
              value={isEditing ? formData.phone_number : user?.phone_number}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.email', 'Email Address')}
              name="email"
              value={user?.email}
              isEditing={false}
              onChange={() => {}}
            />
            <Field
              label={t('profile.language', 'Preferred Language')}
              name="preferred_language"
              value={isEditing ? formData.preferred_language : getLanguageLabel(user?.preferred_language)}
              isEditing={isEditing}
              onChange={handleChange}
              options={LANGUAGE_OPTIONS}
            />
            <Field
              label={t('profile.state', 'State')}
              name="state"
              value={isEditing ? formData.state : translateLocation(user?.state, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.district', 'District')}
              name="district"
              value={isEditing ? formData.district : translateLocation(user?.district, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.taluka', 'Taluka')}
              name="taluka"
              value={isEditing ? formData.taluka : translateLocation(user?.taluka, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.village', 'Village')}
              name="village"
              value={isEditing ? formData.village : translateLocation(user?.village, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.farmSize', 'Farm Size (hectares)')}
              name="farm_size"
              type="number"
              value={isEditing ? formData.farm_size : user?.farm_size}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field
              label={t('profile.crops', 'Primary Crops')}
              name="primary_crops"
              value={isEditing ? formData.primary_crops : translateCropName(user?.primary_crops, lang)}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
