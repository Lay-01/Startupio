import React from 'react';

const CATEGORIES = [
  { name: "All", sectorId: "all", color: "bg-slate-900" },
  { name: "FinTech", sectorId: "FinTech", color: "bg-blue-500" },
  { name: "SaaS", sectorId: "SaaS", color: "bg-indigo-500" },
  { name: "AI & DeepTech", sectorId: "AI", color: "bg-purple-500" },
  { name: "HealthTech", sectorId: "HealthTech", color: "bg-emerald-500" },
  { name: "Consumer", sectorId: "Consumer", color: "bg-pink-500" },
  { name: "Food Tech", sectorId: "FoodTech", color: "bg-red-500" },
  { name: "EdTech", sectorId: "EdTech", color: "bg-teal-500" },
  { name: "Logistics", sectorId: "Logistics", color: "bg-amber-500" },
  { name: "Mobility", sectorId: "Mobility", color: "bg-yellow-500" },
  { name: "AgriTech", sectorId: "AgriTech", color: "bg-green-500" },
  { name: "CleanTech", sectorId: "CleanTech", color: "bg-lime-500" },
  { name: "Gaming", sectorId: "Gaming", color: "bg-cyan-500" },
  { name: "Web3", sectorId: "Web3", color: "bg-violet-500" }
];

export default function SectorPills({ selectedSector, onSelectSector }) {
  return (
    <div className="max-w-[1600px] mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = selectedSector === cat.sectorId || (cat.sectorId === 'all' && selectedSector === 'all');
        return (
          <button
            key={cat.name}
            onClick={() => onSelectSector(cat.sectorId)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-sky-400' : cat.color}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
