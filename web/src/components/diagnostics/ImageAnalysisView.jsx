import { useRef, useState } from 'react';
import { Search, Zap, Upload, Camera, AlertTriangle, Loader2 } from 'lucide-react';

const ImageAnalysisView = ({ activeReport, onUpload, uploading }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      if (onUpload) {
        onUpload(file);
      }
    }
  };

  const currentImage = previewUrl || activeReport?.image_url || '/images/late_blight.png';
  const diseaseName = activeReport?.disease_name || 'LATE BLIGHT';

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#E5E7EB] bg-black">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Background Image */}
      <img
        src={currentImage}
        alt={diseaseName}
        className="absolute inset-0 w-full h-full object-cover object-center"
        onError={(e) => {
          e.currentTarget.src = '/images/late_blight.png';
        }}
      />

      {/* Gradient Overlay for better text readability at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>

      {/* Uploading Overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <span className="text-white text-[14px] font-medium tracking-wide">
            Analyzing foliage with Vision AI...
          </span>
        </div>
      )}

      {/* Bounding Box overlay */}
      {!uploading && (
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[45%] border-[2px] border-[#D7392E] rounded-md pointer-events-none shadow-[0_0_15px_rgba(215,57,46,0.5)]">
          {/* Label tag */}
          <div className="absolute top-0 left-0 -mt-[1px] -ml-[1px] bg-[#D7392E] text-white text-[11px] font-bold px-[8px] py-[4px] rounded-br-md rounded-tl-sm flex items-center gap-[4px] tracking-wider uppercase">
            <AlertTriangle className="w-[12px] h-[12px] stroke-[2.5]" />
            {diseaseName}
          </div>
        </div>
      )}

      {/* Bottom Left controls */}
      <div className="absolute bottom-[24px] left-[24px] flex flex-col gap-[12px] z-20">
        <span className="text-white text-[10px] font-bold tracking-wider uppercase opacity-90">
          REAL-TIME ANALYSIS
        </span>
        <div className="flex gap-[12px]">
          <button
            type="button"
            title="Inspect"
            className="w-[42px] h-[42px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          >
            <Search className="w-[20px] h-[20px] text-white stroke-[2]" />
          </button>
          <button
            type="button"
            title="AI Scan"
            className="w-[42px] h-[42px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          >
            <Zap className="w-[20px] h-[20px] text-white stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Bottom Right controls */}
      <div className="absolute bottom-[24px] right-[24px] flex gap-[12px] z-20">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-[8px] bg-white/20 backdrop-blur-md text-white text-[13px] font-semibold px-[20px] py-[12px] rounded-lg hover:bg-white/30 transition-colors border border-white/30 cursor-pointer"
        >
          <Upload className="w-[16px] h-[16px] stroke-[2]" />
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-[8px] bg-[#06291C] text-white text-[13px] font-semibold px-[20px] py-[12px] rounded-lg hover:bg-[#093B28] transition-colors border border-[#06291C] cursor-pointer"
        >
          <Camera className="w-[16px] h-[16px] stroke-[2]" />
          Use Live Camera
        </button>
      </div>
    </div>
  );
};

export default ImageAnalysisView;
