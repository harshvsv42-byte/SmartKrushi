import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import farmFieldImg from '../../assets/farm_field.jpg';
import wheatFieldImg from '../../assets/wheat_field.jpg';

const MobileFeaturedOffers = ({ onOpenOffer }) => {
  const { t } = useTranslation();

  const offers = [
    {
      id: 'pm-kisan',
      title: 'પ્રધાનમંત્રી કિસાન સન્માન નિધિ',
      subtitle: 'વાર્ષિક ₹6,000 સહાય હપ્તો & ખાતર સબસિડી',
      image: farmFieldImg,
      tag: 'સરકારી સહાય',
      badgeBg: 'bg-emerald-600',
    },
    {
      id: 'wheat-package',
      title: 'ઉચ્ચ ઉપજ ઘઉં & કપાસ સંરક્ષણ',
      subtitle: 'ગુજરાત એગ્રો સંશોધન કેન્દ્ર દ્વારા ભલામણ',
      image: wheatFieldImg,
      tag: 'નવીન પાક',
      badgeBg: 'bg-amber-600',
    },
  ];

  return (
    <div className="mt-6 px-4 pb-24">
      {/* Header: Title and View All */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-extrabold text-[#0B3B24] tracking-tight">
          {t('home.bestOffers', 'શ્રેષ્ઠ ઑફર્સ')}
        </h2>
        <Link
          to="/market"
          className="text-[13px] font-bold text-[#0B5D34] hover:text-emerald-800 transition-colors"
        >
          {t('home.viewAll', 'બધા જુઓ')}
        </Link>
      </div>

      {/* Horizontal Carousel on mobile, 2-column grid on desktop */}
      <div className="flex md:grid md:grid-cols-2 gap-3.5 md:gap-5 overflow-x-auto no-scrollbar pb-2 -mx-4 md:mx-0 px-4 md:px-0 snap-x snap-mandatory">
        {offers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => onOpenOffer && onOpenOffer(offer)}
            className="w-[280px] sm:w-[320px] md:w-full shrink-0 snap-start bg-white rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-150/70 hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] group"
          >
            {/* Image Banner */}
            <div className="relative h-[155px] w-full overflow-hidden bg-gray-100">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
              
              {/* Category Pill Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`${offer.badgeBg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs`}>
                  {offer.tag}
                </span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-bold text-[14px] leading-snug drop-shadow-xs">
                  {offer.title}
                </h3>
              </div>
            </div>

            {/* Subtitle / Details */}
            <div className="p-3 bg-white flex items-center justify-between">
              <p className="text-[11px] text-gray-500 font-medium truncate">
                {offer.subtitle}
              </p>
              <span className="text-[11px] font-bold text-[#0B5D34] shrink-0 ml-2">
                વિગતો →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileFeaturedOffers;
