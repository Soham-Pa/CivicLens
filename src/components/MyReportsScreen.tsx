import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  X,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { CivicReport, Language, ReportStatus } from '../types';
import { translations } from '../utils/translations';
import { SeverityMeter } from './SeverityMeter';
import { generateCivicReportPDF } from '../utils/pdfGenerator';

interface MyReportsScreenProps {
  lang: Language;
  reports: CivicReport[];
  onOpenReportFlow: () => void;
  selectedReport?: CivicReport | null;
  onClearSelectedReport?: () => void;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({
  lang,
  reports,
  onOpenReportFlow,
  selectedReport: externalSelectedReport,
  onClearSelectedReport,
}) => {
  const t = translations[lang] || translations.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [internalSelectedReport, setInternalSelectedReport] = useState<CivicReport | null>(null);

  const activeModalReport = externalSelectedReport || internalSelectedReport;

  const handleCloseModal = () => {
    setInternalSelectedReport(null);
    if (onClearSelectedReport) onClearSelectedReport();
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = rep.id.toLowerCase().includes(q);
        const matchesIssue = rep.issue_type.toLowerCase().includes(q);
        const matchesAddress = rep.location.address.toLowerCase().includes(q);
        if (!matchesId && !matchesIssue && !matchesAddress) return false;
      }
      return true;
    });
  }, [reports, statusFilter, searchQuery]);

  const handleShareWhatsApp = (report: CivicReport) => {
    const text = `🚨 CivicLens Docket: ${report.id}
📍 Location: ${report.location.address}
⚠️ Severity: ${report.severity}
🛑 Issue: ${report.issue_type}
🏛️ Department: ${report.suggested_department}
🕒 Date: ${report.formattedTimestamp}

Status: ${report.status}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-5 lg:py-8 space-y-6 pb-28 md:pb-12">
      {/* Header and counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.myReportsTitle}
          </h1>
          <p className="text-xs text-slate-500 pt-0.5">
            {t.myReportsSub}
          </p>
        </div>
        <button
          onClick={onOpenReportFlow}
          className="h-10 px-4 bg-[#0B3C7A] hover:bg-[#072B56] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 w-fit"
        >
          <span>+ New Report</span>
        </button>
      </div>

      {/* Controls row: Search + Status Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0B3C7A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap text-xs transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.filterStatusAll} ({reports.length})
          </button>
          <button
            onClick={() => setStatusFilter('Submitted')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap text-xs transition-colors cursor-pointer ${
              statusFilter === 'Submitted'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            {t.statusSubmitted}
          </button>
          <button
            onClick={() => setStatusFilter('In Review')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap text-xs transition-colors cursor-pointer ${
              statusFilter === 'In Review'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
            }`}
          >
            {t.statusInReview}
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap text-xs transition-colors cursor-pointer ${
              statusFilter === 'Resolved'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {t.statusResolved}
          </button>
        </div>
      </div>

      {/* Reports Responsive Grid: 1 col on phones, 2 on tablets, 3 on desktop */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 max-w-md mx-auto">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">
            {t.noReportsFound}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setInternalSelectedReport(report)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer active:scale-[0.99] group space-y-2.5 flex flex-col justify-between"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setInternalSelectedReport(report)}
            >
              {/* Top row: Thumbnail + Details */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={report.imageUrl}
                    alt={report.issue_type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[11px] font-mono font-extrabold text-[#0B3C7A]">
                      {report.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.status === 'In Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {report.issue_type}
                  </h3>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <SeverityMeter severity={report.severity} showLabel={false} />
                    <span className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location.address}</span>
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform self-center shrink-0" />
              </div>

              {/* Bottom row: Date & Department */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{report.formattedTimestamp.split(',')[0]}</span>
                </span>
                <span className="truncate max-w-[180px] font-medium text-slate-500">
                  {report.location.ward || 'KMC Ward'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= REPORT DETAILS MODAL (Centered & capped width on desktop) ================= */}
      {activeModalReport && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold font-mono text-[#0B3C7A]">
                  {activeModalReport.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeModalReport.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeModalReport.status === 'In Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {activeModalReport.status}
                </span>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Photo & Main Issue */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/9 relative">
                <img
                  src={activeModalReport.imageUrl}
                  alt={activeModalReport.issue_type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <SeverityMeter severity={activeModalReport.severity} />
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeModalReport.issue_type}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeModalReport.location.address}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Logged: {activeModalReport.formattedTimestamp}
                </p>
              </div>

              {/* Complaint Description */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Citizen Grievance Description:
                </span>
                <p className="text-slate-800 text-xs leading-relaxed">
                  {activeModalReport.description}
                </p>
              </div>

              {/* Department & Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Assigned Authority
                  </span>
                  <p className="font-semibold text-slate-800">
                    {activeModalReport.suggested_department}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Public Risk Factor
                  </span>
                  <p className="font-semibold text-slate-800">
                    {activeModalReport.risk_to_public}
                  </p>
                </div>
              </div>

              {/* 3-Step Timeline */}
              {activeModalReport.statusTimeline && activeModalReport.statusTimeline.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0B3C7A]" />
                    <span>{t.timelineTitle}</span>
                  </h3>
                  <div className="space-y-2">
                    {activeModalReport.statusTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[11px]">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{item.stage}</p>
                          <p className="text-slate-400 text-[10px]">{item.date}</p>
                          {item.notes && (
                            <p className="text-slate-600 text-[11px] leading-tight">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => generateCivicReportPDF(activeModalReport)}
                className="flex-1 h-11 bg-[#0B3C7A] hover:bg-[#072B56] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-xs"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadPdfBtn}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(activeModalReport)}
                className="h-11 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-xs"
                title="Share on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="h-11 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer text-xs"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
