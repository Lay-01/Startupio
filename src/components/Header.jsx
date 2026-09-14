import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, SlidersHorizontal, Building2, Command, X, ChevronDown, Check, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectorPills from './SectorPills';

export default function Header({ 
  onOpenCommandSearch,
  onToggleFilters, 
  activeFilterCount,
  selectedSector,
  onSelectSector,
  areas = [],
  selectedArea = 'all',
  onSelectArea,
  headerCollapsed = false
}) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
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
    <header className={`sticky z-30 select-none bg-white border-b border-slate-200/50 transition-all duration-300 md:top-0 ${
      headerCollapsed 
        ? 'md:translate-y-0 md:opacity-100 -translate-y-full opacity-0 h-0 overflow-hidden md:h-auto md:overflow-visible'
        : 'translate-y-0 opacity-100'
    }`} style={{ top: 0 }}>
      
      {/* Top Bar Row */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-5 lg:px-6 py-2.5">
        <div className="flex items-center gap-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <Building2 className="w-4 h-4 text-sky-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-sm text-slate-900 tracking-tight leading-none">
                Startup<span className="text-gradient-brand">.io</span>
              </span>
              <span className="text-[8px] font-extrabold text-slate-400 tracking-[0.14em] uppercase mt-0.5">
                Bengaluru
              </span>
            </div>
          </Link>

          {/* Search Bar — takes remaining space */}
          <div className="flex-1 min-w-0">
            <div 
              onClick={onOpenCommandSearch}
              className="group relative bg-white/70 hover:bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl px-3 py-2 cursor-pointer flex items-center gap-2 transition-all duration-200"
            >
              <Search className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors shrink-0" />
              <span className="text-[12px] text-slate-400 truncate">Search...</span>
              <kbd className="hidden sm:inline-flex ml-auto items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-slate-300 bg-white/80 border border-slate-200/60 rounded-md">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>
          </div>

          {/* Location + Filters */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Location Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                  selectedArea !== 'all'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">{selectedArea !== 'all' ? selectedArea : 'Bengaluru'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 sm:left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200/60 p-1.5 z-50">
                  <div className="px-2.5 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Areas</span>
                    <button 
                      onClick={() => setIsLocationOpen(false)}
                      className="p-0.5 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto py-0.5">
                    <button
                      onClick={() => {
                        if (onSelectArea) onSelectArea('all');
                        setIsLocationOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                        selectedArea === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>All Areas</span>
                      {selectedArea === 'all' && <Check className="w-3 h-3 text-sky-400" />}
                    </button>

                    {areas.map((areaName) => (
                      <button
                        key={areaName}
                        onClick={() => {
                          if (onSelectArea) onSelectArea(areaName);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                          selectedArea === areaName
                            ? 'bg-sky-500 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{areaName}</span>
                        {selectedArea === areaName && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                activeFilterCount > 0 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-sky-500 text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Category Pills Row — collapsible */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out border-t border-slate-100/80 bg-white/60"
        style={{
          maxHeight: categoriesOpen ? '200px' : '0px',
          opacity: categoriesOpen ? 1 : 0
        }}
      >
        <div className="relative">
          <SectorPills
            selectedSector={selectedSector}
            onSelectSector={onSelectSector}
          />
          {/* Collapse toggle */}
          <button
            onClick={() => setCategoriesOpen(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 md:hidden"
            title="Collapse categories"
          >
            <ChevronDown className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Expand categories toggle — visible when collapsed on mobile */}
      {!categoriesOpen && (
        <button
          onClick={() => setCategoriesOpen(true)}
          className="md:hidden flex items-center justify-center gap-1.5 w-full py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200 border-t border-slate-100/80"
        >
          <LayoutGrid className="w-3 h-3" />
          <span>Categories</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      )}

    </header>
  );
}
