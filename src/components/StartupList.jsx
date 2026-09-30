import React, { useEffect, useRef, useState } from 'react';
import StartupCard from './StartupCard';
import SectorPills from './SectorPills';
import { Search, SlidersHorizontal, Download, X, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';

const DESKTOP_ROW_HEIGHT = 88;
const MOBILE_ROW_HEIGHT = 100;
const OVERSCAN_ROWS = 4;

export default function StartupList({ 
  startups, 
  totalCount = 0,
  page = 1,
  pageCount = 0,
  isLoading = false,
  resultKey = '',
  error = '',
  onPageChange,
  selectedStartup, 
  onSelectStartup,
  onHoverStartup,
  sectors,
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
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState(MOBILE_ROW_HEIGHT);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const resizeObserver = new ResizeObserver(() => setListHeight(list.clientHeight));
    resizeObserver.observe(list);
    setListHeight(list.clientHeight);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateRowHeight = () => {
      setRowHeight(mediaQuery.matches ? MOBILE_ROW_HEIGHT : DESKTOP_ROW_HEIGHT);
      if (listRef.current) listRef.current.scrollTop = 0;
      setScrollTop(0);
    };

    updateRowHeight();
    mediaQuery.addEventListener('change', updateRowHeight);
    return () => mediaQuery.removeEventListener('change', updateRowHeight);
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    setScrollTop(0);
  }, [page, resultKey]);

  const firstVisibleIndex = Math.max(0, Math.min(
    startups.length,
    Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS
  ));
  const visibleRowCount = Math.ceil(listHeight / rowHeight) + OVERSCAN_ROWS * 2;
  const lastVisibleIndex = Math.min(startups.length, firstVisibleIndex + visibleRowCount);
  const visibleStartups = startups.slice(firstVisibleIndex, lastVisibleIndex);

  return (
    <div id="startup-directory" className={`h-full flex flex-col overflow-hidden bg-white ${
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
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white shrink-0">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-1">Explore</p>
            <h2 className="font-extrabold text-xl sm:text-2xl leading-tight text-[#142039] tracking-tight">Bengaluru Startups</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {totalCount.toLocaleString()} startups found in Bengaluru
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                title="Export PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
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
          <div className="-mx-4 sm:-mx-5 px-1 border-t border-b border-slate-100 bg-white">
            <SectorPills
              sectors={sectors}
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
      <div
        ref={listRef}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
      >
        {error ? (
          <div role="alert" className="py-16 px-4 text-center">
            <h3 className="font-bold text-slate-900 text-sm">Startup data is unavailable</h3>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : isLoading && startups.length === 0 ? (
          <div className="py-16 px-4 text-center text-xs font-semibold text-slate-500">Loading startups...</div>
        ) : startups.length > 0 ? (
          <>
            <div aria-hidden="true" style={{ height: firstVisibleIndex * rowHeight }} />
            {visibleStartups.map((startup, index) => (
              <div key={startup.id} style={{ height: rowHeight, boxSizing: 'border-box', paddingBottom: 8 }}>
                <StartupCard
                  startup={startup}
                  index={firstVisibleIndex + index + 1}
                  isSelected={selectedStartup && selectedStartup.id === startup.id}
                  onClick={() => onSelectStartup(startup)}
                  onMouseEnter={() => onHoverStartup && onHoverStartup(startup)}
                  onMouseLeave={() => onHoverStartup && onHoverStartup(null)}
                />
              </div>
            ))}
            <div aria-hidden="true" style={{ height: (startups.length - lastVisibleIndex) * rowHeight }} />
          </>
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

      <div className="shrink-0 min-h-12 px-3 sm:px-5 border-t border-slate-200/80 bg-white flex items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] text-slate-500 font-medium truncate">
          <span className="hidden sm:inline">Showing {totalCount ? (page - 1) * 20 + 1 : 0}-{Math.min(page * 20, totalCount)} of {totalCount.toLocaleString()} · </span>
          Page {pageCount ? page : 0} of {pageCount.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || isLoading}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={pageCount === 0 || page >= pageCount || isLoading}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
