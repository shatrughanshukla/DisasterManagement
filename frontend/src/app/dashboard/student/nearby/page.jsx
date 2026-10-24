'use client';

import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import DashboardHeader from '@/app/components/DashboardHeader';
import { useAuth } from '../../../context/AuthContext';
import { FaHospital, FaShieldAlt, FaFireExtinguisher, FaHome, FaLocationArrow } from 'react-icons/fa';

const NearbyMap = lazy(() => import('@/app/components/NearbyMap'));

const CATEGORIES = [
  { key: 'all', label: 'All', icon: FaLocationArrow },
  { key: 'hospital', label: 'Hospitals', icon: FaHospital },
  { key: 'police', label: 'Police', icon: FaShieldAlt },
  { key: 'fire_station', label: 'Fire stations', icon: FaFireExtinguisher },
  { key: 'shelter', label: 'Shelters', icon: FaHome },
];

const CATEGORY_LABEL = {
  hospital: 'Hospital',
  police: 'Police',
  fire_station: 'Fire station',
  shelter: 'Shelter',
};

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export default function NearbyPage() {
  const { user, logout } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Your browser doesn\u2019t support location. Showing New Delhi as a default.');
      setUserLocation({ lat: 28.6139, lon: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setLocationError('Location access denied. Showing New Delhi as a default \u2014 allow location access and reload to see your area.');
        setUserLocation({ lat: 28.6139, lon: 77.209 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const fetchPlaces = useCallback(async (loc) => {
    setLoadingPlaces(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/nearby?lat=${loc.lat}&lon=${loc.lon}&radius=5000`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Nearby places request failed (HTTP ${res.status}).`);
      const mapped = (json.elements || [])
        .map((el) => {
          let category = null;
          if (
            el.tags?.amenity === 'hospital' ||
            el.tags?.healthcare === 'hospital' ||
            el.tags?.amenity === 'clinic' ||
            el.tags?.healthcare === 'clinic'
          ) category = 'hospital';
          else if (el.tags?.amenity === 'police') category = 'police';
          else if (el.tags?.amenity === 'fire_station') category = 'fire_station';
          else if (
            el.tags?.emergency === 'assembly_point' ||
            el.tags?.amenity === 'shelter' ||
            el.tags?.social_facility === 'shelter' ||
            el.tags?.['emergency:social_facility'] === 'shelter' ||
            el.tags?.evacuation_center === 'yes'
          ) category = 'shelter';
          if (!category) return null;
          const point = el.center || el;
          if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return null;
          return {
            id: el.id,
            category,
            name: el.tags?.name || CATEGORY_LABEL[category],
            lat: point.lat,
            lon: point.lon,
            distanceKm: haversineKm(loc, { lat: point.lat, lon: point.lon }),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm);
      setPlaces(mapped);
    } catch (err) {
      console.error('Nearby places request failed:', err);
      setFetchError(err.message && err.message !== 'Failed to fetch'
        ? err.message
        : 'Couldn\u2019t connect to the nearby places service. Please try again.');
    } finally {
      setLoadingPlaces(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) fetchPlaces(userLocation);
  }, [userLocation, fetchPlaces]);

  const filtered = useMemo(
    () => (filter === 'all' ? places : places.filter((p) => p.category === filter)),
    [places, filter]
  );

  return (
    <>
      <DashboardHeader user={user} logout={logout} />
      <div className="min-h-screen font-body p-4 sm:px-6 lg:px-8" style={{ background: '#F4F1E8' }}>
        <div className="max-w-7xl mx-auto space-y-4 py-4">
          <div>
            <h1 className="font-display text-xl md:text-2xl" style={{ color: '#1E3A5F' }}>
              Nearby shelters and emergency services
            </h1>
            <p className="text-sm mt-1" style={{ color: '#5A6B7A' }}>
              Hospitals, police, fire stations, and evacuation points within 5 km.
            </p>
          </div>

          {locationError && (
            <div
              className="rounded-lg px-4 py-2 text-sm"
              style={{ background: '#FBE7A1', color: '#5A4200' }}
            >
              {locationError}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors border"
                  style={
                    active
                      ? { background: '#1E3A5F', color: '#F4F1E8', borderColor: '#1E3A5F' }
                      : { background: 'white', color: '#1E3A5F', borderColor: '#E8E2CF' }
                  }
                >
                  <Icon size={13} aria-hidden="true" />
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
            <div className="bg-white rounded-xl border-2 p-3 overflow-y-auto" style={{ borderColor: '#E8E2CF', maxHeight: '520px' }}>
              {loadingPlaces && <p className="text-sm p-3" style={{ color: '#5A6B7A' }}>Finding nearby places...</p>}
              {fetchError && (
                <div className="p-3">
                  <p className="text-sm" style={{ color: '#B5372F' }}>{fetchError}</p>
                  <button
                    type="button"
                    onClick={() => userLocation && fetchPlaces(userLocation)}
                    className="mt-2 rounded-md px-3 py-1.5 text-sm font-medium"
                    style={{ background: '#1E3A5F', color: '#F4F1E8' }}
                  >
                    Try again
                  </button>
                </div>
              )}
              {!loadingPlaces && !fetchError && filtered.length === 0 && (
                <p className="text-sm p-3" style={{ color: '#5A6B7A' }}>Nothing found in this category nearby.</p>
              )}
              <ul className="space-y-2">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveId(p.id)}
                      className="w-full text-left rounded-lg p-3 border transition-colors"
                      style={
                        activeId === p.id
                          ? { borderColor: '#B5372F', background: '#FAECE7' }
                          : { borderColor: '#E8E2CF', background: 'white' }
                      }
                    >
                      <p className="text-sm font-medium" style={{ color: '#1E3A5F' }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#5A6B7A' }}>
                        {CATEGORY_LABEL[p.category]} &middot; {p.distanceKm.toFixed(1)} km away
                      </p>
                      <a
                        href={`https://www.openstreetmap.org/directions?to=${p.lat}%2C${p.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs mt-1 font-medium"
                        style={{ color: '#B5372F' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Get directions
                      </a>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: '#E8E2CF', minHeight: '420px' }}>
              {userLocation && (
                <Suspense fallback={<div className="flex items-center justify-center" style={{ minHeight: '420px' }}>Loading map...</div>}>
                  <NearbyMap
                    userLocation={userLocation}
                    places={filtered}
                    activeId={activeId}
                    onSelect={setActiveId}
                  />
                </Suspense>
              )}
            </div>
          </div>
          <p className="text-xs text-right" style={{ color: '#5A6B7A' }}>
            Place data by <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer" className="underline">Geoapify</a> and <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap contributors</a>.
          </p>
        </div>
      </div>
    </>
  );
}
