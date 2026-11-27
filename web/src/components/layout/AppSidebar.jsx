import { Cloud, Beaker, Calendar, Bell, HelpCircle, TrendingUp, Sprout, PhoneCall } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AppSidebar = ({ activeItem = '' }) => {
  const { t } = useTranslation();

  const links = [
    { to: '/market', icon: TrendingUp, label: 'બજાર ભાવ (Mandi Rates)' },
    { to: '/crops', icon: Sprout, label: 'પાક માહિતી (Crops)' },
    { to: '/weather', icon: Cloud, label: 'હવામાન (Weather)' },
    { to: '/soil', icon: Beaker, label: 'જમીન વિશ્લેષણ (Soil)' },
    { to: '/diagnostics', icon: Bell, label: 'રોગ નિદાન (Diagnostics)' },
  ];

  return (
    <div className="h-full flex flex-col py-6">
      
      {/* Header */}
      <div className="px-6 mb-6">
        <h2 className="text-[12px] font-extrabold text-[#0B3B24] tracking-widest uppercase">ગુજરાત કૃષિ સાધનો</h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Gujarat Agri Tools & Mandi</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold rounded-xl transition-all ${
                  isActive
                    ? 'text-[#0A311F] bg-[#D4E8DC] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pt-4 border-t border-gray-200/80">
        <a
          href="tel:18001801551"
          className="w-full bg-[#0B5D34] hover:bg-[#084828] text-white text-[12px] font-bold h-10 rounded-xl transition-colors mb-3 flex items-center justify-center gap-2 shadow-2xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>કિસાન હેલ્પલાઇન 1800-180-1551</span>
        </a>

        <div className="text-center text-[11px] text-gray-400">
          Digital Gujarat & i-Khedut Compatible
        </div>
      </div>

    </div>
  );
};

export default AppSidebar;
