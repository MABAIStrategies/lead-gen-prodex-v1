import { NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/actions/enrichment-actions';

export async function GET() {
  const data = await fetchDashboardData();
  return NextResponse.json({ ok: true, data });
}
