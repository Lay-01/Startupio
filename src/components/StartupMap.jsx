import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import { BENGALURU_CENTER, DEFAULT_ZOOM } from '../utils/location';
import { Navigation, Plus, Minus, Target, Layers, BookOpen } from 'lucide-react';

const MAP_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  },
  esriStreet: {
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: 'Tiles © Esri'
  },
  esriTopo: {
    name: 'Esri World Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Tiles © Esri'
  },
  hot: {
    name: 'Humanitarian Map',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }
};

// Colors matching reference image cluster badges
const CLUSTER_COLORS = ['#3B82F6', '#8B5CF6', '#F97316', '#10B981', '#0EA5E9', '#6366F1'];

export default function StartupMap({
  startups = [],
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

  // Category legend counts calculated dynamically from dataset
  const legendCounts = useMemo(() => {
    let startupCount = 0;
    let investorCount = 0;
    let acceleratorCount = 0;
    let communityCount = 0;
    let otherCount = 0;

    startups.forEach(s => {
      const sec = (s.sector || '').toLowerCase();
      if (sec.includes('vc') || sec.includes('capital') || sec.includes('investor') || sec.includes('fund')) {
        investorCount++;
      } else if (sec.includes('accelerator') || sec.includes('incubator') || sec.includes('hub')) {
        acceleratorCount++;
      } else if (sec.includes('community') || sec.includes('network') || sec.includes('event')) {
        communityCount++;
      } else if (sec.includes('other') || !sec) {
        otherCount++;
      } else {
        startupCount++;
      }
    });

    return {
      startup: startupCount,
      investor: investorCount,
      accelerator: acceleratorCount,
      community: communityCount,
      other: otherCount
    };
  }, [startups]);

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
      maxClusterRadius: 40,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        // Pick cluster background color deterministically from cluster count
        const color = CLUSTER_COLORS[count % CLUSTER_COLORS.length];
        
        return L.divIcon({
          html: `<div style="
            background-color: ${color};
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 12px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            transition: transform 0.2s ease;
          "><span>${count}</span></div>`,
          className: '',
          iconSize: L.point(32, 32)
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

        let markerHtml = '';

        if (isSelected) {
          // Selected pin popup style matching reference design: Black rounded box with pin pointing
          markerHtml = `
            <div style="
              background: #0F172A;
              color: #FFFFFF;
              padding: 5px 10px;
              border-radius: 9999px;
              font-family: Inter, sans-serif;
              font-size: 11px;
              font-weight: 800;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 6px 20px rgba(0,0,0,0.3);
              white-space: nowrap;
              cursor: pointer;
              border: 2px solid #FFFFFF;
            ">
              <span style="font-size: 12px;">📍</span>
              <span>${startup.name}</span>
            </div>
          `;
        } else {
          // Circle pin marker
          const pinColor = isHovered ? '#0F172A' : '#3B82F6';
          const size = isHovered ? 16 : 12;

          markerHtml = `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${pinColor};
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              cursor: pointer;
              transition: transform 0.2s ease;
            "></div>
          `;
        }

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: isSelected ? [120, 32] : [16, 16],
          iconAnchor: isSelected ? [60, 16] : [8, 8]
        });

        const marker = L.marker([startup.latitude, startup.longitude], { icon });

        if (!isSelected) {
          marker.bindTooltip(`
            <div style="font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; color: #0F172A;">
              ${startup.name}
            </div>
          `, { direction: 'top', offset: [0, -8] });
        }

        marker.on('click', () => {
          onSelectStartup(startup);
        });

        clusterGroup.addLayer(marker);
        markersMapRef.current.set(startup.id, marker);
      }
    });

    if (selectedStartup && selectedStartup.latitude && selectedStartup.longitude) {
      map.flyTo([selectedStartup.latitude, selectedStartup.longitude], 15, {
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

  return (
    <div className="relative w-full h-full bg-slate-100">
      
      {/* Leaflet DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top-Right Floating Controls (Reference Image Style) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-1 divide-y divide-slate-100">
        <button
          onClick={handleResetMap}
          className="p-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          title="Locate / Center"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomIn}
          className="p-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetMap}
          className="p-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          title="Target View"
        >
          <Target className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom-Left Floating Legend Bar (Reference Image 1 & 2 Style) */}
      <div className="absolute bottom-5 left-5 z-[400] hidden sm:flex items-center gap-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-lg text-xs font-semibold text-slate-700 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Startup</span>
          <span className="font-bold text-slate-900 ml-0.5">{legendCounts.startup}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>Investor</span>
          <span className="font-bold text-slate-900 ml-0.5">{legendCounts.investor}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>Accelerator</span>
          <span className="font-bold text-slate-900 ml-0.5">{legendCounts.accelerator}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span>Community</span>
          <span className="font-bold text-slate-900 ml-0.5">{legendCounts.community}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Other</span>
          <span className="font-bold text-slate-900 ml-0.5">{legendCounts.other}</span>
        </div>
      </div>

      {/* Mobile Floating Legend (Compact) */}
      <div className="absolute bottom-16 left-3 right-3 z-[400] sm:hidden flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-md text-[11px] font-semibold text-slate-700">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Startup</span>
          <span className="font-bold text-slate-900">{legendCounts.startup}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Investor</span>
          <span className="font-bold text-slate-900">{legendCounts.investor}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Accelerator</span>
          <span className="font-bold text-slate-900">{legendCounts.accelerator}</span>
        </div>
        <span className="text-slate-400">•••</span>
      </div>

      {/* Bottom-Right Layer Switcher Button */}
      <div className="absolute bottom-5 right-5 z-[400] hidden sm:block">
        <div className="relative">
          {showStyleMenu && (
            <div className="absolute bottom-12 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-slate-200/80 w-48 text-xs space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                Map Tiles
              </div>
              {Object.entries(MAP_PROVIDERS).map(([key, provider]) => (
                <button
                  key={key}
                  onClick={() => handleSelectProvider(key)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-between ${
                    activeProviderKey === key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{provider.name}</span>
                  {activeProviderKey === key && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
            title="Map Style"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
