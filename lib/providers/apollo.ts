import { BaseProvider } from './base';
import type { EnrichmentInput, EnrichmentResult } from '@/types/enrichment';
import { smtpToConfidence } from '@/lib/utils/domain';

export class ApolloProvider extends BaseProvider {
  name = 'apollo';
  priority = 10;

  async execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult> {
    const response = await fetch('https://api.apollo.io/api/v1/mixed_companies/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        q_organization_domains: [input.domain],
        page: 1,
        per_page: 5
      }),
      cache: 'no-store'
    });

    if (this.isRateLimited(response.status)) {
      return { success: false, contacts: [], provider: this.name, reason: 'Rate limited', rateLimited: true };
    }

    if (!response.ok) {
      return { success: false, contacts: [], provider: this.name, reason: `Apollo failed (${response.status})` };
    }

    const body = await response.json();
    const people: Array<{ name: string; title?: string; email?: string; email_status?: string }> = body?.people ?? [];
    const contacts = people.map((person) => ({
      fullName: person.name,
      title: person.title || 'Unknown',
      email: person.email || '',
      emailVerified: !!person.email_status && ['verified', 'valid'].includes(person.email_status.toLowerCase()),
      smtpStatus: person.email_status,
      confidence: smtpToConfidence(person.email_status),
      sourceProvider: this.name
    })).filter((contact) => !!contact.email);

    return {
      success: contacts.some((c) => c.emailVerified),
      contacts,
      provider: this.name,
      reason: contacts.length ? undefined : 'No contacts found'
    };
  }
}
