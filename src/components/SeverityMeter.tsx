import React from 'react';
import { SeverityLevel } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SeverityMeterProps {
  severity: SeverityLevel;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  showBar?: boolean;
}

export const SeverityMeter: React.FC<SeverityMeterProps> = ({
  severity,
  className = '',
  showIcon = true,
  showLabel = true,
  showBar = false,
}) => {
  const levels: SeverityLevel[] = ['Low', 'Medium', 'High', 'Critical'];
  const currentIndex = levels.indexOf(severity);

  const config = {
    Low: {
      color: 'bg-emerald-500 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      icon: CheckCircle2,
      label: 'Low Severity',
      desc: 'Minor cosmetic flaw / low risk',
      barColor: 'bg-emerald-500',
    },
    Medium: {
      color: 'bg-amber-500 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      label: 'Medium Severity',
      desc: 'Noticeable inconvenience / moderate wear',
      barColor: 'bg-amber-500',
    },
    High: {
      color: 'bg-orange-500 text-orange-700 border-orange-200',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-300',
      icon: ShieldAlert,
      label: 'High Severity',
      desc: 'Significant obstacle / active danger',
      barColor: 'bg-orange-500',
    },
    Critical: {
      color: 'bg-rose-600 text-rose-700 border-rose-200',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse',
      icon: AlertOctagon,
      label: 'Critical Hazard',
      desc: 'Immediate public danger / fatal accident risk',
      barColor: 'bg-rose-600',
    },
  }[severity] || {
    color: 'bg-slate-500 text-slate-700 border-slate-200',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-300',
    icon: AlertTriangle,
    label: severity,
    desc: '',
    barColor: 'bg-slate-500',
  };

  const Icon = config.icon;

  if (!showBar) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.badgeBg} ${className}`}
      >
        {showIcon && <Icon className="w-3 h-3 shrink-0" />}
        {showLabel && <span>{config.label}</span>}
      </span>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && (
            <span className={`inline-flex items-center justify-center p-1 rounded-md ${config.badgeBg} border`}>
              <Icon className="w-4 h-4" />
            </span>
          )}
          {showLabel && <span className="font-semibold text-sm text-slate-900">{config.label}</span>}
        </div>
        <span className="text-xs text-slate-500 font-medium">{config.desc}</span>
      </div>

      {/* 4-tier segment bar */}
      <div className="grid grid-cols-4 gap-1.5 h-2.5 w-full bg-slate-100 rounded-full p-0.5 border border-slate-200">
        {levels.map((level, idx) => {
          const isActive = idx <= currentIndex;
          let segmentColor = 'bg-slate-200';
          if (isActive) {
            if (idx === 0) segmentColor = 'bg-emerald-500';
            if (idx === 1) segmentColor = 'bg-amber-500';
            if (idx === 2) segmentColor = 'bg-orange-500';
            if (idx === 3) segmentColor = 'bg-rose-600';
          }
          return (
            <div
              key={level}
              className={`h-full rounded-full transition-all duration-500 ${segmentColor} ${
                idx === currentIndex ? 'ring-2 ring-offset-1 ring-slate-400' : ''
              }`}
              title={`${level} Severity`}
            />
          );
        })}
      </div>
    </div>
  );
};
