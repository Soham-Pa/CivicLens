import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MiniMapProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  zoom?: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  interactive = true,
  className = 'h-48 w-full rounded-xl overflow-hidden',
  zoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create custom pin icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; background: rgba(20, 184, 166, 0.25); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 22px; height: 22px; background: #0B1F3A; border: 2.5px solid #14B8A6; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; background: #14B8A6; border-radius: 9999px;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([latitude, longitude], {
        icon: customIcon,
        draggable: interactive && !!onLocationChange,
      }).addTo(map);

      if (interactive && onLocationChange) {
        marker.on('dragend', (e) => {
          const newPos = (e.target as L.Marker).getLatLng();
          onLocationChange(newPos.lat, newPos.lng);
        });

        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          onLocationChange(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], zoom);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update view when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([latitude, longitude]);
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className={`${className} z-0`} />
      {interactive && (
        <div className="absolute bottom-2 right-2 z-10 bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-200 px-2 py-1 rounded-md shadow-xs pointer-events-none">
          Click or drag pin to adjust location
        </div>
      )}
    </div>
  );
};
