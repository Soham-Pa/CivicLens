import React, { useState } from 'react';
import { CivicReport } from '../types';
import { SeverityMeter } from './SeverityMeter';
import { MiniMap } from './MiniMap';
import { generateCivicReportPDF } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  Copy,
  Check,
  Share2,
  Mail,
  MapPin,
  Calendar,
  Building2,
  ShieldAlert,
  BookmarkCheck,
  ExternalLink,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Clock,
} from 'lucide-react';

interface ReportPackagePreviewProps {
  report: CivicReport;
  onSaveToDashboard?: (report: CivicReport) => void;
  isSaved?: boolean;
}

export const ReportPackagePreview: React.FC<ReportPackagePreviewProps> = ({
  report,
  onSaveToDashboard,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [localSaved, setLocalSaved] = useState(isSaved);

  const complaintText = `OFFICIAL CIVIC GRIEVANCE PETITION [Ref: ${report.id}]
To: Municipal Commissioner / Ward Executive Engineer, Kolkata Municipal Corporation
Subject: Urgent Action Requested - ${report.issue_type} at ${report.location.address}

Issue Detected: ${report.issue_type} (${report.category})
Severity Assessment: ${report.severity.toUpperCase()}
Assigned Municipal Wing: ${report.suggested_department}
GPS Coordinates: ${report.location.latitude.toFixed(6)}° N, ${report.location.longitude.toFixed(6)}° E
Address: ${report.location.address} (${report.location.ward || 'KMC Ward'})
Recorded Timestamp: ${report.formattedTimestamp}

Official Statement:
${report.description}

Technical Hazard Assessment:
${report.severity_reason}
Public Safety Risk: ${report.risk_to_public || report.estimated_risk || 'Public hazard'}

This evidence dossier has been generated with photographic and GPS proof via CivicLens (Citizen Civic Grievance & Evidence Portal) for immediate administrative intervention under the West Bengal Right to Public Services Act.`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(complaintText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCivicReportPDF(report);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚨 *CIVIC HAZARD EVIDENCE REPORT [Ref: ${report.id}]*\n\n` +
      `*Issue:* ${report.issue_type}\n` +
      `*Severity:* ${report.severity} ⚠️\n` +
      `*Location:* ${report.location.address}\n` +
      `*Department:* ${report.suggested_department}\n\n` +
      `*Complaint Summary:* ${report.description}\n\n` +
      `*GPS Coordinates:* https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}\n\n` +
      `_Logged via CivicLens Portal_`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailAuthority = () => {
    const subject = encodeURIComponent(`[GRIEVANCE ${report.id}] ${report.issue_type} - ${report.location.address}`);
    const body = encodeURIComponent(complaintText);
    window.location.href = `mailto:commissioner@kmcgov.in?cc=support@civiclens.org&subject=${subject}&body=${body}`;
  };

  const handleSave = () => {
    if (onSaveToDashboard) {
      onSaveToDashboard(report);
      setLocalSaved(true);
    }
  };

  return (
    <div className="bg-white rounded border-2 border-[#0B3C7A] shadow-md overflow-hidden text-slate-800">
      
      {/* Top Docket Header (Navy + Saffron Stripe) */}
      <div className="bg-[#0B3C7A] text-white p-5 sm:p-6 border-b-4 border-[#FF9933]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#FF9933] text-[#072346] px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                FORMAL EVIDENCE DOCKET
              </span>
              <span className="text-xs text-slate-300 font-mono">IST Authenticated</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF9933]" />
              Official Civic Evidence Docket
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Docket Ref: <span className="text-[#FF9933] font-bold">{report.id}</span> • Jurisdiction: KMC Borough Wing
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded bg-[#FF9933] hover:bg-[#E68A00] text-[#072346] font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-75"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF'}
            </button>

            <button
              onClick={handleSave}
              className={`px-3 py-2 rounded border text-xs font-semibold flex items-center gap-1.5 transition ${
                localSaved
                  ? 'bg-[#138808] border-[#138808] text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              {localSaved ? 'Saved in Records' : 'Save Record'}
            </button>
          </div>
        </div>
      </div>

      {/* Docket Metadata Summary Grid (Tabular Portal Look) */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Title & Classification Bar */}
        <div className="border border-slate-300 rounded p-4 bg-[#F8FAFC]">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700">
                  {report.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#0B3C7A] border border-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0B3C7A]" />
                  AI Vision Verified: {report.confidence}%
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Ready for Administrative Action
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3C7A]">
                {report.issue_type}
              </h2>
            </div>

            {/* Severity Rating */}
            <div className="w-full lg:w-72 bg-white border border-slate-300 p-3 rounded">
              <SeverityMeter severity={report.severity} />
            </div>
          </div>
        </div>

        {/* Visual Proof and Mini-Map Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Photographic Evidence</span>
              <span className="text-[#0B3C7A] font-mono text-[11px]">Geo-Tagged Snapshot</span>
            </div>
            <div className="relative aspect-4/3 rounded overflow-hidden border border-slate-300 bg-slate-950">
              <img
                src={report.imageUrl}
                alt={report.issue_type}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#0B3C7A]/90 text-white px-2 py-0.5 rounded text-[10px] font-mono border border-white/20">
                EVIDENCE TAG: {report.id}
              </div>
              <div className="absolute bottom-2 inset-x-2 bg-slate-900/90 text-white p-2 rounded text-[10px] font-mono flex items-center justify-between">
                <span>{report.location.latitude.toFixed(4)}°N, {report.location.longitude.toFixed(4)}°E</span>
                <span>{report.formattedTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Location & Mini Map Box */}
          <div className="space-y-1.5 flex flex-col">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Incident Geolocation</span>
              <span className="text-slate-600 font-mono text-[11px]">OpenStreetMap Pin</span>
            </div>
            <div className="flex-1 rounded overflow-hidden border border-slate-300 min-h-[200px] relative">
              <MiniMap
                latitude={report.location.latitude}
                longitude={report.location.longitude}
                interactive={false}
                className="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 p-2 rounded border border-slate-300 text-xs shadow-xs">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0B3C7A] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{report.location.address}</p>
                    <p className="text-[10px] text-slate-600">{report.location.ward || 'KMC Ward'} • {report.location.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grievance Statement & Department Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-[#F8FAFC] border border-slate-300 rounded p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-[#0B3C7A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FF9933]" />
                  Formal Grievance Petition Text
                </h4>
                <button
                  onClick={handleCopyText}
                  className="text-xs font-semibold text-[#0B3C7A] hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-800 leading-relaxed font-normal">
                {report.description}
              </div>

              <div className="text-xs text-slate-600 pt-1 space-y-0.5">
                <p className="font-bold text-slate-800">Inspector Verification Note:</p>
                <p className="italic">{report.severity_reason}</p>
              </div>
            </div>
          </div>

          {/* Department & Hazard Box */}
          <div className="space-y-3">
            <div className="bg-[#F8FAFC] border border-slate-300 rounded p-3.5 space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#0B3C7A]" />
                Target Municipal Department
              </span>
              <p className="font-bold text-[#0B3C7A] text-sm">{report.suggested_department}</p>
              <p className="text-[11px] text-slate-500">
                Right to Public Services SLA: <strong>24–48 Hours</strong>
              </p>
            </div>

            <div className="bg-red-50/70 border border-red-200 rounded p-3.5 space-y-1 text-xs">
              <span className="font-bold text-red-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                Assessed Hazard Risk
              </span>
              <p className="text-red-950 font-medium leading-snug">{report.risk_to_public || report.estimated_risk || 'Public safety hazard'}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Incident Logged:</span>
                <span className="font-bold text-slate-800 font-mono">{report.formattedTimestamp}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1">
                <span className="text-slate-500">Jurisdiction:</span>
                <span className="font-bold text-slate-800">{report.location.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded bg-[#138808] hover:bg-[#0E6C06] text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share via WhatsApp
            </button>

            <button
              onClick={handleEmailAuthority}
              className="px-3.5 py-2 rounded bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              Email to KMC Authority
            </button>

            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Petition'}
            </button>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded bg-[#FF9933] hover:bg-[#E68A00] text-[#072346] font-extrabold text-xs flex items-center gap-1.5 transition ml-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Official PDF Docket
          </button>
        </div>

      </div>

    </div>
  );
};
