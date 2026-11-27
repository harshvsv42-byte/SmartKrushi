import { Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="bg-[#F5F7F9] border-t border-[#E5E7EB] py-[24px]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[16px]">
          
          <div className="flex flex-col text-center md:text-left">
            <h4 className="font-bold text-[13px] text-[#111827] tracking-tight">AgroIntel Direct</h4>
            <p className="text-[11px] text-[#6B7280] mt-[2px]">© 2024 AgroIntel Direct. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-[24px] text-[12px] font-semibold text-[#4B5563]">
            <Link to="#" className="hover:text-[#111827] transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-[#111827] transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-[#111827] transition-colors">Government Helpline</Link>
            <Link to="#" className="hover:text-[#111827] transition-colors">Agricultural News</Link>
          </div>

          <div className="flex items-center gap-[12px]">
            <button className="w-[36px] h-[36px] rounded-full bg-[#E5E9F3] flex items-center justify-center hover:bg-[#D4DBEB] transition-colors">
              <Share2 className="w-[16px] h-[16px] text-[#4B5563]" />
            </button>
            <button className="w-[36px] h-[36px] rounded-full bg-[#E5E9F3] flex items-center justify-center hover:bg-[#D4DBEB] transition-colors">
              <Download className="w-[16px] h-[16px] text-[#4B5563]" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
