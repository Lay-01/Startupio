import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BENGALURU_CENTER, DEFAULT_ZOOM } from '../utils/location';
import { Navigation, Plus, Minus, Target, BookOpen } from 'lucide-react';
import { requestStartups } from '../utils/api';

const MAP_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
  },
  esriStreet: {
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>'
  },
  esriTopo: {
    name: 'Esri World Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>'
  },
  hot: {
    name: 'Humanitarian Map',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
  }
};

// Colors matching reference image cluster badges
const CLUSTER_COLORS = ['#3B82F6', '#8B5CF6', '#F97316', '#10B981', '#0EA5E9', '#6366F1'];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

export default function StartupMap({
  filters = {},
  selectedStartup,
  hoveredStartup,
  onSelectStartup,
  onResetView
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const [activeProviderKey, setActiveProviderKey] = useState('osm');
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [mapFeatures, setMapFeatures] = useState([]);
  const [legendCounts, setLegendCounts] = useState({ startup: 0, investor: 0, accelerator: 0, community: 0, other: 0 });
  const [mapError, setMapError] = useState('');
  const [mapTruncated, setMapTruncated] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BENGALURU_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true
    });

    const initialProvider = MAP_PROVIDERS.osm;
    const tileLayer = L.tileLayer(initialProvider.url, {
      maxZoom: initialProvider.maxZoom,
      attribution: initialProvider.attribution
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resizeObserver.observe(mapContainerRef.current);

    const clusterGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    clusterGroupRef.current = clusterGroup;

    let fetchTimeout;
    let requestController;
    const fetchViewport = () => {
      clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(async () => {
        requestController?.abort();
        requestController = new AbortController();
        const bounds = map.getBounds();
        const activeFilters = filtersRef.current;
        const params = new URLSearchParams({
          view: 'map',
          bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(','),
          zoom: String(Math.floor(map.getZoom())),
          q: activeFilters.query || '',
          sector: activeFilters.sector || 'all',
          area: activeFilters.area || 'all',
          employeeSize: activeFilters.employeeSize || 'all',
          precision: activeFilters.precision || 'all',
          verifiedOnly: String(Boolean(activeFilters.verifiedOnly))
        });

        try {
          const data = await requestStartups(params, { signal: requestController.signal });
          setMapFeatures(data.items);
          setLegendCounts(data.legendCounts);
          setMapTruncated(data.truncated);
          setMapError('');
        } catch (error) {
          if (error.name !== 'AbortError') setMapError(error.message);
        }
      }, 140);
    };

    map.on('moveend', fetchViewport);
    fetchViewport();

    return () => {
      clearTimeout(fetchTimeout);
      requestController?.abort();
      resizeObserver.disconnect();
      map.off('moveend', fetchViewport);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    mapInstanceRef.current?.fire('moveend');
  }, [filters.query, filters.sector, filters.area, filters.employeeSize, filters.precision, filters.verifiedOnly]);

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
        maxZoom: provider.maxZoom,
        attribution: provider.attribution
      }).addTo(map);
      tileLayerRef.current = newLayer;
    }
  };

  // Render only viewport features returned by the server.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!map || !clusterGroup) return;

    clusterGroup.clearLayers();
    mapFeatures.forEach(feature => {
      if (!Number.isFinite(feature.latitude) || !Number.isFinite(feature.longitude)) return;

      if (feature.kind === 'cluster') {
        const color = CLUSTER_COLORS[feature.count % CLUSTER_COLORS.length];
        const icon = L.divIcon({
          html: `<div style="background:${color};color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.18)"><span>${feature.count}</span></div>`,
          className: '',
          iconSize: L.point(34, 34)
        });
        const marker = L.marker([feature.latitude, feature.longitude], { icon });
        marker.on('click', () => map.flyTo(
          [feature.latitude, feature.longitude],
          Math.min(map.getZoom() + 2, 19),
          { animate: true, duration: 0.4 }
        ));
        clusterGroup.addLayer(marker);
        return;
      }

      const isSelected = selectedStartup?.id === feature.id;
      const isHovered = hoveredStartup?.id === feature.id;
      const markerHtml = isSelected
        ? `<div style="background:#0f172a;color:#fff;padding:5px 10px;border-radius:9999px;font-family:Inter,sans-serif;font-size:11px;font-weight:800;box-shadow:0 6px 20px rgba(0,0,0,.3);white-space:nowrap;cursor:pointer;border:2px solid #fff">📍 ${escapeHtml(feature.name)}</div>`
        : `<div style="width:${isHovered ? 16 : 12}px;height:${isHovered ? 16 : 12}px;background:${isHovered ? '#0f172a' : '#3b82f6'};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.2);cursor:pointer"></div>`;
      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: isSelected ? [180, 32] : [16, 16],
        iconAnchor: isSelected ? [90, 16] : [8, 8]
      });
      const marker = L.marker([feature.latitude, feature.longitude], { icon });
      if (!isSelected) marker.bindTooltip(escapeHtml(feature.name), { direction: 'top', offset: [0, -8] });
      marker.on('click', () => onSelectStartup?.(feature));
      clusterGroup.addLayer(marker);
    });
  }, [mapFeatures, selectedStartup, hoveredStartup, onSelectStartup]);

  useEffect(() => {
    if (selectedStartup && Number.isFinite(selectedStartup.latitude) && Number.isFinite(selectedStartup.longitude)) {
      mapInstanceRef.current?.flyTo([selectedStartup.latitude, selectedStartup.longitude], 15, {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedStartup?.id]);

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

      {(mapError || mapTruncated) && (
        <div role={mapError ? 'alert' : undefined} className="absolute top-4 left-4 z-[400] max-w-[min(70%,320px)] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-600 shadow-md">
          {mapError ? `Map results unavailable: ${mapError}` : 'Zoom in to load more map detail.'}
        </div>
      )}

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
      <div className="absolute bottom-8 right-5 z-[400] hidden sm:block">
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
