import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Search,
  MapPin,
  Calculator,
  X,
  ArrowUpDown,
  RefreshCw,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { marketApi } from '../../api/services';

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-600 inline mr-1" />;
  return <Minus className="w-3.5 h-3.5 text-gray-500 inline mr-1" />;
};

const MarketPricesWidget = ({ districtId }) => {
  const { t, i18n } = useTranslation();

  const [prices, setPrices] = useState([]);
  const [mandis, setMandis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unitMode, setUnitMode] = useState('20kg'); // '20kg' (મણ) or 'quintal' (100 kg)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Mandi Calculator State
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcCrop, setCalcCrop] = useState(null);
  const [calcQuantity, setCalcQuantity] = useState('20');
  const [calcUnit, setCalcUnit] = useState('man'); // 'man' (મણ) or 'quintal' or 'kg'
  const [calcRate, setCalcRate] = useState('');

  const fetchPrices = () => {
    setIsLoading(true);
    setError(null);

    const params = {
      include_meta: true,
      ...(selectedMandi !== 'all' ? { mandi: selectedMandi } : {}),
      ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}),
      ...(searchQuery.trim() ? { crop: searchQuery.trim() } : {})
    };

    marketApi.prices(params)
      .then((res) => {
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.prices || []);
          setPrices(list);
          if (res.data.mandis) setMandis(res.data.mandis);
          if (res.data.categories) setCategories(res.data.categories);
          setLastUpdated(res.data.last_updated || new Date().toLocaleTimeString());
        }
      })
      .catch((err) => {
        console.error('Error fetching market prices:', err);
        setError('બજાર ભાવ પ્રાપ્ત કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedMandi, selectedCategory]);

  // Client-side search filtering
  const filteredPrices = useMemo(() => {
    if (!searchQuery.trim()) return prices;
    const q = searchQuery.toLowerCase().trim();
    return prices.filter((p) =>
      p.crop_name?.toLowerCase().includes(q) ||
      p.crop_name_gu?.toLowerCase().includes(q) ||
      p.mandi?.toLowerCase().includes(q) ||
      p.mandi_gu?.toLowerCase().includes(q) ||
      p.variety?.toLowerCase().includes(q)
    );
  }, [prices, searchQuery]);

  const openCalculator = (priceItem) => {
    setCalcCrop(priceItem);
    const rate = unitMode === '20kg'
      ? (priceItem.price_20kg_modal || Math.round(priceItem.modal_price / 5))
      : priceItem.modal_price;
    setCalcRate(String(rate));
    setCalcUnit(unitMode === '20kg' ? 'man' : 'quintal');
    setCalcOpen(true);
  };

  // Calculator total
  const calculatedResult = useMemo(() => {
    const qty = parseFloat(calcQuantity) || 0;
    const rate = parseFloat(calcRate) || 0;
    if (qty <= 0 || rate <= 0) return { total: 0, weightKg: 0, manCount: 0 };

    let weightKg = 0;
    let total = 0;

    if (calcUnit === 'man') {
      weightKg = qty * 20;
      total = qty * rate; // rate per man
    } else if (calcUnit === 'quintal') {
      weightKg = qty * 100;
      total = qty * rate; // rate per quintal
    } else {
      // kg
      weightKg = qty;
      const ratePerKg = (rate / 20);
      total = qty * ratePerKg;
    }

    const manCount = (weightKg / 20).toFixed(1);
    const quintalCount = (weightKg / 100).toFixed(2);

    return { total: Math.round(total), weightKg, manCount, quintalCount };
  }, [calcQuantity, calcRate, calcUnit]);

  return (
    <div className="w-full">
      
      {/* Header with Title, Last Update, Unit Toggle, and Calculator button */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150 p-4 sm:p-5 mb-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-[19px] font-extrabold text-[#0B3B24] tracking-tight">
                ગુજરાત APMC બજાર ભાવ (Mandi Rates)
              </h2>
            </div>
            <p className="text-[12px] text-gray-500 mt-0.5">
              ગોંડલ, રાજકોટ, ઊંઝા, મહુવા સહિત ગુજરાતના મુખ્ય માર્કેટ યાર્ડના દૈનિક લાઈવ હરાજી ભાવ
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Unit Switcher: 20kg (મણ) vs Quintal */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setUnitMode('20kg')}
                className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                  unitMode === '20kg'
                    ? 'bg-[#0B5D34] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ₹ / ૨૦ કિલો (મણ)
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('quintal')}
                className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                  unitMode === 'quintal'
                    ? 'bg-[#0B5D34] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ₹ / ક્વિન્ટલ
              </button>
            </div>

            {/* Mandi Calculator Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (prices.length > 0 && !calcCrop) {
                  openCalculator(prices[0]);
                } else {
                  setCalcOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5D34] border border-emerald-200 rounded-xl text-[12px] font-bold transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>મણ કેલ્ક્યુલેટર</span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchPrices}
              disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-[#0B5D34] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="રીફ્રેશ કરો"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0B5D34]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Row: Mandi Selector & Search Box */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3">
          
          {/* APMC Mandi Selector */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
              માર્કેટ યાર્ડ પસંદ કરો (APMC Mandi)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedMandi}
                onChange={(e) => setSelectedMandi(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-800 outline-none focus:border-[#0B5D34] transition-colors"
              >
                <option value="all">સમગ્ર ગુજરાત (બધા માર્કેટ યાર્ડ)</option>
                {mandis.filter(m => m.id !== 'all').map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name_gu} ({m.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-7">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
              પાક શોધો (Search Crop)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="દા.ત. કપાસ, જીરું, મગફળી, ઘઉં, Cumin, Cotton..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#0B5D34] transition-colors"
              />
            </div>
          </div>

        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-gray-100">
          {[
            { id: 'all', label_gu: 'બધા પાક' },
            { id: 'cash_crop', label_gu: 'રોકડિયા પાક (કપાસ)' },
            { id: 'oilseeds', label_gu: 'તેલીબિયાં (મગફળી, એરંડા, રાયડો)' },
            { id: 'spices', label_gu: 'મસાલા (જીરું, વરિયાળી, ઈસબગુલ)' },
            { id: 'grains', label_gu: 'અનાજ & કઠોળ (ઘઉં, ચણા, બાજરી)' },
            { id: 'vegetables', label_gu: 'શાકભાજી (ડુંગળી, લસણ, બટાટા)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B5D34] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label_gu}
            </button>
          ))}
        </div>

      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-150 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B5D34] mx-auto mb-2" />
          <p className="text-[14px] font-bold text-gray-700">ગુજરાત APMC બજાર ભાવ લોડ થઈ રહ્યા છે...</p>
          <p className="text-[12px] text-gray-400 mt-1">લાઈવ મંડી હરાજી ડેટાબેઝમાંથી માહિતી લાવવામાં આવે છે</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center text-red-700">
          <p className="font-bold text-[13px]">{error}</p>
          <button
            type="button"
            onClick={fetchPrices}
            className="mt-2 px-4 py-1.5 bg-[#0B5D34] text-white text-[12px] font-bold rounded-lg"
          >
            ફરી પ્રયાસ કરો
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredPrices.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-150 shadow-xs">
          <Scale className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-[14px] font-bold text-gray-700">પસંદ કરેલ માર્કેટ યાર્ડ અથવા કેટેગરીમાં કોઈ ભાવ મળ્યા નથી.</p>
          <p className="text-[12px] text-gray-400 mt-1">કૃપા કરીને અન્ય યાર્ડ પસંદ કરો અથવા સર્ચ ફિલ્ટર હટાવો.</p>
          <button
            type="button"
            onClick={() => { setSelectedMandi('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 px-4 py-1.5 bg-[#0B5D34] text-white text-[12px] font-bold rounded-lg"
          >
            તમામ ગુજરાત બજાર ભાવ જુઓ
          </button>
        </div>
      )}

      {/* Prices List Cards */}
      {!isLoading && !error && filteredPrices.length > 0 && (
        <div className="space-y-3">
          {filteredPrices.map((item) => {
            const is20Kg = unitMode === '20kg';
            const modalPrice = is20Kg ? (item.price_20kg_modal || Math.round(item.modal_price / 5)) : item.modal_price;
            const minPrice = is20Kg ? (item.price_20kg_min || Math.round(item.min_price / 5)) : item.min_price;
            const maxPrice = is20Kg ? (item.price_20kg_max || Math.round(item.max_price / 5)) : item.max_price;
            const unitLabel = is20Kg ? '૨૦ કિલો (મણ)' : 'ક્વિન્ટલ';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-150 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Crop Info & Mandi */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-[#0B5D34] font-black text-[14px]">
                    {item.crop_name_gu ? item.crop_name_gu.substring(0, 2) : 'પાક'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[17px] font-extrabold text-[#0B3B24] tracking-tight">
                        {item.crop_name_gu || item.crop_name}
                      </h3>
                      <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200">
                        {item.variety}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1 flex-wrap font-medium">
                      <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {item.mandi_gu || item.mandi}
                      </span>
                      <span>•</span>
                      <span>આવક: <strong className="text-gray-800">{item.arrival_qty || 'વ્યવસ્થિત'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Prices & Calculate action */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  
                  {/* Min / Max Range */}
                  <div className="text-left md:text-right">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase">
                      નીચો - ઊંચો ભાવ ({unitLabel})
                    </p>
                    <p className="text-[13px] font-bold text-gray-700">
                      ₹{minPrice?.toLocaleString('en-IN')} - ₹{maxPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Modal/Average Price with Trend */}
                  <div className="text-right min-w-[120px]">
                    <p className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide">
                      સરેરાશ બજાર ભાવ
                    </p>
                    <div className="text-[22px] font-black text-[#0B3B24] tracking-tight leading-none mt-0.5">
                      ₹{modalPrice?.toLocaleString('en-IN')}
                      <span className="text-[11px] font-bold text-gray-500 ml-1">/{is20Kg ? 'મણ' : 'ક્વિ.'}</span>
                    </div>
                    <div className={`text-[11px] font-bold mt-1 ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                      <TrendIcon trend={item.trend} />
                      {item.change_text || (item.change_pct ? `${item.change_pct}%` : 'સ્થિર')}
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <button
                    type="button"
                    onClick={() => openCalculator(item)}
                    className="p-2.5 bg-emerald-50 hover:bg-[#0B5D34] text-[#0B5D34] hover:text-white rounded-xl border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                    title="આ ભાવથી ગણતરી કરો (Mandi Calculator)"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE GUJARAT MANDI CALCULATOR MODAL (મણ ગણતરી)
         ───────────────────────────────────────────────────────────── */}
      {calcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-150 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#0B5D34]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] text-[#0B3B24]">
                    ગુજરાત મંડી ભાવ કેલ્ક્યુલેટર
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {calcCrop?.crop_name_gu || calcCrop?.crop_name || 'પાક ગણતરી'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCalcOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              
              {/* Quantity & Unit Selection */}
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">
                  જથ્થો (Quantity)
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="number"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(e.target.value)}
                    min="1"
                    className="col-span-7 px-3.5 py-2 border border-gray-200 rounded-xl font-bold text-[15px] outline-none focus:border-[#0B5D34]"
                    placeholder="દા.ત. 25"
                  />
                  <select
                    value={calcUnit}
                    onChange={(e) => setCalcUnit(e.target.value)}
                    className="col-span-5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[13px] text-gray-800 outline-none focus:border-[#0B5D34]"
                  >
                    <option value="man">મણ (20 kg)</option>
                    <option value="quintal">ક્વિન્ટલ (100 kg)</option>
                    <option value="kg">કિલોગ્રામ (kg)</option>
                  </select>
                </div>
              </div>

              {/* Rate per Man / Quintal */}
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">
                  ભાવ પ્રતિ {calcUnit === 'man' ? '૨૦ કિલો (મણ)' : calcUnit === 'quintal' ? 'ક્વિન્ટલ (૧૦૦ કિલો)' : 'કિલો'} (₹)
                </label>
                <input
                  type="number"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                  min="1"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold text-[16px] text-emerald-900 outline-none focus:border-[#0B5D34]"
                  placeholder="દા.ત. 1540"
                />
              </div>

              {/* Calculation Summary Card */}
              <div className="bg-[#0B3B24] text-white rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                  અંદાજિત કુલ વેચાણ રકમ (Total Amount)
                </span>
                <div className="text-[28px] font-black tracking-tight text-white mt-0.5">
                  ₹{calculatedResult.total.toLocaleString('en-IN')}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/15 text-[12px] text-emerald-100 font-medium">
                  <div>
                    કુલ વજન: <strong className="text-white">{calculatedResult.weightKg} કિલો</strong>
                  </div>
                  <div className="text-right">
                    કુલ મણ: <strong className="text-white">{calculatedResult.manCount} મણ</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setCalcOpen(false)}
                className="w-full py-2.5 bg-[#0B5D34] hover:bg-[#084828] text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer"
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

export default MarketPricesWidget;
