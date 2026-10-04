import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, Crosshair, Cpu } from 'lucide-react';

interface ImageScannerProps {
  imageUrl: string;
  isScanning: boolean;
  onAnalyze?: () => void;
  className?: string;
}

export const ImageScanner: React.FC<ImageScannerProps> = ({
  imageUrl,
  isScanning,
  className = '',
}) => {
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const scanSteps = [
    'Scanning surface topology & structural fracture...',
    'Detecting debris volume & water accumulation...',
    'Evaluating pedestrian & two-wheeler rollover risks...',
    'Cross-referencing Kolkata Municipal Corporation service wings...',
    'Drafting administrative grievance petition...',
  ];

  useEffect(() => {
    if (!isScanning) {
      setScanStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % scanSteps.length);
    }, 900);

    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/60 shadow-lg ${className}`}>
      {/* Target Image */}
      <img
        src={imageUrl}
        alt="Civic hazard inspection view"
        className={`w-full h-full object-cover transition-all duration-700 ${
          isScanning ? 'scale-105 brightness-90 filter' : ''
        }`}
      />

      {/* Grid overlay for high-tech inspection look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc08_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Scanning active effects */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Laser scanning bar */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_18px_#14B8A6] animate-[scan_2.2s_ease-in-out_infinite]" />

          {/* Cyan tint vignette */}
          <div className="absolute inset-0 bg-teal-500/10 mix-blend-overlay" />

          {/* Crosshairs & Target markers */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-teal-400/80 animate-pulse">
            <Crosshair className="w-8 h-8 stroke-[1.5]" />
            <span className="text-[10px] font-mono tracking-wider bg-slate-950/80 px-1 py-0.5 rounded text-teal-300 ml-1">
              HAZARD_POINT_A
            </span>
          </div>

          <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 text-teal-400/80 animate-pulse delay-300">
            <Crosshair className="w-7 h-7 stroke-[1.5]" />
            <span className="text-[10px] font-mono tracking-wider bg-slate-950/80 px-1 py-0.5 rounded text-teal-300 ml-1">
              IMPACT_ZONE_B
            </span>
          </div>

          {/* Live Scanning Status Pill */}
          <div className="absolute bottom-4 inset-x-4 flex justify-center">
            <div className="bg-slate-950/90 backdrop-blur-md border border-teal-500/40 text-teal-200 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 max-w-md w-full">
              <div className="relative flex items-center justify-center">
                <Cpu className="w-5 h-5 text-teal-400 animate-spin" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-semibold text-teal-300 font-mono tracking-wide uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    AI Vision Analysis
                  </span>
                  <span className="text-teal-400/90 font-mono text-[11px] animate-pulse">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {scanSteps[scanStepIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification watermark badge */}
      <div className="absolute top-3 left-3 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700/50">
        <Scan className="w-3.5 h-3.5 text-teal-400" />
        <span>CIVICLENS EVIDENCE FRAME</span>
      </div>
    </div>
  );
};
