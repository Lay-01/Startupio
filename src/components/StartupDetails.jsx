import React, { useState } from 'react';
import { getLocationPrecisionMeta } from '../utils/location';
import { 
  X, 
  MapPin, 
  Users, 
  UserCheck, 
  ExternalLink, 
  Linkedin, 
  Globe, 
  Briefcase, 
  CheckCircle2, 
  Building2,
  Info,
  Copy,
  Check,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StartupDetails({ startup, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!startup) return null;

  const precisionMeta = getLocationPrecisionMeta(startup.locationPrecision);

  const hasLinkedin = Boolean(startup.linkedinUrl && startup.linkedinUrl.trim());
  const hasWebsite = Boolean(startup.websiteUrl && startup.websiteUrl.trim());
  const hasCareers = Boolean(startup.careersUrl && startup.careersUrl.trim());
  const hasApply = Boolean(startup.applyUrl && startup.applyUrl.trim());

  const handleCopyLink = () => {
    const url = `${window.location.origin}/startup/${startup.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200/90 shadow-[0_18px_40px_rgba(15,23,42,0.12)] overflow-y-auto w-full md:w-96 lg:w-[400px] shrink-0 z-30 select-text animate-in slide-in-from-right duration-200">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-[0_10px_18px_rgba(15,23,42,0.12)]">
            {startup.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">{startup.name}</h2>
              {startup.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Data" />
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{startup.sector}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Copy share link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 space-y-6 flex-1 text-slate-900">
        
        {/* Description */}
        <div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {startup.description || 'No description available for this startup.'}
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Location Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location</h3>
          <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-800 leading-relaxed mb-3">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{startup.address}</span>
          </div>

          <div className={`p-2.5 rounded-2xl border text-[11px] font-medium leading-relaxed flex items-start gap-2 shadow-sm ${precisionMeta.badgeBg}`}>
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{precisionMeta.label}</span>
              <span>{precisionMeta.description}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Company Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Company Details</h3>
          
          <div className="space-y-3 text-xs">
            {startup.foundedYear && (
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Founded Year</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">{startup.foundedYear}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Team Size</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{startup.employees || 'Not disclosed'} employees</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Founders</span>
              {Array.isArray(startup.founders) && startup.founders.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {startup.founders.map((founder, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800">
                      <UserCheck className="w-3 h-3 text-sky-600" />
                      {founder}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic text-[11px] mt-0.5 block">Founder information not publicly disclosed.</span>
              )}
            </div>
          </div>
        </div>

        {/* Verification & Evidence Notes Block */}
        {(startup.confidence || startup.evidenceNotes || (Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0)) && (
          <>
            <div className="h-px bg-slate-100" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Verification & Evidence</h3>
                {startup.confidence && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    startup.confidence.toLowerCase() === 'high' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {startup.confidence.toUpperCase()} CONFIDENCE
                  </span>
                )}
              </div>

              {startup.evidenceNotes && (
                <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl leading-relaxed mb-3 font-medium">
                  {startup.evidenceNotes}
                </p>
              )}

              {Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0 && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Verification Sources</span>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.verificationSources.map((srcUrl, idx) => (
                      <a
                        key={idx}
                        href={srcUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md hover:underline truncate max-w-[320px]"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{srcUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="h-px bg-slate-100" />

        {/* Links Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Links & Action Links</h3>

          <div className="space-y-2">
            
            {hasWebsite && (
              <a
                href={startup.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-[0_8px_18px_rgba(15,23,42,0.1)]"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Company Website</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            {hasLinkedin && (
              <a
                href={startup.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition shadow-[0_8px_18px_rgba(10,102,194,0.18)]"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            {hasApply ? (
              <a
                href={startup.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-[0_8px_18px_rgba(16,185,129,0.18)]"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Apply Now</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            ) : hasCareers ? (
              <a
                href={startup.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Careers Page</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium text-center italic">
                Career information not publicly available
              </div>
            )}

          </div>

          {/* Direct Route */}
          <div className="pt-3">
            <Link
              to={`/startup/${startup.id}`}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Open Dedicated Profile Page</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
