import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Store } from 'lucide-react';
import { marketApi } from '../../api/services';

const GujaratMandiTicker = () => {
  const [topPrices, setTopPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    marketApi.prices({ include_meta: false })
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res.data) ? res.data : (res.data?.prices || []);
          // Pick primary Gujarat crops: Cotton, Cumin, Groundnut, Wheat, Castor
          const featured = list.slice(0, 5);
          setTopPrices(featured);
        }
      })
      .catch((err) => console.error('Error loading ticker prices:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (loading || topPrices.length === 0) return null;

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#0B5D34]" />
          <h2 className="text-[17px] font-extrabold text-[#0B3B24] tracking-tight">
            આજના ગુજરાત માર્કેટ ભાવ (Mandi Bhav)
          </h2>
        </div>

        <Link
          to="/market"
          className="flex items-center gap-0.5 text-[12px] font-bold text-[#0B5D34] hover:text-[#084828] transition-colors"
        >
          <span>બધા યાર્ડ</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scrollable or Grid of Mandi Rates */}
      <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 md:mx-0 px-4 md:px-0 snap-x">
        {topPrices.map((item) => {
          const rate20 = item.price_20kg_modal || Math.round(item.modal_price / 5);
          const isUp = item.trend === 'up';
          const isDown = item.trend === 'down';

          return (
            <Link
              key={item.id}
              to="/market"
              className="w-[155px] md:w-full shrink-0 snap-start bg-white rounded-2xl p-3 border border-gray-150/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  {item.mandi_gu ? item.mandi_gu.replace(' માર્કેટ યાર્ડ', '') : item.mandi}
                </span>
                <h4 className="font-extrabold text-[14px] text-gray-900 leading-snug mt-0.5 truncate">
                  {item.crop_name_gu || item.crop_name}
                </h4>
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[16px] font-black text-[#0B3B24]">
                    ₹{rate20.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold ml-0.5">/મણ</span>
                </div>

                <div className={`text-[10px] font-extrabold flex items-center ${
                  isUp ? 'text-emerald-600' : isDown ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {isUp && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {isDown && <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
                  {item.change_pct ? `${Math.abs(item.change_pct)}%` : '0%'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GujaratMandiTicker;
