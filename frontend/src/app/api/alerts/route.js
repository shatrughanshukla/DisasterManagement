// src/app/api/alerts/route.js
import { getNdmaCapAlerts } from '@/lib/ndma';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET() {
  try {
    // Only NDMA CAP; keep it lean (top 5)
    const items = await getNdmaCapAlerts(5);

    return Response.json(
      { items },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (e) {
    // Graceful failure: empty list (your UI already shows "No recent alerts.")
    return Response.json({ items: [], error: e.message }, { status: 200 });
  }
}
