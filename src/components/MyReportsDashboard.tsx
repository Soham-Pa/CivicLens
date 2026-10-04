import React, { useState } from 'react';
import { CivicReport, SeverityLevel, ReportStatus } from '../types';
import {
  Search,
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Building2,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import { generateCivicReportPDF } from '../utils/pdfGenerator';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MyReportsDashboardProps {
  reports: CivicReport[];
  isLoading: boolean;
  lang: Language;
  onViewReport: (report: CivicReport) => void;
  onTrackReport: (reportId: string) => void;
  onNewReport: () => void;
}

export const MyReportsDashboard: React.FC<MyReportsDashboardProps> = ({
  reports,
  isLoading,
  lang,
  onViewReport,
  onTrackReport,
  onNewReport,
}) => {
  const t = translations[lang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Real statistics computed directly from Firestore records
  const total = reports.length;
  const criticalCount = reports.filter((r) => r.severity === 'Critical').length;
  const inReviewCount = reports.filter((r) => r.status === 'In Review').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.issue_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.suggested_department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' || r.severity.toUpperCase() === severityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            In Review
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-800 border border-sky-300">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            Submitted
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            MEDIUM
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            LOW
          </span>
        );
    }
  };

  return (
    <section id="dashboard" className="py-12 bg-[#F4F6F9] border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              Official Database Registry
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
              {t.myReportsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live records fetched from Firestore database
            </p>
          </div>

          <button
            onClick={onNewReport}
            className="px-4 py-2 bg-[#0B3C7A] hover:bg-[#082852] text-white text-xs font-bold rounded transition shrink-0 self-start sm:self-auto"
          >
            + File New Grievance
          </button>
        </div>

        {/* Real Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-slate-800">
          <div className="bg-white p-4 rounded border border-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">{t.statTotal}</span>
            <div className="text-2xl font-extrabold text-[#0B3C7A] font-mono">{total}</div>
            <p className="text-[11px] text-slate-500">Real database records</p>
          </div>

          <div className="bg-white p-4 rounded border border-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-red-700 uppercase">{t.statCritical}</span>
            <div className="text-2xl font-extrabold text-red-700 font-mono">{criticalCount}</div>
            <p className="text-[11px] text-slate-500">Assessed critical hazards</p>
          </div>

          <div className="bg-white p-4 rounded border border-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase">{t.statInReview}</span>
            <div className="text-2xl font-extrabold text-amber-700 font-mono">{inReviewCount}</div>
            <p className="text-[11px] text-slate-500">Under municipal review</p>
          </div>

          <div className="bg-white p-4 rounded border border-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">{t.statResolved}</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">
              {resolvedCount} ({resolutionRate}%)
            </div>
            <p className="text-[11px] text-slate-500">Resolved & rectified</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-3.5 rounded border border-slate-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search database by ID, street address, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#0B3C7A] bg-[#F8FAFC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 border border-slate-300 rounded p-1 bg-[#F8FAFC]">
              {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded font-medium ${
                    severityFilter === sev ? 'bg-[#0B3C7A] text-white font-bold' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border border-slate-300 rounded p-1 bg-[#F8FAFC]">
              {['ALL', 'Submitted', 'In Review', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded font-medium ${
                    statusFilter === st ? 'bg-[#0B3C7A] text-white font-bold' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center bg-white rounded border border-slate-300 space-y-2">
            <RotateCw className="w-6 h-6 animate-spin text-[#0B3C7A] mx-auto" />
            <p className="text-xs text-slate-600 font-medium">Connecting to Firestore database...</p>
          </div>
        )}

        {/* Real List of Reports */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded border border-slate-300 p-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Grievance Reports Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {reports.length === 0
                    ? 'No grievances have been registered in the database yet. Submit your first report using the form above.'
                    : 'No reports matched your search criteria.'}
                </p>
                {reports.length === 0 && (
                  <button
                    onClick={onNewReport}
                    className="px-4 py-2 bg-[#0B3C7A] text-white text-xs font-bold rounded hover:bg-[#082852]"
                  >
                    Report First Issue
                  </button>
                )}
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded border border-slate-300 p-4 hover:border-[#0B3C7A] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                      <img src={report.imageUrl} alt={report.issue_type} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#0B3C7A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {report.id}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {report.category}
                        </span>
                        {getSeverityBadge(report.severity)}
                        {getStatusBadge(report.status)}
                      </div>

                      <h3 className="text-sm font-bold text-[#0B3C7A] truncate">
                        {report.issue_type}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-sm">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{report.location.address}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {report.formattedTimestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate">
                        Assigned: {report.suggested_department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => onTrackReport(report.id)}
                      className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-xs font-bold text-[#0B3C7A] flex items-center gap-1 transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => onViewReport(report)}
                      className="px-3.5 py-1.5 rounded bg-[#0B3C7A] hover:bg-[#082852] text-white text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Docket</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  );
};
