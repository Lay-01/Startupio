import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import StartupMap from '../components/StartupMap';
import StartupList from '../components/StartupList';
import StartupDetails from '../components/StartupDetails';
import StartupBottomSheet from '../components/StartupBottomSheet';
import CommandSearchModal from '../components/CommandSearchModal';

import rawStartups from '../data/startups.json';
import { searchStartups } from '../utils/search';
import { filterStartups, getUniqueSectors, getUniqueAreas, getUniqueEmployeeSizes, getUniquePrecisions } from '../utils/filters';
import { exportStartupsToPDF } from '../utils/pdfExport';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedEmployeeSize, setSelectedEmployeeSize] = useState('all');
  const [selectedPrecision, setSelectedPrecision] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [hoveredStartup, setHoveredStartup] = useState(null);
  const [mobileView, setMobileView] = useState('map');
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const allSectors = useMemo(() => getUniqueSectors(rawStartups), []);
  const allAreas = useMemo(() => getUniqueAreas(rawStartups), []);
  const allEmployeeSizes = useMemo(() => getUniqueEmployeeSizes(rawStartups), []);
  const allPrecisions = useMemo(() => getUniquePrecisions(rawStartups), []);

  const filteredStartups = useMemo(() => {
    let result = searchStartups(rawStartups, searchQuery);
    result = filterStartups(result, {
      sector: selectedSector,
      area: selectedArea,
      employeeSize: selectedEmployeeSize,
      precision: selectedPrecision,
      verifiedOnly: verifiedOnly
    });
    return result;
  }, [searchQuery, selectedSector, selectedArea, selectedEmployeeSize, selectedPrecision, verifiedOnly]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSector !== 'all') count++;
    if (selectedArea !== 'all') count++;
    if (selectedEmployeeSize !== 'all') count++;
    if (selectedPrecision !== 'all') count++;
    if (verifiedOnly) count++;
    return count;
  }, [selectedSector, selectedArea, selectedEmployeeSize, selectedPrecision, verifiedOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('all');
    setSelectedArea('all');
    setSelectedEmployeeSize('all');
    setSelectedPrecision('all');
    setVerifiedOnly(false);
  };

  // Collapsible header: hide on scroll down, show on scroll up (mobile only)
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset;
        if (currentY > lastScrollY.current && currentY > 80) {
          setHeaderCollapsed(true);
        } else if (lastScrollY.current - currentY > 10) {
          setHeaderCollapsed(false);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleExportPDF = () => {
    exportStartupsToPDF(filteredStartups, {
      sector: selectedSector,
      area: selectedArea,
      employeeSize: selectedEmployeeSize,
      precision: selectedPrecision,
      verifiedOnly: verifiedOnly,
      searchQuery: searchQuery
    });
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 select-none font-sans">
      
      {/* Top Header Nav containing Search & Category Pills */}
      <Header
        onOpenCommandSearch={() => setIsCommandOpen(true)}
        onToggleFilters={() => setShowFilterBar(prev => !prev)}
        activeFilterCount={activeFilterCount}
        selectedSector={selectedSector}
        onSelectSector={(sec) => setSelectedSector(sec)}
        areas={allAreas}
        selectedArea={selectedArea}
        onSelectArea={(area) => setSelectedArea(area)}
        headerCollapsed={headerCollapsed}
      />

      {/* Extended Filters Drawer — always rendered, animated collapse */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out z-20"
        style={{
          maxHeight: showFilterBar ? '300px' : '0px',
          opacity: showFilterBar ? 1 : 0
        }}
      >
        <div className="bg-white border-b border-slate-200/50">
          <FilterBar
            sectors={allSectors}
            areas={allAreas}
            employeeSizes={allEmployeeSizes}
            precisions={allPrecisions}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedEmployeeSize={selectedEmployeeSize}
            setSelectedEmployeeSize={setSelectedEmployeeSize}
            selectedPrecision={selectedPrecision}
            setSelectedPrecision={setSelectedPrecision}
            verifiedOnly={verifiedOnly}
            setVerifiedOnly={setVerifiedOnly}
            onClose={() => setShowFilterBar(false)}
            onReset={handleResetFilters}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative md:flex-row">
        
        {/* Left Directory Panel — desktop sidebar */}
        <div className="hidden md:block md:w-80 md:min-w-[20rem] md:h-full md:max-w-[25rem] md:flex-none z-10">
          <StartupList
            startups={filteredStartups}
            selectedStartup={selectedStartup}
            onSelectStartup={(startup) => setSelectedStartup(startup)}
            onHoverStartup={(startup) => setHoveredStartup(startup)}
            onResetFilters={handleResetFilters}
            onExportPDF={handleExportPDF}
          />
        </div>

        {/* Spatial Map — right side on desktop, full on mobile */}
        <div className="flex-1 min-h-0 relative md:h-full">
          <StartupMap
            startups={filteredStartups}
            selectedStartup={selectedStartup}
            hoveredStartup={hoveredStartup}
            onSelectStartup={(startup) => setSelectedStartup(startup)}
            onResetView={() => setSelectedStartup(null)}
          />
        </div>

        {/* Mobile List Overlay — slides up over the map */}
        <div className={`absolute inset-x-0 top-0 bottom-0 z-20 md:hidden flex flex-col transition-all duration-300 ease-out ${
          mobileView === 'list' 
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}>
          <div className="flex-1 min-h-0">
            <StartupList
              startups={filteredStartups}
              selectedStartup={selectedStartup}
              onSelectStartup={(startup) => setSelectedStartup(startup)}
              onHoverStartup={(startup) => setHoveredStartup(startup)}
              onResetFilters={handleResetFilters}
              onExportPDF={handleExportPDF}
              mobileOverlay
            />
          </div>
        </div>

        {/* Right Details Drawer */}
        {selectedStartup && (
          <div className="hidden lg:block h-full z-20">
            <StartupDetails
              startup={selectedStartup}
              onClose={() => setSelectedStartup(null)}
            />
          </div>
        )}

      </main>

      {/* Mobile Floating Capsule Tab Bar */}
      <div className="md:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none safe-area-bottom">
        <div className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-2xl border border-slate-200/50 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] px-1 py-1">
          {/* Map Button */}
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 pl-4 pr-5 py-2.5 rounded-full transition-all duration-200 ${
              mobileView === 'map'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 active:text-slate-600'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3z" />
              <path d="M9 4v13" />
              <path d="M15 7v13" />
            </svg>
            <span className="text-[11px] font-bold">Map</span>
          </button>

          {/* List Button */}
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 pl-5 pr-4 py-2.5 rounded-full transition-all duration-200 ${
              mobileView === 'list'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 active:text-slate-600'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span className="text-[11px] font-bold">List</span>
          </button>
        </div>
      </div>

      {/* Mobile Touch Bottom Sheet */}
      {selectedStartup && (
        <StartupBottomSheet
          startup={selectedStartup}
          onClose={() => setSelectedStartup(null)}
        />
      )}

      {/* Command K Modal */}
      <CommandSearchModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        startups={rawStartups}
        onSelectStartup={(startup) => setSelectedStartup(startup)}
      />

    </div>
  );
}
