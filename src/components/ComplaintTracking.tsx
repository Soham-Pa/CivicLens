import React, { useState, useEffect } from 'react';
import { CivicReport } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  RotateCw,
  AlertCircle,
} from 'lucide-react';
import { fetchReportById } from '../services/reportService';
import { generateCivicReportPDF } from '../utils/pdfGenerator';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface ComplaintTrackingProps {
  initialReportId?: string;
  lang: Language;
  onViewDocket: (report: CivicReport) => void;
  onNewReport: () => void;
}

export const ComplaintTracking: React.FC<ComplaintTrackingProps> = ({
  initialReportId = '',
  lang,
  onViewDocket,
  onNewReport,
}) => {
  const t = translations[lang] || translations.en;
  const [searchTerm, setSearchTerm] = useState(initialReportId);
  const [currentReport, setCurrentReport] = useState<CivicReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchedId, setSearchedId] = useState<string>('');

  useEffect(() => {
    if (initialReportId) {
      setSearchTerm(initialReportId);
      performSearch(initialReportId);
    }
  }, [initialReportId]);

  const performSearch = async (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;

    setIsLoading(true);
    setSearchError(null);
    setSearchedId(cleanId);

    try {
      const found = await fetchReportById(cleanId);
      if (found) {
        setCurrentReport(found);
      } else {
        setCurrentReport(null);
        setSearchError(`No grievance record found with ID "${cleanId}" in the database.`);
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setSearchError('Error connecting to database: ' + (err.message || String(err)));
      setCurrentReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <section id="track-complaint" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            Real-Time Grievance Status Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
            {t.trackHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.trackSub}
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-[#F8FAFC] border border-slate-300 rounded p-4 sm:p-6 space-y-3">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="track-search-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.trackInputLabel}
              </label>
              <input
                id="track-search-input"
                type="text"
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. CL-2026-XXXXXX"
                className="w-full px-4 py-2.5 rounded border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-[#0B3C7A] bg-white text-slate-800"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold text-sm rounded transition flex items-center justify-center gap-2 h-[42px] disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Real Status</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Error State */}
        {searchError && (
          <div className="p-4 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Record Not Found</p>
              <p className="text-[11px] mt-0.5">{searchError}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Please submit a report using the form above to generate a real reference ID.
              </p>
            </div>
          </div>
        )}

        {/* Real Report Found */}
        {currentReport && (
          <div className="bg-[#F8FAFC] border border-slate-300 rounded p-6 sm:p-8 space-y-6">
            
            {/* Top Summary Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#0B3C7A] text-white px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                    REF: {currentReport.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                    currentReport.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : currentReport.status === 'In Review'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-sky-50 text-sky-800 border-sky-300'
                  }`}>
                    Status: {currentReport.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {currentReport.formattedTimestamp}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0B3C7A]">
                  {currentReport.issue_type}
                </h3>

                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0B3C7A]" />
                  <span>{currentReport.location.address}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700">{currentReport.location.city}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => generateCivicReportPDF(currentReport)}
                  className="px-4 py-2 rounded bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-[#0B3C7A]" />
                  Download PDF Docket
                </button>

                <button
                  onClick={() => onViewDocket(currentReport)}
                  className="px-4 py-2 rounded bg-[#0B3C7A] hover:bg-[#082852] text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-4 h-4" />
                  View Full Evidence Package
                </button>
              </div>
            </div>

            {/* Real Timeline Events */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">
                Grievance Life Cycle (Real Database Log)
              </h4>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-300 space-y-6">
                {(currentReport.statusTimeline || []).map((stage, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#138808] text-white ring-4 ring-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className="text-sm font-bold text-slate-900">
                          {stage.stage}
                        </h5>
                        <span className="text-xs font-mono text-slate-500">
                          {stage.date}
                        </span>
                      </div>
                      {stage.notes && (
                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                          {stage.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Handling Note */}
            <div className="bg-white border border-slate-200 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0B3C7A]" />
                <span className="font-semibold text-slate-800">Target Department:</span>
                <span className="text-[#0B3C7A] font-bold">{currentReport.suggested_department}</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                Hazard Severity: <strong className="text-red-700">{currentReport.severity.toUpperCase()}</strong>
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
