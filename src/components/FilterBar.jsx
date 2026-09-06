import React from 'react';
import { X, Check, Filter, Download } from 'lucide-react';

export default function FilterBar({
  sectors,
  areas = [],
  employeeSizes,
  selectedSector,
  setSelectedSector,
  selectedArea = 'all',
  setSelectedArea,
  selectedEmployeeSize,
  setSelectedEmployeeSize,
  selectedPrecision,
  setSelectedPrecision,
  verifiedOnly,
  setVerifiedOnly,
  onClose,
  onReset,
  onExportPDF
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Area Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Area:</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea && setSelectedArea(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
            >
              <option value="all">All Areas</option>
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Sector Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector:</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Employee Size Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees:</label>
            <select
              value={selectedEmployeeSize}
              onChange={(e) => setSelectedEmployeeSize(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
            >
              <option value="all">Any Size</option>
              {employeeSizes.map(size => (
                <option key={size} value={size}>{size} employees</option>
              ))}
            </select>
          </div>

          {/* Location Precision Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location:</label>
            <select
              value={selectedPrecision}
              onChange={(e) => setSelectedPrecision(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
            >
              <option value="all">All Precision Levels</option>
              <option value="exact">Exact Geocoded Location</option>
              <option value="approximate">Approximate Area</option>
              <option value="unavailable">Location Unavailable</option>
            </select>
          </div>

          {/* Verified Only Checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span>Verified Data Only</span>
          </label>

        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-lg transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
          >
            Reset Filters
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Close filter panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
