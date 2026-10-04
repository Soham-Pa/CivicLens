/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { BottomNav, AppTab } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ReportScreen } from './components/ReportScreen';
import { MapScreen } from './components/MapScreen';
import { MyReportsScreen } from './components/MyReportsScreen';
import { CivicReport, Language, CivicCategory } from './types';
import { subscribeToReports, saveReportToFirestore } from './services/reportService';

export default function App() {
  // Session persistent Language state (English / বাংলা / हिन्दी)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('civiclens_lang');
      if (savedLang === 'en' || savedLang === 'bn' || savedLang === 'hi') {
        return savedLang;
      }
    } catch (e) {
      console.warn('Could not read saved language', e);
    }
    return 'en';
  });

  // Active Tab: 'home' | 'report' | 'map' | 'my-reports'
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Reports data state (populated from local storage / demo seed)
  const [reports, setReports] = useState<CivicReport[]>([]);

  // Map initial mode toggle
  const [mapMode, setMapMode] = useState<'issues' | 'waterlogging'>('issues');

  // Category pre-selected from Home category chips
  const [reportCategory, setReportCategory] = useState<CivicCategory | undefined>(undefined);

  // Selected report for modal detail view
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);

  // Subscribe to local report updates
  useEffect(() => {
    const unsubscribe = subscribeToReports((updatedReports) => {
      setReports(updatedReports);
    });
    return () => unsubscribe();
  }, []);

  // Save language selection
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('civiclens_lang', newLang);
    } catch (e) {
      console.warn('Failed to save language', e);
    }
  };

  // Handle report submission
  const handleReportSubmitted = async (newReport: CivicReport) => {
    await saveReportToFirestore(newReport);
  };

  // Navigation handlers
  const handleOpenReport = (category?: CivicCategory) => {
    setReportCategory(category);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMap = () => {
    setMapMode('issues');
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWaterloggingMap = () => {
    setMapMode('waterlogging');
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMyReports = () => {
    setActiveTab('my-reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (report: CivicReport) => {
    setSelectedReport(report);
    setActiveTab('my-reports');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* 1. Header (Full Width with white background, inner max-w-[1400px], desktop nav links) */}
      <AppHeader
        lang={lang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'map') {
            setMapMode('issues');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        reportsCount={reports.length}
      />

      {/* 2. Main Page Content (Full width fluid container) */}
      <main className="flex-1 w-full" id="main-content">
        {activeTab === 'home' && (
          <HomeScreen
            lang={lang}
            onOpenReport={handleOpenReport}
            onOpenMap={handleOpenMap}
            onOpenWaterloggingMap={handleOpenWaterloggingMap}
            onOpenMyReports={handleOpenMyReports}
            onSelectReport={handleSelectReport}
            recentReports={reports}
          />
        )}

        {activeTab === 'report' && (
          <ReportScreen
            lang={lang}
            initialCategory={reportCategory}
            onReportSubmitted={handleReportSubmitted}
            onGoToMyReports={handleOpenMyReports}
          />
        )}

        {activeTab === 'map' && (
          <MapScreen
            lang={lang}
            initialMode={mapMode}
            onReportHere={(locName, coords) => {
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'my-reports' && (
          <MyReportsScreen
            lang={lang}
            reports={reports}
            onOpenReportFlow={() => handleOpenReport()}
            selectedReport={selectedReport}
            onClearSelectedReport={() => setSelectedReport(null)}
          />
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar (Visible only below 768px, full width) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'map') {
            setMapMode('issues');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        reportsCount={reports.length}
      />
    </div>
  );
}
