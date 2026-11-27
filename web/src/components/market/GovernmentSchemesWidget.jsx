import { useState, useEffect } from 'react';
import { Landmark, Sparkles, Loader2, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { marketApi } from '../../api/services';

const GovernmentSchemesWidget = () => {
  const { t, i18n } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const response = await marketApi.schemes();
        if (isMounted) {
          setSchemes(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching government schemes:', err);
          setError('યોજનાઓની વિગતો લોડ થઈ શકી નથી.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchemes();
    return () => {
      isMounted = false;
    };
  }, []);

  const getLocalizedName = (item) => {
    const lang = i18n.language;
    if (lang === 'gu' && item.name_gu) return item.name_gu;
    if (lang === 'hi' && item.name_hi) return item.name_hi;
    return item.name;
  };

  const getLocalizedDesc = (item) => {
    const lang = i18n.language;
    if (lang === 'gu' && item.description_gu) return item.description_gu;
    if (lang === 'hi' && item.description_hi) return item.description_hi;
    return item.description;
  };

  const getBenefit = (item) => {
    const lang = i18n.language;
    if (lang === 'gu' && item.benefit_amount_gu) return item.benefit_amount_gu;
    return item.benefit_amount;
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Title */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#0B3B24]" />
          <h2 className="text-[18px] font-extrabold text-[#0B3B24] tracking-tight">
            ગુજરાત કૃષિ યોજનાઓ & સબસિડી (i-Khedut)
          </h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150 p-5 mb-4">
        
        {/* Banner with icon */}
        <div className="flex items-start gap-3 bg-emerald-50/80 border border-emerald-200/70 rounded-xl p-3.5 mb-4">
          <Sparkles className="w-5 h-5 text-[#0B5D34] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-[14px] text-[#0B3B24] leading-tight">
              ગુજરાતના ખેડૂતો માટે સત્તાવાર સહાય પોર્ટલ
            </h3>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              ટ્રેક્ટર, ગોડાઉન, ટપક પદ્ધતિ, તાર ફેન્સીંગ અને દેશી ગાય સહાય માટે સીધી ઓનલાઈન અરજી કરો.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0B5D34]" />
            <span className="text-[13px] text-gray-600 font-medium">યોજનાઓ લોડ થઈ રહી છે...</span>
          </div>
        ) : error || schemes.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-[13px] text-gray-600 font-medium">
              {error || 'હાલમાં કોઈ યોજના ઉપલબ્ધ નથી.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {schemes.map((scheme, idx) => {
              const isExpanded = expandedId === (scheme.id || idx);

              return (
                <div
                  key={scheme.id || idx}
                  className="bg-white rounded-xl border border-gray-150 hover:border-emerald-300 transition-all p-4 shadow-2xs"
                >
                  {/* Top Bar: Title and Priority */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {scheme.portal_name || 'ગુજરાત કૃષિ વિભાગ'}
                      </span>
                      <h4 className="font-bold text-[15px] text-[#0B3B24] mt-1 leading-snug">
                        {getLocalizedName(scheme)}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : (scheme.id || idx))}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Benefit Highlight Badge */}
                  <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#0B5D34] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 my-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>સહાય રકમ: {getBenefit(scheme)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-gray-600 leading-relaxed mt-1">
                    {getLocalizedDesc(scheme)}
                  </p>

                  {/* Expanded Eligibility and Required Docs */}
                  {isExpanded && scheme.eligible_criteria && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                      <p>
                        <strong className="text-gray-700">પાત્રતા:</strong> {scheme.eligible_criteria}
                      </p>
                      <p>
                        <strong className="text-gray-700">જરૂરી દસ્તાવેજ:</strong> ૭/૧૨ અને ૮-અ ની નકલ, આધાર કાર્ડ, બેંક પાસબુક
                      </p>
                    </div>
                  )}

                  {/* Apply Button */}
                  <div className="mt-3 pt-2">
                    <a
                      href={scheme.apply_url || 'https://ikhedut.gujarat.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#0B5D34] hover:bg-[#084828] text-white text-[12px] font-bold h-9 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>આઈ-ખેડૂત પોર્ટલ પર અરજી કરો (Apply Now)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Gujarat Quick Helpline & Portals Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150 p-4 space-y-2.5">
        <p className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">
          મહત્વના ખેડૂત પોર્ટલ્સ & હેલ્પલાઈન
        </p>

        <a
          href="https://ikhedut.gujarat.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 group"
        >
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>i-Khedut Portal Gujarat (આઈ-ખેડૂત)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700" />
        </a>

        <a
          href="https://ggrc.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 group"
        >
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            <span>GGRC Drip Subsidy (ટપક પદ્ધતિ પોર્ટલ)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-700" />
        </a>

        <a
          href="https://pmkisan.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 group"
        >
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>PM-KISAN Samman Nidhi (e-KYC)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-700" />
        </a>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
          📞 <strong>કિસાન કોલ સેન્ટર ટોલ-ફ્રી નંબર:</strong> 1800-180-1551 (સવારે ૬ થી રાત્રે ૧૦ વાગ્યા સુધી નિઃશુલ્ક માર્ગદર્શન)
        </div>
      </div>

    </div>
  );
};

export default GovernmentSchemesWidget;
