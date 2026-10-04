import React, { useState } from 'react';
import {
  Camera,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Trash2,
  Lightbulb,
  Waves,
  Footprints,
} from 'lucide-react';
import { Language, CivicReport } from '../types';
import { translations } from '../utils/translations';

interface PortalHeroProps {
  lang: Language;
  reports: CivicReport[];
  onStartReport: () => void;
  onTrackReport: (reportId: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const PortalHero: React.FC<PortalHeroProps> = ({
  lang,
  reports,
  onStartReport,
  onTrackReport,
  onSelectCategory,
}) => {
  const t = translations[lang] || translations.en;
  const [trackInput, setTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onTrackReport(trackInput.trim());
    }
  };

  // Real statistics computed from live database
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;
  const critical = reports.filter((r) => r.severity === 'Critical').length;
  const resolutionPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const quickServices = [
    {
      id: 'pothole',
      title: t.servicePotholes,
      desc: t.servicePotholesDesc,
      icon: AlertTriangle,
      color: 'text-[#B71C1C]',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      id: 'garbage',
      title: t.serviceGarbage,
      desc: t.serviceGarbageDesc,
      icon: Trash2,
      color: 'text-[#E65100]',
      bgColor: 'bg-orange-50 border-orange-200',
    },
    {
      id: 'streetlight',
      title: t.serviceLighting,
      desc: t.serviceLightingDesc,
      icon: Lightbulb,
      color: 'text-[#F57F17]',
      bgColor: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'drain',
      title: t.serviceDrainage,
      desc: t.serviceDrainageDesc,
      icon: Waves,
      color: 'text-[#0277BD]',
      bgColor: 'bg-sky-50 border-sky-200',
    },
    {
      id: 'footpath',
      title: t.serviceFootpaths,
      desc: t.serviceFootpathsDesc,
      icon: Footprints,
      color: 'text-[#0B3C7A]',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'waterlogging',
      title: t.serviceWater,
      desc: t.serviceWaterDesc,
      icon: Droplets,
      color: 'text-[#00897B]',
      bgColor: 'bg-teal-50 border-teal-200',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-300">
      {/* Hero Content Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Portal Header, Intro & Track Box */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Government Portal Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F6F9] border border-slate-300 rounded text-xs font-semibold text-[#0B3C7A]">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              <span className="font-bold">CITIZEN GRIEVANCE PORTAL</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-mono">Kolkata Municipal Corporation (KMC)</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3C7A] tracking-tight leading-tight">
              {t.heroHeadline}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {t.heroSubtext}
            </p>

            {/* Action Bar: Primary Report Button */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onStartReport}
                className="px-6 py-3.5 rounded bg-[#FF9933] hover:bg-[#E68A00] text-[#072346] font-bold text-sm sm:text-base shadow-sm transition active:scale-98 flex items-center gap-2 border border-[#E68A00]"
              >
                <Camera className="w-5 h-5 text-[#072346]" />
                <span>{t.heroReportBtn}</span>
              </button>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                <span>Real AI analysis on camera upload • Free public portal</span>
              </div>
            </div>

            {/* Track Your Complaint Government Box */}
            <div className="bg-[#F8FAFC] border-2 border-[#0B3C7A] rounded p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B3C7A] uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#FF9933]" />
                  {t.heroTrackTitle}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Live Database Verification</span>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder={t.heroTrackPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-[#0B3C7A] focus:border-[#0B3C7A] uppercase bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold text-sm rounded transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.heroTrackBtn}</span>
                </button>
              </form>

              {/* Show recently registered report IDs if any exist */}
              {reports.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Recent In Database:</span>
                  {reports.slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setTrackInput(r.id);
                        onTrackReport(r.id);
                      }}
                      className="font-mono text-xs text-[#0B3C7A] hover:underline bg-white px-2 py-0.5 border border-slate-300 rounded font-semibold"
                    >
                      {r.id}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Indian Street Scene Photo with Caption */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-slate-300 rounded p-3 shadow-xs space-y-2">
              <div className="relative aspect-4/3 rounded overflow-hidden border border-slate-300 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                  alt="City street showing road surface defect in Kolkata"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-2.5 left-2.5 bg-[#0B3C7A]/95 text-white px-2 py-1 rounded text-[10px] font-mono border border-white/20">
                  CIVICLENS FIELD VERIFICATION
                </div>

                <div className="absolute bottom-2.5 inset-x-2.5 bg-[#072346]/90 backdrop-blur-xs text-white p-2 rounded text-[11px] font-mono flex items-center justify-between border border-slate-700">
                  <span>Municipal Defect Inspection</span>
                  <span className="text-[#FF9933]">West Bengal</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 px-1 py-1">
                <p className="font-semibold text-slate-800">
                  Citizen Visual Documentation:
                </p>
                <p className="text-[11px] text-slate-500">
                  Upload an authentic photograph to automatically extract the hazard severity rating, civic category, and administrative petition text.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Real Statistics Band */}
      <div className="bg-[#0B3C7A] text-white py-6 border-t-2 border-[#FF9933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
            
            <div className="pt-2 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">
                {total}
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mt-1">
                {t.statRegistered}
              </span>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#76FF03] font-mono block">
                {resolved} ({resolutionPercentage}%)
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mt-1">
                {t.statResolved}
              </span>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#FFD54F] font-mono block">
                {critical}
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mt-1">
                Critical Hazards Flagged
              </span>
            </div>

            <div className="pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">
                144 Wards
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mt-1">
                KMC Municipal Jurisdiction
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Quick-Service Tiles */}
      <div id="quick-services" className="bg-[#F4F6F9] py-12 border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-300 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B3C7A]">
                {t.quickServicesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.quickServicesSub}
              </p>
            </div>
            <button
              onClick={onStartReport}
              className="text-xs font-bold text-[#0B3C7A] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Report An Issue Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickServices.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.id}
                  onClick={() => onSelectCategory(tile.id)}
                  className="bg-white border border-slate-300 rounded p-4 hover:border-[#0B3C7A] hover:shadow-md transition cursor-pointer flex items-start gap-3.5 group"
                  role="button"
                  tabIndex={0}
                >
                  <div className={`p-2.5 rounded border ${tile.bgColor} shrink-0`}>
                    <Icon className={`w-5 h-5 ${tile.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#0B3C7A] group-hover:text-[#FF9933] transition-colors truncate">
                      {tile.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {tile.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3C7A] mt-2 group-hover:translate-x-1 transition-transform">
                      <span>Report this issue</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
