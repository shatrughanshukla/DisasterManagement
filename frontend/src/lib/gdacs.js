// src/lib/gdacs.js
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

const sevFromTitle = (t='') => {
  const s = t.toLowerCase();
  if (s.includes('red')) return 'Red';
  if (s.includes('orange')) return 'Orange';
  if (s.includes('green')) return 'Green';
  return 'Unknown';
};

function shortId(str) {
  let hash = 2166136261;
  for (const char of String(str)) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
function asArray(x){ return Array.isArray(x) ? x : (x ? [x] : []); }

export async function getGdacsFloods(limit = 3) {
  const rssUrl = import.meta.env.VITE_GDACS_FLOOD_RSS;
  if (!rssUrl) throw new Error('GDACS_FLOOD_RSS not set');

  const res = await fetch(rssUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GDACS RSS failed: ${res.status}`);
  const xml = await res.text();
  const json = parser.parse(xml);

  // take more, we'll filter later
  const items = asArray(json?.rss?.channel?.item);

  const normalized = items.map(i => {
    const title = i.title || 'Flood alert';
    const link = i.link;
    const pubDate = i.pubDate || null;

    // Try to find coordinates in multiple possible tags
    let coords = null;
    const point = i['georss:point']; // "lat lon"
    if (typeof point === 'string') {
      const [latStr, lonStr] = point.trim().split(/\s+/);
      const lat = parseFloat(latStr), lon = parseFloat(lonStr);
      if (Number.isFinite(lat) && Number.isFinite(lon)) coords = [lon, lat];
    }
    const geoLat = parseFloat(i['geo:lat']);
    const geoLon = parseFloat(i['geo:long']);
    if (!coords && Number.isFinite(geoLat) && Number.isFinite(geoLon)) {
      coords = [geoLon, geoLat];
    }

    // Country can appear in various fields; keep it flexible
    const country =
      i['gdacs:country'] ||
      i['gdacs:countryshortname'] ||
      (typeof i.category === 'string' ? i.category : '');

    return {
      kind: 'flood',
      id: shortId(link || title),
      title,
      time: pubDate ? new Date(pubDate).toISOString() : null,
      location: (typeof i.category === 'string') ? i.category : (i['gdacs:country'] || '—'),
      severity: sevFromTitle(title),
      link,
      country: country || '',
      coords, // [lon, lat] when available
    };
  });

  // don't slice yet; let the caller or API route filter first
  return normalized.slice(0, Math.max(limit, 50)); // a bit more headroom
}
