import React, { useState, useMemo } from 'react';
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
  const [mobileListOpen, setMobileListOpen] = useState(false);

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
        onResetAll={handleResetFilters}
        selectedSector={selectedSector}
        onSelectSector={(sec) => setSelectedSector(sec)}
        areas={allAreas}
        selectedArea={selectedArea}
        onSelectArea={(area) => setSelectedArea(area)}
        onExportPDF={handleExportPDF}
        mobileView={mobileView}
        onToggleMobileView={() => {
          const next = mobileView === 'map' ? 'list' : 'map';
          setMobileView(next);
          setMobileListOpen(false);
        }}
        onOpenMobileList={() => setMobileListOpen(prev => !prev)}
      />

      {/* Extended Filters Drawer */}
      {showFilterBar && (
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 p-2 z-20 shadow-glass">
          <div className="max-w-7xl mx-auto">
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
      )}

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative md:flex-row">
        
        {/* Left Directory Panel */}
        <div className={`${mobileView === 'list' ? 'block' : 'hidden'} w-full h-[32vh] min-h-[220px] overflow-hidden z-10 md:block md:w-80 md:min-w-[20rem] md:h-full md:max-w-[25rem]`}>
          <StartupList
            startups={filteredStartups}
            selectedStartup={selectedStartup}
            onSelectStartup={(startup) => setSelectedStartup(startup)}
            onHoverStartup={(startup) => setHoveredStartup(startup)}
            onResetFilters={handleResetFilters}
            onExportPDF={handleExportPDF}
          />
        </div>

        {/* Spatial Map */}
        <div className={`${mobileView === 'map' ? 'block' : 'hidden'} flex-1 h-[48vh] min-h-[300px] relative md:block md:h-full`}>
          <StartupMap
            startups={filteredStartups}
            selectedStartup={selectedStartup}
            hoveredStartup={hoveredStartup}
            onSelectStartup={(startup) => setSelectedStartup(startup)}
            onResetView={() => setSelectedStartup(null)}
          />
        </div>

        {/* Mobile list overlay */}
        {mobileListOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-2xl rounded-t-3xl border-t border-slate-200/40 shadow-glass-xl md:hidden">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            <div className="max-h-[52vh] overflow-hidden">
              <StartupList
                startups={filteredStartups}
                selectedStartup={selectedStartup}
                onSelectStartup={(startup) => {
                  setSelectedStartup(startup);
                  setMobileListOpen(false);
                }}
                onHoverStartup={(startup) => setHoveredStartup(startup)}
                onResetFilters={handleResetFilters}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        )}

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
