import React from 'react';
import { Home, Camera, Map, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

export type AppTab = 'home' | 'report' | 'map' | 'my-reports';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  lang: Language;
  reportsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  lang,
  reportsCount,
}) => {
  const t = translations[lang] || translations.en;

  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.tabHome, icon: Home },
    { id: 'report', label: t.tabReport, icon: Camera },
    { id: 'map', label: t.tabMap, icon: Map },
    { id: 'my-reports', label: t.tabMyReports, icon: FileText },
  ];

  return (
    /* Phones only (below 768px); hidden on tablets and desktop */
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-slate-200 shadow-lg pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-4 h-14 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer relative ${
                isActive
                  ? 'text-[#0B3C7A]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.id === 'my-reports' && reportsCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-[#0B3C7A] text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {reportsCount > 9 ? '9+' : reportsCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight mt-1 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-[2px] bg-[#0B3C7A] rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
