import React from 'react';
import { Clock, ShieldCheck, Zap, Award, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface WhyCivicLensProps {
  lang: Language;
}

export const WhyCivicLens: React.FC<WhyCivicLensProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;

  const benefits = [
    {
      title: 'Saves 20+ Minutes of Form Filling',
      tagline: '10 Seconds vs 20 Mins',
      desc: 'No navigating confusing municipal portal dropdowns or complex legal language. Take a photo, and the AI drafts the complete grievance with administrative precision.',
      icon: Clock,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200',
    },
    {
      title: 'Structured, Tamper-Evident Proof',
      tagline: 'GPS + Time + Multimodal Assessment',
      desc: 'Authorities reject vague complaints. CivicLens stamps cryptographic IST timestamps, pinpoint coordinates, and AI-measured hazard depth for unassailable proof.',
      icon: ShieldCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
    },
    {
      title: 'Auto-Routed to Correct Department',
      tagline: 'Zero Bureaucratic Ping-Pong',
      desc: 'Complaints get routed directly to KMC Roads, Solid Waste Management, or Lighting wings based on verified damage classification, cutting routing delays.',
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      title: 'Citizen Accountability & Legal SLAs',
      tagline: 'Right to Public Services Act',
      desc: 'Every evidence package generates a permanent reference ID and downloadable PDF ready for Right to Service escalations, RTI petitions, or grievance hearings.',
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section id="why" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold font-mono tracking-widest text-teal-600 uppercase bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Civic Tech Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            {t.whyHeading}
          </h2>
          <p className="text-base text-slate-600">
            {t.whySubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-3xl border border-slate-200/80 p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`p-3 rounded-2xl ${b.bg} border inline-flex`}>
                      <Icon className={`w-6 h-6 ${b.color}`} />
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {b.tagline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Verified Civic Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
