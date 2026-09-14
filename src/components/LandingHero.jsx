import React, { useState } from 'react';
import { Sparkles, Building2, TrendingUp, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function LandingHero({ startupCount = 100, onExploreClick }) {
  const [collapsed, setCollapsed] = useState(false);

  const stats = [
    {
      icon: <Building2 className="h-4 w-4 text-sky-500" />,
      value: `${startupCount}+`,
      label: "Startups Mapped",
      gradient: "from-sky-500 to-sky-600"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
      value: "$4B+",
      label: "Ecosystem Value",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Users className="h-4 w-4 text-violet-500" />,
      value: "20K+",
      label: "Jobs Created",
      gradient: "from-violet-500 to-violet-600"
    },
    {
      icon: <MapPin className="h-4 w-4 text-amber-500" />,
      value: "1",
      label: "Iconic Hub",
      gradient: "from-amber-500 to-amber-600"
    }
  ];

  if (collapsed) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold">
          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
          <span>Bengaluru Startup Directory • {startupCount} Startups Mapped</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all duration-200"
        >
          <span>Show Summary</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 py-8 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(true)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          title="Minimize header banner"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-sky-50/80 text-sky-700 border border-sky-200/60 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bengaluru Tech Ecosystem</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Discover top startups in{' '}
          <span className="text-gradient-brand">
            HSR Layout, Indiranagar & BTM Layout
          </span>
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          An interactive directory and verified location map of Bengaluru's leading technology startups across HSR Layout, Indiranagar, and BTM Layout.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                {React.cloneElement(stat.icon, { className: 'h-4 w-4 text-white' })}
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
