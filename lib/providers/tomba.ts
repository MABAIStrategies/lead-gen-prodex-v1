import { BaseProvider } from './base';
import type { EnrichmentInput, EnrichmentResult } from '@/types/enrichment';

export class TombaProvider extends BaseProvider {
  name = 'tomba';
  priority = 30;

  async execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult> {
    void input;
    void apiKey;
    return {
      success: false,
      contacts: [],
      provider: this.name,
      reason: 'Tomba adapter scaffolded; endpoint wiring pending account-specific contract.'
    };
  }
}
