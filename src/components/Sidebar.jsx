import React from 'react';
import { Map, Rocket, LayoutGrid, Settings, Compass, MapPin } from 'lucide-react';

export default function Sidebar({ activeTab = 'map', setActiveTab }) {
  const navItems = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'startups', label: 'Startups', icon: Rocket },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'settings', label: 'About', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-[68px] lg:w-[210px] h-full bg-[#10141d] border-r border-slate-800/60 py-4 lg:py-6 z-40 shrink-0 select-none text-white">
      
      {/* Top Brand Logo */}
      <div className="flex flex-col items-center lg:items-stretch gap-10">
        <div className="flex items-center justify-center lg:justify-start gap-3 px-0 lg:px-5">
          <div className="w-10 h-10 rounded-xl bg-[#f97343] flex items-center justify-center text-[#10141d] shadow-md shrink-0">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="font-extrabold text-base leading-tight tracking-tight">Startupio</p>
            <p className="text-xs text-slate-400 mt-1">Bengaluru</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-2 px-2 lg:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-12 h-12 lg:w-full lg:h-[50px] lg:justify-start lg:px-4 rounded-xl flex items-center lg:gap-3 transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#252b35] text-white shadow-md border border-slate-700/60 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-[#f97343]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-100' : 'text-slate-400'}`} />
                <span className="hidden lg:block text-sm font-semibold leading-none">{item.label}</span>
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
      <div className="hidden lg:block px-5 pb-2">
        <div className="h-16 mb-3 flex items-end gap-1 border-b border-slate-700/60 text-slate-600" aria-hidden="true">
          <span className="w-3 h-6 border border-current rounded-t-sm" />
          <span className="w-5 h-10 border border-current rounded-t-sm" />
          <span className="w-3 h-8 border border-current rounded-t-sm" />
          <span className="w-6 h-5 border border-current rounded-t-sm" />
          <span className="w-4 h-12 border border-current rounded-t-sm" />
        </div>
        <p className="text-sm font-semibold text-slate-200">Bengaluru</p>
        <p className="text-xs leading-relaxed text-slate-400 mt-1">Where Ideas<br />Build Tomorrow</p>
      </div>

    </aside>
  );
}
