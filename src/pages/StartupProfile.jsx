import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { requestStartups } from '../utils/api';
import { getLocationPrecisionMeta } from '../utils/location';
import { S_PROFILE_URL } from '../utils/config';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  UserCheck, 
  Globe, 
  Linkedin, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  Info,
  ChevronLeft,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Map
} from 'lucide-react';

export default function StartupProfile() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setStartup(null);
    setIsLoading(true);
    setLoadError('');
    requestStartups({ id: startupId }, { signal: controller.signal })
      .then(data => setStartup(data.item))
      .catch(error => {
        if (!controller.signal.aborted) setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [startupId]);

  useEffect(() => {
    if (!startup || !mapContainerRef.current || mapInstanceRef.current) return;

    const lat = startup.latitude || 12.9352;
    const lng = startup.longitude || 77.6245;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
    }).addTo(map);

    if (startup.latitude && startup.longitude) {
      const markerHtml = `
        <div style="
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border: 3px solid #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.3), 0 4px 16px rgba(0,0,0,0.3);
        ">
          <div style="width: 7px; height: 7px; background-color: white; border-radius: 50%;"></div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker([lat, lng], { icon }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [startup]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-slate-500">Loading startup profile...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-3xl p-10 text-center">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-5 border border-slate-200/50">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="font-black text-slate-900 text-lg">{loadError ? 'Unable to Load Startup' : 'Startup Record Not Found'}</h2>
          <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
            {loadError || <>We couldn't find a startup record matching "<span className="font-mono font-bold text-slate-700">{startupId}</span>".</>}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discovery</span>
          </Link>
        </div>
      </div>
    );
  }

  const precisionMeta = getLocationPrecisionMeta(startup.locationPrecision);
  const hasLinkedin = Boolean(startup.linkedinUrl && startup.linkedinUrl.trim());
  const hasWebsite = Boolean(startup.websiteUrl && startup.websiteUrl.trim());
  const hasCareers = Boolean(startup.careersUrl && startup.careersUrl.trim());
  const hasApply = Boolean(startup.applyUrl && startup.applyUrl.trim());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Top Header */}
      <header className="glass-strong sticky top-0 z-30 border-b border-slate-200/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs transition-all duration-200 py-2 group"
          >
            <ChevronLeft className="w-4 h-4 text-sky-500 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Discovery</span>
          </button>

            <button
              onClick={() => window.open(S_PROFILE_URL, "_blank", "noopener,noreferrer")}
              className="w-9 h-9 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer select-none"
              title="User Profile (S)"
            >
              S
            </button>
        </div>
      </header>

      {/* Profile Sheet Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Main Profile Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100/80">
            
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                {startup.name.charAt(0).toUpperCase()}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/10 to-transparent" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{startup.name}</h1>
                  {startup.verified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-500 font-semibold">
                  <span className="text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100/60">{startup.sector}</span>
                  <span className="text-slate-300">·</span>
                  <span>{startup.area}, {startup.city}</span>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2 self-start">
              {hasWebsite && (
                <a
                  href={startup.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold shadow-lg transition-all duration-200 active:scale-95"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>

          </div>

          {/* Description */}
          <div className="py-6 border-b border-slate-100/80">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Company Overview
            </h2>
            <p className="text-slate-700 text-[13px] leading-relaxed max-w-3xl font-medium">
              {startup.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-100/80">
            
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Team Size</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                <span>{startup.employees} employees</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Founded</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>{startup.foundedYear || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Founders</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-500" />
                <span className="truncate">{Array.isArray(startup.founders) && startup.founders.length > 0 ? startup.founders.join(', ') : 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Location</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  startup.locationPrecision === 'exact' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' :
                  startup.locationPrecision === 'approximate' ? 'bg-amber-500 shadow-sm shadow-amber-500/30' : 'bg-slate-400'
                }`}></span>
                <span>{precisionMeta.label}</span>
              </div>
            </div>

          </div>

          {/* Careers & Hiring */}
          <div className="pt-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" />
              Careers & Hiring
            </h2>

            <div className="p-4 bg-sky-50/50 border border-sky-100/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Briefcase className="w-4 h-4 text-sky-500" />
                  <span>Careers at {startup.name}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {hasApply ? 'Active open roles and direct application portal available.' :
                   hasCareers ? 'Explore public career openings on company job portal.' :
                   'Career information not publicly available at this time.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasApply && (
                  <a
                    href={startup.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {hasCareers && (
                  <a
                    href={startup.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-sky-500/20 active:scale-95"
                  >
                    <span>Careers Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Map & Office Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Office Address
              </h2>
              <div className="flex items-start gap-2.5 text-slate-800 font-semibold text-[13px] leading-relaxed mb-4">
                <span className="text-sky-500 mt-0.5">📍</span>
                <span>{startup.address}</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-[11px] font-medium leading-relaxed flex items-start gap-2.5 ${precisionMeta.badgeBg}`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">{precisionMeta.label}</span>
                <span className="opacity-80">{precisionMeta.description}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden h-64 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

        </div>

      </main>

    </div>
  );
}
