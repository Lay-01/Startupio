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
import { filterStartups, getUniqueSectors, getUniqueAreas, getUniqueEmployeeSizes } from '../utils/filters';
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

  const allSectors = useMemo(() => getUniqueSectors(rawStartups), []);
  const allAreas = useMemo(() => getUniqueAreas(rawStartups), []);
  const allEmployeeSizes = useMemo(() => getUniqueEmployeeSizes(rawStartups), []);

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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-900 select-none font-sans">
      
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
      />

      {/* Extended Filters Drawer */}
      {showFilterBar && (
        <div className="bg-white border-b border-slate-200 p-2 z-20 shadow-md">
          <div className="max-w-7xl mx-auto">
            <FilterBar
              sectors={allSectors}
              areas={allAreas}
              employeeSizes={allEmployeeSizes}
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
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Directory Panel */}
        <div className="hidden sm:block w-80 md:w-96 shrink-0 h-full overflow-hidden z-10">
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
        <div className="flex-1 h-full relative">
          <StartupMap
            startups={filteredStartups}
            selectedStartup={selectedStartup}
            hoveredStartup={hoveredStartup}
            onSelectStartup={(startup) => setSelectedStartup(startup)}
            onResetView={() => setSelectedStartup(null)}
          />
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
