import { useState, useEffect } from 'react';
import { Droplet, Snowflake, Leaf, AlertTriangle, Bug, Wrench, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { alertsApi } from '../../api/services';

const getAlertIcon = (type) => {
  switch (type) {
    case 'irrigation':
      return {
        icon: <Droplet className="w-[20px] h-[20px] text-white stroke-[2]" />,
        bgColor: 'bg-[#184631]',
        borderLeft: 'border-l-[#0A311F]',
      };
    case 'frost':
      return {
        icon: <Snowflake className="w-[20px] h-[20px] text-[#D7392E] stroke-[2]" />,
        bgColor: 'bg-[#F9DBDA]',
        borderLeft: 'border-l-[#F9DBDA]',
      };
    case 'pest':
      return {
        icon: <Bug className="w-[20px] h-[20px] text-[#D7392E] stroke-[2]" />,
        bgColor: 'bg-[#FEE2E2]',
        borderLeft: 'border-l-[#EF4444]',
      };
    case 'equipment':
      return {
        icon: <Wrench className="w-[20px] h-[20px] text-[#B45309] stroke-[2]" />,
        bgColor: 'bg-[#FEF3C7]',
        borderLeft: 'border-l-[#F59E0B]',
      };
    case 'crop':
    default:
      return {
        icon: <Leaf className="w-[20px] h-[20px] text-[#558166] stroke-[2]" />,
        bgColor: 'bg-[#D4E8DC]',
        borderLeft: 'border-l-[#0A311F]',
      };
  }
};

const MorningBriefingList = () => {
  const { t, i18n } = useTranslation();
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionDone, setActionDone] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchBriefings = async () => {
      setLoading(true);
      try {
        const response = await alertsApi.briefing();
        if (isMounted) {
          setBriefings(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching morning briefing:', err);
          setError('Failed to load morning briefing.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBriefings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = (id) => {
    setActionDone((prev) => ({ ...prev, [id]: true }));
  };

  const getLocalizedTitle = (item) => {
    const lang = i18n.language;
    if (lang === 'gu' && item.title_gu) return item.title_gu;
    if (lang === 'hi' && item.title_hi) return item.title_hi;
    return item.title;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[32px] flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#0A311F]" />
        <span className="text-[14px] text-[#4B5563]">Loading morning briefing...</span>
      </div>
    );
  }

  if (error || briefings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-[24px] text-center">
        <p className="text-[14px] text-[#4B5563]">
          {error ? error : 'No urgent alerts or briefings for today. All farm systems normal.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[16px]">
      {briefings.map((item) => {
        const style = getAlertIcon(item.alert_type);
        const isCompleted = actionDone[item.id];

        return (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-y border-r border-[#E5E7EB] border-l-[4px] ${style.borderLeft} p-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[20px] transition-all`}
          >
            <div className="flex items-start gap-[20px] flex-grow">
              <div
                className={`w-[42px] h-[42px] rounded-full ${style.bgColor} flex items-center justify-center shrink-0 mt-[2px]`}
              >
                {style.icon}
              </div>
              <div>
                <h4 className="font-bold text-[16px] text-[#111827]">
                  {getLocalizedTitle(item)}
                </h4>
                <p className="text-[#4B5563] text-[14px] mt-[4px] max-w-sm leading-[1.4]">
                  {item.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAction(item.id)}
              disabled={isCompleted}
              className={`${
                isCompleted
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-default'
                  : 'bg-[#0A311F] text-white hover:bg-[#11402B]'
              } text-[13px] font-semibold py-[10px] px-[24px] rounded-full transition-colors shrink-0 self-start sm:self-center`}
            >
              {isCompleted ? 'Completed' : item.action_label || 'Take Action'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MorningBriefingList;
