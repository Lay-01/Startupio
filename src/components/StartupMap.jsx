import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import { getLocationPrecisionMeta, BENGALURU_CENTER, DEFAULT_ZOOM } from '../utils/location';
import { RotateCcw, Maximize2, Plus, Minus, Layers } from 'lucide-react';

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



      {/* Floating Controls & Style Switcher (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto items-end">
        
        {/* Style Selector Popup Menu */}
        {showStyleMenu && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-slate-200/80 mb-1 w-52 text-xs space-y-1">
            <div className="text-[9px] font-black uppercase text-slate-400 px-2.5 py-1 tracking-[0.18em]">
              Map Style
            </div>
            {Object.entries(MAP_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => handleSelectProvider(key)}
                className={`w-full text-left px-2.5 py-2 rounded-xl font-bold transition-all duration-200 flex items-center justify-between ${
                  activeProviderKey === key 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{provider.name}</span>
                {activeProviderKey === key && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
              </button>
            ))}
          </div>
        )}

        {/* Unified Map Controls Toolbar */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-lg flex flex-col divide-y divide-slate-100 overflow-hidden">
          <button
            onClick={() => setShowStyleMenu(prev => !prev)}
            className={`p-2.5 transition-colors flex items-center justify-center ${
              showStyleMenu ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Map Styles"
          >
            <Layers className="w-4 h-4 text-sky-500" />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={handleFitBounds}
            className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
            title="Fit bounds to results"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetMap}
            className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-colors flex items-center justify-center group"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-30deg] transition-transform duration-300" />
          </button>
        </div>

      </div>

    </div>
  );
}
