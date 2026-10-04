import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  FileCheck2,
  Pencil,
  Crosshair,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Eye,
  XCircle,
} from 'lucide-react';
import { CIVIC_CATEGORIES, CategoryInfo } from '../data/samples';
import { AnalysisData, CivicReport, CivicCategory, Language, LocationInfo, SeverityLevel } from '../types';
import { SeverityMeter } from './SeverityMeter';
import { MiniMap } from './MiniMap';
import { CameraModal } from './CameraModal';
import { ReportPackagePreview } from './ReportPackagePreview';
import { getISTTimestamp, generateReportId, reverseGeocode } from '../utils/geo';
import { compressImage } from '../utils/imageCompressor';
import { saveReportToFirestore } from '../services/reportService';
import { translations } from '../utils/translations';

interface ReportToolProps {
  lang: Language;
  onReportCreated?: (report: CivicReport) => void;
  selectedCategory?: CategoryInfo | null;
  onTrackRedirect?: (reportId: string) => void;
}

export const ReportTool: React.FC<ReportToolProps> = ({
  lang,
  onReportCreated,
  selectedCategory,
  onTrackRedirect,
}) => {
  const t = translations[lang] || translations.en;

  // Image and Input state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [nonCivicIssueDetected, setNonCivicIssueDetected] = useState(false);

  // Location & Timestamp state
  const [location, setLocation] = useState<LocationInfo>({
    latitude: 22.5726,
    longitude: 88.3639,
    address: 'Kolkata, West Bengal',
    ward: 'Kolkata Municipal Corporation',
    city: 'Kolkata',
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [timestamp, setTimestamp] = useState<string>(getISTTimestamp());

  // User edited fields
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<CivicCategory>('pothole');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalReport, setFinalReport] = useState<CivicReport | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auto-fetch real location on mount
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  // Sync selectedCategory if passed from parent
  useEffect(() => {
    if (selectedCategory) {
      setCustomCategory(selectedCategory.id);
      document.getElementById('report-tool')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCategory]);

  // Handle file selection with image compression
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAnalysisError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    try {
      setAnalysisError(null);
      setNonCivicIssueDetected(false);
      setAnalysis(null);
      setFinalReport(null);
      setShowConfirmation(false);

      // Compress to max 1280px at 0.8 JPEG quality
      const compressedDataUrl = await compressImage(file, 1280, 0.8);
      setSelectedImage(compressedDataUrl);
      setImageFileName(file.name);
      setTimestamp(getISTTimestamp());

      // Trigger real analysis
      analyzeWithGemini(compressedDataUrl);
    } catch (err: any) {
      console.error('Image compression error:', err);
      setAnalysisError('Failed to process image: ' + (err.message || String(err)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Real Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const geoData = await reverseGeocode(lat, lng);
          setLocation({
            latitude: lat,
            longitude: lng,
            address: geoData.address || `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`,
            ward: geoData.ward || 'Municipal Ward Jurisdiction',
            city: geoData.city || 'Kolkata',
            accuracy: Math.round(pos.coords.accuracy),
          });
        } catch {
          setLocation((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            accuracy: Math.round(pos.coords.accuracy),
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        let msg = 'Could not retrieve GPS coordinates.';
        if (err.code === 1) msg = 'Location access was denied. Please enter the address manually below.';
        else if (err.code === 2) msg = 'Location position unavailable. Please enter address manually.';
        else if (err.code === 3) msg = 'Location request timed out. Please enter address manually.';
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Map pin dragged
  const handleMapLocationChange = async (lat: number, lng: number) => {
    try {
      const geoData = await reverseGeocode(lat, lng);
      setLocation((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: geoData.address || `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`,
        ward: geoData.ward || prev.ward,
      }));
    } catch {
      setLocation((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    }
  };

  // Real Gemini Vision Call
  const analyzeWithGemini = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setNonCivicIssueDetected(false);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageDataUrl,
          city: 'Kolkata',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze image with Gemini AI.');
      }

      const res = data.analysis as AnalysisData;

      if (!res.is_civic_issue) {
        setNonCivicIssueDetected(true);
        setAnalysis(null);
      } else {
        setAnalysis(res);
        setCustomDescription(res.description);
        setCustomCategory(res.category);
      }
    } catch (err: any) {
      console.error('Real Gemini Analysis error:', err);
      setAnalysisError(err.message || 'Error communicating with AI service. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Real Form Submission & Firestore Save
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedImage) {
      setSubmitError('Please upload or capture a photo first.');
      return;
    }

    if (!analysis) {
      setSubmitError('AI analysis is required before submission.');
      return;
    }

    if (!location.address.trim()) {
      setSubmitError('Please enter a valid street address or landmark.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportId = generateReportId();
      const currentIsoTime = new Date().toISOString();
      const currentIstTime = getISTTimestamp();

      const report: CivicReport = {
        id: reportId,
        createdAt: currentIsoTime,
        formattedTimestamp: currentIstTime,
        imageUrl: selectedImage,
        is_civic_issue: true,
        issue_type: analysis.issue_type,
        category: customCategory,
        severity: analysis.severity,
        severity_reason: analysis.severity_reason,
        description: customDescription || analysis.description,
        suggested_department: analysis.suggested_department,
        risk_to_public: analysis.risk_to_public,
        confidence: analysis.confidence,
        location: location,
        status: 'Submitted',
        statusTimeline: [
          {
            stage: 'Complaint Registered & Timestamped',
            date: currentIstTime,
            notes: 'Citizen grievance authenticated with photo and GPS location evidence.',
            completed: true,
          },
        ],
      };

      // Real Firestore write
      await saveReportToFirestore(report);

      setFinalReport(report);
      setShowConfirmation(true);
      if (onReportCreated) {
        onReportCreated(report);
      }

      // Smooth scroll to confirmation
      setTimeout(() => {
        document.getElementById('confirmation-box')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError('Failed to record report in database: ' + (err.message || String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report-tool" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Government Form Heading Banner */}
        <div className="border-b-2 border-[#0B3C7A] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#0B3C7A] uppercase tracking-wider block">
                CITIZEN CIVIC INFRASTRUCTURE REPORTING PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A] mt-1">
                {t.formHeading}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-[#F4F6F9] border border-slate-300 text-slate-700 px-3 py-1 rounded self-start sm:self-auto">
              FORM: CIVIC-GR-01
            </span>
          </div>
          <p className="text-xs text-[#B71C1C] font-semibold mt-2">
            * All fields marked with an asterisk are mandatory. Upload an authentic photo of a civic fault to begin.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitForm} className="space-y-8">
          
          {/* Section 1: Photo Evidence & AI Inspection */}
          <div className="bg-[#F8FAFC] border border-slate-300 rounded p-5 sm:p-6 space-y-6">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-[#0B3C7A] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B3C7A] text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Incident Visual Evidence *</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload or capture a clear photo of the civic defect. The AI vision model will automatically inspect it.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Photo Input Frame */}
              <div className="lg:col-span-6 space-y-3">
                {selectedImage ? (
                  <div className="relative aspect-4/3 rounded overflow-hidden border-2 border-slate-300 bg-slate-950 shadow-inner">
                    <img
                      src={selectedImage}
                      alt="Captured civic hazard"
                      className={`w-full h-full object-cover ${isAnalyzing ? 'brightness-75' : ''}`}
                    />
                    
                    {/* Scanning indicator */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                        <RotateCw className="w-8 h-8 text-[#FF9933] animate-spin mb-2" />
                        <p className="text-sm font-bold">Analyzing with Gemini AI...</p>
                        <p className="text-xs text-slate-300">Checking hazard severity and infrastructure defect</p>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      {imageFileName || 'Uploaded Photo'}
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-4/3 border-2 border-dashed rounded p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 bg-white ${
                      isDragging ? 'border-[#0B3C7A] bg-blue-50' : 'border-slate-300 hover:border-[#0B3C7A]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B3C7A] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Click to Upload or Drag Photo Here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports JPG, PNG, WEBP (Photos are compressed automatically)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                {/* Upload & Camera Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-3 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4 text-[#0B3C7A]" />
                    <span>{selectedImage ? 'Change Photo' : 'Select Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="py-2.5 px-4 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Camera className="w-4 h-4 text-[#0B3C7A]" />
                    <span>Use Camera</span>
                  </button>

                  {selectedImage && !isAnalyzing && (
                    <button
                      type="button"
                      onClick={() => analyzeWithGemini(selectedImage)}
                      className="py-2.5 px-4 rounded bg-[#0B3C7A] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#082852]"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Re-Analyze</span>
                    </button>
                  )}
                </div>

                {/* Error Banner with Retry */}
                {analysisError && (
                  <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold">AI Analysis Failed</p>
                        <p className="text-[11px] mt-0.5">{analysisError}</p>
                      </div>
                    </div>
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={() => analyzeWithGemini(selectedImage)}
                        className="px-3 py-1 bg-red-700 text-white rounded font-bold text-xs hover:bg-red-800"
                      >
                        Retry Analysis
                      </button>
                    )}
                  </div>
                )}

                {/* Non-Civic Issue Banner */}
                {nonCivicIssueDetected && (
                  <div className="p-4 rounded bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">No civic issue detected</p>
                        <p className="mt-0.5 text-xs">
                          Please upload a clear photo of the problem (such as a pothole, garbage dump, broken streetlight, or clogged drain).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#0B3C7A] text-white rounded text-xs font-bold"
                    >
                      Upload Different Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Analysis Result Card */}
              <div className="lg:col-span-6 space-y-4">
                {analysis ? (
                  <div className="bg-white border border-slate-300 rounded p-4 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          AI Vision Inspection Verified
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0B3C7A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Confidence: {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Detected Issue Title</span>
                      <h4 className="text-base font-extrabold text-[#0B3C7A]">{analysis.issue_type}</h4>
                    </div>

                    {/* Category Selector (Editable by user) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Category (Editable) *
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value as CivicCategory)}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#0B3C7A]"
                      >
                        <option value="pothole">pothole - Road Potholes & Craters</option>
                        <option value="garbage">garbage - Overflowing Waste & Sanitation</option>
                        <option value="streetlight">streetlight - Broken & Dark Streetlights</option>
                        <option value="drain">drain - Blocked Drains & Sewerage</option>
                        <option value="waterlogging">waterlogging - Street Flooding & Inundation</option>
                        <option value="footpath">footpath - Damaged Footpaths & Pavers</option>
                        <option value="other">other - General Municipal Hazard</option>
                      </select>
                    </div>

                    {/* Severity Meter */}
                    <div className="border border-slate-200 rounded p-3 bg-[#F8FAFC] space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 block">Severity Level</span>
                      <SeverityMeter severity={analysis.severity} />
                      <p className="text-xs text-slate-600 pt-1">
                        <strong>Reason:</strong> {analysis.severity_reason}
                      </p>
                    </div>

                    {/* Department & Risk */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Suggested Department</span>
                        <p className="font-bold text-[#0B3C7A]">{analysis.suggested_department}</p>
                      </div>
                      <div className="bg-red-50/70 p-2.5 rounded border border-red-200">
                        <span className="text-[10px] font-bold text-red-700 uppercase block">Risk to Public</span>
                        <p className="text-red-950 font-medium">{analysis.risk_to_public}</p>
                      </div>
                    </div>

                    {/* Description (Editable by user) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Complaint Description (Editable) *
                        </label>
                        <span className="text-[10px] text-slate-500">Edit wording if desired</span>
                      </div>
                      <textarea
                        rows={4}
                        required
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="w-full p-2.5 rounded border border-slate-300 text-xs text-slate-800 leading-relaxed font-normal bg-white focus:ring-2 focus:ring-[#0B3C7A]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-slate-300 rounded p-8 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-[#FF9933] mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">
                      {isAnalyzing ? 'Analyzing with Gemini Vision...' : 'Waiting for Photo Upload'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Select or take a photo of a civic hazard. Real AI multimodal inspection will identify the defect, severity, and responsible municipal authority.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Real Geolocation & Time */}
          <div className="bg-[#F8FAFC] border border-slate-300 rounded p-5 sm:p-6 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-[#0B3C7A] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B3C7A] text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Real Location & Official Timestamp *</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact coordinates obtained via device GPS and reverse geocoded with OpenStreetMap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Street Address / Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="text-xs font-bold text-[#0B3C7A] hover:underline flex items-center gap-1"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Acquiring GPS...' : 'Re-detect GPS'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Street name, landmark, or ward"
                  className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white focus:ring-2 focus:ring-[#0B3C7A]"
                />

                {locationError && (
                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    {locationError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">LATITUDE</span>
                    {location.latitude.toFixed(6)}° N
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">LONGITUDE</span>
                    {location.longitude.toFixed(6)}° E
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0B3C7A]" />
                    Real Device Timestamp (IST):
                  </span>
                  <span className="font-mono font-bold text-slate-800">{timestamp}</span>
                </div>
              </div>

              {/* Leaflet Draggable Pin Map */}
              <div className="space-y-1">
                <MiniMap
                  latitude={location.latitude}
                  longitude={location.longitude}
                  onLocationChange={handleMapLocationChange}
                  interactive={true}
                  className="h-44 w-full rounded border border-slate-300 overflow-hidden"
                />
              </div>

            </div>
          </div>

          {/* Submission Bar */}
          <div className="space-y-3">
            {submitError && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !analysis}
              className={`w-full py-4 rounded font-bold text-base flex items-center justify-center gap-2 transition shadow-sm ${
                analysis && !isSubmitting
                  ? 'bg-[#FF9933] hover:bg-[#E68A00] text-[#072346] border border-[#E68A00]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>Saving to Official Registry...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-5 h-5" />
                  <span>Submit Grievance to Official Database</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Section 4: Real Confirmation Receipt from Database */}
        {showConfirmation && finalReport && (
          <div id="confirmation-box" className="space-y-6 pt-4 scroll-mt-20">
            <div className="bg-emerald-50 border-2 border-[#138808] rounded p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#138808] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider block">
                      OFFICIAL GRIEVANCE STORED IN REGISTRY
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                      Grievance Docket Generated Successfully
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your complaint has been permanently written to Firestore database with verified photographic proof.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-emerald-300 text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Report Reference ID</span>
                  <span className="text-xl font-extrabold text-[#0B3C7A] font-mono block">{finalReport.id}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onTrackRedirect && onTrackRedirect(finalReport.id)}
                  className="px-5 py-2.5 rounded bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Track Status in Real-Time Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedImage(null);
                    setAnalysis(null);
                    setFinalReport(null);
                  }}
                  className="px-4 py-2.5 rounded bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition"
                >
                  File Another Grievance
                </button>
              </div>
            </div>

            {/* Complete Report Package Preview */}
            <ReportPackagePreview report={finalReport} isSaved={true} />
          </div>
        )}

      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={async (dataUrl) => {
          try {
            const compressed = await compressImage(dataUrl, 1280, 0.8);
            setSelectedImage(compressed);
            setImageFileName('camera_capture.jpg');
            setTimestamp(getISTTimestamp());
            analyzeWithGemini(compressed);
          } catch (e: any) {
            setSelectedImage(dataUrl);
            analyzeWithGemini(dataUrl);
          }
        }}
      />
    </section>
  );
};
