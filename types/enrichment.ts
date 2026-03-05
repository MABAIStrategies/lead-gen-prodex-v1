export type EnrichmentInput = {
  companyName: string;
  domain: string;
  industry?: string;
};

export type EnrichedContact = {
  fullName: string;
  title: string;
  email: string;
  emailVerified: boolean;
  smtpStatus?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  sourceProvider: string;
};

export type EnrichmentResult = {
  success: boolean;
  contacts: EnrichedContact[];
  provider: string;
  reason?: string;
  rateLimited?: boolean;
};

export interface EnrichmentProvider {
  name: string;
  priority: number;
  execute(input: EnrichmentInput, apiKey: string): Promise<EnrichmentResult>;
}
