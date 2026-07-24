// src/lib/usgs.js
import 'server-only';

function severityFromMag(m) {
  if (m == null) return 'Unknown';
  if (m >= 7) return 'Extreme';
  if (m >= 6) return 'Severe';
  if (m >= 5) return 'Moderate';
  return 'Minor';
}

export async function getUsgsQuakes(limit = 3) {
  const url = process.env.USGS_FEED_URL;
  if (!url) throw new Error('USGS_FEED_URL not set');

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`USGS feed failed: ${res.status}`);
  const json = await res.json(); // GeoJSON FeatureCollection

  const features = Array.isArray(json?.features) ? json.features : [];
  // newest first
  features.sort((a, b) => (b?.properties?.time || 0) - (a?.properties?.time || 0));

  return features.slice(0, limit).map(f => {
    const p = f.properties ?? {};
    const g = f.geometry ?? {};
    const mag = p.mag ?? null;
    return {
      kind: 'earthquake',
      id: f.id,                     // stable USGS id
      title: p.title || `M${mag} – ${p.place || 'Earthquake'}`,
      time: p.time ? new Date(p.time).toISOString() : null,
      location: p.place || '—',
      magnitude: mag,
      severity: severityFromMag(mag),
      link: p.url,                  // human page
      detailUrl: p.detail,          // per-event JSON detail
      coords: g.coordinates || null // [lon, lat, depth]
    };
  });
}

/** Per-event JSON (via USGS detail/FDSN). */
export async function getUsgsQuakeById(id) {
  // USGS provides a per-event GeoJSON detail; you can either use properties.detail
  // or query FDSN with eventid:
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventid=${encodeURIComponent(id)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const f = await res.json(); // a GeoJSON Feature
  const p = f?.properties ?? {};
  const g = f?.geometry ?? {};
  const mag = p.mag ?? null;
  return {
    kind: 'earthquake',
    id: f?.id || id,
    title: p.title || `M${mag} – ${p.place || 'Earthquake'}`,
    time: p.time ? new Date(p.time).toISOString() : null,
    location: p.place || '—',
    magnitude: mag,
    severity: severityFromMag(mag),
    link: p.url,
    detailUrl: p.detail,
    coords: g?.coordinates || null,
    products: p.products || {}
  };
}
