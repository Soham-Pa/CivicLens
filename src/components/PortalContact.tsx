import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface PortalContactProps {
  lang: Language;
}

export const PortalContact: React.FC<PortalContactProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            Official Grievance Redressal Cell
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
            {t.navContact}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Reach out to municipal nodal officers, borough engineering helplines, or submit an official inquiry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact Directory */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-[#F8FAFC] border border-slate-300 rounded p-5 space-y-4">
              <h3 className="font-bold text-base text-[#0B3C7A] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF9933]" />
                Kolkata Municipal Corporation Headquarters
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0B3C7A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Central Municipal Office Buildings</p>
                    <p className="text-slate-600">5, S.N. Banerjee Road, Kolkata – 700 013, West Bengal, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#0B3C7A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Toll-Free Control Room (24x7)</p>
                    <p className="font-mono text-slate-800">1800-11-2026 / 155304</p>
                    <p className="text-[11px] text-slate-500">Kolkata Police Traffic Control: 1073</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#0B3C7A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Official Grievance Inboxes</p>
                    <p className="font-mono text-[#0B3C7A]">commissioner@kmcgov.in</p>
                    <p className="font-mono text-[#0B3C7A]">grievance@civiclens.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#0B3C7A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Public Grievance Hearing Hours</p>
                    <p className="text-slate-600">Monday to Friday: 10:00 AM – 5:00 PM IST (Saturday: 10:00 AM – 2:00 PM)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency note */}
            <div className="bg-[#FFF4E5] border border-[#FFE0B2] text-[#8C3B00] rounded p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-[#E65100]" />
                Urgent Life & Safety Escalations
              </div>
              <p className="text-[11px] leading-relaxed">
                For live electrical wire sparking or major water main bursts during active monsoon periods, dial the State Emergency Operation Centre directly at <strong>1070</strong>.
              </p>
            </div>

          </div>

          {/* Right Column: Citizen Inquiry Form (Govt portal style) */}
          <div className="lg:col-span-6">
            <div className="bg-[#F8FAFC] border border-slate-300 rounded p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-base text-[#0B3C7A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0B3C7A]" />
                  Citizen Feedback & Inquiries
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit a query regarding civic procedure, SLA compliance, or borough administration
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#138808] mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-950">Inquiry Logged Successfully</h4>
                  <p className="text-xs text-emerald-800">
                    Your inquiry has been assigned Reference Token: <strong>INQ-2026-9281</strong>. A municipal desk representative will respond within 24 working hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="mt-3 px-4 py-1.5 bg-[#0B3C7A] text-white rounded text-xs font-bold"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Citizen Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#0B3C7A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address or Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. citizen@example.com or 98300XXXXX"
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#0B3C7A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inquiry Subject & Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry or feedback..."
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#0B3C7A] bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#0B3C7A] hover:bg-[#082852] text-white font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Official Inquiry
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
