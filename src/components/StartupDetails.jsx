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
  Share2,
  Calendar,
  Shield,
  Sparkles,
  ArrowUpRight
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
    <div className="h-full flex flex-col bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-2xl border-l border-slate-200/40 shadow-glass-xl overflow-y-auto w-full md:w-96 lg:w-[420px] shrink-0 z-30 select-text">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100/80 bg-white/50 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-black text-sm flex items-center justify-center shadow-lg">
            {startup.name.charAt(0).toUpperCase()}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/10 to-transparent" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">{startup.name}</h2>
              {startup.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Verified Data" />
              )}
            </div>
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">{startup.sector}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
            title="Copy share link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 space-y-5 flex-1 text-slate-900">
        
        {/* Description */}
        <div>
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
            {startup.description || 'No description available for this startup.'}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Location Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Location
          </h3>
          <div className="flex items-start gap-2.5 text-[13px] font-semibold text-slate-800 leading-relaxed mb-3">
            <span className="text-sky-500 mt-0.5">📍</span>
            <span>{startup.address}</span>
          </div>

          <div className={`p-3 rounded-xl border text-[11px] font-medium leading-relaxed flex items-start gap-2.5 ${precisionMeta.badgeBg}`}>
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{precisionMeta.label}</span>
              <span className="opacity-80">{precisionMeta.description}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Company Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" />
            Company Details
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            {startup.foundedYear && (
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Founded</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  {startup.foundedYear}
                </span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Team Size</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500" />
                {startup.employees || 'N/A'}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-2">Founders</span>
            {Array.isArray(startup.founders) && startup.founders.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {startup.founders.map((founder, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 shadow-card">
                    <UserCheck className="w-3 h-3 text-sky-500" />
                    {founder}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400 italic text-[11px]">Founder information not publicly disclosed.</span>
            )}
          </div>
        </div>

        {/* Verification & Evidence */}
        {(startup.confidence || startup.evidenceNotes || (Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0)) && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Data Verification
                </h3>
                {startup.confidence && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    startup.confidence.toLowerCase() === 'high' 
                      ? 'bg-emerald-50 border-emerald-200/60 text-emerald-700' 
                      : 'bg-amber-50 border-amber-200/60 text-amber-700'
                  }`}>
                    {startup.confidence.toUpperCase()}
                  </span>
                )}
              </div>

              {startup.evidenceNotes && (
                <p className="text-[11px] text-slate-600 bg-slate-50/80 border border-slate-100 p-3 rounded-xl leading-relaxed mb-3 font-medium">
                  {startup.evidenceNotes}
                </p>
              )}

              {Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Sources</span>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.verificationSources.map((srcUrl, idx) => (
                      <a
                        key={idx}
                        href={srcUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 bg-sky-50/80 border border-sky-100/60 px-2.5 py-1 rounded-lg hover:underline truncate max-w-[320px] transition-colors"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{srcUrl.replace(/^https?:\/\/(www\.)?/, '').substring(0, 40)}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Links Block */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            Links & Actions
          </h3>

          <div className="space-y-2">
            
            {hasWebsite && (
              <a
                href={startup.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4" />
                  <span>Company Website</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            )}

            {hasLinkedin && (
              <a
                href={startup.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#0A66C2] to-[#084e96] hover:from-[#084e96] hover:to-[#073d78] text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-[#0A66C2]/20 hover:shadow-[#0A66C2]/30 group"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            )}

            {hasApply ? (
              <a
                href={startup.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Apply Now</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            ) : hasCareers ? (
              <a
                href={startup.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-sky-500/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Careers Page</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-[11px] text-slate-500 font-medium text-center italic">
                Career information not publicly available
              </div>
            )}

          </div>

          {/* Direct Route */}
          <div className="pt-3">
            <Link
              to={`/startup/${startup.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all duration-200 hover:shadow-card"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Open Full Profile</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
