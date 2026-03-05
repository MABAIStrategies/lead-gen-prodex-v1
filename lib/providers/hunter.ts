import { BaseProvider } from './base';
import type { EnrichmentInput, EnrichmentResult } from '@/types/enrichment';
import { smtpToConfidence } from '@/lib/utils/domain';

export class HunterProvider extends BaseProvider {
  name = 'hunter';
  priority = 20;

  async execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult> {
    const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(input.domain)}&api_key=${apiKey}`;
    const response = await fetch(url, { cache: 'no-store' });

    if (this.isRateLimited(response.status)) {
      return { success: false, contacts: [], provider: this.name, reason: 'Rate limited', rateLimited: true };
    }

    if (!response.ok) {
      return { success: false, contacts: [], provider: this.name, reason: `Hunter failed (${response.status})` };
    }

    const body = await response.json();
    const emails: Array<{ first_name?: string; last_name?: string; value: string; position?: string; verification?: { status?: string } }> = body?.data?.emails ?? [];

    const contacts = emails.map((entry) => ({
      fullName: entry.first_name && entry.last_name ? `${entry.first_name} ${entry.last_name}` : entry.value,
      title: entry.position ?? 'Unknown',
      email: entry.value,
      emailVerified: entry.verification?.status === 'valid',
      smtpStatus: entry.verification?.status,
      confidence: smtpToConfidence(entry.verification?.status),
      sourceProvider: this.name
    }));

    return {
      success: contacts.some((c) => c.emailVerified),
      contacts,
      provider: this.name,
      reason: contacts.length ? undefined : 'No contacts found'
    };
  }
}
