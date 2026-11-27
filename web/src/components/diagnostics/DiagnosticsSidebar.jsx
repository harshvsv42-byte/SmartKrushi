import { Cloud, Beaker, Calendar, Bell, HelpCircle, Settings } from 'lucide-react';

const DiagnosticsSidebar = () => {
  return (
    <div className="h-full flex flex-col py-[24px]">
      
      {/* Header */}
      <div className="px-[24px] mb-[32px]">
        <h2 className="text-[18px] font-bold text-[#111827]">Field Tools</h2>
        <p className="text-[12px] text-[#4B5563] mt-[2px]">AI-Driven Insights</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-[8px] px-[16px]">
        <a href="#" className="flex items-center gap-[16px] px-[16px] py-[12px] text-[14px] text-[#4B5563] hover:bg-gray-100 rounded-lg transition-colors">
          <Cloud className="w-[20px] h-[20px] stroke-[1.5]" />
          Weather Intelligence
        </a>
        <a href="#" className="flex items-center gap-[16px] px-[16px] py-[12px] text-[14px] text-[#4B5563] hover:bg-gray-100 rounded-lg transition-colors">
          <Beaker className="w-[20px] h-[20px] stroke-[1.5]" />
          Soil Analysis
        </a>
        <a href="#" className="flex items-center gap-[16px] px-[16px] py-[12px] text-[14px] font-medium text-[#0A311F] bg-[#D4E8DC] rounded-lg transition-colors">
          <Calendar className="w-[20px] h-[20px] stroke-[1.5]" />
          Crop Calendar
        </a>
        <a href="#" className="flex items-center gap-[16px] px-[16px] py-[12px] text-[14px] text-[#4B5563] hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-[20px] h-[20px] stroke-[1.5]" />
          Alerts
        </a>
      </nav>

      {/* Bottom Section */}
      <div className="px-[24px] pb-[16px]">
        <button className="w-full bg-[#06291C] text-white text-[14px] font-semibold h-[46px] rounded-[10px] hover:bg-[#093B28] transition-colors mb-[32px]">
          Generate Report
        </button>

        <div className="space-y-[8px]">
          <a href="#" className="flex items-center gap-[16px] py-[12px] text-[14px] text-[#4B5563] hover:text-[#111827] transition-colors">
            <HelpCircle className="w-[20px] h-[20px] stroke-[1.5]" />
            Support
          </a>
          <a href="#" className="flex items-center gap-[16px] py-[12px] text-[14px] text-[#4B5563] hover:text-[#111827] transition-colors">
            <Settings className="w-[20px] h-[20px] stroke-[1.5]" />
            Settings
          </a>
        </div>
      </div>

    </div>
  );
};

export default DiagnosticsSidebar;
