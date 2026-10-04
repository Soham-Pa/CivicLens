import React, { useState } from 'react';
import { CivicLensLogo } from './CivicLensLogo';
import {
  Phone,
  Volume2,
  Globe,
  Menu,
  X,
  AlertCircle,
  Eye,
  Megaphone,
  Pause,
  Play,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface PortalHeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  textSize: 'sm' | 'base' | 'lg';
  onTextSizeChange: (size: 'sm' | 'base' | 'lg') => void;
  onOpenScreenReaderModal: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  lang,
  onLanguageChange,
  activeSection,
  onNavigate,
  highContrast,
  onToggleHighContrast,
  textSize,
  onTextSizeChange,
  onOpenScreenReaderModal,
}) => {
  const t = translations[lang] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'report-tool', label: t.navReport },
    { id: 'track-complaint', label: t.navTrack },
    { id: 'categories', label: t.navCategories },
    { id: 'departments', label: t.navDepartments },
    { id: 'dashboard', label: t.navDashboard },
    { id: 'faqs', label: t.navFaqs },
    { id: 'contact', label: t.navContact },
  ];

  return (
    <header className="w-full select-none" role="banner">
      {/* 1. Mandatory Clear Always-Visible Disclaimer Strip */}
      <div className="bg-[#FFF4E5] border-b border-[#FFE0B2] text-[#8C3B00] px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#E65100]" aria-hidden="true" />
        <span>{t.disclaimerBanner}</span>
      </div>

      {/* 2. Top Utility Bar (Navy #072346) */}
      <div className="bg-[#072346] text-white text-[12px] border-b border-[#123668]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between h-9 gap-2">
          {/* Left: Skip to Content & Screen Reader Access */}
          <div className="flex items-center gap-4">
            <a
              href="#main-content"
              className="hover:underline font-semibold focus:bg-[#FF9933] focus:text-[#0B3C7A] px-1 py-0.5 rounded text-[11px]"
            >
              {t.skipToMain}
            </a>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">|</span>
            <button
              onClick={onOpenScreenReaderModal}
              className="hover:underline flex items-center gap-1 text-[11px] text-slate-200 hover:text-white"
              title="Screen Reader Accessibility Information"
            >
              <Volume2 className="w-3 h-3 text-[#FF9933]" aria-hidden="true" />
              <span>{t.screenReader}</span>
            </button>
          </div>

          {/* Right: Text Resize, Contrast & Language */}
          <div className="flex items-center gap-3">
            {/* Text-size controls */}
            <div className="flex items-center border border-slate-600 rounded bg-[#0B2F5B] px-1 py-0.5" role="group" aria-label="Text sizing">
              <span className="text-[10px] text-slate-300 mr-1.5 hidden md:inline">{t.textResize}:</span>
              <button
                onClick={() => onTextSizeChange('sm')}
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  textSize === 'sm' ? 'bg-[#FF9933] text-[#072346]' : 'text-slate-200 hover:text-white'
                }`}
                title="Small text"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                onClick={() => onTextSizeChange('base')}
                className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                  textSize === 'base' ? 'bg-[#FF9933] text-[#072346]' : 'text-slate-200 hover:text-white'
                }`}
                title="Default text"
                aria-label="Default text size"
              >
                A
              </button>
              <button
                onClick={() => onTextSizeChange('lg')}
                className={`px-1.5 py-0.2 rounded text-[12px] font-bold ${
                  textSize === 'lg' ? 'bg-[#FF9933] text-[#072346]' : 'text-slate-200 hover:text-white'
                }`}
                title="Large text"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>

            {/* Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium transition ${
                highContrast
                  ? 'bg-[#FFFF00] text-[#000000] border-[#FFFF00] font-bold'
                  : 'border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle High Contrast Display"
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">{highContrast ? t.standardContrast : t.highContrast}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#0B2F5B] border border-slate-600 rounded px-1.5 py-0.5 text-[11px]" role="group" aria-label="Language selection">
              <Globe className="w-3 h-3 text-[#FF9933] mr-1" aria-hidden="true" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.2 rounded ${lang === 'en' ? 'font-bold text-[#FF9933]' : 'text-slate-300 hover:text-white'}`}
              >
                English
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={() => onLanguageChange('bn')}
                className={`px-1.5 py-0.2 rounded ${lang === 'bn' ? 'font-bold text-[#FF9933]' : 'text-slate-300 hover:text-white'}`}
              >
                বাংলা
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 py-0.2 rounded ${lang === 'hi' ? 'font-bold text-[#FF9933]' : 'text-slate-300 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tricolour Strip (Saffron #FF9933, White #FFFFFF, Green #138808) */}
      <div className="w-full flex h-1 portal-tricolour" aria-hidden="true">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* 4. Main Header: CivicLens Logo + Taglines + Helpline Box */}
      <div className="bg-white border-b border-slate-200 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3.5 cursor-pointer text-left group"
            role="button"
            tabIndex={0}
            aria-label="CivicLens Portal Home"
          >
            <CivicLensLogo className="w-12 h-12 shrink-0 group-hover:scale-102 transition-transform" />
            <div className="border-l-2 border-[#0B3C7A] pl-3.5">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B3C7A]">
                  CivicLens
                </h1>
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase hidden sm:inline">
                  (सिभिकलेन्स / सिविकलेंस)
                </span>
              </div>
              <p className="text-xs font-bold text-[#FF9933] tracking-wide uppercase">
                {t.taglineEnglish} • <span className="font-normal text-slate-600">{t.taglineHindi}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.portalSubTitleBengali} | {t.portalSubTitleHindi}
              </p>
            </div>
          </div>

          {/* Right Helpline & Emergency Box */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <div className="flex items-center gap-3 bg-[#F4F6F9] border border-slate-300 rounded px-4 py-2 text-left">
              <div className="w-9 h-9 rounded bg-[#0B3C7A] text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#FF9933]" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider block">
                  {t.tollFreeLabel}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0B3C7A] tracking-tight font-mono block">
                  {t.helplineNumber}
                </span>
                <span className="text-[10px] text-[#138808] font-semibold block">
                  ● {t.helplineHours}
                </span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. Primary Navigation Bar (Navy #0B3C7A, flat government look) */}
      <nav className="bg-[#0B3C7A] text-white shadow-sm" aria-label="Primary Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between">
            <ul className="flex items-center">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className={`px-4 py-3 text-sm font-semibold border-r border-[#154E96] transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF9933] text-[#072346] font-bold shadow-inner'
                          : 'text-white hover:bg-[#082F62]'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Quick Action in nav */}
            <button
              onClick={() => onNavigate('report-tool')}
              className="bg-[#138808] hover:bg-[#0E6C06] text-white text-xs font-bold px-4 py-1.5 rounded transition flex items-center gap-1.5 my-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.heroReportBtn}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#072346] border-t border-[#123668] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded text-sm font-semibold ${
                  activeSection === link.id
                    ? 'bg-[#FF9933] text-[#072346] font-bold'
                    : 'text-white hover:bg-[#0B3C7A]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 6. Official Announcements / News Ticker */}
      <div className="bg-[#FFFDF5] border-b border-[#EADBB6] text-[#333333] text-xs py-2 px-4 flex items-center gap-3 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0B3C7A] text-white px-2.5 py-1 rounded text-[11px] font-bold shrink-0 shadow-xs uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5 text-[#FF9933]" aria-hidden="true" />
            <span>{t.tickerTitle}</span>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className={`whitespace-nowrap text-slate-800 font-medium ${isTickerPaused ? '' : 'animate-marquee'}`}>
              <span className="mx-4 font-semibold text-[#0B3C7A]">● {t.tickerNotice1}</span>
              <span className="mx-4 font-semibold text-[#138808]">● {t.tickerNotice2}</span>
              <span className="mx-4 font-semibold text-[#B71C1C]">● {t.tickerNotice3}</span>
            </div>
          </div>

          {/* Ticker play/pause control */}
          <button
            onClick={() => setIsTickerPaused(!isTickerPaused)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
            title={isTickerPaused ? 'Resume news marquee' : 'Pause news marquee'}
            aria-label={isTickerPaused ? 'Resume scrolling news' : 'Pause scrolling news'}
          >
            {isTickerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </header>
  );
};
