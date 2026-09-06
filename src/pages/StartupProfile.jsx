import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import rawStartups from '../data/startups.json';
import { getLocationPrecisionMeta } from '../utils/location';
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
  ChevronLeft
} from 'lucide-react';

export default function StartupProfile() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const startup = rawStartups.find(s => s.id === startupId || s.id.toLowerCase() === startupId?.toLowerCase());

  useEffect(() => {
    if (!startup || !mapContainerRef.current || mapInstanceRef.current) return;

    const lat = startup.latitude || 12.9352;
    const lng = startup.longitude || 77.6245;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    if (startup.latitude && startup.longitude) {
      const meta = getLocationPrecisionMeta(startup.locationPrecision);
      const markerHtml = `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #0f172a;
          border: 2px solid #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.35);
        ">
          <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
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

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Startup Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            We couldn't find a startup record matching ID "<span className="font-mono text-slate-700">{startupId}</span>".
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discovery App</span>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs transition py-2"
          >
            <ChevronLeft className="w-4 h-4 text-sky-600" />
            <span>Back to Discovery Canvas</span>
          </button>

          <Link to="/" className="flex items-center gap-2 font-black text-base text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <span>Startup.io</span>
          </Link>

        </div>
      </header>

      {/* Profile Sheet Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {startup.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{startup.name}</h1>
                  {startup.verified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Data</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-500 font-semibold">
                  <span className="text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">{startup.sector}</span>
                  <span>•</span>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
            </div>

          </div>

          <div className="py-6 border-b border-slate-100">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Company Overview</h2>
            <p className="text-slate-700 text-sm leading-relaxed max-w-3xl font-normal">
              {startup.description}
            </p>
          </div>

          <div className="py-6 grid grid-cols-1 sm:grid-cols-4 gap-6 border-b border-slate-100 text-xs">
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Company Size</span>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>{startup.employees} employees</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Founded Year</span>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>{startup.foundedYear || 'Not specified'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Founders</span>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-600" />
                <span>{Array.isArray(startup.founders) && startup.founders.length > 0 ? startup.founders.join(', ') : 'Not disclosed'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Location Precision</span>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  startup.locationPrecision === 'exact' ? 'bg-emerald-500' :
                  startup.locationPrecision === 'approximate' ? 'bg-amber-500' : 'bg-slate-400'
                }`}></span>
                <span>{precisionMeta.label}</span>
              </div>
            </div>

          </div>

          {/* Verification & Evidence Notes Block */}
          {(startup.confidence || startup.evidenceNotes || (Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0)) && (
            <div className="py-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Verification & Evidence</h2>
                {startup.confidence && (
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    startup.confidence.toLowerCase() === 'high' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {startup.confidence.toUpperCase()} CONFIDENCE DATA
                  </span>
                )}
              </div>

              {startup.evidenceNotes && (
                <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl leading-relaxed mb-4 font-medium">
                  {startup.evidenceNotes}
                </p>
              )}

              {Array.isArray(startup.verificationSources) && startup.verificationSources.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Verification Sources</span>
                  <div className="flex flex-wrap gap-2">
                    {startup.verificationSources.map((srcUrl, idx) => (
                      <a
                        key={idx}
                        href={srcUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 border border-sky-100 px-3 py-1 rounded-lg hover:underline truncate max-w-md"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{srcUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Careers & Hiring</h2>

            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Briefcase className="w-4 h-4 text-sky-600" />
                  <span>Careers at {startup.name}</span>
                </div>
                <p className="text-[11px] text-slate-600">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {hasCareers && (
                  <a
                    href={startup.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Careers Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Map & Office Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Office Address</h2>
              <div className="flex items-start gap-2.5 text-slate-800 font-semibold text-xs leading-relaxed mb-4">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>{startup.address}</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] font-medium leading-relaxed flex items-start gap-2 ${precisionMeta.badgeBg}`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">{precisionMeta.label}</span>
                <span>{precisionMeta.description}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm h-60 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

        </div>

      </main>

    </div>
  );
}
