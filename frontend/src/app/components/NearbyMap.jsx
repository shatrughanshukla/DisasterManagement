'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const CATEGORY_COLORS = {
  hospital: '#B5372F',
  police: '#1E3A5F',
  fire_station: '#D9645B',
  shelter: '#4E7A3F',
};

export default function NearbyMap({ userLocation, places, activeId, onSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const leafletRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current || mapInstance.current) return;
      leafletRef.current = L;

      const map = L.map(mapRef.current).setView(
        [userLocation.lat, userLocation.lon],
        14
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.circleMarker([userLocation.lat, userLocation.lon], {
        radius: 8,
        color: '#F4C430',
        fillColor: '#F4C430',
        fillOpacity: 1,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip('You are here');

      mapInstance.current = map;
    }

    init();
    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [userLocation.lat, userLocation.lon]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstance.current;
    if (!L || !map) return;

    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    places.forEach((p) => {
      const color = CATEGORY_COLORS[p.category] || '#1E3A5F';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const marker = L.marker([p.lat, p.lon], { icon }).addTo(map);
      marker.bindTooltip(p.name);
      marker.on('click', () => onSelect && onSelect(p.id));
      markersRef.current[p.id] = marker;
    });
  }, [places, onSelect]);

  useEffect(() => {
    const map = mapInstance.current;
    const marker = markersRef.current[activeId];
    if (map && marker) {
      map.panTo(marker.getLatLng());
      marker.openTooltip();
    }
  }, [activeId]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '420px' }}
      role="img"
      aria-label="Map showing nearby hospitals, police stations, fire stations, and shelters"
    />
  );
}
