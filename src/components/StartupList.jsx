import React from 'react';
import StartupCard from './StartupCard';
import SectorPills from './SectorPills';
import { Search, SlidersHorizontal, Download, X, SearchX } from 'lucide-react';

export default function StartupList({ 
  startups, 
  selectedStartup, 
  onSelectStartup,
  onHoverStartup,
  selectedSector,
  onSelectSector,
  searchQuery,
  onSearchChange,
  onToggleFilters,
  onResetFilters,
  onExportPDF,
  mobileOverlay = false,
  onClose
}) {
  return (
    <div className={`h-full flex flex-col overflow-hidden bg-slate-50/50 ${
      mobileOverlay
        ? 'bg-white rounded-t-3xl shadow-2xl border-t border-slate-200/80'
        : 'border-r border-slate-200/80'
    }`}>
      
      {/* Mobile Drag Handle */}
      {mobileOverlay && (
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
      )}

      {/* Directory Header */}
      <div className="p-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">Startups</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {startups.length.toLocaleString()} companies found
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1.5"
                title="Export PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Filter Startups"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {mobileOverlay && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Close List"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Row */}
        {onSelectSector && (
          <div className="-mx-4 px-1 border-t border-b border-slate-100 bg-slate-50/40">
            <SectorPills
              selectedSector={selectedSector || 'all'}
              onSelectSector={onSelectSector}
            />
          </div>
        )}

        {/* Inner Search Bar Input */}
        {onSearchChange !== undefined && (
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search startups..."
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Cards List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
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
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No startups found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto">
              Try adjusting your search query or category filters.
            </p>
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
