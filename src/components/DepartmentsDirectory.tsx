import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Phone,
  Search,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface DepartmentsDirectoryProps {
  lang: Language;
  onSelectDepartmentForReport: (deptName: string) => void;
}

export const DepartmentsDirectory: React.FC<DepartmentsDirectoryProps> = ({
  lang,
  onSelectDepartmentForReport,
}) => {
  const t = translations[lang] || translations.en;
  const [filterText, setFilterText] = useState('');

  const departments = [
    {
      name: 'Roads & Engineering Department (KMC)',
      bengaliName: 'সড়ক ও প্রকৌশল বিভাগ',
      hindiName: 'सड़क एवं इंजीनियरिंग विभाग',
      scope: 'Carriageway pothole filling, mastic asphalt resurfacing, arterial road repairs, trench restoration after utility excavations.',
      nodal: 'Chief Municipal Engineer (Roads)',
      sla: '24–48 Hours',
      helpline: '033-2286-1000 Ext 2401',
      categoryKey: 'potholes',
    },
    {
      name: 'Solid Waste Management (SWM) Department',
      bengaliName: 'কঠিন বর্জ্য ব্যবস্থাপনা বিভাগ',
      hindiName: 'ठोस अपशिष्ट प्रबंधन विभाग',
      scope: 'Community waste vat clearance, roadside compactor operations, door-to-door collection oversight, market refuse sanitation.',
      nodal: 'Chief Municipal Health Officer / DG (SWM)',
      sla: '12–24 Hours',
      helpline: '033-2286-1000 Ext 2603',
      categoryKey: 'garbage',
    },
    {
      name: 'Drainage & Sewerage Wing',
      bengaliName: 'নিকাশি ও পয়ঃপ্রণালী বিভাগ',
      hindiName: 'जल निकासी एवं सीवरेज विभाग',
      scope: 'Subterranean brick sewer desilting, roadside gully pit unblocking, high-capacity drainage pumping stations, monsoon flood mitigation.',
      nodal: 'Director General (Drainage)',
      sla: '12–36 Hours (Immediate for Flood)',
      helpline: '033-2286-1000 Ext 2514',
      categoryKey: 'drainage',
    },
    {
      name: 'Lighting & Electrical Department',
      bengaliName: 'আলো ও বৈদ্যুতিক বিভাগ',
      hindiName: 'प्रकाश एवं विद्युत विभाग',
      scope: 'High-mast and street luminaire maintenance, LED driver replacement, dangling cable bundling, utility pole earthing audits.',
      nodal: 'Chief Municipal Electrical Engineer',
      sla: '24 Hours',
      helpline: '033-2286-1000 Ext 2712',
      categoryKey: 'lighting',
    },
    {
      name: 'Water Supply Department',
      bengaliName: 'জল সরবরাহ বিভাগ',
      hindiName: 'जल आपूर्ति विभाग',
      scope: 'Filtered water pipeline burst containment, distribution valve repair, water contamination investigation, emergency tanker dispatch.',
      nodal: 'Director General (Water Supply)',
      sla: '12–24 Hours',
      helpline: '033-2286-1000 Ext 2810',
      categoryKey: 'water',
    },
    {
      name: 'Civil Engineering & Borough Works',
      bengaliName: 'সিভিল ইঞ্জিনিয়ারিং ও বরো শাখা',
      hindiName: 'सिविल इंजीनियरिंग एवं बोरो कार्य',
      scope: 'Footpath paver blocks reinstatement, missing manhole cover replacement, kerb painting, pedestrian guard rails restoration.',
      nodal: 'Executive Engineer (Civil - Boroughs I to XVI)',
      sla: '3–5 Working Days',
      helpline: '033-2286-1000 Ext 2901',
      categoryKey: 'footpaths',
    },
  ];

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(filterText.toLowerCase()) ||
    d.scope.toLowerCase().includes(filterText.toLowerCase()) ||
    d.nodal.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <section id="departments" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              Civic Infrastructure Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
              {t.deptTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.deptSub}
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department, wing, or scope..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-[#0B3C7A] bg-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Directory Table (Flat Government Portal Layout) */}
        <div className="overflow-x-auto border border-slate-300 rounded shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-300">
            <thead className="bg-[#0B3C7A] text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 border-r border-[#154E96]">
                  {t.deptColName}
                </th>
                <th scope="col" className="px-4 py-3 border-r border-[#154E96]">
                  {t.deptColScope}
                </th>
                <th scope="col" className="px-4 py-3 border-r border-[#154E96] whitespace-nowrap">
                  {t.deptColNodal}
                </th>
                <th scope="col" className="px-4 py-3 border-r border-[#154E96] whitespace-nowrap">
                  {t.deptColSla}
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredDepts.map((d, idx) => (
                <tr key={d.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFC]'}>
                  {/* Department Name */}
                  <td className="px-4 py-3.5 font-bold text-[#0B3C7A] border-r border-slate-200">
                    <div>{d.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {d.bengaliName} | {d.hindiName}
                    </div>
                  </td>

                  {/* Scope */}
                  <td className="px-4 py-3.5 leading-relaxed text-slate-600 border-r border-slate-200">
                    {d.scope}
                  </td>

                  {/* Nodal Officer */}
                  <td className="px-4 py-3.5 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                    <div>{d.nodal}</div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#FF9933]" />
                      <span>{d.helpline}</span>
                    </div>
                  </td>

                  {/* Turnaround SLA */}
                  <td className="px-4 py-3.5 border-r border-slate-200 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {d.sla}
                    </span>
                  </td>

                  {/* File Grievance Action */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectDepartmentForReport(d.categoryKey)}
                      className="px-3 py-1.5 rounded bg-[#0B3C7A] hover:bg-[#FF9933] hover:text-[#072346] text-white text-xs font-bold transition flex items-center justify-center gap-1 mx-auto"
                    >
                      <span>Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="bg-[#FFFDF5] border border-[#EADBB6] rounded p-3 text-xs text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#138808] shrink-0" />
          <span>
            <strong>Statutory SLA Notice:</strong> In accordance with the West Bengal Right to Public Services Act, municipal bodies are legally mandated to rectify critical public safety hazards within designated turnaround limits.
          </span>
        </div>

      </div>
    </section>
  );
};
