export type CivicCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'drain'
  | 'waterlogging'
  | 'footpath'
  | 'other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ReportStatus = 'Submitted' | 'In Review' | 'Resolved';

export type Language = 'en' | 'bn' | 'hi';

export interface AnalysisData {
  is_civic_issue: boolean;
  issue_type: string;
  category: CivicCategory;
  severity: SeverityLevel;
  severity_reason: string;
  description: string;
  suggested_department: string;
  risk_to_public: string;
  confidence: number;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  ward?: string;
  city: string;
  accuracy?: number;
}

export interface TimelineEvent {
  stage: string;
  date: string;
  notes?: string;
  completed: boolean;
}

export interface CivicReport {
  id: string; // Report ID (e.g. CL-2026-XXXXXX)
  createdAt: string; // ISO date string
  formattedTimestamp: string; // IST string
  imageUrl: string; // Base64 or image URL
  is_civic_issue: boolean;
  issue_type: string;
  category: CivicCategory;
  severity: SeverityLevel;
  severity_reason: string;
  description: string;
  suggested_department: string;
  risk_to_public: string;
  estimated_risk?: string;
  confidence: number;
  location: LocationInfo;
  status: ReportStatus;
  statusTimeline: TimelineEvent[];
}
