import React, { useState, useEffect } from 'react';
import { X, Calendar, Droplets, AlertTriangle, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';
import { marketApi, soilApi, alertsApi, cropApi } from '../../api/services';
import { useNavigate } from 'react-router-dom';

const MobileFacilityDrawer = ({ activeType, onClose, districtName }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeType) return;
    setLoading(true);

    if (activeType === 'calendar') {
      marketApi.calendar()
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else if (activeType === 'soil') {
      soilApi.get(districtName)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else if (activeType === 'alerts') {
      alertsApi.briefing()
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else if (activeType === 'crops') {
      cropApi.list()
        .then((res) => setData(res.data?.results || res.data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [activeType, districtName]);

  if (!activeType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-white w-full max-w-[440px] rounded-t-[32px] sm:rounded-[32px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-150">

        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-gray-100 bg-[#F0F4F1]">
          <div className="flex items-center gap-2">
            {activeType === 'calendar' && <Calendar className="w-5 h-5 text-[#0284C7]" />}
            {activeType === 'soil' && <Droplets className="w-5 h-5 text-[#15803D]" />}
            {activeType === 'alerts' && <AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
            {activeType === 'crops' && <Sprout className="w-5 h-5 text-[#15803D]" />}
            <h3 className="font-bold text-[16px] text-[#0B3B24]">
              {activeType === 'calendar' && 'પાક કેલેન્ડર & સમયગાળો (Crop Calendar)'}
              {activeType === 'soil' && `જમીન વિશ્લેષણ - ${districtName || 'Gujarat'}`}
              {activeType === 'alerts' && 'હવામાન & જોખમ ચેતવણીઓ (Alerts)'}
              {activeType === 'crops' && 'તમામ પાક & ખેતરો (All Crops Directory)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-400 animate-pulse text-[13px]">
              માહિતી લોડ થઈ રહી છે... (Loading dynamic data)
            </div>
          ) : (
            <>
              {/* 1. Calendar View */}
              {activeType === 'calendar' && (
                <div className="space-y-3">
                  {data && data.length > 0 ? (
                    data.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${item.status === 'current'
                          ? 'bg-blue-50/70 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[13px] text-gray-900">{item.crop_name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.status === 'current'
                              ? 'bg-blue-600 text-white'
                              : item.status === 'upcoming'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[12px] font-semibold text-gray-700 mt-1">{item.stage}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {item.start_date} થી {item.end_date}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-gray-600 mt-1.5 bg-white p-2 rounded-lg border border-gray-100">
                            💡 {item.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">કોઈ કેલેન્ડર ઇવેન્ટ્સ મળ્યા નથી.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/market');
                    }}
                    className="w-full py-2.5 bg-[#0B5D34] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5"
                  >
                    સંપૂર્ણ બજાર & કેલેન્ડર જુઓ <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 2. Soil View */}
              {activeType === 'soil' && (
                <div className="space-y-4">
                  {data ? (
                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                          <span className="text-[11px] text-emerald-800 font-medium">નાઇટ્રોજન (N)</span>
                          <div className="text-[18px] font-extrabold text-[#0B5D34] mt-0.5">{data.nitrogen} kg/ha</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">{data.nitrogen_status}</span>
                        </div>
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                          <span className="text-[11px] text-emerald-800 font-medium">ફોસ્ફરસ (P)</span>
                          <div className="text-[18px] font-extrabold text-[#0B5D34] mt-0.5">{data.phosphorus} kg/ha</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">{data.phosphorus_status}</span>
                        </div>
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                          <span className="text-[11px] text-emerald-800 font-medium">પોટેશિયમ (K)</span>
                          <div className="text-[18px] font-extrabold text-[#0B5D34] mt-0.5">{data.potassium} kg/ha</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">{data.potassium_status}</span>
                        </div>
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                          <span className="text-[11px] text-emerald-800 font-medium">જમીન pH / ભેજ</span>
                          <div className="text-[18px] font-extrabold text-[#0B5D34] mt-0.5">{data.ph_level} pH</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">ભેજ: {data.moisture_percentage}%</span>
                        </div>
                      </div>

                      {data.recommendations && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[12px] text-amber-900">
                          <strong>ખાતર સલાહ:</strong> {data.recommendations}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">આ સ્થાન માટે જમીન ડેટા ઉપલબ્ધ નથી.</p>
                  )}
                </div>
              )}

              {/* 3. Alerts View */}
              {activeType === 'alerts' && (
                <div className="space-y-3">
                  {data && data.length > 0 ? (
                    data.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-2xl border ${alert.severity === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'warning'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-emerald-50 border-emerald-200'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[13px] text-gray-900">{alert.title}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/80">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-700 mt-1">{alert.message}</p>
                        {alert.action_required && (
                          <div className="text-[11px] text-red-700 font-bold mt-1.5">
                            ⚠️ તાત્કાલિક પગલું: {alert.action_required}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">હાલમાં કોઈ જોખમ ચેતવણી નથી. ખેતી સુરક્ષિત છે!</p>
                  )}
                </div>
              )}

              {/* 4. Crops Directory */}
              {activeType === 'crops' && (
                <div className="space-y-3">
                  {data && data.length > 0 ? (
                    data.map((crop) => (
                      <div
                        key={crop.id}
                        className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[14px] text-gray-900">{crop.name_gu || crop.name}</div>
                          <div className="text-[11px] text-gray-500">
                            ઋતુ: {crop.season} | સમયગાળો: {crop.growing_days} દિવસ
                          </div>
                          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            અપેક્ષિત ઉત્પાદન: {crop.expected_yield}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#0B5D34] bg-emerald-50 px-2.5 py-1 rounded-full">
                          {crop.crop_type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">પાક માહિતી લોડ થઈ શકી નથી.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default MobileFacilityDrawer;
