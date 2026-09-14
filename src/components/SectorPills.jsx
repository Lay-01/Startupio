import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { name: "All", sectorId: "all", emoji: "✦", gradient: "from-slate-900 to-slate-800" },
  { name: "FinTech", sectorId: "FinTech", emoji: "💳", gradient: "from-blue-500 to-blue-600" },
  { name: "SaaS", sectorId: "SaaS", emoji: "☁️", gradient: "from-indigo-500 to-indigo-600" },
  { name: "AI & DeepTech", sectorId: "AI", emoji: "🧠", gradient: "from-purple-500 to-purple-600" },
  { name: "HealthTech", sectorId: "HealthTech", emoji: "🏥", gradient: "from-emerald-500 to-emerald-600" },
  { name: "Consumer", sectorId: "Consumer", emoji: "🛍️", gradient: "from-pink-500 to-pink-600" },
  { name: "Food Tech", sectorId: "FoodTech", emoji: "🍕", gradient: "from-red-500 to-red-600" },
  { name: "EdTech", sectorId: "EdTech", emoji: "📚", gradient: "from-teal-500 to-teal-600" },
  { name: "Logistics", sectorId: "Logistics", emoji: "🚛", gradient: "from-amber-500 to-amber-600" },
  { name: "Mobility", sectorId: "Mobility", emoji: "🚗", gradient: "from-yellow-500 to-yellow-600" },
  { name: "AgriTech", sectorId: "AgriTech", emoji: "🌾", gradient: "from-green-500 to-green-600" },
  { name: "CleanTech", sectorId: "CleanTech", emoji: "♻️", gradient: "from-lime-500 to-lime-600" },
  { name: "Gaming", sectorId: "Gaming", emoji: "🎮", gradient: "from-cyan-500 to-cyan-600" },
  { name: "Web3", sectorId: "Web3", emoji: "🔗", gradient: "from-violet-500 to-violet-600" }
];

const COLLAPSED_COUNT = 8;

export default function SectorPills({ selectedSector, onSelectSector }) {
  const [expanded, setExpanded] = useState(false);

  const visibleCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, COLLAPSED_COUNT);
  const hiddenCount = CATEGORIES.length - COLLAPSED_COUNT;

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Desktop: horizontal scroll row */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedSector === cat.sectorId || (cat.sectorId === 'all' && selectedSector === 'all');
          return (
            <button
              key={cat.name}
              onClick={() => onSelectSector(cat.sectorId)}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shrink-0 transition-all duration-200 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-[1.02]`
                  : 'bg-white/70 text-slate-600 border border-slate-200/60 hover:text-slate-900 hover:border-slate-300 hover:bg-white hover:shadow-card active:scale-95'
              }`}
            >
              <span className="text-[10px]">{cat.emoji}</span>
              <span>{cat.name}</span>
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: collapsible grid with larger tappable pills */}
      <div className="sm:hidden px-4">
        <div className="flex flex-wrap gap-2 py-2">
          {visibleCategories.map((cat) => {
            const isActive = selectedSector === cat.sectorId || (cat.sectorId === 'all' && selectedSector === 'all');
            return (
              <button
                key={cat.name}
                onClick={() => onSelectSector(cat.sectorId)}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-br ${cat.gradient} text-white shadow-lg shadow-black/10 scale-[1.03]`
                    : 'bg-white/80 text-slate-600 border border-slate-200/60 active:scale-95 active:bg-slate-100'
                }`}
              >
                <span className="text-xs leading-none">{cat.emoji}</span>
                <span className="leading-none">{cat.name}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                )}
              </button>
            );
          })}

          {/* Show More / Show Less toggle */}
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-bold text-sky-600 bg-sky-50/80 border border-sky-200/50 active:scale-95 transition-all duration-200"
          >
            <span>{expanded ? 'Less' : `+${hiddenCount}`}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Hidden categories with smooth expand animation */}
        <div 
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            maxHeight: expanded ? `${Math.ceil(hiddenCount / 4) * 52 + 16}px` : '0px',
            opacity: expanded ? 1 : 0
          }}
        >
          <div className="flex flex-wrap gap-2 pb-2">
            {CATEGORIES.slice(COLLAPSED_COUNT).map((cat) => {
              const isActive = selectedSector === cat.sectorId;
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectSector(cat.sectorId)}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-br ${cat.gradient} text-white shadow-lg shadow-black/10 scale-[1.03]`
                      : 'bg-white/80 text-slate-600 border border-slate-200/60 active:scale-95 active:bg-slate-100'
                  }`}
                >
                  <span className="text-xs leading-none">{cat.emoji}</span>
                  <span className="leading-none">{cat.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
