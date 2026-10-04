import React, { useState, useEffect } from 'react';
import {
  Camera,
  Cpu,
  ShieldAlert,
  MapPin,
  FileCheck2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeroProps {
  onStartReport: () => void;
  onExploreSteps: () => void;
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onStartReport,
  onExploreSteps,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [activeStep, setActiveStep] = useState(0);

  const phoneSteps = [
    {
      step: '01',
      title: 'Snap Incident',
      badge: '📸 1. PHOTO CAPTURE',
      desc: 'Deep pothole detected on Rashbehari Ave',
      icon: Camera,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/30',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '02',
      title: 'AI Vision Inspects',
      badge: '🤖 2. MULTIMODAL SCAN',
      desc: 'Asphalt crater depth: 15cm • Waterlogged',
      icon: Cpu,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/30',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '03',
      title: 'Severity Gauge',
      badge: '⚠️ 3. CRITICAL RISK',
      desc: 'Two-wheeler rollover hazard detected',
      icon: ShieldAlert,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '04',
      title: 'GPS & Time Lock',
      badge: '📍 4. GEOTAG PIN',
      desc: 'Ward 86, Kolkata • 03 Oct 11:20 AM IST',
      icon: MapPin,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      step: '05',
      title: 'Docket Dispatched',
      badge: '📄 5. READY PETITION',
      desc: 'PDF generated & routed to KMC Roads Wing',
      icon: FileCheck2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Auto-advance step every 3.2s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % phoneSteps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [phoneSteps.length]);

  const currentPhoneStep = phoneSteps[activeStep];
  const StepIcon = currentPhoneStep.icon;

  return (
    <section className="relative overflow-hidden bg-[#0B1F3A] text-white pt-12 pb-20 md:py-24">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 translate-y-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs sm:text-sm text-teal-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span className="font-semibold">{t.heroBadge}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-medium">{t.heroCityBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              See it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Snap it.</span><br />
              Get it fixed.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.heroSubtext}
            </p>

            {/* Quick Flow Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-2 pb-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <span className="text-xs text-teal-300 font-mono font-bold block">10 SECONDS</span>
                <span className="text-xs text-slate-300">Photo to Report</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <span className="text-xs text-teal-300 font-mono font-bold block">AI ACCURACY</span>
                <span className="text-xs text-slate-300">Hazard & Dept Routing</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <span className="text-xs text-teal-300 font-mono font-bold block">EVIDENCE PDF</span>
                <span className="text-xs text-slate-300">KMC Grievance Ready</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartReport}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-teal-500/25 transition active:scale-95 group"
              >
                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {t.heroCtaReport}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreSteps}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-base flex items-center justify-center gap-2 transition"
              >
                {t.heroCtaHow}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust badge */}
            <p className="text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2 pt-2">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              Pre-configured for Kolkata Municipal Corporation (KMC) Ward 1 to 144
            </p>
          </div>

          {/* Right Column: Phone Mockup with 5-Step Flow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[310px] sm:w-[340px]">
              {/* Glow backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-sky-500 rounded-[50px] opacity-20 blur-xl animate-pulse" />

              {/* Phone Device Shell */}
              <div className="relative rounded-[44px] bg-slate-900 border-[7px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-4 overflow-hidden">
                {/* Speaker notch */}
                <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Phone Screen Container */}
                <div className="rounded-[30px] bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col h-[520px]">
                  {/* Mock status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] text-slate-400 font-mono">
                    <span>11:20 AM</span>
                    <span className="text-teal-400 font-bold">CivicLens 5G</span>
                    <span>100%</span>
                  </div>

                  {/* Flow step tabs */}
                  <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {phoneSteps.map((s, idx) => (
                        <button
                          key={s.step}
                          onClick={() => setActiveStep(idx)}
                          className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                            idx === activeStep ? 'bg-teal-400 w-8' : 'bg-slate-700'
                          }`}
                          title={s.title}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      STEP {currentPhoneStep.step}/05
                    </span>
                  </div>

                  {/* Screen Content for current step */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    {/* Top step badge */}
                    <div className={`p-2.5 rounded-xl border ${currentPhoneStep.bgColor} flex items-center gap-2.5`}>
                      <StepIcon className={`w-5 h-5 ${currentPhoneStep.color} shrink-0`} />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-slate-300 block">
                          {currentPhoneStep.badge}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">
                          {currentPhoneStep.title}
                        </p>
                      </div>
                    </div>

                    {/* Step Image Graphic Preview */}
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 my-2 border border-slate-800">
                      <img
                        src={currentPhoneStep.preview}
                        alt="Kolkata civic road condition"
                        className="w-full h-full object-cover"
                      />
                      {/* Scanning laser on step 2 */}
                      {activeStep === 1 && (
                        <div className="absolute inset-x-0 top-1/2 h-1 bg-teal-400 shadow-[0_0_12px_#14B8A6] animate-pulse" />
                      )}
                      <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                        Kolkata Ward 86
                      </div>
                    </div>

                    {/* Step description card */}
                    <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Observation:</span>
                        <span className="text-teal-300 font-mono">KMC Verified</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        {currentPhoneStep.desc}
                      </p>
                    </div>

                    {/* Action button inside phone */}
                    <button
                      onClick={() => setActiveStep((prev) => (prev + 1) % phoneSteps.length)}
                      className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
