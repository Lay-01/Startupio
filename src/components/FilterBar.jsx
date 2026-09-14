import React from 'react';
import { X, Check, Download, RotateCcw } from 'lucide-react';

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
    <div className="px-4 py-3">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile: stacked filters */}
        <div className="flex flex-col gap-2.5 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea && setSelectedArea(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Areas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>

            <select
              value={selectedEmployeeSize}
              onChange={(e) => setSelectedEmployeeSize(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">Any Size</option>
              {employeeSizes.map(size => <option key={size} value={size}>{size} emp</option>)}
            </select>

            <select
              value={selectedPrecision}
              onChange={(e) => setSelectedPrecision(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Precision</option>
              {precisions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-slate-600">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all flex items-center justify-center">
                  {verifiedOnly && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </div>
              </div>
              <span>Verified only</span>
            </label>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={onReset}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: inline row */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea && setSelectedArea(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Areas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>

            <select
              value={selectedEmployeeSize}
              onChange={(e) => setSelectedEmployeeSize(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">Any Size</option>
              {employeeSizes.map(size => <option key={size} value={size}>{size} emp</option>)}
            </select>

            <select
              value={selectedPrecision}
              onChange={(e) => setSelectedPrecision(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:outline-none transition-all"
            >
              <option value="all">All Precision</option>
              {precisions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all flex items-center justify-center">
                  {verifiedOnly && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </div>
              </div>
              <span>Verified</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            )}
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
