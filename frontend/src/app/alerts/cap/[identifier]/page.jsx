// src/app/alerts/cap/[identifier]/page.jsx
import { XMLParser } from 'fast-xml-parser';
import { formatServerDate } from '../../../../lib/serverDateUtils';

export const revalidate = 60;

function pickText(x) {
  if (x == null) return null;
  if (typeof x === 'string' || typeof x === 'number') return String(x);
  if (typeof x === 'object') return x['#text'] || x._text || x.value || null;
  return null;
}

function badgeColor(sev) {
  const s = String(sev || '').toLowerCase();
  if (s === 'extreme') return 'bg-red-100 text-red-700';
  if (s === 'severe')  return 'bg-orange-100 text-orange-700';
  if (s === 'moderate')return 'bg-yellow-100 text-yellow-800';
  if (s === 'minor')   return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
}

export default async function CapAlertPage({ params }) {
  const identifier = decodeURIComponent(params.identifier);
  const numeric = String(identifier).replace(/^IN-?/, '');
  const xmlUrl = `https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=${encodeURIComponent(numeric)}`;

  const res = await fetch(xmlUrl, { next: { revalidate: 60 } });
  if (!res.ok) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Alert not found</h1>
        <p className="text-sm text-gray-600">Identifier: {identifier}</p>
      </div>
    );
  }

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', trimValues: true, textNodeName: '#text' });
  const j = parser.parse(xml);
  const alert = j?.['cap:alert'] || {};
  const infoRaw = alert?.['cap:info'];
  const info = Array.isArray(infoRaw) ? infoRaw[0] : (infoRaw || {});
  const areaRaw = info?.['cap:area'];
  const areas = Array.isArray(areaRaw) ? areaRaw : (areaRaw ? [areaRaw] : []);

  const headline = pickText(info?.['cap:headline']) || `${pickText(info?.['cap:event']) || 'Alert'} – ${pickText(areas[0]?.['cap:areaDesc']) || ''}`;
  const event = pickText(info?.['cap:event']) || 'Alert';
  const severity = pickText(info?.['cap:severity']) || 'Unknown';
  const urgency = pickText(info?.['cap:urgency']) || '';
  const certainty = pickText(info?.['cap:certainty']) || '';
  const effective = pickText(info?.['cap:effective']);
  const onset = pickText(info?.['cap:onset']);
  const expires = pickText(info?.['cap:expires']);
  const desc = pickText(info?.['cap:description']) || '';
  const instr = pickText(info?.['cap:instruction']) || '';
  const sender = pickText(alert?.['cap:sender']);
  const sent = pickText(alert?.['cap:sent']);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">{headline}</h1>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${badgeColor(severity)}`}>
            {severity}
          </span>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          <p><span className="font-medium">Event:</span> {event}</p>
          <p><span className="font-medium">Issued:</span> {formatServerDate(sent, 'en-IN')}</p>
          <p><span className="font-medium">Effective:</span> {formatServerDate(effective, 'en-IN')}</p>
          <p><span className="font-medium">Onset:</span> {formatServerDate(onset, 'en-IN')}</p>
          <p><span className="font-medium">Expires:</span> {formatServerDate(expires, 'en-IN')}</p>
          <p><span className="font-medium">Urgency/Certainty:</span> {[urgency, certainty].filter(Boolean).join(' / ') || '—'}</p>
          <p><span className="font-medium">Sender:</span> {sender || '—'}</p>
          <p><span className="font-medium">Identifier:</span> {identifier}</p>
        </div>

        {desc && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-800">Description</h2>
            <p className="text-gray-700 mt-1 whitespace-pre-line">{desc}</p>
          </div>
        )}

        {instr && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-800">Instructions</h2>
            <p className="text-gray-700 mt-1 whitespace-pre-line">{instr}</p>
          </div>
        )}

        {!!areas.length && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-800">Affected Areas</h2>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              {areas.map((a, idx) => (
                <li key={idx}>{pickText(a?.['cap:areaDesc']) || '—'}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-sm">
          <a href={xmlUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View original CAP XML
          </a>
          <span className="text-gray-300">•</span>
          <a href="https://sachet.ndma.gov.in/Dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Open SACHET Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
