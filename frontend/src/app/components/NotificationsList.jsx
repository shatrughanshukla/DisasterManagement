'use client';

import { useEffect, useState } from 'react';
import NotificationCard from './NotificationCard';
import { getAlertDetails } from '../../lib/alertDetails';

export default function NotificationsList() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [detailsById, setDetailsById] = useState({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active) setItems((json.items || []));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load alerts');
      }
    };

    load();
    const iv = setInterval(load, 60000);
    return () => { active = false; clearInterval(iv); };
  }, []);

  useEffect(() => {
    let active = true;
    if (!items?.length) return () => { active = false; };
    Promise.all(items.map(async (item) => [item.identifier, await getAlertDetails(item)]))
      .then((results) => {
        if (active) setDetailsById(Object.fromEntries(results.filter(([id, details]) => id && details)));
      });
    return () => { active = false; };
  }, [items]);

  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;

  if (items === null) {
    return (
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-72 h-16 animate-pulse rounded-lg bg-gray-100 flex-none" />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) return <p className="text-sm text-gray-500">No recent alerts.</p>;

  // Single horizontal row, scrollable; compact cards with fixed width
  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]"
         style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex gap-3 flex-nowrap">
        {items.map(a => (
          <div key={a.uid || `${a.kind}-${a.id}`} className="w-72 flex-none">
            <NotificationCard alert={a} details={detailsById[a.identifier]} />
          </div>
        ))}
      </div>
    </div>
  );
}
