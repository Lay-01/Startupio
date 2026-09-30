import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import StartupMap from '../components/StartupMap';
import StartupList from '../components/StartupList';
import StartupDetails from '../components/StartupDetails';
import StartupBottomSheet from '../components/StartupBottomSheet';
import CommandSearchModal from '../components/CommandSearchModal';
import MobileNav from '../components/MobileNav';

import { requestStartups } from '../utils/api';
import { LayoutGrid, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [metadata, setMetadata] = useState({ total: 0, categories: [], areas: [], employeeSizes: [], precisions: [] });
  const [pageData, setPageData] = useState({ items: [], page: 1, limit: 20, total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [metadataError, setMetadataError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDirectoryCollapsed, setIsDirectoryCollapsed] = useState(false);

  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedEmployeeSize, setSelectedEmployeeSize] = useState('all');
  const [selectedPrecision, setSelectedPrecision] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [hoveredStartup, setHoveredStartup] = useState(null);
  
  // Navigation tabs ('map', 'startups', 'categories', 'settings')
  const [activeTab, setActiveTab] = useState('map');

  const allSectors = useMemo(() => metadata.categories.map(category => category.name), [metadata.categories]);
  const allAreas = useMemo(() => metadata.areas.map(area => area.name), [metadata.areas]);
  const allEmployeeSizes = metadata.employeeSizes;
  const allPrecisions = metadata.precisions;
  const resultKey = JSON.stringify([searchQuery, selectedSector, selectedArea, selectedEmployeeSize, selectedPrecision, verifiedOnly]);

  useEffect(() => {
    const controller = new AbortController();
    requestStartups({ view: 'meta' }, { signal: controller.signal })
      .then(data => setMetadata(data))
      .catch(error => {
        if (!controller.signal.aborted) setMetadataError(error.message);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      q: searchQuery,
      sector: selectedSector,
      area: selectedArea,
      employeeSize: selectedEmployeeSize,
      precision: selectedPrecision,
      verifiedOnly: String(verifiedOnly)
    });
    setIsLoading(true);
    setDataError('');
    setPageData(current => ({ ...current, items: [], page, total: 0, pages: 0 }));
    const timeout = setTimeout(() => {
      requestStartups(params, { signal: controller.signal })
        .then(data => {
          if (!controller.signal.aborted) {
            setPageData(data);
          }
        })
        .catch(error => {
          if (!controller.signal.aborted) setDataError(error.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, searchQuery ? 220 : 0);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [page, searchQuery, selectedSector, selectedArea, selectedEmployeeSize, selectedPrecision, verifiedOnly]);

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
    setPage(1);
    setSelectedStartup(null);
  };

  const updateFilter = (setter, value) => {
    setter(value);
    setPage(1);
    setSelectedStartup(null);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
    setSelectedStartup(null);
  };

  const handleMapSelectStartup = async (startup) => {
    try {
      const result = await requestStartups({ id: startup.id });
      setSelectedStartup(result.item);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleExportPDF = async () => {
    const { exportStartupsToPDF } = await import('../utils/pdfExport');
    exportStartupsToPDF(pageData.items, {
      sector: selectedSector,
      area: selectedArea,
      employeeSize: selectedEmployeeSize,
      precision: selectedPrecision,
      verifiedOnly,
      searchQuery
    });
  };

  return (
    <div className="app-shell w-full flex overflow-hidden bg-[#F8FAFC] font-sans antialiased select-none text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenCommandSearch={() => setIsCommandOpen(true)}
          areas={allAreas}
          selectedArea={selectedArea}
          onSelectArea={value => updateFilter(setSelectedArea, value)}
          onToggleFilters={() => setShowFilterBar(value => !value)}
          activeFilterCount={activeFilterCount}
        />

        {showFilterBar && (
          <div className="bg-white border-b border-slate-200/80 z-30 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <FilterBar
              sectors={allSectors}
              areas={allAreas}
              employeeSizes={allEmployeeSizes}
              precisions={allPrecisions}
              selectedSector={selectedSector}
              setSelectedSector={(value) => updateFilter(setSelectedSector, value)}
              selectedArea={selectedArea}
              setSelectedArea={(value) => updateFilter(setSelectedArea, value)}
              selectedEmployeeSize={selectedEmployeeSize}
              setSelectedEmployeeSize={(value) => updateFilter(setSelectedEmployeeSize, value)}
              selectedPrecision={selectedPrecision}
              setSelectedPrecision={(value) => updateFilter(setSelectedPrecision, value)}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={(value) => updateFilter(setVerifiedOnly, value)}
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
              ${activeTab === 'startups'
                ? 'flex w-full z-20'
                : isDirectoryCollapsed
                  ? 'hidden'
                  : 'hidden md:flex md:w-[min(42vw,535px)] md:min-w-[320px] lg:w-[min(40vw,535px)] lg:min-w-[390px] xl:w-[535px] flex-none z-20'}
              h-full min-h-0 transition-[width] duration-300 ease-in-out
            `}>
              <StartupList
                startups={pageData.items}
                totalCount={pageData.total}
                page={page}
                pageCount={pageData.pages}
                isLoading={isLoading}
                resultKey={resultKey}
                error={dataError}
                onPageChange={setPage}
                sectors={allSectors}
                selectedStartup={selectedStartup}
                onSelectStartup={(startup) => {
                  setSelectedStartup(startup);
                  if (window.innerWidth < 768) {
                    setActiveTab('map');
                  }
                }}
                onHoverStartup={(startup) => setHoveredStartup(startup)}
                selectedSector={selectedSector}
                onSelectSector={(value) => updateFilter(setSelectedSector, value)}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onToggleFilters={() => setShowFilterBar(prev => !prev)}
                onResetFilters={handleResetFilters}
                onExportPDF={handleExportPDF}
              />
            </div>

            {activeTab === 'map' && (
              <button
                type="button"
                onClick={() => setIsDirectoryCollapsed(value => !value)}
                className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-[450] h-10 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  isDirectoryCollapsed
                    ? 'left-2'
                    : 'left-[min(42vw,535px)] -translate-x-1/2 lg:left-[min(40vw,535px)] xl:left-[535px]'
                }`}
                aria-label={isDirectoryCollapsed ? 'Expand startup directory' : 'Collapse startup directory'}
                aria-expanded={!isDirectoryCollapsed}
                aria-controls="startup-directory"
                title={isDirectoryCollapsed ? 'Expand startup directory' : 'Collapse startup directory'}
              >
                {isDirectoryCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Spatial Map Canvas */}
            <div className={`
              flex-1 h-full min-h-0 relative
              ${activeTab === 'startups' ? 'hidden md:block' : 'block'}
            `}>
              <StartupMap
                filters={{
                  query: searchQuery,
                  sector: selectedSector,
                  area: selectedArea,
                  employeeSize: selectedEmployeeSize,
                  precision: selectedPrecision,
                  verifiedOnly
                }}
                selectedStartup={selectedStartup}
                hoveredStartup={hoveredStartup}
                onSelectStartup={handleMapSelectStartup}
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

              {metadataError && <p role="alert" className="mb-4 text-sm font-semibold text-rose-700">{metadataError}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {metadata.categories.map(({ name: sector, count }) => (
                  <button
                    key={sector}
                    onClick={() => {
                      updateFilter(setSelectedSector, sector);
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
                      {count.toLocaleString()} startups
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
                      <span className="text-base font-extrabold text-slate-900">{metadata.total.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Unique Sectors</span>
                      <span className="text-base font-extrabold text-slate-900">{metadata.categories.length}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Unique Areas</span>
                      <span className="text-base font-extrabold text-slate-900">{metadata.areas.length}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Export Data</h3>
                    <p className="text-xs text-slate-500 mb-3">Download the current results page as a PDF directory document.</p>
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
        onSelectStartup={(startup) => {
          setSelectedStartup(startup);
          setActiveTab('map');
        }}
      />

      {metadataError && (
        <div role="alert" className="fixed bottom-16 left-4 z-[60] max-w-sm rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-800 shadow-lg">
          Startup metadata could not be loaded: {metadataError}
        </div>
      )}

    </div>
  );
}
