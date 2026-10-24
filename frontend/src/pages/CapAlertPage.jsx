import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from '../lib/dateUtils';

function badgeColor(severity = '') {
  const value = severity.toLowerCase();
  if (value === 'extreme') return 'bg-red-100 text-red-700';
  if (value === 'severe') return 'bg-orange-100 text-orange-700';
  if (value === 'moderate') return 'bg-yellow-100 text-yellow-800';
  if (value === 'minor') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
}

export default function CapAlertPage() {
  const { identifier } = useParams();
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/alerts/cap/${encodeURIComponent(identifier)}`)
      .then((response) => {
        if (!response.ok) throw new Error('Alert not found');
        return response.json();
      })
      .then((data) => { if (active) setAlert(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [identifier]);

  if (error) return <div className="max-w-3xl mx-auto p-4"><h1 className="text-xl font-semibold">Alert not found</h1><p className="text-sm text-gray-600">Identifier: {identifier}</p><Link to="/" className="text-blue-600">Home</Link></div>;
  if (!alert) return <div className="max-w-3xl mx-auto p-4">Loading alert…</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">{alert.headline || alert.event}</h1>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${badgeColor(alert.severity)}`}>{alert.severity}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p><b>Event:</b> {alert.event}</p>
          <p><b>Issued:</b> {formatDate(alert.sent, 'en-IN')}</p>
          <p><b>Effective:</b> {formatDate(alert.effective, 'en-IN')}</p>
          <p><b>Onset:</b> {formatDate(alert.onset, 'en-IN')}</p>
          <p><b>Expires:</b> {formatDate(alert.expires, 'en-IN')}</p>
          <p><b>Urgency/Certainty:</b> {[alert.urgency, alert.certainty].filter(Boolean).join(' / ') || '—'}</p>
          <p><b>Sender:</b> {alert.sender || '—'}</p>
          <p><b>Identifier:</b> {identifier}</p>
        </div>
        {alert.description && <div className="mt-4"><h2 className="font-semibold text-gray-800">Description</h2><p className="text-gray-700 mt-1 whitespace-pre-line">{alert.description}</p></div>}
        {alert.instruction && <div className="mt-4"><h2 className="font-semibold text-gray-800">Instructions</h2><p className="text-gray-700 mt-1 whitespace-pre-line">{alert.instruction}</p></div>}
        {!!alert.areas?.length && <div className="mt-4"><h2 className="font-semibold text-gray-800">Affected Areas</h2><ul className="list-disc list-inside text-gray-700 mt-1">{alert.areas.map((area, index) => <li key={index}>{area}</li>)}</ul></div>}
        <div className="mt-6 flex items-center gap-3 text-sm">
          <a href={alert.xmlUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View original CAP XML</a>
          <span className="text-gray-300">•</span>
          <a href="https://sachet.ndma.gov.in/Dashboard" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Open SACHET Dashboard</a>
        </div>
      </div>
    </div>
  );
}
