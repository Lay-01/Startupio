import React, { useState, useRef, useEffect } from 'react';
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
  onExportPDF,
  mobileView,
  onToggleMobileView,
  onOpenMobileList
}) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsLocationOpen(false);
      }
    };
    if (isLocationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLocationOpen]);

  return (
    <header className="glass-strong sticky top-0 z-30 shadow-glass border-b border-slate-200/40 select-none">
      
      {/* Top Bar Row */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 py-2.5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          
          {/* Logo & Location Badge */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                <Building2 className="w-4.5 h-4.5 text-sky-300 transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-900 tracking-tight leading-none">
                  Startup<span className="text-gradient-brand">.io</span>
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 tracking-[0.16em] uppercase mt-0.5">
                  Bengaluru Hubs
                </span>
              </div>
            </Link>

            {/* Interactive Location Dropdown Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all duration-200 ${
                  selectedArea !== 'all'
                    ? 'bg-sky-50 border-sky-200/80 text-sky-700 hover:bg-sky-100 shadow-glow'
                    : 'bg-white/60 border-slate-200/80 text-slate-600 hover:bg-white hover:border-slate-300 hover:text-slate-800'
                }`}
                title="Click to choose a specific area or hub in Bengaluru"
              >
                <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                <span>{selectedArea !== 'all' ? selectedArea : 'Bengaluru'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
                <span className="relative flex h-1.5 w-1.5 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-glass-xl border border-slate-200/60 p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-slate-100/80 mb-1 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">Select Location Hub</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">Bengaluru Areas</span>
                    </div>
                    <button 
                      onClick={() => setIsLocationOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-0.5 max-h-64 overflow-y-auto py-1">
                    <button
                      onClick={() => {
                        if (onSelectArea) onSelectArea('all');
                        setIsLocationOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                        selectedArea === 'all'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-50'
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
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                          selectedArea === areaName
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-500/20'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{areaName}</span>
                        {selectedArea === areaName && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Command K Search Bar */}
          <div className="w-full max-w-xl sm:flex-1">
            <div 
              onClick={onOpenCommandSearch}
              className="group relative bg-white/60 hover:bg-white/80 border border-slate-200/60 hover:border-slate-300/80 rounded-2xl px-3.5 py-2 cursor-pointer flex items-center justify-between gap-3 transition-all duration-300 shadow-card hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors duration-200 shrink-0" />
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors duration-200 truncate">
                  Search startups, sectors, founders...
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-white/80 border border-slate-200/80 rounded-lg shadow-sm">
                  <Command className="w-3 h-3" /> K
                </kbd>
              </div>
              
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/0 via-sky-500/[0.02] to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {onToggleMobileView && (
              <button
                onClick={onOpenMobileList || onToggleMobileView}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[11px] font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                {mobileView === 'map' ? 'List' : 'Map'}
              </button>
            )}

            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all duration-300"
                title="Download filtered startups as PDF report"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}

            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                activeFilterCount > 0 
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-900 shadow-lg' 
                  : 'bg-white/60 border-slate-200/80 text-slate-600 hover:bg-white hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-black shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={onResetAll}
                className="hidden lg:block text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Integrated Category Pills Row */}
      <div className="border-t border-slate-100/80 bg-slate-50/40 backdrop-blur-sm px-3 sm:px-5 lg:px-6 py-1.5 overflow-x-auto no-scrollbar">
        <SectorPills
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
        />
      </div>

    </header>
  );
}
