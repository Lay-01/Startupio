import React from 'react';
import { Map, Rocket, LayoutGrid, Bookmark, Settings, Compass } from 'lucide-react';

export default function Sidebar({ activeTab = 'map', setActiveTab }) {
  const navItems = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'startups', label: 'Startups', icon: Rocket },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center justify-between w-[72px] h-full bg-[#0D1322] border-r border-slate-800/60 py-4 z-40 shrink-0 select-none">
      
      {/* Top Brand Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-sky-400 shadow-md">
          <Compass className="w-5 h-5" />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1E293B] text-white shadow-md border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="text-[9px] font-semibold leading-none">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tagline */}
      <div className="flex flex-col items-center px-1 text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mb-2" />
        <span className="text-[9px] font-medium text-slate-500 tracking-tight leading-tight max-w-[50px]">
          Explore. Discover. Support.
        </span>
      </div>

    </aside>
  );
}
