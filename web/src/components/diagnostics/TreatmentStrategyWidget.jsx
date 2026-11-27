import { Leaf, Beaker } from 'lucide-react';

const TreatmentStrategyWidget = ({ activeReport }) => {
  const disease = activeReport?.disease_name?.toLowerCase() || '';

  const isBlight = disease.includes('blight') || disease.includes('infestans');
  const isRust = disease.includes('rust');

  return (
    <div className="bg-[#FAFBFC] rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[24px]">
      <h3 className="font-semibold text-[15px] text-[#111827] mb-[20px]">Treatment Strategy</h3>

      <div className="space-y-[16px]">
        {/* Organic Protocol */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-[20px]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <Leaf className="w-[18px] h-[18px] text-[#467456] stroke-[2]" />
            <h4 className="font-semibold text-[14px] text-[#111827]">Organic Protocol</h4>
          </div>
          <ul className="list-disc pl-[20px] text-[12px] text-[#4B5563] space-y-[6px] mb-[16px] marker:text-[#D1D5DB]">
            {isRust ? (
              <>
                <li>Neem oil or sulfur dust application</li>
                <li>Prune infected leaves in morning hours</li>
                <li>Improve field spacing to lower humidity</li>
              </>
            ) : isBlight ? (
              <>
                <li>Copper-based fungicidal soap spray</li>
                <li>Remove and isolate infected foliage immediately</li>
                <li>Improve airflow via 15% crop canopy thinning</li>
              </>
            ) : (
              <>
                <li>Bio-fungicide (Trichoderma viride 5g/L)</li>
                <li>Crop rotation with non-host legumes</li>
                <li>Balanced potassium fertilization for immunity</li>
              </>
            )}
          </ul>
          <button className="w-full bg-white border border-[#E5E7EB] text-[#111827] text-[12px] font-bold h-[36px] rounded-lg hover:bg-gray-50 transition-colors">
            Order Supplies
          </button>
        </div>

        {/* Industrial Protocol */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-[20px]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <Beaker className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
            <h4 className="font-semibold text-[14px] text-[#111827]">Industrial Protocol</h4>
          </div>
          <ul className="list-disc pl-[20px] text-[12px] text-[#4B5563] space-y-[6px] mb-[16px] marker:text-[#D1D5DB]">
            {isRust ? (
              <>
                <li>Propiconazole 25% EC (1ml/L)</li>
                <li>Spray at first appearance of pustules</li>
                <li>Ensure thorough coverage under leaf canopy</li>
              </>
            ) : isBlight ? (
              <>
                <li>Apply Chlorothalonil concentrate (5ml/L)</li>
                <li>Repeat application every 7-10 days</li>
                <li>Check pH levels of irrigation water</li>
              </>
            ) : (
              <>
                <li>Mancozeb 75% WP (2g/L) broad spectrum</li>
                <li>Alternate with systemic fungicide to avoid resistance</li>
                <li>Maintain safe pre-harvest interval</li>
              </>
            )}
          </ul>
          <button className="w-full bg-[#06291C] text-white text-[12px] font-bold h-[36px] rounded-lg hover:bg-[#093B28] transition-colors">
            Protocol PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentStrategyWidget;
