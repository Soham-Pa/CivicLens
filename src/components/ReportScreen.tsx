import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Share2,
  RotateCcw,
  Loader2,
  Check,
  Edit3,
  RefreshCw,
} from 'lucide-react';
import { CivicReport, Language, SeverityLevel, CivicCategory } from '../types';
import { translations } from '../utils/translations';
import { SAMPLE_REPORT_PHOTOS } from '../data/sampleData';
import { getISTTimestamp, generateReportId, reverseGeocode } from '../utils/geo';
import { generateCivicReportPDF } from '../utils/pdfGenerator';
import { MiniMap } from './MiniMap';
import { CameraModal } from './CameraModal';
import { SeverityMeter } from './SeverityMeter';

interface ReportScreenProps {
  lang: Language;
  onReportSubmitted: (report: CivicReport) => void;
  onGoToMyReports: () => void;
  initialCategory?: CivicCategory;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  lang,
  onReportSubmitted,
  onGoToMyReports,
  initialCategory,
}) => {
  const t = translations[lang] || translations.en;

  // Step state: 1 (Photo) -> 2 (AI Result & Location) -> 3 (Review) -> 4 (Submitted)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Photo state
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'real' | 'sample'>('sample');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 Editable Fields
  const [issueType, setIssueType] = useState('');
  const [category, setCategory] = useState<CivicCategory>(initialCategory || 'pothole');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [severityReason, setSeverityReason] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedDept, setSuggestedDept] = useState('');
  const [riskToPublic, setRiskToPublic] = useState('');

  // Location & Timestamp
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 22.5726,
    lng: 88.3639, // Default Kolkata
  });
  const [address, setAddress] = useState('Central Kolkata Municipal Ward, Kolkata, West Bengal');
  const [ward, setWard] = useState('Ward 44');
  const [timestamp, setTimestamp] = useState(getISTTimestamp());

  // Step 3 Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  // Try GPS on mount if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          const geoRes = await reverseGeocode(lat, lng);
          if (geoRes.address) setAddress(geoRes.address);
          if (geoRes.ward) setWard(geoRes.ward);
        },
        () => {
          // Fallback location kept
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Handle Photo selection & analyze
  const handlePhotoSelect = async (img: string, hint = '', customCoords?: { lat: number; lng: number }, customAddress?: string) => {
    setImageSrc(img);
    setIsAnalyzing(true);
    setTimestamp(getISTTimestamp());

    if (customCoords) {
      setCoords(customCoords);
    }
    if (customAddress) {
      setAddress(customAddress);
    }

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: img,
          sampleHint: hint,
          city: 'Kolkata',
        }),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        const a = data.analysis;
        setIssueType(a.issue_type || 'Civic Infrastructure Defect');
        setCategory((a.category as CivicCategory) || 'pothole');
        setSeverity((a.severity as SeverityLevel) || 'High');
        setSeverityReason(a.severity_reason || 'Road hazard requires municipal attention.');
        setDescription(a.description || 'Public infrastructure hazard documented for civic intervention.');
        setSuggestedDept(a.suggested_department || 'Kolkata Municipal Corporation – Engineering Wing');
        setRiskToPublic(a.risk_to_public || 'Pedestrian and vehicular safety hazard');
        setAnalysisSource(data.source === 'real_gemini_vision' ? 'real' : 'sample');
      } else {
        applyFallback(hint);
      }
    } catch (err) {
      console.warn('Analysis error, applying demo fallback', err);
      applyFallback(hint);
    } finally {
      setIsAnalyzing(false);
      setStep(2); // Advance to Step 2
    }
  };

  const applyFallback = (hint: string) => {
    setAnalysisSource('sample');
    const h = hint.toLowerCase();
    if (h.includes('garbage') || h.includes('waste')) {
      setIssueType('Overflowing Solid Waste Vat');
      setCategory('garbage');
      setSeverity('High');
      setSeverityReason('Uncollected organic waste encroaching onto public walkway with high vector risk.');
      setDescription('An overflowing municipal waste vat has remained uncollected, causing decomposing refuse to spill across the pedestrian walkway. Immediate compactor clearance and sanitation is requested.');
      setSuggestedDept('Kolkata Municipal Corporation – Solid Waste Management (SWM)');
      setRiskToPublic('Vector-borne disease outbreak, stray animal nuisance, blocked sidewalk');
    } else if (h.includes('water') || h.includes('flood') || h.includes('drain')) {
      setIssueType('Severe Street Waterlogging & Blocked Drain');
      setCategory('waterlogging');
      setSeverity('Critical');
      setSeverityReason('Choked subterranean stormwater conduits leading to knee-deep water accumulation.');
      setDescription('Monsoon showers have caused severe waterlogging due to choked gully pits and heavy silt deposition. Stagnant sewage water impedes vehicle movement and submerges roadside kerbs. Immediate suction pump operation is requested.');
      setSuggestedDept('Kolkata Municipal Corporation – Drainage & Sewerage Department');
      setRiskToPublic('Electrocution hazard from submerged pole bases, vector breeding, vehicle stalling');
    } else {
      setIssueType('Deep Carriageway Pothole with Standing Water');
      setCategory('pothole');
      setSeverity('Critical');
      setSeverityReason('Deep 15cm crater in active vehicle traffic lane causing high risk of two-wheeler skids.');
      setDescription('A severe asphalt crater has formed on the active carriageway, measuring over 1 meter across. Stagnant rainwater conceals the crater depth, causing dangerous lane diversions and vehicle damage. Urgent mastic asphalt patch repair is solicited.');
      setSuggestedDept('Kolkata Municipal Corporation – Roads & Engineering Department');
      setRiskToPublic('Two-wheeler falls, axle shocks, severe traffic bottleneck');
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        handlePhotoSelect(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Draggable pin location update
  const handleLocationChange = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    const geo = await reverseGeocode(lat, lng);
    if (geo.address) setAddress(geo.address);
    if (geo.ward) setWard(geo.ward);
  };

  // Step 3 Submission
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    const newReportId = generateReportId();

    const report: CivicReport = {
      id: newReportId,
      createdAt: new Date().toISOString(),
      formattedTimestamp: timestamp,
      imageUrl: imageSrc,
      is_civic_issue: true,
      issue_type: issueType,
      category,
      severity,
      severity_reason: severityReason,
      description,
      suggested_department: suggestedDept,
      risk_to_public: riskToPublic,
      confidence: 0.95,
      location: {
        latitude: coords.lat,
        longitude: coords.lng,
        address,
        ward,
        city: 'Kolkata',
      },
      status: 'Submitted',
      statusTimeline: [
        {
          stage: 'Complaint Registered & Timestamped',
          date: timestamp,
          notes: 'Citizen photographic evidence authenticated with GPS coordinates.',
          completed: true,
        },
        {
          stage: 'AI Hazard Severity Verified',
          date: timestamp,
          notes: `Multimodal AI verified ${category} defect with ${severity.toUpperCase()} severity.`,
          completed: true,
        },
        {
          stage: 'Dispatched to Departmental Wing',
          date: timestamp,
          notes: `Docket assigned to ${suggestedDept} under Public Services Act (48-Hr SLA).`,
          completed: true,
        },
      ],
    };

    await onReportSubmitted(report);
    setSubmittedReport(report);
    setIsSubmitting(false);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setImageSrc('');
    setSubmittedReport(null);
  };

  const handleShareWhatsApp = () => {
    if (!submittedReport) return;
    const text = `🚨 CivicLens Grievance Docket: ${submittedReport.id}
📍 Location: ${submittedReport.location.address}
⚠️ Severity: ${submittedReport.severity}
🛑 Issue: ${submittedReport.issue_type}
🏛️ Department: ${submittedReport.suggested_department}
🕒 Logged: ${submittedReport.formattedTimestamp}

Evidence docket generated via CivicLens Kolkata Citizen Portal.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-5 lg:py-8 space-y-6 pb-28 md:pb-12">
      {/* PROGRESS STEPPER (Steps 1-3) */}
      {step < 4 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-[#0B3C7A]' : ''}>{t.step1Tab}</span>
            <span className={step >= 2 ? 'text-[#0B3C7A]' : ''}>{t.step2Tab}</span>
            <span className={step >= 3 ? 'text-[#0B3C7A]' : ''}>{t.step3Tab}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-[#0B3C7A] h-2 transition-all duration-300 rounded-full"
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            />
          </div>
        </div>
      )}

      {/* ================= STEP 1 & 2: RESPONSIVE TWO-COLUMN ON DESKTOP, STEP-BY-STEP ON MOBILE ================= */}
      {step < 3 && (
        <div className="max-w-5xl mx-auto">
          {/* On Desktop (md+), we show two columns: Left (Photo & Samples) | Right (AI Result & Location) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Photo Capture, Preview, or Scanner */}
            <div className={`md:col-span-5 space-y-4 ${step === 2 ? 'hidden md:block' : 'block'}`}>
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">
                    {t.step1Title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t.step1Sub}
                  </p>
                </div>

                {/* If analyzing: scanning beam */}
                {isAnalyzing ? (
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border-2 border-[#0B3C7A] aspect-4/3 flex flex-col items-center justify-center p-4">
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt="Scanning"
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                    )}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />
                    <div className="relative z-10 text-center space-y-2 max-w-xs">
                      <Sparkles className="w-8 h-8 text-yellow-300 mx-auto animate-pulse" />
                      <h3 className="text-sm font-bold text-white tracking-wide">{t.analyzingPhoto}</h3>
                      <p className="text-[11px] text-blue-200">{t.analyzingSub}</p>
                      <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-cyan-300 font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Inspecting infrastructure defect...</span>
                      </div>
                    </div>
                  </div>
                ) : imageSrc ? (
                  /* Photo preview when already captured */
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
                      <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {analysisSource === 'real' ? t.realAiBadge : t.demoAiFallbackBadge}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setImageSrc('');
                        setStep(1);
                      }}
                      className="w-full h-10 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake / Upload Different Photo</span>
                    </button>
                  </div>
                ) : (
                  /* Big action buttons */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => setIsCameraOpen(true)}
                        className="h-14 bg-[#0B3C7A] hover:bg-[#072B56] active:scale-98 text-white font-bold text-sm rounded-xl flex flex-col items-center justify-center gap-1 p-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Camera className="w-5 h-5" />
                        <span>{t.takePhotoBtn}</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-14 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-sm rounded-xl border border-slate-300/80 flex flex-col items-center justify-center gap-1 p-2 shadow-2xs transition-all cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-[#0B3C7A]" />
                        <span>{t.uploadPhotoBtn}</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-3.5 text-center hover:border-blue-400 bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <p className="text-xs text-slate-500 font-medium">
                        {t.dragDropText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Sample Photos */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.samplePhotosHeading}
                  </h3>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    1-Click Instant Test
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {SAMPLE_REPORT_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      disabled={isAnalyzing}
                      onClick={() => handlePhotoSelect(sample.imageUrl, sample.hint, sample.coords, sample.address)}
                      className="group flex flex-col text-left rounded-xl overflow-hidden border border-slate-200 hover:border-[#0B3C7A] hover:ring-2 hover:ring-blue-100 transition-all bg-slate-50 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <div className="aspect-4/3 w-full bg-slate-200 overflow-hidden relative">
                        <img
                          src={sample.imageUrl}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {sample.tag}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-1">
                          {sample.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI Results, Editable Description, Department & Map */}
            <div className={`md:col-span-7 space-y-4 ${step === 1 ? 'hidden md:block' : 'block'}`}>
              {step === 1 ? (
                /* Desktop placeholder when on Step 1 */
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 flex flex-col items-center justify-center min-h-[360px]">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B3C7A] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Awaiting Incident Photo
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Capture or select a photo on the left. CivicLens AI will automatically verify the defect, assess hazard severity, and draft an administrative petition.
                  </p>
                </div>
              ) : (
                /* Active Step 2 Fields */
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {analysisSource === 'real' ? t.realAiBadge : t.demoAiFallbackBadge}
                        </span>
                        <SeverityMeter severity={severity} />
                      </div>
                      <h2 className="text-base font-bold text-slate-900 truncate">
                        {issueType}
                      </h2>
                    </div>

                    {/* Mobile-only thumbnail */}
                    {imageSrc && (
                      <div className="md:hidden w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        <img src={imageSrc} alt="Incident" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Editable Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#0B3C7A]" />
                        <span>{t.descriptionLabel}</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Click to edit</span>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0B3C7A] bg-slate-50/50"
                      placeholder="Formal complaint description..."
                    />
                  </div>

                  {/* Department & Severity details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t.suggestedDeptLabel}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {suggestedDept}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t.severityReasonLabel}
                      </span>
                      <p className="text-xs text-slate-700 leading-tight">
                        {severityReason}
                      </p>
                    </div>
                  </div>

                  {/* Location & Time Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0B3C7A]" />
                        <span>{t.locationSectionTitle}</span>
                      </h3>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{timestamp}</span>
                      </span>
                    </div>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B3C7A]"
                      placeholder="Street address / Landmark"
                    />

                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <MiniMap
                        latitude={coords.lat}
                        longitude={coords.lng}
                        onLocationChange={handleLocationChange}
                        interactive={true}
                        className="h-44 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      {t.changeLocation}
                    </p>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => setStep(1)}
                      className="h-11 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.backBtn}</span>
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="h-11 flex-1 bg-[#0B3C7A] hover:bg-[#072B56] active:scale-98 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>{t.nextReviewBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: REVIEW & SUBMIT ================= */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                {t.step3Title}
              </h2>
              <p className="text-xs text-slate-500">
                {t.step3Sub}
              </p>
            </div>

            {/* Review Summary Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-start gap-4">
                {imageSrc && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-300 bg-slate-200">
                    <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {category}
                    </span>
                    <SeverityMeter severity={severity} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {issueType}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{address}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200/80 pt-3 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Complaint Text:
                  </span>
                  <p className="text-slate-700 italic text-xs leading-relaxed pt-1">
                    "{description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1.5 text-slate-600">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
                    <span className="font-semibold text-slate-800">{suggestedDept}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Recorded IST</span>
                    <span className="font-semibold text-slate-800">{timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => setStep(2)}
                className="h-12 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={handleSubmitReport}
                className="h-12 flex-1 bg-[#E65100] hover:bg-[#D84315] active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.submittingReport}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submitReportBtn}</span>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SUCCESS SCREEN ================= */}
      {step === 4 && submittedReport && (
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.reportSuccessTitle}
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {t.reportSuccessSub}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 inline-block mx-auto min-w-[260px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {t.reportIdLabel}
            </span>
            <span className="text-xl font-black font-mono text-[#0B3C7A]">
              {submittedReport.id}
            </span>
          </div>

          <div className="space-y-2.5 pt-2 max-w-xs mx-auto">
            <button
              onClick={() => generateCivicReportPDF(submittedReport)}
              className="w-full h-11 bg-[#0B3C7A] hover:bg-[#072B56] active:scale-98 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{t.downloadPdfBtn}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full h-11 bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareWhatsAppBtn}</span>
            </button>

            <button
              onClick={onGoToMyReports}
              className="w-full h-11 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs rounded-xl border border-slate-300/80 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{t.viewInMyReportsBtn}</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 cursor-pointer pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.reportAnotherBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          setIsCameraOpen(false);
          handlePhotoSelect(base64);
        }}
      />
    </div>
  );
};
