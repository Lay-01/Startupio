import React from 'react';

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

export default function SectorPills({ selectedSector, onSelectSector }) {
  return (
    <div className="max-w-[1600px] mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
  );
}
