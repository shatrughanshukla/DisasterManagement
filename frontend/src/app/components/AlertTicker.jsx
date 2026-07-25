'use client';

import { useEffect, useState } from 'react';

function severityColor(sev = '') {
  const k = String(sev).toLowerCase();
  if (k === 'extreme') return '#D9645B';
  if (k === 'severe') return '#F4C430';
  if (k === 'moderate') return '#F4C430';
  return '#8FA8C4';
}

export default function AlertTicker() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' });
        const json = await res.json();
        if (active) setItems(json.items || []);
      } catch {
        if (active) setItems([]);
      }
    };
    load();
    const iv = setInterval(load, 60000);
    return () => { active = false; clearInterval(iv); };
  }, []);

  const hasAlerts = items && items.length > 0;
  const feed = hasAlerts ? items : [{ title: 'No active alerts in your area', severity: 'clear' }];
  const doubled = [...feed, ...feed];

  return (
    <div
      className="w-full overflow-hidden rounded-lg border border-navy-dark"
      style={{ background: '#142944' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-stretch">
        <div
          className="flex items-center gap-2 px-3 py-2 flex-none font-body font-semibold text-xs uppercase tracking-wider"
          style={{ background: '#B5372F', color: '#F4F1E8' }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: '#F4C430', animation: hasAlerts ? 'pulse 1.4s infinite' : 'none' }}
            aria-hidden="true"
          />
          Live
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex whitespace-nowrap ticker-track" style={{ width: 'max-content' }}>
            {doubled.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body"
                style={{ color: '#F4F1E8' }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-none"
                  style={{ background: severityColor(a.severity) }}
                  aria-hidden="true"
                />
                {a.title}
                {a.location ? <span style={{ color: '#8FA8C4' }}>&nbsp;· {a.location}</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
