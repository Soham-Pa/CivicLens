import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, FileText, Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface PortalFaqsProps {
  lang: Language;
}

export const PortalFaqs: React.FC<PortalFaqsProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CivicLens AI verify the authenticity of a reported civic hazard?',
      a: 'CivicLens utilizes multimodal vision models to inspect structural failure (such as road asphalt depth, surface cracking, water stagnation, or loose wiring) and filters out frivolous or non-civic photos. It cross-references the geographic coordinates and records an Indian Standard Time (IST) timestamp to ensure non-repudiation.',
    },
    {
      q: 'Do I need to create an account or provide Aadhaar to file a complaint?',
      a: 'No. In alignment with open citizen-access guidelines, any commuter or resident can upload an incident photo and generate a verified Evidence Docket without logging in. The resulting Report ID (e.g. CL-2026-XXXXXX) serves as your permanent tracking token.',
    },
    {
      q: 'What is the legally mandated resolution time under the Right to Public Services Act?',
      a: 'For Critical safety hazards (such as submerged potholes on arterial routes or exposed live electrical wires), municipal authorities are mandated to intervene within 24 to 48 hours. Solid waste vat overflows have an SLA of 12 to 24 hours, while regular pavement repairs take 3 to 5 working days.',
    },
    {
      q: 'Can the generated PDF report be used for legal or RTI proceedings?',
      a: 'Yes. The generated Evidence Docket includes high-resolution image proof, cryptographic IST timestamp, latitude/longitude coordinates, ward designation, and calculated severity, formatted to the official complaint petition standard acceptable by Municipal Commissioners and Consumer Forums.',
    },
    {
      q: 'Which municipal bodies in Kolkata are covered under this portal?',
      a: 'The portal covers all 144 Wards across Boroughs I to XVI under the Kolkata Municipal Corporation (KMC), along with arterial corridors managed by the Kolkata Metropolitan Development Authority (KMDA) and West Bengal Public Works Department (PWD).',
    },
  ];

  return (
    <section id="faqs" className="py-12 bg-[#F4F6F9] border-b border-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-300 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider bg-white px-3 py-1 rounded border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF9933]" />
            Citizen Helpdesk
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
            {t.faqsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.faqsSub}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-300 rounded overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0B3C7A] hover:bg-slate-50 transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-start gap-2.5">
                    <span className="text-[#FF9933] font-mono shrink-0">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-[#FBFDFE]">
                    <div className="pt-3">{faq.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
