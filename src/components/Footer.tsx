import React, { useState } from 'react';
import {
  ExternalLink,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { CivicLensLogo } from './CivicLensLogo';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = translations[lang] || translations.en;
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const policies = [
    { id: 'privacy', title: 'Privacy Policy', desc: 'CivicLens does not sell or distribute citizen metadata. Location coordinates and incident photos are used solely to generate administrative municipal grievance packages.' },
    { id: 'terms', title: 'Terms of Use', desc: 'CivicLens is an independent citizen evidence initiative. Submissions must depict bona-fide civil or public infrastructure hazards.' },
    { id: 'accessibility', title: 'Accessibility Statement', desc: 'Built to conform with Guidelines for Indian Government Websites (GIGW 3.0) and Web Content Accessibility Guidelines (WCAG 2.1 AA).' },
    { id: 'disclaimer', title: 'Disclaimer', desc: 'CivicLens is an independent citizen-tech prototype and is not an official Government of India website.' },
    { id: 'hyperlinking', title: 'Hyperlinking Policy', desc: 'External links to Kolkata Municipal Corporation (KMC) or West Bengal Government portals are provided for citizen convenience.' },
  ];

  return (
    <footer className="bg-[#072346] text-white border-t-4 border-[#FF9933] text-xs">
      
      {/* Disclaimer Strip Above Footer */}
      <div className="bg-[#0B2F5B] border-b border-[#123668] py-2 px-4 text-center text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
          <span>{t.disclaimerBanner}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <CivicLensLogo className="w-8 h-8" />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  CivicLens Portal
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Govt Service Redressal Prototype
                </span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Empowering urban commuters with automated vision AI to turn unpaved road craters, overflowing refuse, and choked storm sewers into verifiable administrative evidence.
            </p>
            <div className="pt-1 text-[11px] text-[#76FF03] font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GIGW 3.0 Conforming Architecture</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Portal Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report-tool')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Report a Civic Hazard (दर्ज करें)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track-complaint')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Track Grievance Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Municipal Departments Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Citizen Reports Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-[#FF9933] hover:underline"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Policies (GIGW Mandatory) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerPolicies}
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {policies.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setActivePolicyModal(p.id)}
                    className="hover:text-[#FF9933] hover:underline text-left"
                  >
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Grievance Cell */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerContact}
            </h4>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF9933] shrink-0 mt-0.5" />
                <span>Central Municipal Office, 5, S.N. Banerjee Road, Kolkata – 700013</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                <span className="font-mono">Toll-Free: 1800-11-2026 / 155304</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                <span className="font-mono">commissioner@kmcgov.in</span>
              </p>
              <div className="pt-2">
                <span className="bg-[#0B3C7A] text-white px-2 py-1 rounded text-[10px] font-mono border border-slate-600 block text-center">
                  {t.footerVisitors}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Technical Footer Line (GIGW Mandatory) */}
        <div className="border-t border-slate-700/80 pt-6 space-y-2 text-center text-slate-400 text-[11px]">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <span>{t.footerLastUpdated}</span>
            <span>•</span>
            <span>{t.footerCompatibility}</span>
          </div>
          <p className="text-slate-300">
            {t.footerCopyright}
          </p>
        </div>

      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-md border-2 border-[#0B3C7A] max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-[#0B3C7A] border-b pb-2">
              {policies.find((p) => p.id === activePolicyModal)?.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {policies.find((p) => p.id === activePolicyModal)?.desc}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-1.5 bg-[#0B3C7A] text-white font-bold text-xs rounded hover:bg-[#082852]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
