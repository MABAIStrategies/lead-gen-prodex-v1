import { NextResponse } from 'next/server';
import { enrichSingleLead } from '@/lib/actions/enrichment-actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await enrichSingleLead(body);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 400 }
    );
  }
}
