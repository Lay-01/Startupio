import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import { getLocationPrecisionMeta, BENGALURU_CENTER, DEFAULT_ZOOM } from '../utils/location';
import { RotateCcw, Maximize2, Plus, Minus, Building2, Layers } from 'lucide-react';

const MAP_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  },
  esri: {
    name: 'Esri World Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Tiles © Esri'
  },
  cartoLight: {
    name: 'CartoDB Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    maxZoom: 19,
    attribution: '© CARTO'
  },
  cartoDark: {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    maxZoom: 19,
    attribution: '© CARTO'
  }
};

export default function StartupMap({
  startups,
  selectedStartup,
  hoveredStartup,
  onSelectStartup,
  onResetView
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const markersMapRef = useRef(new Map());

  const [activeProviderKey, setActiveProviderKey] = useState('osm');
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BENGALURU_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    const initialProvider = MAP_PROVIDERS.osm;
    const tileLayer = L.tileLayer(initialProvider.url, {
      maxZoom: initialProvider.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 35,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="marker-cluster-custom"><span>${count}</span></div>`,
          className: '',
          iconSize: L.point(38, 38)
        });
      }
    });

    map.addLayer(clusterGroup);

    mapInstanceRef.current = map;
    clusterGroupRef.current = clusterGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Provider
  const handleSelectProvider = (key) => {
    setActiveProviderKey(key);
    setShowStyleMenu(false);
    const provider = MAP_PROVIDERS[key];
    const map = mapInstanceRef.current;
    if (map && provider) {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const newLayer = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom
      }).addTo(map);
      tileLayerRef.current = newLayer;
    }
  };

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!map || !clusterGroup) return;

    clusterGroup.clearLayers();
    markersMapRef.current.clear();

    startups.forEach(startup => {
      if (startup.latitude && startup.longitude) {
        const isSelected = selectedStartup && selectedStartup.id === startup.id;
        const isHovered = hoveredStartup && hoveredStartup.id === startup.id;
        const meta = getLocationPrecisionMeta(startup.locationPrecision);

        const isActivePin = isSelected || isHovered;
        const pinSize = isSelected ? 26 : isHovered ? 22 : 14;

        const markerHtml = `
          <div class="custom-pin-marker ${isSelected ? 'pin-selected' : ''}" style="cursor: pointer;">
            <div style="
              width: ${pinSize}px;
              height: ${pinSize}px;
              background: ${isActivePin ? 'linear-gradient(135deg, #0f172a, #1e293b)' : meta.markerBg};
              border: 2.5px solid ${isActivePin ? '#38bdf8' : '#ffffff'};
              border-radius: 50%;
              box-shadow: ${isActivePin 
                ? '0 0 0 4px rgba(56, 189, 248, 0.3), 0 4px 16px rgba(0,0,0,0.3)' 
                : '0 2px 8px rgba(0,0,0,0.18)'};
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              ${isActivePin ? `<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>` : ''}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [pinSize, pinSize],
          iconAnchor: [pinSize / 2, pinSize / 2]
        });

        const marker = L.marker([startup.latitude, startup.longitude], { icon });

        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 11px;">
            <div style="font-weight: 800; color: #0f172a;">${startup.name}</div>
            <div style="color: #64748b; font-weight: 600; margin-top: 1px;">${startup.sector}</div>
          </div>
        `, { direction: 'top', offset: [0, -12], className: '' });

        marker.on('click', () => {
          onSelectStartup(startup);
        });

        clusterGroup.addLayer(marker);
        markersMapRef.current.set(startup.id, marker);
      }
    });

    if (selectedStartup && selectedStartup.latitude && selectedStartup.longitude) {
      map.flyTo([selectedStartup.latitude, selectedStartup.longitude], 16, {
        animate: true,
        duration: 0.6
      });
    }
  }, [startups, selectedStartup, hoveredStartup]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleResetMap = () => {
    mapInstanceRef.current?.flyTo(BENGALURU_CENTER, DEFAULT_ZOOM, {
      animate: true,
      duration: 0.6
    });
    if (onResetView) onResetView();
  };

  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds();
    let hasBounds = false;

    startups.forEach(s => {
      if (s.latitude && s.longitude) {
        bounds.extend([s.latitude, s.longitude]);
        hasBounds = true;
      }
    });

    if (hasBounds) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100">
      
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Stats Overlay Pill (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] glass-card rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-800 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-sky-500" />
          <span className="text-slate-900">{startups.length}</span>
          <span className="text-slate-500 font-medium">Startups</span>
        </div>
        <div className="w-px h-3.5 bg-slate-200" />
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Live</span>
        </div>
      </div>

      {/* Floating Controls & Style Switcher (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto items-end">
        
        {/* Style Selector Popup Menu */}
        {showStyleMenu && (
          <div className="glass-card rounded-2xl p-2 shadow-glass-lg mb-1 w-52 text-xs space-y-1">
            <div className="text-[9px] font-black uppercase text-slate-400 px-2.5 py-1 tracking-[0.18em]">
              Map Style
            </div>
            {Object.entries(MAP_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => handleSelectProvider(key)}
                className={`w-full text-left px-2.5 py-2 rounded-xl font-bold transition-all duration-200 flex items-center justify-between ${
                  activeProviderKey === key 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{provider.name}</span>
                {activeProviderKey === key && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
              </button>
            ))}
          </div>
        )}

        {/* Tile Provider Layer Button */}
        <button
          onClick={() => setShowStyleMenu(prev => !prev)}
          className={`p-2.5 rounded-2xl shadow-md border transition-all duration-200 flex items-center justify-center ${
            showStyleMenu 
              ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
              : 'glass-card text-slate-700 hover:text-slate-900'
          }`}
          title="Switch Map Tile Provider"
        >
          <Layers className="w-4 h-4 text-sky-500" />
        </button>

        {/* Zoom Controls */}
        <div className="glass-card rounded-2xl shadow-md flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors border-b border-slate-100/80"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={handleResetMap}
          className="glass-card p-2.5 rounded-2xl shadow-md hover:shadow-card-hover transition-all duration-200 flex items-center justify-center group"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-sky-500 group-hover:rotate-[-30deg] transition-transform duration-300" />
        </button>

        {/* Fit Bounds */}
        <button
          onClick={handleFitBounds}
          className="glass-card p-2.5 rounded-2xl shadow-md hover:shadow-card-hover transition-all duration-200 flex items-center justify-center group"
          title="Fit bounds to current results"
        >
          <Maximize2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform duration-200" />
        </button>

      </div>

    </div>
  );
}
