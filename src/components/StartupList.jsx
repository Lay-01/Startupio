import React from 'react';
import StartupCard from './StartupCard';
import { SearchX, SlidersHorizontal, Download } from 'lucide-react';

export default function StartupList({ 
  startups, 
  selectedStartup, 
  onSelectStartup,
  onHoverStartup,
  onResetFilters,
  onExportPDF
}) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
      
      {/* Directory Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-sm">
        <div>
          <h2 className="font-extrabold text-slate-900 text-[11px] tracking-[0.18em] uppercase">Startups Directory</h2>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {startups.length} matching company{startups.length === 1 ? '' : 'ies'}
          </p>
        </div>

        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold transition shadow-[0_8px_16px_rgba(14,165,233,0.08)]"
            title="Export directory list as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        )}
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {startups.length > 0 ? (
          startups.map(startup => (
            <StartupCard
              key={startup.id}
              startup={startup}
              isSelected={selectedStartup && selectedStartup.id === startup.id}
              onClick={() => onSelectStartup(startup)}
              onMouseEnter={() => onHoverStartup && onHoverStartup(startup)}
              onMouseLeave={() => onHoverStartup && onHoverStartup(null)}
            />
          ))
        ) : (
          <div className="py-16 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <SearchX className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">No startups found</h3>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Try another sector, startup name, or founder.
            </p>
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold transition shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
