import React from 'react';
import {
  Camera,
  Map,
  CheckCircle2,
  CloudRain,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Trash2,
  Lightbulb,
  Droplets,
  Waves,
  Sparkles,
} from 'lucide-react';
import { CivicReport, Language, CivicCategory } from '../types';
import { translations } from '../utils/translations';
import { SeverityMeter } from './SeverityMeter';

interface HomeScreenProps {
  lang: Language;
  onOpenReport: (category?: CivicCategory) => void;
  onOpenMap: () => void;
  onOpenWaterloggingMap: () => void;
  onOpenMyReports: () => void;
  onSelectReport: (report: CivicReport) => void;
  recentReports: CivicReport[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lang,
  onOpenReport,
  onOpenMap,
  onOpenWaterloggingMap,
  onOpenMyReports,
  onSelectReport,
  recentReports,
}) => {
  const t = translations[lang] || translations.en;

  // Recent reports (up to 4 on desktop, 3 on mobile)
  const displayReports = recentReports.slice(0, 4);

  // Category chips
  const categoryChips: {
    id: CivicCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'pothole', label: t.categoryPothole, icon: AlertTriangle },
    { id: 'garbage', label: t.categoryGarbage, icon: Trash2 },
    { id: 'streetlight', label: t.categoryStreetlight, icon: Lightbulb },
    { id: 'drain', label: t.categoryDrain, icon: Waves },
    { id: 'waterlogging', label: t.categoryWaterlogging, icon: Droplets },
  ];

  // Top 3 waterlogging risky areas
  const riskyAreas = ['Thanthania', 'Ultadanga', 'Amherst St'];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-5 lg:py-8 space-y-6">
      {/* RESPONSIVE LAYOUT: 1 column on phone, 2 columns on tablet/desktop (8 cols left / 4 cols right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ================= LEFT COLUMN (8 cols on lg, 7 cols on md) ================= */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* 1. COMPACT HERO CARD */}
          <section className="bg-gradient-to-br from-[#072346] via-[#0B3C7A] to-[#124E96] text-white rounded-2xl p-5 md:p-7 shadow-sm relative overflow-hidden">
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold leading-tight tracking-tight">
              {t.heroHeadline}
            </h1>
            <p className="text-[15px] lg:text-base text-blue-100/90 leading-relaxed pt-2 max-w-[65ch]">
              {t.homeReportSub}
            </p>

            {/* Full-width on mobile, capped width on desktop */}
            <div className="pt-4">
              <button
                onClick={() => onOpenReport()}
                className="w-full sm:max-w-xs h-12 bg-[#E65100] hover:bg-[#D84315] active:scale-[0.98] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                aria-label={t.homeReportCta}
              >
                <Camera className="w-5 h-5" />
                <span>{t.homeReportCta}</span>
              </button>
            </div>
          </section>

          {/* 2. ROW OF TWO SECONDARY BUTTONS SIDE BY SIDE */}
          <section className="grid grid-cols-2 gap-3 sm:max-w-md">
            <button
              onClick={onOpenMap}
              className="h-11 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-xl text-slate-800 text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Map className="w-4 h-4 text-[#0B3C7A]" />
              <span>{t.viewMapBtn}</span>
            </button>

            <button
              onClick={() => onOpenReport()}
              className="h-11 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-xl text-slate-800 text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.reportFixBtn}</span>
            </button>
          </section>

          {/* 3. CATEGORY CHIPS: Swipeable on mobile (no scrollbar), wrapped on desktop */}
          <section>
            <div className="flex md:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 md:mx-0 md:px-0">
              {categoryChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    onClick={() => onOpenReport(chip.id)}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#0B3C7A]" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. ON MOBILE ONLY: RAIN ALERT & STATS INSERTED IN SINGLE-COLUMN FLOW */}
          <div className="md:hidden space-y-6">
            {/* Rain Alert card (Mobile) */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-[15px] font-bold text-slate-900 leading-snug">
                      {t.rainAlertHeadline}
                    </h2>
                    <button
                      onClick={onOpenWaterloggingMap}
                      className="text-xs font-bold text-blue-700 hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.viewOnMapLink}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {riskyAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-100/80 text-blue-900 border border-blue-200/70"
                      >
                        {area}
                      </span>
                    ))}
                    <span className="text-[11px] text-slate-500 font-medium">
                      +39 more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row in 1 card with 3 columns (Mobile) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                <div className="px-1">
                  <div className="text-xl font-black text-slate-900 leading-tight">148</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{t.statReportsWeek}</div>
                </div>
                <div className="px-1">
                  <div className="text-xl font-black text-emerald-600 leading-tight">94</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{t.statFixedMonth}</div>
                </div>
                <div className="px-1">
                  <div className="text-xl font-black text-[#E65100] leading-tight">42</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{t.statActiveHotspots}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. "RECENT REPORTS NEAR YOU" (2-column grid on desktop, 1 column on phone) */}
          <section className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-slate-900">
                {t.recentReportsTitle}
              </h2>
              <button
                onClick={onOpenMyReports}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{t.seeAll}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid of cards: 1 column on mobile, 2 columns on tablet and desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {displayReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 flex items-center gap-3 transition-all cursor-pointer active:scale-[0.99] group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectReport(report)}
                >
                  {/* 64px Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src={report.imageUrl}
                      alt={report.issue_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-[13px] font-bold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                        {report.issue_type}
                      </h3>
                      <SeverityMeter severity={report.severity} showLabel={false} />
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate">{report.location.address || 'Kolkata'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{report.formattedTimestamp.split(',')[0]}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN (Desktop/Tablet Sticky Sidebar: 4 cols on lg, 5 cols on md) ================= */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4 space-y-5 md:sticky md:top-20">
          {/* Card 1: Rain Alert card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CloudRain className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
                  {t.rainAlertHeadline}
                </h3>
                <span className="text-[11px] text-blue-700 font-medium">
                  Monsoon Drainage Risk
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-normal">
              High waterlogging risk logged across arterial corridors. Real-time water depth & clearance hours monitored.
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              {riskyAreas.map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-900 border border-blue-200"
                >
                  {area}
                </span>
              ))}
              <span className="text-[11px] text-slate-500 font-medium">
                +39 more
              </span>
            </div>

            <button
              onClick={onOpenWaterloggingMap}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{t.viewOnMapLink}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Stats card (3 columns) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
              <div className="px-1.5">
                <div className="text-2xl font-black text-slate-900 leading-tight">148</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{t.statReportsWeek}</div>
              </div>
              <div className="px-1.5">
                <div className="text-2xl font-black text-emerald-600 leading-tight">94</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{t.statFixedMonth}</div>
              </div>
              <div className="px-1.5">
                <div className="text-2xl font-black text-[#E65100] leading-tight">42</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{t.statActiveHotspots}</div>
              </div>
            </div>
          </div>

          {/* Card 3: Mini Heat-Map preview card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-[#0B3C7A]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Civic Heat Map Preview
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Data
              </span>
            </div>

            {/* Stylized visual map snippet */}
            <div
              onClick={onOpenMap}
              className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-slate-900 to-indigo-950/90" />
              {/* Simulated map street grid & glowing hotspots */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
              <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-red-500 border border-white" />
              <div className="absolute bottom-6 right-10 w-3 h-3 rounded-full bg-amber-500 border border-white" />
              <div className="absolute top-10 right-20 w-3 h-3 rounded-full bg-blue-400 border border-white" />
              <div className="absolute bottom-4 left-16 w-3 h-3 rounded-full bg-purple-400 border border-white" />

              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-900 shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-[#0B3C7A]" />
                  <span>Open Full Map</span>
                </span>
              </div>
            </div>

            <button
              onClick={onOpenMap}
              className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All 90+ Issues & Flood Zones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE (Spanning full width of the container) */}
      <footer className="pt-6 pb-12 text-center text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <p className="leading-normal max-w-2xl mx-auto">
          {t.disclaimerBanner}
        </p>
        <p className="text-[11px] text-slate-400 leading-normal">
          {t.footerDemoNote}
        </p>
        <p className="text-[11px] text-slate-400 pt-0.5">
          KMC 24x7 Grievance Helpline: 155304
        </p>
      </footer>
    </div>
  );
};
