const detailRequests = new Map();

/** Load the human-written CAP headline/description once per alert. */
export function getAlertDetails(alert) {
  if (alert?.kind !== 'cap' || !alert.identifier) return Promise.resolve(null);

  const key = alert.identifier;
  if (!detailRequests.has(key)) {
    const request = fetch(`/api/alerts/cap/${encodeURIComponent(key)}`, { cache: 'force-cache' })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null);
    detailRequests.set(key, request);
  }
  return detailRequests.get(key);
}

export function readableAlertTitle(alert, details) {
  const text = details?.headline || details?.description;
  if (text && typeof text === 'string') {
    return text.replace(/\s+/g, ' ').trim();
  }
  return alert?.title || alert?.event || 'Emergency alert';
}
