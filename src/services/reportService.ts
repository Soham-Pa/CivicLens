/**
 * CivicLens Local & In-Memory Report Service (Demo Mode)
 * Provides realistic pre-seeded records from sampleData.ts and persists new citizen submissions to localStorage.
 */

import { CivicReport } from '../types';
import { INITIAL_DEMO_REPORTS } from '../data/sampleData';

const LOCAL_STORAGE_KEY = 'civiclens_demo_reports';

function getStoredReports(): CivicReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage', e);
  }
  return [...INITIAL_DEMO_REPORTS];
}

let inMemoryReports: CivicReport[] = getStoredReports();
const listeners = new Set<(reports: CivicReport[]) => void>();

function notify() {
  const list = [...inMemoryReports];
  listeners.forEach((fn) => {
    try {
      fn(list);
    } catch (err) {
      console.error('Error notifying report listener', err);
    }
  });
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving to localStorage', e);
  }
}

/**
 * Saves a new CivicReport document to local demo store
 */
export async function saveReportToFirestore(report: CivicReport): Promise<void> {
  inMemoryReports = [report, ...inMemoryReports.filter((r) => r.id !== report.id)];
  notify();
}

/**
 * Fetches all reports ordered by creation date descending
 */
export async function fetchAllReports(): Promise<CivicReport[]> {
  return [...inMemoryReports];
}

/**
 * Fetches a single report by its ID
 */
export async function fetchReportById(reportId: string): Promise<CivicReport | null> {
  const cleanId = reportId.trim().toUpperCase();
  const found = inMemoryReports.find((r) => r.id.toUpperCase() === cleanId);
  return found || null;
}

/**
 * Subscribes to updates of the reports collection
 */
export function subscribeToReports(onUpdate: (reports: CivicReport[]) => void): () => void {
  listeners.add(onUpdate);
  // Send initial data immediately
  setTimeout(() => {
    onUpdate([...inMemoryReports]);
  }, 0);

  return () => {
    listeners.delete(onUpdate);
  };
}
