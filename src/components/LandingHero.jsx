import React, { useState } from 'react';
import { Sparkles, Building2, TrendingUp, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function LandingHero({ startupCount = 100, onExploreClick }) {
  const [collapsed, setCollapsed] = useState(false);

  const stats = [
    {
      icon: <Building2 className="h-4 w-4 text-gray-700" />,
      value: `${startupCount}+`,
      label: "Startups Mapped"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-gray-700" />,
      value: "$4B+",
      label: "Ecosystem Value"
    },
    {
      icon: <Users className="h-4 w-4 text-gray-700" />,
      value: "20K+",
      label: "Jobs Created"
    },
    {
      icon: <MapPin className="h-4 w-4 text-gray-700" />,
      value: "1",
      label: "Iconic Hub"
    }
  ];

  if (collapsed) {
    return (
      <div className="bg-gray-50 border-b border-gray-200/80 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-gray-900" />
          <span>Bengaluru Startup Directory • {startupCount} Startups Mapped</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1 font-semibold text-gray-800 hover:text-gray-900 px-2 py-0.5 rounded hover:bg-gray-200/60 transition"
        >
          <span>Show Summary Banner</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6 relative shadow-2xs">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(true)}
          className="absolute right-4 top-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          title="Minimize header banner"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 border border-gray-200 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-gray-900" />
          <span>Bengaluru Tech Ecosystem</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Discover top startups in{' '}
          <span className="bg-gradient-to-r from-sky-600 via-slate-800 to-indigo-600 bg-clip-text text-transparent">
            HSR Layout, Indiranagar & BTM Layout
          </span>
        </h1>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          An interactive directory and verified location map of Bengaluru's leading technology startups across HSR Layout, Indiranagar, and BTM Layout.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 text-left">
              <div className="h-8 w-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                {stat.icon}
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
