import 'server-only';
import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  trimValues: true,
  textNodeName: '#text',
});

function asArray(x){ return Array.isArray(x) ? x : (x ? [x] : []); }
function shortId(str){ return crypto.createHash('sha1').update(String(str || '')).digest('hex').slice(0,16); }
function pickText(x){
  if (x == null) return null;
  if (typeof x === 'string' || typeof x === 'number') return String(x);
  if (typeof x === 'object') return x['#text'] || x._text || x.value || null;
  return null;
}
function capSeverityToBadge(s){
  const k = String(s || '').toLowerCase();
  if (k === 'extreme') return 'Extreme';
  if (k === 'severe')  return 'Severe';
  if (k === 'moderate')return 'Moderate';
  if (k === 'minor')   return 'Minor';
  return 'Severe';
}
/** polygon "lat,lon lat,lon ..." -> centroid [lon,lat] */
function centroidFromPolygon(polyStr=''){
  const pts = polyStr.trim().split(/\s+/).map(p=>{
    const [lat, lon] = p.split(',').map(Number);
    return [lon, lat];
  }).filter(([lon,lat])=>Number.isFinite(lon)&&Number.isFinite(lat));
  if (!pts.length) return null;
  const [sl, sb] = pts.reduce(([a,b],[lon,lat])=>[a+lon,b+lat],[0,0]);
  return [sl/pts.length, sb/pts.length];
}
/** circle "lat,lon radiusKm" -> [lon,lat] */
function centerFromCircle(circleStr=''){
  const m = circleStr.trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const lat = parseFloat(m[1]), lon = parseFloat(m[2]);
  return (Number.isFinite(lat) && Number.isFinite(lon)) ? [lon, lat] : null;
}
function buildXmlUrl(identifier){
  if (!identifier) return null;
  // Use the FULL identifier (keep the IN- prefix)
  return `https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=${encodeURIComponent(identifier)}`;
}
async function fetchWithTimeout(url, ms=4000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), ms);
  try{
    const res = await fetch(url, { signal: ctrl.signal, next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}
function isEnglishLangCode(v = '') {
  const s = String(v).trim().toLowerCase();
  if (!s) return false;
  // matches: en, en-in, en_us, english, etc.
  return s === 'en' || s.startsWith('en-') || s.startsWith('en_') || s === 'english';
}

function looksEnglish(text = '') {
  const s = String(text || '').trim();
  if (!s) return false;
  // crude but fast: ratio of basic ASCII letters, digits, spaces, and common punctuations
  const ascii = s.match(/[A-Za-z0-9 ,.;:!?'()"“”‘’\-–—\/\\]/g)?.length || 0; // note: escaped /
  const total = s.length;
  return ascii / total >= 0.75; // at least 75% ASCII-ish
}

/**
 * Fetch NDMA CAP (RSS) → normalize → enrich top N from the CAP XML.
 * - Picks English info block when available (en or en-IN)
 * - ALWAYS overrides severity & location from XML (so no "Unknown")
 */
export async function getNdmaCapAlerts(limit = 5){
  const rssUrl = process.env.NDMA_CAP_RSS;
  if (!rssUrl) throw new Error('NDMA_CAP_RSS not set');

  const res = await fetch(rssUrl, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`NDMA RSS failed: ${res.status}`);

  const xml = await res.text();
  const j = parser.parse(xml);
  const items = asArray(j?.rss?.channel?.item);

  const base = items.map(i => {
    const identifier = pickText(i['cap:identifier']) || pickText(i.guid);
    const sent = pickText(i['cap:sent']) || pickText(i.pubDate) || null;

    // Try coordinates if present in RSS (rare)
    let coords = null;
    const poly = pickText(i['cap:polygon']) || pickText(i['cap:area']?.['cap:polygon']);
    const circle = pickText(i['cap:circle']) || pickText(i['cap:area']?.['cap:circle']);
    if (poly) coords = centroidFromPolygon(poly);
    if (!coords && circle) coords = centerFromCircle(circle);

    const xmlUrl = buildXmlUrl(identifier);
    const humanUrl = pickText(i.link) || null;

    // React-safe unique key
    const uid = shortId(`${identifier || ''}|${sent || ''}`);

    return {
      kind: 'cap',
      uid,                          // Use this in React keys
      id: identifier || uid,
      identifier: identifier || null,
      title: pickText(i.title) || 'Alert', // will be replaced by English headline from XML
      time: sent ? new Date(sent).toISOString() : null,
      location: '—',                // will be filled from XML
      severity: 'Unknown',          // will be overridden by XML
      link: humanUrl || xmlUrl,     // keep something clickable
      xmlUrl,
      coords,
      event: '',
    };
  });

  base.sort((a,b)=>new Date(b.time||0)-new Date(a.time||0));
  const top = base.slice(0, limit);

  // Enrich from CAP XML (prefer English block)
  await Promise.allSettled(top.map(async a => {
    if (!a.xmlUrl) return;
    try {
      const capXml = await fetchWithTimeout(a.xmlUrl, 10000);
      const capJ = parser.parse(capXml);
      const alert = capJ?.['cap:alert'] || {};
      const infosRaw = alert?.['cap:info'];
      const infos = Array.isArray(infosRaw) ? infosRaw : (infosRaw ? [infosRaw] : []);

      const langOf = (inf) => pickText(inf?.['cap:language']) || '';
      const headOf = (inf) => pickText(inf?.['cap:headline']) || '';
      const areaOf = (inf) => {
        const areaRaw = inf?.['cap:area'];
        const areas = Array.isArray(areaRaw) ? areaRaw : (areaRaw ? [areaRaw] : []);
        return pickText(areas[0]?.['cap:areaDesc']) || '';
      };

      // Rank infos: explicit English first, then those that "look English", then others
      const ranked = [...infos].sort((x, y) => {
        const xe = isEnglishLangCode(langOf(x)) ? 2 : looksEnglish(headOf(x) + ' ' + areaOf(x)) ? 1 : 0;
        const ye = isEnglishLangCode(langOf(y)) ? 2 : looksEnglish(headOf(y) + ' ' + areaOf(y)) ? 1 : 0;
        return ye - xe; // higher score first
      });

      const info = ranked[0] || {};
      const sevRaw = pickText(info?.['cap:severity']);
      const ev = pickText(info?.['cap:event']) || 'Alert';
      const head = headOf(info);
      const areaDesc = areaOf(info);

      // ALWAYS override from XML; default severity to 'Severe' when missing/unknown
      a.severity = capSeverityToBadge(sevRaw);  // defaults unknown -> 'Severe'
      a.event = ev;
      a.title = head || (areaDesc ? `${ev} – ${areaDesc}` : ev);
      a.location = areaDesc || a.location;

      // mark language for filtering: explicit code OR heuristic
      const code = langOf(info);
      a._isEnglish = isEnglishLangCode(code) || looksEnglish(a.title + ' ' + a.location);
    } catch {
      // On enrichment failure, be conservative: not English
      a._isEnglish = false;
      // still normalize severity in case upstream set something odd
      a.severity = capSeverityToBadge(a.severity);
    }
  }));

  // Return English only (explicit 'en*' or looks-English heuristic)
  const englishOnly = top.filter(a => !!a._isEnglish);

  return englishOnly;
} // <-- missing brace added here
