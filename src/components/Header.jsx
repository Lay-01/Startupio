import React, { useState } from 'react';
import { MapPin, Search, SlidersHorizontal, Building2, Command, X, Download, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectorPills from './SectorPills';

export default function Header({ 
  onOpenCommandSearch,
  onToggleFilters, 
  activeFilterCount,
  onResetAll,
  selectedSector,
  onSelectSector,
  areas = [],
  selectedArea = 'all',
  onSelectArea,
  onExportPDF
}) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs select-none">
      
      {/* Top Bar Row */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Location Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-sky-600 transition-colors">
                <Building2 className="w-4.5 h-4.5 text-sky-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-900 tracking-tight leading-none">
                  Startup<span className="text-sky-600">.io</span>
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase mt-0.5">
                  Bengaluru Hubs
                </span>
              </div>
            </Link>

            {/* Interactive Location Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                  selectedArea !== 'all'
                    ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                    : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                }`}
                title="Click to choose a specific area or hub in Bengaluru"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{selectedArea !== 'all' ? selectedArea : 'Bengaluru'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
              </button>

              {isLocationOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLocationOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Select Location Hub</span>
                        <span className="text-xs font-bold text-slate-800">Bengaluru Areas</span>
                      </div>
                      <button 
                        onClick={() => setIsLocationOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-0.5 max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          if (onSelectArea) onSelectArea('all');
                          setIsLocationOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                          selectedArea === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>All Bengaluru Areas</span>
                        {selectedArea === 'all' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </button>

                      {areas.map((areaName) => (
                        <button
                          key={areaName}
                          onClick={() => {
                            if (onSelectArea) onSelectArea(areaName);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                            selectedArea === areaName
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{areaName}</span>
                          {selectedArea === areaName && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Command K Search Bar */}
          <div className="flex-1 max-w-xl">
            <div 
              onClick={onOpenCommandSearch}
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 hover:border-slate-300 rounded-xl px-3.5 py-1.5 cursor-pointer flex items-center justify-between gap-3 group transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                  Search startups, sectors, founders...
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                  <Command className="w-3 h-3" /> K
                </kbd>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
                title="Download filtered startups as PDF report"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}

            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeFilterCount > 0 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={onResetAll}
                className="hidden lg:block text-xs font-bold text-slate-500 hover:text-slate-900 transition px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Integrated Category Pills Row */}
      <div className="border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-1.5 overflow-x-auto no-scrollbar">
        <SectorPills
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
        />
      </div>

    </header>
  );
}
