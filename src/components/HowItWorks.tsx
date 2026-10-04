import React from 'react';
import { Camera, Cpu, AlertTriangle, MapPin, FileCheck2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HowItWorksProps {
  lang: Language;
  onStartReport: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang, onStartReport }) => {
  const t = translations[lang] || translations.en;

  const steps = [
    {
      num: '1',
      title: t.step1,
      desc: t.step1Desc,
      icon: Camera,
      tag: 'On-Site Capture',
    },
    {
      num: '2',
      title: t.step2,
      desc: t.step2Desc,
      icon: Cpu,
      tag: 'Multimodal Vision',
    },
    {
      num: '3',
      title: t.step3,
      desc: t.step3Desc,
      icon: AlertTriangle,
      tag: 'Risk Calibration',
    },
    {
      num: '4',
      title: t.step4,
      desc: t.step4Desc,
      icon: MapPin,
      tag: 'GPS & Time Lock',
    },
    {
      num: '5',
      title: t.step5,
      desc: t.step5Desc,
      icon: FileCheck2,
      tag: 'Municipal Docket',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            Citizen Grievance Standard Operating Procedure (SOP)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
            {t.howTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.howSub}
          </p>
        </div>

        {/* 5 Numbered Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-[#F8FAFC] border border-slate-300 rounded p-4 flex flex-col justify-between space-y-4 hover:border-[#0B3C7A] transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#0B3C7A] text-white font-mono font-bold text-sm flex items-center justify-center">
                      {s.num}
                    </span>
                    <span className="text-[10px] font-mono text-[#0B3C7A] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>STAGE {s.num} / 5</span>
                  {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statutory Compliance Banner */}
        <div className="bg-[#F4F6F9] border border-slate-300 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#138808] shrink-0" />
            <span className="text-slate-700">
              <strong>Non-Repudiation Assurance:</strong> Every evidence packet is permanently stamped with verified GPS coordinates and IST time logs to ensure formal accountability during municipal hearings.
            </span>
          </div>

          <button
            onClick={onStartReport}
            className="px-4 py-2 bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold rounded text-xs shrink-0 transition"
          >
            Initiate Grievance Form
          </button>
        </div>

      </div>
    </section>
  );
};
