import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { saveProviderCredential } from '@/lib/actions/enrichment-actions';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized: Authentication required to update credentials' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { provider, apiKey, isEnabled } = body as {
      provider?: string;
      apiKey?: string;
      isEnabled?: boolean;
    };

    if (!provider || !apiKey) {
      return NextResponse.json(
        { ok: false, error: 'Missing required credential fields' },
        { status: 400 }
      );
    }

    const result = await saveProviderCredential(provider, apiKey, isEnabled ?? true);
    return NextResponse.json({ ok: true, data: { id: result.id, provider: result.provider } }, { status: 200 });
  } catch (error) {
    console.error('[CREDENTIALS_API_ERROR]', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error during credential update' },
      { status: 500 }
    );
  }
}
