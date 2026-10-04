import React from 'react';
import { CivicReport } from '../types';
import { ReportPackagePreview } from './ReportPackagePreview';
import { X } from 'lucide-react';

interface ReportModalProps {
  report: CivicReport | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white transition shadow-lg"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <ReportPackagePreview report={report} />
      </div>
    </div>
  );
};
