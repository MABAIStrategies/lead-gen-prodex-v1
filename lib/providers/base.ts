import type { EnrichmentProvider } from '@/types/enrichment';

export abstract class BaseProvider implements EnrichmentProvider {
  abstract name: string;
  abstract priority: number;

  abstract execute(input: { companyName: string; domain: string; industry?: string }, apiKey: string): Promise<import('@/types/enrichment').EnrichmentResult>;

  protected isRateLimited(status: number): boolean {
    return status === 429;
  }
}
