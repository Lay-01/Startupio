import React from 'react';
import { getLocationPrecisionMeta } from '../utils/location';
import { CheckCircle2 } from 'lucide-react';

export default function StartupCard({ 
  startup, 
  isSelected, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}) {
  const precisionMeta = getLocationPrecisionMeta(startup.locationPrecision);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group p-3 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5">
        
        {/* Startup Initial Avatar + Name + Sector */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
            isSelected
              ? 'bg-sky-500 border-sky-400 text-white'
              : 'bg-slate-100 border-slate-200 text-slate-800 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-colors'
          }`}>
            {startup.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-slate-900'}`}>
                {startup.name}
              </h3>
              {startup.verified && (
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-emerald-600'}`} />
              )}
            </div>

            <p className={`text-[11px] font-semibold truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
              {startup.sector}
            </p>
          </div>
        </div>

        {/* Employee Count Pill & Location Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
            isSelected 
              ? 'bg-slate-800 border-slate-700 text-slate-200' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {startup.employees}
          </span>

          <span 
            className={`w-2 h-2 rounded-full shrink-0 ${
              startup.locationPrecision === 'exact' ? 'bg-emerald-500' :
              startup.locationPrecision === 'approximate' ? 'bg-amber-500' : 'bg-slate-400'
            }`}
            title={precisionMeta.label}
          />
        </div>

      </div>
    </div>
  );
}
