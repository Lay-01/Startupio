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
    <div className="glass-dark text-slate-200 text-xs py-2 px-4 sm:px-6 flex items-center justify-between border-b border-white/5 select-none">
      
      {/* Metrics Summary Strip */}
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Showing</span>
          <span className="text-white font-bold">{filteredCount}</span>
          <span className="text-slate-400">of {totalCount}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-semibold">{sectorCount} Sectors</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {exactLocationCount} Exact
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span className="text-slate-600">•</span>
          <span className="text-sky-400 font-semibold">HSR, Indiranagar, BTM</span>
        </div>
      </div>

      {/* View Switcher Toggle */}
      <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10">
        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
            viewMode === 'split' 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Map + Directory Split View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split</span>
        </button>

        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
            viewMode === 'map' 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Full Map View"
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Map</span>
        </button>

        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Directory List View"
        >
          <List className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">List</span>
        </button>
      </div>

    </div>
  );
}
