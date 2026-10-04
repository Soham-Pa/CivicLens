import React from 'react';
import { Volume2, X, Check, Eye, Keyboard } from 'lucide-react';

interface ScreenReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenReaderModal: React.FC<ScreenReaderModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border-2 border-[#0B3C7A] max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-[#0B3C7A]">
            <Volume2 className="w-5 h-5 text-[#FF9933]" />
            <h3 className="font-bold text-lg">Screen Reader Access & Accessibility (GIGW 3.0)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          CivicLens is built in compliance with the Guidelines for Indian Government Websites (GIGW) and Web Content Accessibility Guidelines (WCAG 2.1 Level AA).
        </p>

        <div className="space-y-3 text-xs">
          <div className="bg-[#F4F6F9] p-3 rounded border border-slate-200">
            <h4 className="font-bold text-[#0B3C7A] mb-1 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-[#FF9933]" />
              Keyboard Navigation Shortcuts
            </h4>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><kbd className="bg-white px-1.5 py-0.5 border rounded font-mono">Tab</kbd> : Navigate forward through interactive controls</li>
              <li><kbd className="bg-white px-1.5 py-0.5 border rounded font-mono">Shift + Tab</kbd> : Navigate backward</li>
              <li><kbd className="bg-white px-1.5 py-0.5 border rounded font-mono">Enter</kbd> / <kbd className="bg-white px-1.5 py-0.5 border rounded font-mono">Space</kbd> : Activate selected button or link</li>
              <li><kbd className="bg-white px-1.5 py-0.5 border rounded font-mono">Escape</kbd> : Dismiss dialogs and modals</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#0B3C7A]">Tested Screen Readers:</h4>
            <div className="grid grid-cols-2 gap-2">
              <span className="p-2 bg-slate-50 border rounded text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#138808]" /> NVDA (NonVisual Desktop Access)
              </span>
              <span className="p-2 bg-slate-50 border rounded text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#138808]" /> JAWS (Freedom Scientific)
              </span>
              <span className="p-2 bg-slate-50 border rounded text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#138808]" /> Apple VoiceOver (macOS / iOS)
              </span>
              <span className="p-2 bg-slate-50 border rounded text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#138808]" /> Google TalkBack (Android)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0B3C7A] text-white text-xs font-bold rounded hover:bg-[#082852] transition"
          >
            Close / বন্ধ করুন / बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
