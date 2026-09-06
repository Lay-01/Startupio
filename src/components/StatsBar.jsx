import React from 'react';
import { Map, List, Building2, LayoutGrid, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StatsBar({ 
  totalCount, 
  filteredCount, 
  sectorCount,
  viewMode,
  setViewMode,
  exactLocationCount
}) {
  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shadow-inner select-none">
      
      {/* Metrics Summary Strip */}
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Showing</span>
          <span className="text-white font-bold">{filteredCount}</span>
          <span className="text-slate-400">of {totalCount} Startups</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <span>•</span>
          <span className="text-slate-300 font-semibold">{sectorCount} Sectors</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <span>•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {exactLocationCount} Exact Offices
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span>•</span>
          <span className="text-sky-400 font-semibold">HSR Layout, Indiranagar, BTM Layout</span>
        </div>
      </div>

      {/* View Switcher Toggle */}
      <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/80 shadow-2xs">
        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            viewMode === 'split' 
              ? 'bg-sky-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Map + Directory Split View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split View</span>
        </button>

        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            viewMode === 'map' 
              ? 'bg-sky-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Full Map View"
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Map View</span>
        </button>

        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            viewMode === 'list' 
              ? 'bg-sky-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Directory List View"
        >
          <List className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">List View</span>
        </button>
      </div>

    </div>
  );
}
