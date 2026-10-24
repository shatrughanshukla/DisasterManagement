const express = require('express');
const crypto = require('crypto');
const { XMLParser } = require('fast-xml-parser');

const router = express.Router();
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  trimValues: true,
  textNodeName: '#text',
});

function text(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return String(value['#text'] || value._text || value.value || '');
  return '';
}

router.get('/', async (_req, res) => {
  try {
    const response = await fetch('https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`NDMA returned HTTP ${response.status}`);
    const rows = await response.json();
    const items = rows.map((alert) => {
      const identifier = String(alert.identifier || '');
      const time = alert.effective_start_time && Number.isFinite(Date.parse(alert.effective_start_time))
        ? new Date(alert.effective_start_time).toISOString()
        : null;
      const xmlUrl = `https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=${encodeURIComponent(identifier)}`;
      return {
        kind: 'cap',
        uid: crypto.createHash('sha1').update(`${identifier}|${time || ''}`).digest('hex').slice(0, 16),
        id: identifier,
        identifier,
        title: alert.disaster_type || 'Alert',
        event: alert.disaster_type || 'Alert',
        time,
        location: alert.area_description || '—',
        severity: alert.severity || 'Unknown',
        link: `/api/alerts/cap/${encodeURIComponent(identifier)}`,
        xmlUrl,
        coords: null,
      };
    }).sort((a, b) => Date.parse(b.time || 0) - Date.parse(a.time || 0)).slice(0, 5);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300').json({ items });
  } catch (error) {
    console.error('NDMA alerts request failed:', error.message);
    res.status(200).json({ items: [], error: 'Alerts are temporarily unavailable.' });
  }
});

router.get('/cap/:identifier', async (req, res) => {
  const identifier = String(req.params.identifier || '');
  const numericIdentifier = identifier.replace(/^IN-?/, '');
  const xmlUrl = `https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=${encodeURIComponent(numericIdentifier)}`;
  try {
    const response = await fetch(xmlUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return res.status(404).json({ error: 'Alert not found' });
    const xml = await response.text();
    const alert = parser.parse(xml)?.['cap:alert'] || {};
    const infosRaw = alert['cap:info'];
    const infos = Array.isArray(infosRaw) ? infosRaw : (infosRaw ? [infosRaw] : []);
    const info = infos.find((item) => /^en(?:-|_|$)/i.test(text(item['cap:language']))) || infos[0] || {};
    const areaRaw = info['cap:area'];
    const areas = Array.isArray(areaRaw) ? areaRaw : (areaRaw ? [areaRaw] : []);
    const firstArea = areas[0] || {};
    res.json({
      identifier,
      xmlUrl,
      sender: text(alert['cap:sender']),
      sent: text(alert['cap:sent']),
      event: text(info['cap:event']) || 'Alert',
      headline: text(info['cap:headline']),
      severity: text(info['cap:severity']) || 'Unknown',
      urgency: text(info['cap:urgency']),
      certainty: text(info['cap:certainty']),
      effective: text(info['cap:effective']),
      onset: text(info['cap:onset']),
      expires: text(info['cap:expires']),
      description: text(info['cap:description']),
      instruction: text(info['cap:instruction']),
      areas: areas.map((area) => text(area['cap:areaDesc'])).filter(Boolean),
      area: text(firstArea['cap:areaDesc']),
    });
  } catch (error) {
    console.error('CAP alert fetch failed:', error.message);
    res.status(502).json({ error: 'Unable to load this alert right now.' });
  }
});

module.exports = router;
