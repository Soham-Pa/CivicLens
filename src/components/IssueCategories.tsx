import React from 'react';
import { CIVIC_CATEGORIES, CategoryInfo } from '../data/samples';
import {
  AlertTriangle,
  Trash2,
  Lightbulb,
  Waves,
  Droplets,
  Footprints,
  Clock,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface IssueCategoriesProps {
  lang: Language;
  onSelectCategory: (category: CategoryInfo) => void;
}

export const IssueCategories: React.FC<IssueCategoriesProps> = ({
  lang,
  onSelectCategory,
}) => {
  const t = translations[lang] || translations.en;

  const iconMap: Record<string, React.ElementType> = {
    AlertTriangle,
    Trash2,
    Lightbulb,
    Waves,
    Droplets,
    Footprints,
  };

  return (
    <section id="categories" className="py-12 bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0B3C7A] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            Municipal Jurisdiction Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C7A]">
            {t.categoriesHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.categoriesSubheading}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CIVIC_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.iconName] || AlertTriangle;
            return (
              <div
                key={cat.id}
                className="bg-[#F8FAFC] border border-slate-300 rounded overflow-hidden flex flex-col justify-between hover:border-[#0B3C7A] transition"
              >
                {/* Photo Header */}
                <div className="relative aspect-16/9 overflow-hidden bg-slate-900 border-b border-slate-300">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-[#0B3C7A] text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                    <Icon className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>{cat.name}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-slate-900/90 text-[#FFD54F] px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FF9933]" />
                    <span>SLA: {cat.sla}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] text-[#0B3C7A] font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-[#0B3C7A]" />
                      <span>{cat.department}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="w-full py-2 rounded bg-white hover:bg-[#0B3C7A] text-[#0B3C7A] hover:text-white font-bold text-xs border border-slate-300 hover:border-[#0B3C7A] transition flex items-center justify-center gap-1.5"
                  >
                    <span>{t.reportCategoryBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
