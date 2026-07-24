import Link from 'next/link';
import FormattedTime from '../../components/FormattedTime';

function severityClasses(sev = '') {
  const k = String(sev).toLowerCase();
  if (k === 'extreme') return 'bg-red-100 text-red-800 border-red-200';
  if (k === 'severe')  return 'bg-orange-100 text-orange-800 border-orange-200';
  if (k === 'moderate')return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (k === 'minor')   return 'bg-green-100 text-green-800 border-green-200';
  return 'bg-orange-100 text-orange-800 border-orange-200'; // default to Severe styling
}

export default function NotificationCard({ alert }) {
  const isExternal = alert.link && /^https?:\/\//i.test(alert.link);

  const internalHref =
    alert.kind === 'earthquake' ? `/earthquakes/${alert.id}` :
    alert.kind === 'flood'      ? `/floods/${alert.id}` :
    (alert.kind === 'cap' && alert.identifier) ? `/alerts/cap/${encodeURIComponent(alert.identifier)}` :
    null;

  const Wrapper = ({children}) => {
    const base =
      "block rounded-lg border p-2 bg-white hover:bg-gray-50 transition shadow-sm";
    if (isExternal) {
      return (
        <a href={alert.link} target="_blank" rel="noopener noreferrer" className={base}>
          {children}
        </a>
      );
    }
    if (internalHref) {
      return (
        <Link href={internalHref} className={base} prefetch>
          {children}
        </Link>
      );
    }
    return <div className={base}>{children}</div>;
  };

  const sevClass = severityClasses(alert.severity);

  return (
    <Wrapper>
      <div className="flex items-start justify-between gap-2">
        <strong className="font-semibold text-xs leading-5 text-gray-900 line-clamp-2">
          {alert.title}
        </strong>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border ${sevClass}`}>
          {alert.severity || 'Severe'}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-700">
        <time className="whitespace-nowrap">
          <FormattedTime time={alert.time} format="date" />
        </time>
        <span>•</span>
        <span className="truncate">📍 {alert.location || '—'}</span>
      </div>
    </Wrapper>
  );
}
