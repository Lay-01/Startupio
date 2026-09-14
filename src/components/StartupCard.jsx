import React from 'react';
import { getLocationPrecisionMeta } from '../utils/location';
import { CheckCircle2 } from 'lucide-react';

export default function StartupCard({ 
  startup, 
  index,
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
      className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'bg-slate-900 border-slate-700 text-white shadow-lg ring-1 ring-sky-500/20'
          : 'bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md'
      }`}
    >


      <div className="relative flex items-center justify-between gap-3">
        
        {/* Startup Initial Avatar + Name + Sector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className={`relative w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-br from-sky-400 to-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 text-slate-700 group-hover:from-slate-900 group-hover:to-slate-800 group-hover:border-slate-900 group-hover:text-white group-hover:shadow-lg'
            }`}>
              {startup.name.charAt(0).toUpperCase()}
            </div>
            {index && (
              <span className={`absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-black border-2 border-white ${
                isSelected
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 text-white'
              }`}>
                {index}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className={`font-bold text-[13px] truncate transition-colors duration-200 ${
                isSelected ? 'text-white' : 'text-slate-900 group-hover:text-slate-900'
              }`}>
                {startup.name}
              </h3>
              {startup.verified && (
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? 'text-sky-400' : 'text-emerald-500'
                }`} />
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[11px] font-semibold truncate ${
                isSelected ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {startup.sector}
              </span>
              <span className={`text-[9px] ${
                isSelected ? 'text-slate-500' : 'text-slate-400'
              }`}>·</span>
              <span className={`text-[11px] font-medium truncate ${
                isSelected ? 'text-slate-400' : 'text-slate-400'
              }`}>
                {startup.area}
              </span>
            </div>
          </div>
        </div>

        {/* Employee Count Pill & Location Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all duration-200 ${
            isSelected 
              ? 'bg-white/10 border border-white/10 text-slate-200' 
              : 'bg-slate-100/80 border border-slate-200/50 text-slate-500 group-hover:bg-slate-200/60'
          }`}>
            {startup.employees}
          </span>

          <span 
            className={`w-2 h-2 rounded-full shrink-0 transition-all duration-200 ${
              startup.locationPrecision === 'exact' 
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' :
              startup.locationPrecision === 'approximate' 
                ? 'bg-amber-500 shadow-sm shadow-amber-500/30' : 'bg-slate-400'
            }`}
            title={precisionMeta.label}
          />
        </div>

      </div>


    </div>
  );
}
