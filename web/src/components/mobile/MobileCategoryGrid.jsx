import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClockDurationIcon,
  SoilMoneyIcon,
  LowRiskDocIcon,
  ProtectionShieldIcon
} from './CategoryIcons';

const MobileCategoryGrid = ({ onSelectCategory }) => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 'duration',
      title: t('home.categories.duration', 'સમયગાળો'),
      icon: ClockDurationIcon,
      action: () => onSelectCategory('calendar'),
    },
    {
      id: 'soil',
      title: t('home.categories.soil', 'માટી'),
      icon: SoilMoneyIcon,
      action: () => onSelectCategory('soil'),
    },
    {
      id: 'lowRisk',
      title: t('home.categories.lowRisk', 'ઓછું જોખમ'),
      icon: LowRiskDocIcon,
      action: () => onSelectCategory('alerts'),
    },
    {
      id: 'protection',
      title: t('home.categories.protection', 'સુરક્ષા'),
      icon: ProtectionShieldIcon,
      action: () => onSelectCategory('diagnostics'),
    },
  ];

  return (
    <div className="px-4 mt-6">
      {/* Section Title matching screenshot */}
      <h2 className="text-[17px] font-extrabold text-[#0B3B24] tracking-tight mb-3">
        {t('home.categoriesTitle', 'કેટેગરી પ્રમાણે રોકાણ')}
      </h2>

      {/* 2x2 Grid on phone, 4 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={cat.action}
              className="bg-white rounded-[20px] p-4 py-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-150/70 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md hover:border-emerald-200 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-10 h-10" />
              </div>
              <span className="text-[14px] font-bold text-gray-800 tracking-tight mt-1">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryGrid;
