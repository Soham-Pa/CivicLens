import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  CloudRain,
  Sliders,
  Filter,
  Layers,
  AlertTriangle,
  Info,
  Navigation,
  Search,
  X,
  Droplets,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { CivicCategory, Language, SeverityLevel } from '../types';
import { translations } from '../utils/translations';
import {
  SAMPLE_POTHOLES,
  SAMPLE_GARBAGE,
  SAMPLE_STREETLIGHTS,
  SAMPLE_DRAINS,
  ALL_WATERLOGGING_RECORDS,
  WaterloggingRecord,
  MapCivicIssue,
} from '../data/sampleData';
import { SeverityMeter } from './SeverityMeter';

interface MapScreenProps {
  lang: Language;
  initialMode?: 'issues' | 'waterlogging';
  onReportHere?: (locationName: string, coords: { lat: number; lng: number }) => void;
}

const MONTH_NAMES = [
  'January (Dry)',
  'February (Dry)',
  'March (Pre-Monsoon)',
  'April (Kalbaishakhi)',
  'May (Storm Season)',
  'June (Monsoon Onset)',
  'July (Peak Monsoon)',
  'August (Peak Monsoon)',
  'September (Monsoon)',
  'October (Puja Showers)',
  'November (Post-Monsoon)',
  'December (Dry Winter)',
];

export const MapScreen: React.FC<MapScreenProps> = ({
  lang,
  initialMode = 'issues',
  onReportHere,
}) => {
  const t = translations[lang] || translations.en;

  // View mode: 'issues' | 'waterlogging'
  const [viewMode, setViewMode] = useState<'issues' | 'waterlogging'>(initialMode);

  // Issues mode filters
  const [categoryFilter, setCategoryFilter] = useState<'all' | CivicCategory>('all');
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Waterlogging mode filters
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // Default July (Peak Monsoon)
  const [causeFilter, setCauseFilter] = useState<string>('all');

  // Selected item modal/bottom card
  const [selectedIssue, setSelectedIssue] = useState<MapCivicIssue | null>(null);
  const [selectedWaterlog, setSelectedWaterlog] = useState<WaterloggingRecord | null>(null);

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Combine all civic issues
  const allIssues = useMemo(() => {
    return [
      ...SAMPLE_POTHOLES,
      ...SAMPLE_GARBAGE,
      ...SAMPLE_STREETLIGHTS,
      ...SAMPLE_DRAINS,
    ];
  }, []);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return allIssues.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (criticalOnly && item.severity !== 'Critical') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesRoad = item.road_name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesLocation && !matchesRoad && !matchesDesc) return false;
      }
      return true;
    });
  }, [allIssues, categoryFilter, criticalOnly, searchQuery]);

  // Filtered waterlogging records for selected month
  const filteredWaterlogging = useMemo(() => {
    return ALL_WATERLOGGING_RECORDS.filter((rec) => {
      if (rec.month !== selectedMonth) return false;
      if (causeFilter !== 'all' && rec.cause !== causeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.area_name.toLowerCase().includes(q);
        const matchesWard = rec.ward.toLowerCase().includes(q);
        if (!matchesName && !matchesWard) return false;
      }
      return true;
    });
  }, [selectedMonth, causeFilter, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.5626, 88.3639],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }
  }, []);

  // Invalidate map size on window resize
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Map Markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    if (viewMode === 'issues') {
      // Render Civic Issues markers
      filteredIssues.forEach((issue) => {
        let pinColor = '#0B3C7A';
        if (issue.category === 'pothole') pinColor = '#DC2626';
        if (issue.category === 'garbage') pinColor = '#D97706';
        if (issue.category === 'streetlight') pinColor = '#7C3AED';
        if (issue.category === 'drain') pinColor = '#0284C7';

        const customIcon = L.divIcon({
          className: 'civic-issue-pin',
          html: `
            <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              ${
                issue.severity === 'Critical'
                  ? `<div style="position: absolute; width: 30px; height: 30px; background: ${pinColor}; opacity: 0.3; border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                  : ''
              }
              <div style="position: relative; width: 22px; height: 22px; background: ${pinColor}; border: 2px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <div style="width: 6px; height: 6px; background: #FFFFFF; border-radius: 9999px;"></div>
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedIssue(issue);
          setSelectedWaterlog(null);
        });
        layer.addLayer(marker);
      });
    } else {
      // Render Waterlogging Hotspots
      filteredWaterlogging.forEach((wl) => {
        let circleColor = '#10B981'; // Low (<10cm)
        let radius = 180;
        if (wl.severity === 'Critical') {
          circleColor = '#EF4444'; // Red (>40cm)
          radius = 350;
        } else if (wl.severity === 'High') {
          circleColor = '#F97316'; // Orange (>25cm)
          radius = 280;
        } else if (wl.severity === 'Medium') {
          circleColor = '#FBBF24'; // Yellow (>10cm)
          radius = 220;
        }

        const circle = L.circle([wl.lat, wl.lng], {
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.45,
          weight: 2,
          radius,
        });

        circle.on('click', () => {
          setSelectedWaterlog(wl);
          setSelectedIssue(null);
        });

        layer.addLayer(circle);

        // Center dot marker
        const dotIcon = L.divIcon({
          className: 'wl-dot',
          html: `
            <div style="width: 14px; height: 14px; background: ${circleColor}; border: 2px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); cursor: pointer;"></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const dotMarker = L.marker([wl.lat, wl.lng], { icon: dotIcon });
        dotMarker.on('click', () => {
          setSelectedWaterlog(wl);
          setSelectedIssue(null);
        });
        layer.addLayer(dotMarker);
      });
    }
  }, [viewMode, filteredIssues, filteredWaterlogging]);

  // Locate Me action
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.setView([latitude, longitude], 14, { animate: true });

        const myLocationIcon = L.divIcon({
          className: 'my-loc-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 32px; height: 32px; background: rgba(37, 99, 235, 0.3); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 16px; height: 16px; background: #2563EB; border: 3px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([latitude, longitude], { icon: myLocationIcon }).addTo(mapInstanceRef.current!);
      },
      () => {
        alert('Could not obtain current GPS position.');
      }
    );
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden relative">
      {/* ================= DESKTOP LEFT SIDE PANEL (360px wide) ================= */}
      <aside className="hidden lg:flex w-[360px] shrink-0 border-r border-slate-200 bg-white flex-col h-full overflow-y-auto shadow-sm z-20">
        <div className="p-4 space-y-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {t.mapTitle}
            </h2>
            <button
              onClick={handleLocateMe}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Locate Me"
              aria-label="Locate Me"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setViewMode('issues');
                setSelectedWaterlog(null);
              }}
              className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'issues'
                  ? 'bg-[#0B3C7A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.mapIssuesTab}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('waterlogging');
                setSelectedIssue(null);
              }}
              className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'waterlogging'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t.mapWaterloggingTab}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search road, ward or area..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode Controls */}
          {viewMode === 'issues' ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({allIssues.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('pothole')}
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                    categoryFilter === 'pothole'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Potholes
                </button>
                <button
                  onClick={() => setCategoryFilter('garbage')}
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                    categoryFilter === 'garbage'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Garbage
                </button>
                <button
                  onClick={() => setCategoryFilter('streetlight')}
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                    categoryFilter === 'streetlight'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Lights
                </button>
                <button
                  onClick={() => setCategoryFilter('drain')}
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                    categoryFilter === 'drain'
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  Drains
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={criticalOnly}
                  onChange={(e) => setCriticalOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Critical Hazards Only</span>
              </label>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{t.seasonalSlider}:</span>
                <span className="text-blue-900 font-extrabold">{MONTH_NAMES[selectedMonth - 1]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>Jan (Dry)</span>
                <span>Jul (Peak)</span>
                <span>Dec (Dry)</span>
              </div>
            </div>
          )}
        </div>

        {/* Panel Content: Selected details or list preview */}
        <div className="flex-1 p-4 space-y-4">
          {selectedIssue ? (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {selectedIssue.category}
                    </span>
                    <SeverityMeter severity={selectedIssue.severity} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedIssue.location}
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">
                    {selectedIssue.road_name} • {selectedIssue.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                {selectedIssue.description}
              </p>

              {onReportHere && (
                <button
                  onClick={() => {
                    onReportHere(selectedIssue.location, { lat: selectedIssue.lat, lng: selectedIssue.lng });
                  }}
                  className="w-full h-10 bg-[#0B3C7A] hover:bg-[#072B56] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Report an Issue at this Location</span>
                </button>
              )}
            </div>
          ) : selectedWaterlog ? (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                      {selectedWaterlog.ward}
                    </span>
                    <SeverityMeter severity={selectedWaterlog.severity} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedWaterlog.area_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedWaterlog(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">{t.estDepth}</span>
                  <span className="text-base font-extrabold text-blue-950">{selectedWaterlog.water_depth_cm} cm</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.clearanceDuration}</span>
                  <span className="text-base font-extrabold text-slate-800">~{selectedWaterlog.duration_hours} hrs</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.trafficAdvisory}</span>
                </span>
                <p className="text-amber-950 font-medium leading-tight">
                  {selectedWaterlog.traffic_impact}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">
                {viewMode === 'issues'
                  ? `Showing ${filteredIssues.length} active civic issues`
                  : `Showing ${filteredWaterlogging.length} waterlogging hotspots`}
              </p>
              <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto">
                Click any marker on the map to inspect details, hazard severity, and traffic impact.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ================= MOBILE FLOATING CONTROLS (<lg) ================= */}
      <div className="lg:hidden absolute top-3 inset-x-3 z-30 max-w-xl mx-auto space-y-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-md border border-slate-200 pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => {
              setViewMode('issues');
              setSelectedWaterlog(null);
            }}
            className={`flex-1 min-h-[40px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'issues'
                ? 'bg-[#0B3C7A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t.mapIssuesTab}</span>
          </button>

          <button
            onClick={() => {
              setViewMode('waterlogging');
              setSelectedIssue(null);
            }}
            className={`flex-1 min-h-[40px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'waterlogging'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>{t.mapWaterloggingTab}</span>
          </button>

          <button
            onClick={handleLocateMe}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            title="Locate Me"
            aria-label="Locate Me"
          >
            <Navigation className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* Mobile Filter Chips */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-sm border border-slate-200 pointer-events-auto space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search road, ward or area..."
              className="w-full pl-8 pr-7 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
            />
          </div>

          {viewMode === 'issues' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap text-[11px] ${
                  categoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter('pothole')}
                className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap text-[11px] ${
                  categoryFilter === 'pothole' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                }`}
              >
                Potholes
              </button>
              <button
                onClick={() => setCategoryFilter('garbage')}
                className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap text-[11px] ${
                  categoryFilter === 'garbage' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                Garbage
              </button>
              <button
                onClick={() => setCategoryFilter('streetlight')}
                className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap text-[11px] ${
                  categoryFilter === 'streetlight' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'
                }`}
              >
                Lights
              </button>
              <button
                onClick={() => setCategoryFilter('drain')}
                className={`px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap text-[11px] ${
                  categoryFilter === 'drain' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'
                }`}
              >
                Drains
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-700 shrink-0">
                {MONTH_NAMES[selectedMonth - 1].split(' ')[0]}
              </span>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= LEAFLET MAP CONTAINER ================= */}
      <div className="flex-1 h-full w-full relative z-10">
        <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
      </div>

      {/* ================= MOBILE BOTTOM SHEET CARDS (<lg) ================= */}
      <div className="lg:hidden">
        {selectedIssue && (
          <div className="absolute bottom-20 inset-x-3 z-30 max-w-md mx-auto bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedIssue.category}
                  </span>
                  <SeverityMeter severity={selectedIssue.severity} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {selectedIssue.location}
                </h3>
                <p className="text-[11px] text-blue-700 font-semibold">
                  {selectedIssue.road_name} • {selectedIssue.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              {selectedIssue.description}
            </p>
            {onReportHere && (
              <button
                onClick={() => {
                  onReportHere(selectedIssue.location, { lat: selectedIssue.lat, lng: selectedIssue.lng });
                }}
                className="mt-3 w-full h-10 bg-[#0B3C7A] hover:bg-[#072B56] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Report an Issue at this Location</span>
              </button>
            )}
          </div>
        )}

        {selectedWaterlog && (
          <div className="absolute bottom-20 inset-x-3 z-30 max-w-md mx-auto bg-white rounded-2xl p-4 shadow-xl border border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                    {selectedWaterlog.ward}
                  </span>
                  <SeverityMeter severity={selectedWaterlog.severity} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {selectedWaterlog.area_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWaterlog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">{t.estDepth}</span>
                <span className="text-sm font-extrabold text-blue-950">{selectedWaterlog.water_depth_cm} cm</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.clearanceDuration}</span>
                <span className="text-sm font-extrabold text-slate-800">~{selectedWaterlog.duration_hours} hrs</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-xs">
              <span className="text-[10px] font-bold text-amber-900 uppercase block">{t.trafficAdvisory}</span>
              <p className="text-amber-950 font-medium leading-tight">{selectedWaterlog.traffic_impact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
