const express = require('express');

const router = express.Router();
const GEOAPIFY_URL = 'https://api.geoapify.com/v2/places';
const CATEGORIES = [
  'healthcare.hospital',
  'healthcare.clinic_or_praxis',
  'service.police',
  'service.fire_station',
  'service.social_facility.shelter',
  'emergency.assembly_point',
  'emergency.disaster_help_point',
];
const CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_TTL_MS = 24 * 60 * 60 * 1000;
const responseCache = new Map();
const pendingRequests = new Map();

function cacheKey(lat, lon, radius) {
  // Requests within about 100 m can safely share the same nearby results.
  return `${lat.toFixed(3)}:${lon.toFixed(3)}:${radius}`;
}

function trimCache() {
  const now = Date.now();
  for (const [key, value] of responseCache) {
    if (now - value.savedAt > STALE_TTL_MS) responseCache.delete(key);
  }
  while (responseCache.size > 300) responseCache.delete(responseCache.keys().next().value);
}

function toNearbyElement(feature) {
  const properties = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const [lon, lat] = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const categories = Array.isArray(properties.categories) ? properties.categories : [];
  let category;
  let tags;
  if (categories.some((value) => value === 'healthcare.hospital' || value.startsWith('healthcare.clinic_or_praxis'))) {
    category = 'hospital';
    tags = { amenity: 'hospital' };
  } else if (categories.includes('service.police')) {
    category = 'police';
    tags = { amenity: 'police' };
  } else if (categories.includes('service.fire_station')) {
    category = 'fire_station';
    tags = { amenity: 'fire_station' };
  } else if (categories.some((value) => (
    value === 'service.social_facility.shelter' ||
    value === 'emergency.assembly_point' ||
    value === 'emergency.disaster_help_point'
  ))) {
    category = 'shelter';
    tags = { emergency: 'assembly_point' };
  } else {
    return null;
  }

  const id = properties.place_id || `${category}:${lat}:${lon}`;
  return {
    id,
    type: 'node',
    lat,
    lon,
    tags: {
      ...tags,
      name: properties.name || properties.address_line1 || category.replace('_', ' '),
    },
  };
}

async function fetchNearby(lat, lon, radius) {
  // Geoapify's GET endpoint requires apiKey in the query string. POST supports
  // the x-api-key header, so use its structured request form to keep the key
  // out of URLs and access logs.
  const response = await fetch(GEOAPIFY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.GEOAPIFY_API_KEY,
    },
    body: JSON.stringify({
      categories: CATEGORIES,
      filter: { type: 'circle', lon, lat, radius },
      bias: { type: 'proximity', lon, lat },
      limit: 500,
      lang: 'en',
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(`Geoapify returned HTTP ${response.status}${body.message ? `: ${body.message}` : ''}`);
    error.providerStatus = response.status;
    throw error;
  }

  const result = await response.json();
  if (!Array.isArray(result.features)) throw new Error('Geoapify returned an invalid places response');
  return { elements: result.features.map(toNearbyElement).filter(Boolean) };
}

router.get('/', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radius = Math.min(Math.max(Number(req.query.radius) || 5000, 500), 5000);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return res.status(400).json({ error: 'A valid location is required.' });
  }

  if (!process.env.GEOAPIFY_API_KEY) {
    return res.status(503).json({ error: 'Nearby places are not configured. Add GEOAPIFY_API_KEY to the backend environment.' });
  }

  const key = cacheKey(lat, lon, radius);
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    return res.set('Cache-Control', 'private, max-age=60, stale-if-error=86400').json(cached.data);
  }

  if (pendingRequests.has(key)) {
    try {
      const data = await pendingRequests.get(key);
      return res.set('Cache-Control', 'private, max-age=60, stale-if-error=86400').json(data);
    } catch {
      if (cached && Date.now() - cached.savedAt < STALE_TTL_MS) {
        return res.set('Cache-Control', 'private, max-age=60, stale-if-error=86400').json(cached.data);
      }
    }
  }

  let request;
  try {
    request = fetchNearby(lat, lon, radius);
    pendingRequests.set(key, request);
    const data = await request;
    responseCache.set(key, { data, savedAt: Date.now() });
    trimCache();
    return res.set('Cache-Control', 'private, max-age=60, stale-if-error=86400').json(data);
  } catch (error) {
    console.error('Geoapify nearby places lookup failed:', error.message);
    if (cached && Date.now() - cached.savedAt < STALE_TTL_MS) {
      return res.set('Cache-Control', 'private, max-age=60, stale-if-error=86400').json(cached.data);
    }
    const status = error.name === 'TimeoutError' || error.name === 'AbortError' ? 504 : 502;
    let message = 'Nearby places are temporarily unavailable. Please try again.';
    if (error.providerStatus === 401 || error.providerStatus === 403) {
      message = 'Geoapify rejected the API key. Check that GEOAPIFY_API_KEY is valid and enabled for the Places API.';
    } else if (error.providerStatus === 429) {
      message = 'The Geoapify daily request limit has been reached. Please try again later or check the project quota.';
    } else if (error.providerStatus >= 400 && error.providerStatus < 500) {
      message = 'Geoapify rejected the nearby places search. Check the backend logs for the provider response.';
    } else if (status === 504) {
      message = 'The nearby places service took too long to respond. Please try again.';
    }
    return res.status(status).json({ error: message });
  } finally {
    if (pendingRequests.get(key) === request) pendingRequests.delete(key);
  }
});

module.exports = router;
