import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Globe, 
  MapPin, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  ExternalLink,
  Users,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { getSectorBadgeStyle } from '../utils/badgeStyles';

export default function StartupDetails({ startup, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!startup) return null;

  const badgeStyle = getSectorBadgeStyle(startup.sector);
  const cleanWebsite = startup.websiteUrl 
    ? startup.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/startup/${startup.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full md:w-[380px] lg:w-[400px] h-full bg-white border-l border-slate-200/80 p-5 overflow-y-auto flex flex-col shrink-0 z-30 select-text">
      
      {/* Top Bar: Back Arrow & Menu Dots */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Back / Close details"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Share Startup"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="space-y-4 flex-1">
        
        {/* Startup Name & Category */}
        <div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-tight">
            {startup.name}
          </h1>
          
          {startup.sector && (
            <div className="mt-2">
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border ${badgeStyle.pill}`}>
                {startup.sector}
              </span>
            </div>
          )}
        </div>

        {/* Website & Address */}
        <div className="space-y-2 pt-1">
          {startup.websiteUrl && (
            <a
              href={startup.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <Globe className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
              <span className="truncate">{cleanWebsite}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>
          )}

          <div className="flex items-start gap-2 text-xs font-medium text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{startup.address || (startup.area ? `${startup.area}, Bengaluru` : 'Bengaluru')}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>About</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {startup.description || `${startup.name} is an active startup based in ${startup.area || 'Bengaluru'}, operating in the ${startup.sector || 'technology'} sector.`}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Founded</span>
              <span className="text-xs font-bold text-slate-900">
                {startup.foundedYear || '2020'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Team Size</span>
              <span className="text-xs font-bold text-slate-900">
                {startup.employees || '10–50'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tag List */}
        <div>
          <span className="text-xs font-bold text-slate-900 block mb-2">Category</span>
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${badgeStyle.pill}`}>
              {startup.sector || 'Startup'}
            </span>
          </div>
        </div>

        {/* Founders if available */}
        {Array.isArray(startup.founders) && startup.founders.length > 0 && (
          <div>
            <span className="text-xs font-bold text-slate-900 block mb-2">Founders</span>
            <div className="flex flex-wrap gap-1.5">
              {startup.founders.map((f, i) => (
                <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
