import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import ImageAnalysisView from '../components/diagnostics/ImageAnalysisView';
import ConfidenceScoreWidget from '../components/diagnostics/ConfidenceScoreWidget';
import AIInsightWidget from '../components/diagnostics/AIInsightWidget';
import TreatmentStrategyWidget from '../components/diagnostics/TreatmentStrategyWidget';
import RegionalAlertsWidget from '../components/diagnostics/RegionalAlertsWidget';
import { diagnosticsApi } from '../api/services';

const DiagnosticsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const response = await diagnosticsApi.list();
        if (isMounted) {
          const list = response.data || [];
          setReports(list);
          if (list.length > 0) {
            setActiveReport(list[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch diagnostics reports:', err);
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (imageFile) => {
    setUploading(true);
    try {
      const response = await diagnosticsApi.submit(imageFile, 'Main Field Quadrant');
      const newReport = response.data;
      setReports((prev) => [newReport, ...prev]);
      setActiveReport(newReport);
    } catch (err) {
      console.error('Failed to submit diagnostic image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full bg-[#F0F4F1] min-h-screen pb-20 md:pb-12">
      <div className="max-w-5xl mx-auto md:px-4 md:pt-4">

        {/* Green Header — consistent with Home, Weather, Soil, Market */}
        <header className="bg-[#0B5D34] text-white pt-4 pb-8 px-5 rounded-b-[32px] md:rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all"
              aria-label="પાછા જાઓ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h1 className="text-[17px] font-extrabold tracking-tight">
                રોગ નિદાન (AI Diagnostics)
              </h1>
              <p className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
                AI-Powered Crop Disease Detection
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-emerald-200" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-4 mt-4 space-y-4">

          {/* Image Upload & Analysis */}
          <ImageAnalysisView
            activeReport={activeReport}
            onUpload={handleUpload}
            uploading={uploading}
          />

          {/* Confidence Score + AI Insight - side by side on tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfidenceScoreWidget activeReport={activeReport} />
            <AIInsightWidget activeReport={activeReport} />
          </div>

          {/* Treatment Strategy */}
          <TreatmentStrategyWidget activeReport={activeReport} />

          {/* Regional Alerts */}
          <RegionalAlertsWidget />

        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;
