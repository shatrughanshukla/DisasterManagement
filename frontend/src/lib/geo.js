// Rough-but-practical India bounds (incl. Lakshadweep + Andaman & Nicobar)
const INDIA_BBOX = { minLat: 6.0, maxLat: 37.2, minLon: 68.0, maxLon: 97.6 };

export function isInIndia(coords, locationText, countryLike) {
  // coords: [lon, lat, ...]
  if (Array.isArray(coords) && coords.length >= 2) {
    const [lon, lat] = coords;
    if (
      lat >= INDIA_BBOX.minLat && lat <= INDIA_BBOX.maxLat &&
      lon >= INDIA_BBOX.minLon && lon <= INDIA_BBOX.maxLon
    ) return true;
  }

  const s = String(locationText || '').toLowerCase();
  if (s.includes('india')) return true;

  const c = String(countryLike || '').toLowerCase();
  if (c === 'india' || c === 'in') return true;

  return false;
}
