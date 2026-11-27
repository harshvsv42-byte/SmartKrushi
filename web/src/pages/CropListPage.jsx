import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Search,
  Clock,
  Calendar,
  Droplets,
  Thermometer,
  Layers,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Sprout
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cropApi } from '../api/services';
import {
  translateTimelineText,
  translateCropName,
  translateSeason,
  translateSuitableSoil,
  normalizeLang,
} from '../utils/translateData';

const CropListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { selectedLanguage, selectedCategory, setSelectedCategory, setSelectedCrop } = useApp();

  const [categories, setCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Sync category from URL param or global context
  const activeCategory = searchParams.get('category') || selectedCategory || 'all';

  // 1. Fetch categories from Django API
  useEffect(() => {
    cropApi
      .getCategories(selectedLanguage)
      .then((res) => {
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
  }, [selectedLanguage]);

  // 2. Fetch crops from Django API based on active category & language
  const fetchCrops = () => {
    setLoading(true);
    setError(null);

    const params = { lang: selectedLanguage };
    if (activeCategory && activeCategory !== 'all') {
      params.category = activeCategory;
    }

    cropApi
      .list(params)
      .then((res) => {
        const data = res.data?.results || (Array.isArray(res.data) ? res.data : []);
        setCrops(data);
      })
      .catch((err) => {
        console.error('Failed to load crops:', err);
        setError('પાક માહિતી લોડ કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCrops();
  }, [activeCategory, selectedLanguage]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleOpenCropDetails = (crop) => {
    setSelectedCrop(crop);
    navigate(`/crops/${crop.id}`);
  };

  // Filter crops locally by search query
  const filteredCrops = crops.filter((crop) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = (crop.display_name || crop.crop_name || '').toLowerCase();
    const scName = (crop.scientific_name || '').toLowerCase();
    const cat = (crop.display_category || crop.crop_category || '').toLowerCase();
    return name.includes(query) || scName.includes(query) || cat.includes(query);
  });

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 md:pb-12">
      <div className="max-w-5xl mx-auto md:px-4 md:pt-4">
        {/* Top Header */}
        <header className="bg-[#0B5D34] text-white pt-4 pb-6 px-4 rounded-b-[32px] md:rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="પાછા જાઓ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-extrabold tracking-tight">પાક માહિતી & સમયગાળો</h1>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              યોગ્ય ઋતુ, જમીન અને સમયગાળો (Growing Period)
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCrops}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
            aria-label="રીફ્રેશ કરો"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-[#084828]/90 border border-emerald-700/50 rounded-full px-3.5 py-2">
            <Search className="w-4 h-4 text-emerald-200 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="પાકનું નામ શોધો (Search Crop)..."
              className="w-full bg-transparent text-white placeholder-emerald-200/70 text-[13px] outline-none font-medium"
            />
          </div>
        </div>
      </header>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#0B5D34] text-white ring-2 ring-emerald-600/30'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70'
            }`}
          >
            બધા પાક (All)
          </button>

          {categories.map((cat) => {
            const isSelected =
              activeCategory.toLowerCase() === cat.name.toLowerCase() ||
              activeCategory.toLowerCase() === cat.id.toLowerCase();
            const displayName =
              selectedLanguage === 'gu'
                ? cat.name_gu
                : selectedLanguage === 'hi'
                ? cat.name_hi
                : cat.name_en;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0B5D34] text-white ring-2 ring-emerald-600/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70'
                }`}
              >
                <span>{displayName || cat.name}</span>
                {cat.crop_count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.crop_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 md:px-0 mt-3 space-y-3.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-[24px] p-8 shadow-xs border border-gray-150 text-center mt-2">
            <div className="w-10 h-10 border-3 border-[#0B5D34] border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
            <p className="text-[13px] font-bold text-gray-700">પાક વિગતો લોડ થઈ રહી છે...</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Django બેકએન્ડ API માંથી ડેટા પ્રાપ્ત થાય છે</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-red-200 text-center mt-2">
            <p className="text-[13px] font-semibold text-gray-800 mb-2">{error}</p>
            <button
              type="button"
              onClick={fetchCrops}
              className="px-4 py-2 bg-[#0B5D34] text-white text-[12px] font-bold rounded-xl"
            >
              ફરી પ્રયાસ કરો (Retry)
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCrops.length === 0 && (
          <div className="bg-white rounded-[24px] p-8 shadow-xs border border-gray-150 text-center mt-2">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-[14px] font-bold text-gray-700">આ કેટેગરીમાં કોઈ પાક મળ્યા નથી.</p>
            <p className="text-[12px] text-gray-400 mt-1">કૃપા કરીને અન્ય કેટેગરી પસંદ કરો અથવા સર્ચ બદલો.</p>
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className="mt-3 px-4 py-1.5 bg-[#0B5D34] text-white text-[12px] font-bold rounded-xl"
            >
              તમામ પાક જુઓ
            </button>
          </div>
        )}

        {/* Crop Cards List */}
        {!loading && filteredCrops.length > 0 && (
          filteredCrops.map((crop) => {
            const lang = normalizeLang(selectedLanguage);
            const displayName = translateCropName(crop.display_name || crop.crop_name, lang);
            const categoryName = crop.display_category || crop.crop_category;
            const seasonName = translateSeason(crop.display_season || crop.growing_season, lang);
            const duration = crop.crop_duration_days || crop.growing_days || 120;
            const timeline = crop.timeline || {};

            return (
              <div
                key={crop.id}
                onClick={() => handleOpenCropDetails(crop)}
                className="bg-white rounded-[22px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-150 hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {/* Header Row: Crop Title & Category */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[#0B3B24] tracking-tight">
                      {displayName}
                    </h3>
                    {crop.scientific_name && (
                      <p className="text-[11px] text-gray-400 italic">
                        {crop.scientific_name}
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-[#0B5D34] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {categoryName}
                  </span>
                </div>

                {/* Highlighted Time-Period & Duration Badge (સમયગાળો) */}
                <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-800 font-semibold block leading-tight">
                        પાક સમયગાળો (Duration)
                      </span>
                      <span className="text-[13px] font-extrabold text-amber-950">
                        {duration} દિવસ (Days)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-800 font-semibold block leading-tight">
                      ઋતુ (Season)
                    </span>
                    <span className="text-[12px] font-bold text-amber-900">
                      {seasonName}
                    </span>
                  </div>
                </div>

                {/* Growing Timeline Details */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-medium">
                      {lang === 'en' ? 'Sowing' : lang === 'hi' ? 'बुवाई समय' : 'વાવણી સમય'}
                    </div>
                    <div className="font-bold text-gray-800 mt-0.5 truncate">
                      {translateTimelineText(timeline.sowing_period || crop.sowing_period || 'June - July', lang)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-medium">
                      {lang === 'en' ? 'Harvest' : lang === 'hi' ? 'कटाई समय' : 'લણણી સમય'}
                    </div>
                    <div className="font-bold text-gray-800 mt-0.5 truncate">
                      {translateTimelineText(timeline.harvesting_period || crop.harvesting_period || 'October - November', lang)}
                    </div>
                  </div>
                </div>

                {/* Basic Agronomic Specs */}
                <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1 truncate max-w-[70%]">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {lang === 'en' ? 'Soil:' : lang === 'hi' ? 'मिट्टी:' : 'જમીન:'} {translateSuitableSoil(crop.suitable_soil || 'Black, Loamy', lang)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-[#0B5D34]">
                    <span>વિગતવાર માહિતી</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })
        )}

      </div>
      </div>

    </div>
  );
};

export default CropListPage;
