import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; id?: string }[];
  onNavigate?: (id: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="bg-[#EAEFF5] border-b border-slate-300 py-2 px-4 text-xs" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-slate-600">
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="hover:text-[#0B3C7A] hover:underline flex items-center gap-1 font-medium"
        >
          <Home className="w-3.5 h-3.5 text-[#0B3C7A]" />
          <span>Home</span>
        </button>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
              {isLast ? (
                <span className="font-bold text-[#0B3C7A]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.id && onNavigate && onNavigate(item.id)}
                  className="hover:text-[#0B3C7A] hover:underline font-medium"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
