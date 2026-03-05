import { BaseProvider } from './base';
import type { EnrichmentInput, EnrichmentResult } from '@/types/enrichment';

export class DropcontactProvider extends BaseProvider {
  name = 'dropcontact';
  priority = 40;

  async execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult> {
    void input;
    void apiKey;
    return {
      success: false,
      contacts: [],
      provider: this.name,
      reason: 'Dropcontact adapter scaffolded; endpoint wiring pending account-specific contract.'
    };
  }
}
