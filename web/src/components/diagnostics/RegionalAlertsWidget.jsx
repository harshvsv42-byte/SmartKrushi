import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, Bug } from 'lucide-react';
import { alertsApi } from '../../api/services';

const RegionalAlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPestAlerts = async () => {
      try {
        const response = await alertsApi.list();
        if (isMounted) {
          const allAlerts = response.data || [];
          // Prioritize pest, disease, or regional alerts
          const pestList = allAlerts.filter(
            (a) => a.alert_type === 'pest' || a.is_regional
          );
          setAlerts(pestList.length > 0 ? pestList : allAlerts);
        }
      } catch (err) {
        console.error('Error fetching regional alerts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPestAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[24px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h3 className="font-semibold text-[15px] text-[#111827]">Regional Alerts</h3>
        <span className="bg-[#F9DBDA] text-[#D7392E] text-[11px] font-bold px-[8px] py-[2px] rounded-full">
          {alerts.length} active
        </span>
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#0A311F]" />
          <span className="text-[12px] text-[#4B5563]">Loading regional alerts...</span>
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-[12px] text-[#4B5563]">No active regional pest alerts.</p>
      ) : (
        <div className="space-y-[20px]">
          {alerts.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-[16px]">
                <div className="w-[36px] h-[36px] rounded-md overflow-hidden shrink-0 border border-[#E5E7EB] bg-gray-50 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[14px] text-[#111827] group-hover:text-[#0A311F] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#4B5563] mt-[2px] line-clamp-1">
                    {item.district_name ? `${item.district_name} - ` : ''}{item.message}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionalAlertsWidget;
