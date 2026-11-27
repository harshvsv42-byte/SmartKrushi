import { useState, useEffect } from 'react';
import { marketApi } from '../../api/services';

const MarketPrice = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchPrices = async () => {
      try {
        const response = await marketApi.prices();
        if (isMounted) {
          const list = response.data || [];
          setPrices(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching market price index:', err);
      }
    };

    fetchPrices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute normalized heights for up to 5 items
  const maxPrice = prices.length > 0 ? Math.max(...prices.map((p) => Number(p.price_per_quintal) || 1)) : 100;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[20px] pb-[24px]">
      <div className="flex justify-between items-center mb-[24px]">
        <h3 className="font-bold text-[13px] text-[#4B5563]">Market Price Index</h3>
        {prices.length > 0 && (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Live Mandi
          </span>
        )}
      </div>
      <div className="flex items-end h-[50px] gap-[6px]">
        {prices.length === 0 ? (
          <>
            <div className="w-full bg-[#ADC4B6] rounded-[2px] h-[30%]"></div>
            <div className="w-full bg-[#ADC4B6] rounded-[2px] h-[50%]"></div>
            <div className="w-full bg-[#ADC4B6] rounded-[2px] h-[45%]"></div>
            <div className="w-full bg-[#ADC4B6] rounded-[2px] h-[75%]"></div>
            <div className="w-full bg-[#0A311F] rounded-[2px] h-[100%]"></div>
          </>
        ) : (
          prices.map((item, idx) => {
            const rawHeight = (Number(item.price_per_quintal) / maxPrice) * 100;
            const height = Math.max(25, Math.min(100, Math.round(rawHeight)));
            const isHighest = height >= 95 || idx === prices.length - 1;

            return (
              <div
                key={item.id || idx}
                title={`${item.crop_name}: ₹${item.price_per_quintal}/${item.unit || 'qtl'}`}
                className={`w-full rounded-[2px] transition-all duration-300 hover:opacity-80 cursor-pointer ${
                  isHighest ? 'bg-[#0A311F]' : 'bg-[#ADC4B6]'
                }`}
                style={{ height: `${height}%` }}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MarketPrice;
