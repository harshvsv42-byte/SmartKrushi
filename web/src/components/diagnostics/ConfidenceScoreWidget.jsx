const ConfidenceScoreWidget = ({ activeReport }) => {
  const scorePercent = activeReport?.confidence_score
    ? Math.round(activeReport.confidence_score * 100)
    : 94;

  const affectedArea = activeReport?.affected_area_percent
    ? `${activeReport.affected_area_percent}%`
    : '3%';

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[24px] h-full flex flex-col justify-center">
      <div className="flex justify-between items-end mb-[16px]">
        <h3 className="font-semibold text-[15px] text-[#111827]">Confidence Score</h3>
        <span className="font-extrabold text-[24px] text-[#111827] leading-none">{scorePercent}%</span>
      </div>
      
      <div className="w-full bg-[#E5E9ED] h-[10px] rounded-full overflow-hidden mb-[16px]">
        <div 
          className="bg-[#0A311F] h-full rounded-full transition-all duration-700"
          style={{ width: `${scorePercent}%` }}
        ></div>
      </div>

      <p className="text-[13px] text-[#4B5563] leading-[1.6]">
        High certainty based on verified agricultural neural datasets. Affected canopy estimated at {affectedArea}. Matching patterns: Necrotic lesions, sporulation margins.
      </p>
    </div>
  );
};

export default ConfidenceScoreWidget;
