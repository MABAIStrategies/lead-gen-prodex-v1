import { BaseProvider } from './base';
import type { EnrichmentInput, EnrichmentResult } from '@/types/enrichment';

export class VoilaNorbertProvider extends BaseProvider {
  name = 'voilanorbert';
  priority = 50;

  async execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult> {
    void input;
    void apiKey;
    return {
      success: false,
      contacts: [],
      provider: this.name,
      reason: 'VoilaNorbert adapter scaffolded; endpoint wiring pending account-specific contract.'
    };
  }
}
