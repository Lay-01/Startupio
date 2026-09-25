import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import StartupMap from '../components/StartupMap';
import StartupList from '../components/StartupList';
import StartupDetails from '../components/StartupDetails';
import StartupBottomSheet from '../components/StartupBottomSheet';
import CommandSearchModal from '../components/CommandSearchModal';
import MobileNav from '../components/MobileNav';

import rawStartups from '../data/startups.json';
import { searchStartups } from '../utils/search';
import { filterStartups, getUniqueSectors, getUniqueAreas, getUniqueEmployeeSizes, getUniquePrecisions } from '../utils/filters';
import { exportStartupsToPDF } from '../utils/pdfExport';
import { LayoutGrid, Settings } from 'lucide-react';

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
  
  // Navigation tabs ('map', 'startups', 'categories', 'settings')
  const [activeTab, setActiveTab] = useState('map');

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
    <div className="h-screen w-full flex overflow-hidden bg-[#F8FAFC] font-sans antialiased select-none text-slate-900">
      
      {/* 1. Left Vertical Dark Navigation Sidebar (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCommandSearch={() => setIsCommandOpen(true)}
          areas={allAreas}
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          onToggleFilters={() => setShowFilterBar(prev => !prev)}
          activeFilterCount={activeFilterCount}
        />

        {/* Extended Filter Drawer */}
        {showFilterBar && (
          <div className="bg-white border-b border-slate-200/80 z-30 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
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
        )}

        {/* Content Views (Map / List / Categories / Settings) */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          
          {/* Main 3-Column View (Desktop & Mobile Map View) */}
          <main className={`flex-1 flex min-h-0 w-full h-full relative ${
            activeTab === 'map' || activeTab === 'startups' ? 'flex' : 'hidden'
          }`}>
            
            {/* Left Directory Panel (Visible on Desktop OR Mobile List Tab) */}
            <div className={`
              ${activeTab === 'startups' ? 'flex w-full z-20' : 'hidden md:flex md:w-[360px] lg:w-[380px] flex-none z-20'}
              h-full min-h-0
            `}>
              <StartupList
                startups={filteredStartups}
                selectedStartup={selectedStartup}
                onSelectStartup={(startup) => {
                  setSelectedStartup(startup);
                  if (window.innerWidth < 768) {
                    setActiveTab('map');
                  }
                }}
                onHoverStartup={(startup) => setHoveredStartup(startup)}
                selectedSector={selectedSector}
                onSelectSector={setSelectedSector}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onToggleFilters={() => setShowFilterBar(prev => !prev)}
                onResetFilters={handleResetFilters}
                onExportPDF={handleExportPDF}
              />
            </div>

            {/* Spatial Map Canvas */}
            <div className={`
              flex-1 h-full min-h-0 relative
              ${activeTab === 'startups' ? 'hidden md:block' : 'block'}
            `}>
              <StartupMap
                startups={filteredStartups}
                selectedStartup={selectedStartup}
                hoveredStartup={hoveredStartup}
                onSelectStartup={(startup) => setSelectedStartup(startup)}
                onResetView={() => setSelectedStartup(null)}
              />
            </div>

            {/* Right Startup Details Drawer (Desktop) */}
            {selectedStartup && (
              <div className="hidden lg:block h-full z-30">
                <StartupDetails
                  startup={selectedStartup}
                  onClose={() => setSelectedStartup(null)}
                />
              </div>
            )}

          </main>

          {/* Categories Tab View */}
          {activeTab === 'categories' && (
            <div className="flex-1 h-full overflow-y-auto p-6 max-w-4xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Startup Categories</h1>
                  <p className="text-xs text-slate-500">Explore startups by industry sector</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allSectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => {
                      setSelectedSector(sector);
                      setActiveTab('map');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                      selectedSector === sector
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="font-bold text-sm block">{sector}</span>
                    <span className="text-xs text-slate-400 font-medium mt-1 block">
                      {rawStartups.filter(s => s.sector === sector).length} startups
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab View */}
          {activeTab === 'settings' && (
            <div className="flex-1 h-full overflow-y-auto p-6 max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Settings className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings & Preferences</h1>
                  <p className="text-xs text-slate-500">Startup Discovery Platform Options</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Data Overview</h3>
                  <p className="text-xs text-slate-500">Total active database records in Bengaluru ecosystem.</p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Startups</span>
                      <span className="text-base font-extrabold text-slate-900">{rawStartups.length}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Unique Sectors</span>
                      <span className="text-base font-extrabold text-slate-900">{allSectors.length}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Unique Areas</span>
                      <span className="text-base font-extrabold text-slate-900">{allAreas.length}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Export Data</h3>
                  <p className="text-xs text-slate-500 mb-3">Download the current filtered dataset as a PDF directory document.</p>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Export Directory PDF
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav
          activeTab={activeTab === 'startups' ? 'list' : activeTab}
          setActiveTab={(tab) => {
            if (tab === 'list') {
              setActiveTab('startups');
            } else {
              setActiveTab(tab);
            }
          }}
        />

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
        onSelectStartup={(startup) => {
          setSelectedStartup(startup);
          setActiveTab('map');
        }}
      />

    </div>
  );
}
