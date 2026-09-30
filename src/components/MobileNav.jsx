import React from 'react';
import { Map, List, LayoutGrid, Settings } from 'lucide-react';

export default function MobileNav({ activeTab = 'map', setActiveTab }) {
  const tabs = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'list', label: 'List', icon: List },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 z-50 px-4 py-2 flex items-center justify-around safe-area-bottom select-none shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-150 relative ${
              isActive ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-none">{tab.label}</span>
            {tab.badge && (
              <span className="absolute top-0 right-1/4 w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[8px] font-bold flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
