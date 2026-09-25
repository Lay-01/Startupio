import React from 'react';

const CATEGORIES = [
  { name: "All", sectorId: "all" },
  { name: "FinTech", sectorId: "FinTech" },
  { name: "SaaS", sectorId: "SaaS" },
  { name: "AI & DeepTech", sectorId: "AI" },
  { name: "HealthTech", sectorId: "HealthTech" },
  { name: "D2C", sectorId: "D2C" },
  { name: "EdTech", sectorId: "EdTech" },
  { name: "Consumer", sectorId: "Consumer" },
  { name: "Logistics", sectorId: "Logistics" },
  { name: "Mobility", sectorId: "Mobility" },
  { name: "AgriTech", sectorId: "AgriTech" },
  { name: "CleanTech", sectorId: "CleanTech" },
  { name: "Web3", sectorId: "Web3" }
];

export default function SectorPills({ selectedSector, onSelectSector }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-3">
      <div className="flex items-center gap-2 shrink-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedSector === cat.sectorId || (cat.sectorId === 'all' && selectedSector === 'all');
          return (
            <button
              key={cat.name}
              onClick={() => onSelectSector(cat.sectorId)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
