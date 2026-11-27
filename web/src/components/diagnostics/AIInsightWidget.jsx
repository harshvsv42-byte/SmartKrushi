import { BrainCircuit } from 'lucide-react';

const AIInsightWidget = ({ activeReport }) => {
  const disease = activeReport?.disease_name || 'Phytophthora infestans';
  const customInsight = activeReport?.ai_insight;

  return (
    <div className="bg-[#FAFBFC] rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-y border-r border-[#E5E7EB] border-l-[4px] border-l-[#111827] p-[24px] h-full">
      <div className="flex items-center gap-[8px] mb-[12px]">
        <BrainCircuit className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
        <h3 className="font-semibold text-[14px] text-[#111827]">AI Insight</h3>
      </div>
      
      <p className="text-[14px] text-[#4B5563] leading-[1.6]">
        {customInsight || (
          <>
            The detected <span className="font-bold text-[#111827]">{disease}</span> requires active containment. Spreading risk is elevated based on ambient regional moisture and temperature indices.
          </>
        )}
      </p>
    </div>
  );
};

export default AIInsightWidget;
