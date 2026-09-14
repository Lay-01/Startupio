import React from 'react';
import { X, Check, Filter, Download, RotateCcw, Sparkles } from 'lucide-react';

export default function FilterBar({
  sectors,
  areas = [],
  employeeSizes,
  precisions = [],
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
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 py-3 shadow-glass">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Area Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea && setSelectedArea(e.target.value)}
              className="bg-white/60 border border-slate-200/60 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none font-bold transition-all duration-200 hover:border-slate-300"
            >
              <option value="all">All Areas</option>
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Sector Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white/60 border border-slate-200/60 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none font-bold transition-all duration-200 hover:border-slate-300"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Employee Size Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Size</label>
            <select
              value={selectedEmployeeSize}
              onChange={(e) => setSelectedEmployeeSize(e.target.value)}
              className="bg-white/60 border border-slate-200/60 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none font-bold transition-all duration-200 hover:border-slate-300"
            >
              <option value="all">Any Size</option>
              {employeeSizes.map(size => (
                <option key={size} value={size}>{size} employees</option>
              ))}
            </select>
          </div>

          {/* Location Precision Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Location</label>
            <select
              value={selectedPrecision}
              onChange={(e) => setSelectedPrecision(e.target.value)}
              className="bg-white/60 border border-slate-200/60 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none font-bold transition-all duration-200 hover:border-slate-300"
            >
              <option value="all">All Precision</option>
              {precisions.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Verified Only Checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-white/60 px-3 py-1.5 rounded-xl border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all duration-200">
            <div className="relative">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded-md border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all duration-200 flex items-center justify-center">
                {verifiedOnly && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                )}
              </div>
            </div>
            <span>Verified</span>
          </label>

        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="btn-premium inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
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
