import React, { useState } from 'react';
import { CivicLensLogo } from './CivicLensLogo';
import { Phone, X, Sparkles, Globe, Home, Camera, Map, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { AppTab } from './BottomNav';

interface AppHeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  reportsCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  reportsCount,
}) => {
  const t = translations[lang] || translations.en;
  const [isDisclaimerDismissed, setIsDisclaimerDismissed] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const langNames: Record<Language, string> = {
    en: 'EN',
    bn: 'বাংলা',
    hi: 'हिन्दी',
  };

  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.tabHome, icon: Home },
    { id: 'report', label: t.tabReport, icon: Camera },
    { id: 'map', label: t.tabMap, icon: Map },
    { id: 'my-reports', label: t.tabMyReports, icon: FileText },
  ];

  return (
    <div className="sticky top-0 z-40 w-full bg-white select-none border-b border-slate-200">
      {/* 1. Main Header Bar (Full width background, content max-w-[1400px]) */}
      <header className="w-full bg-white/95 backdrop-blur">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 h-14 flex items-center justify-between gap-3">
          {/* Left: Logo + "CivicLens" + DEMO badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <CivicLensLogo size={28} className="w-7 h-7 shrink-0 transition-transform group-hover:scale-105" />
              <span className="font-extrabold text-[18px] text-[#072346] tracking-tight leading-none">
                CivicLens
              </span>
            </button>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              {t.demoBadge}
            </span>
          </div>

          {/* Center (Tablets & Desktop >= 768px): Horizontal navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full" aria-label="Desktop navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative h-full px-3 lg:px-4 flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0B3C7A]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  <span>{item.label}</span>
                  {item.id === 'my-reports' && reportsCount > 0 && (
                    <span className="ml-1 bg-slate-100 text-[#0B3C7A] border border-slate-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {reportsCount}
                    </span>
                  )}
                  {/* Underlined in navy when active */}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-[2.5px] bg-[#0B3C7A] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Language dropdown & Helpline button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Select Language"
                aria-label="Select Language"
                aria-expanded={isLangMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{langNames[lang]}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 top-9 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {(['en', 'bn', 'hi'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onLanguageChange(l);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        lang === l
                          ? 'bg-blue-50 text-[#0B3C7A] font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{langNames[l]}</span>
                      {lang === l && <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C7A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Helpline button */}
            <a
              href="tel:155304"
              className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#E65100] border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold"
              title="KMC Helpline: 155304"
              aria-label="Call KMC Helpline: 155304"
            >
              <Phone className="w-3.5 h-3.5 text-[#E65100]" />
              <span className="hidden sm:inline">155304</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Thin Tricolour accent line (Full width) */}
      <div className="w-full flex h-[2px]">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white border-y border-slate-200" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* 3. Dismissible slim 11px disclaimer line directly under header */}
      {!isDisclaimerDismissed && (
        <div className="w-full bg-[#FFF8E1] border-b border-[#FFE082]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-1 text-[11px] text-[#795548] font-medium flex items-center justify-between gap-2 leading-tight">
            <span className="truncate">
              {t.disclaimerBanner}
            </span>
            <button
              onClick={() => setIsDisclaimerDismissed(true)}
              className="shrink-0 p-0.5 text-[#8D6E63] hover:text-black rounded cursor-pointer"
              title={t.dismiss}
              aria-label={t.dismiss}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
