import { Mic } from 'lucide-react';

const FloatingActionButton = () => {
  return (
    <button className="fixed bottom-[32px] right-[32px] w-[56px] h-[56px] bg-[#06291C] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#093B28] transition-transform hover:scale-105 z-50">
      <Mic className="w-[24px] h-[24px]" />
    </button>
  );
};

export default FloatingActionButton;
