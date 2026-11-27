import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { alertsApi } from '../../api/services';

const RecentAlerts = () => {
  const { i18n } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await alertsApi.list();
        if (isMounted) {
          const list = response.data || [];
          setAlerts(list.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const getLocalizedTitle = (item) => {
    const lang = i18n.language;
    if (lang === 'gu' && item.title_gu) return item.title_gu;
    if (lang === 'hi' && item.title_hi) return item.title_hi;
    return item.title;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderIcon = (severity, type) => {
    if (severity === 'critical' || severity === 'warning' || type === 'frost' || type === 'pest') {
      return <AlertTriangle className="w-[18px] h-[18px] text-[#D7392E] shrink-0 mt-[2px] stroke-[2]" />;
    }
    if (severity === 'success') {
      return <CheckCircle className="w-[18px] h-[18px] text-[#111827] shrink-0 mt-[2px] stroke-[2]" />;
    }
    return <Info className="w-[18px] h-[18px] text-[#467456] shrink-0 mt-[2px] stroke-[2]" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[20px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h3 className="font-bold text-[14px] text-[#111827]">Recent Alerts</h3>
        <Bell className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#0A311F]" />
          <span className="text-[12px] text-[#4B5563]">Loading alerts...</span>
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-[12px] text-[#4B5563] py-2">No active alerts for your region.</p>
      ) : (
        <div className="space-y-[20px]">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex gap-[12px]">
              {renderIcon(alert.severity, alert.alert_type)}
              <div>
                <h4 className="font-bold text-[13px] text-[#111827]">
                  {getLocalizedTitle(alert)}
                </h4>
                <p className="text-[12px] text-[#4B5563] mt-[2px] line-clamp-1">
                  {formatTime(alert.created_at)} - {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
