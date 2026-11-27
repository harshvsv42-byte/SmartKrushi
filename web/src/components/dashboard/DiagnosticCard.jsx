import { useState, useEffect } from 'react';
import { Bug, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { diagnosticsApi } from '../../api/services';

const DiagnosticCard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusState, setStatusState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestDiagnostic = async () => {
      setLoading(true);
      try {
        const response = await diagnosticsApi.list();
        if (isMounted) {
          const list = response.data || [];
          if (list.length > 0) {
            setReport(list[0]);
            setStatusState(list[0].status);
          } else {
            setReport(null);
          }
        }
      } catch (err) {
        console.error('Error fetching diagnostics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLatestDiagnostic();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!report || updating) return;
    setUpdating(true);
    try {
      await diagnosticsApi.updateStatus(report.id, newStatus);
      setStatusState(newStatus);
    } catch (err) {
      console.error('Failed to update diagnostic status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60)); // minutes
    if (diff < 60) return `${diff > 0 ? diff : 1}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-agri-surface rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-agri-border p-[24px] mt-[24px] flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#0A311F]" />
        <span className="text-[13px] text-agri-text-muted">Checking diagnostics...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-agri-surface rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-agri-border p-[24px] mt-[24px]">
        <div className="flex justify-between items-center mb-[12px]">
          <div className="flex items-center gap-[8px]">
            <Bug className="w-[18px] h-[18px] text-agri-text-main stroke-[2]" />
            <h3 className="font-bold text-[14px] text-agri-text-main">Crop Health Diagnostics</h3>
          </div>
        </div>
        <p className="text-[14px] text-agri-text-muted mb-[16px]">
          No disease detected recently. Upload or capture crop photos to scan for pests and blights.
        </p>
        <Link
          to="/diagnostics"
          className="inline-flex items-center gap-2 bg-[#0A311F] text-white px-[16px] py-[8px] rounded-lg text-[13px] font-semibold hover:bg-[#11402B] transition-colors"
        >
          Run AI Scan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const confidencePercent = report.confidence_score
    ? Math.round(report.confidence_score * 100)
    : 92;

  return (
    <div className="bg-agri-surface rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-agri-border p-[24px] mt-[24px]">
      <div className="flex justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[8px]">
          <Bug className="w-[18px] h-[18px] text-agri-text-main stroke-[2]" />
          <h3 className="font-bold text-[14px] text-agri-text-main">Diagnostic Detected</h3>
        </div>
        <div className="flex items-center gap-2">
          {statusState === 'confirmed' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              Confirmed
            </span>
          )}
          {statusState === 'dismissed' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              Dismissed
            </span>
          )}
          <span className="text-[12px] font-semibold text-agri-text-muted">
            {formatTimeAgo(report.created_at)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-[24px]">
        <div className="w-full sm:w-[130px] h-[130px] rounded-lg overflow-hidden shrink-0 border border-agri-border bg-gray-100">
          <img
            src={report.image_url || '/images/grey_leaf_spot.png'}
            alt={report.disease_name || 'Crop Disease'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/grey_leaf_spot.png';
            }}
          />
        </div>

        <div className="flex flex-col justify-between py-[2px] flex-1">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[14px] text-agri-text-main">
                Suspected {report.disease_name || 'Grey Leaf Spot'}
              </h4>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {confidencePercent}% match
              </span>
            </div>
            <p className="text-[14px] text-agri-text-muted mt-[8px] leading-[1.5]">
              {report.ai_insight ||
                (report.location_description
                  ? `Identified in ${report.location_description} with ${report.affected_area_percent || 3}% affected area.`
                  : 'Computer Vision identified suspicious markings on foliage.')}
            </p>
          </div>
          <div className="flex gap-[8px] mt-[16px]">
            <button
              onClick={() => handleUpdateStatus('confirmed')}
              disabled={updating || statusState === 'confirmed'}
              className={`${
                statusState === 'confirmed'
                  ? 'bg-[#184631] text-white cursor-default'
                  : 'bg-agri-icon-bg text-agri-icon-color hover:bg-[#D4E2DB]'
              } px-[16px] py-[6px] rounded-full text-[12px] font-bold transition-colors flex items-center gap-1.5`}
            >
              {statusState === 'confirmed' && <Check className="w-3.5 h-3.5" />}
              {statusState === 'confirmed' ? 'Confirmed' : 'Confirm'}
            </button>
            <button
              onClick={() => handleUpdateStatus('dismissed')}
              disabled={updating || statusState === 'dismissed'}
              className={`${
                statusState === 'dismissed'
                  ? 'bg-gray-200 text-gray-500 cursor-default'
                  : 'bg-white border border-agri-border text-agri-text-muted hover:bg-gray-50'
              } px-[16px] py-[6px] rounded-full text-[12px] font-bold transition-colors flex items-center gap-1.5`}
            >
              {statusState === 'dismissed' && <X className="w-3.5 h-3.5" />}
              {statusState === 'dismissed' ? 'Dismissed' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticCard;
