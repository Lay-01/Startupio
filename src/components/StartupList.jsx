import React from 'react';
import StartupCard from './StartupCard';
import { SearchX, SlidersHorizontal, Download } from 'lucide-react';

export default function StartupList({ 
  startups, 
  selectedStartup, 
  onSelectStartup,
  onHoverStartup,
  onResetFilters,
  onExportPDF,
  mobileOverlay = false
}) {
  return (
    <div className={`h-full flex flex-col overflow-hidden ${
      mobileOverlay
        ? 'bg-white rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.12)] border border-b-0 border-slate-200/50'
        : 'bg-white border-r border-slate-200/50'
    }`}>
      
      {/* Drag Handle — mobile overlay only */}
      {mobileOverlay && (
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-9 h-[3px] bg-slate-300 rounded-full" />
        </div>
      )}

      {/* Directory Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 text-[11px] tracking-[0.2em] uppercase">Directory</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200/60 text-sky-700 text-[10px] font-black">
              {startups.length}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            {startups.length === 1 ? '1 matching company' : `${startups.length} matching companies`}
          </p>
        </div>

        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-50 to-sky-100/80 border border-sky-200/60 text-sky-700 text-xs font-bold transition-all duration-200 hover:from-sky-100 hover:to-sky-200/60 hover:shadow-card active:scale-95"
            title="Export directory list as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        )}
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {startups.length > 0 ? (
          startups.map((startup, index) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              index={index + 1}
              isSelected={selectedStartup && selectedStartup.id === startup.id}
              onClick={() => onSelectStartup(startup)}
              onMouseEnter={() => onHoverStartup && onHoverStartup(startup)}
              onMouseLeave={() => onHoverStartup && onHoverStartup(null)}
            />
          ))
        ) : (
          <div className="py-20 px-4 text-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-200/50">
              <SearchX className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-[10px] text-white">0</span>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No startups found</h3>
            <p className="text-[11px] text-slate-500 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              Try adjusting your filters or search for a different sector, name, or founder.
            </p>
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
