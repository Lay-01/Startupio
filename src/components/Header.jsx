import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Check, X, Command, SlidersHorizontal } from 'lucide-react';
import { S_PROFILE_URL } from '../utils/config';

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenCommandSearch,
  areas = [],
  selectedArea = 'all',
  onSelectArea,
  onToggleFilters,
  activeFilterCount = 0
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

  const handleProfileClick = () => {
    window.open(S_PROFILE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="w-full bg-white/95 border-b border-slate-200/80 z-30 select-none px-4 sm:px-6 py-3 shrink-0">
      <div className="flex items-center justify-between sm:justify-center gap-4">

        {/* Main Search */}
        <div className="relative group hidden sm:block flex-1 max-w-[690px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-hover:text-slate-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search startups, categories, or locations..."
            className="w-full bg-white border border-slate-200/90 rounded-full pl-11 pr-12 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
          />
          {onOpenCommandSearch && (
            <button
              type="button"
              onClick={onOpenCommandSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200"
              aria-label="Open command search"
            >
              <Command className="w-2.5 h-2.5" />K
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="max-w-24 sm:max-w-40 truncate">{selectedArea !== 'all' ? selectedArea : 'Bengaluru'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Location</span>
                  <button onClick={() => setIsLocationOpen(false)} className="p-0.5 rounded text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto py-0.5 space-y-0.5">
                  <button
                    onClick={() => {
                      if (onSelectArea) onSelectArea('all');
                      setIsLocationOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedArea === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Bengaluru (All)</span>
                    {selectedArea === 'all' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        if (onSelectArea) onSelectArea(area);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        selectedArea === area ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{area}</span>
                      {selectedArea === area && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        <div className="flex items-center gap-2 shrink-0">
          {onToggleFilters && (
            <button
              onClick={onToggleFilters}
              className={`md:hidden p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors relative ${activeFilterCount > 0 ? 'bg-slate-900 text-white' : ''}`}
              title="Filters"
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          )}
          <button
            onClick={handleProfileClick}
            className="w-9 h-9 rounded-full bg-[#10141d] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            title="User Profile (S)"
          >
            S
          </button>
        </div>
      </div>

      <div className="mt-2 sm:hidden">
        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search startups, categories, or locations..."
            className="w-full bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}
