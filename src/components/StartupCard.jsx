import React from 'react';
import { MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getSectorBadgeStyle } from '../utils/badgeStyles';

export default function StartupCard({ 
  startup, 
  index,
  isSelected, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}) {
  const badgeStyle = getSectorBadgeStyle(startup.sector);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative h-full p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'bg-slate-50/80 border-slate-900 ring-1 ring-slate-900/10 shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        
        {/* Index Circle + Startup Name & Category */}
          <div className="flex items-center gap-3 min-w-0">
          
          {/* Index Circle */}
          {index && (
            <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
            }`}>
              {index}
            </div>
          )}

          <div className="w-12 h-12 rounded-xl bg-[#142039] text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm" aria-hidden="true">
            {(startup.name || '?').trim().charAt(0).toUpperCase()}
          </div>

          {/* Startup Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-[#142039] truncate leading-tight">
                {startup.name}
              </h3>
              {startup.sector && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeStyle.pill}`}>
                  {startup.sector}
                </span>
              )}
              {startup.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Startup" />
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 font-normal mt-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">
                {startup.area ? `${startup.area}, Bengaluru` : startup.address || 'Bengaluru'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Chevron Arrow */}
        <div className="shrink-0 pl-1">
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
            isSelected ? 'text-slate-900 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-600'
          }`} />
        </div>

      </div>
    </div>
  );
}
