import { NextResponse } from 'next/server';
import { saveProviderCredential } from '@/lib/actions/enrichment-actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey, isEnabled } = body;

    const result = await saveProviderCredential(provider, apiKey, isEnabled);
    return NextResponse.json({ ok: true, credentialId: result.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 400 }
    );
  }
}
