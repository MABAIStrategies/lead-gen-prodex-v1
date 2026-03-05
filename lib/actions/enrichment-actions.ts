'use server';

import { runEnrichmentJob } from '@/lib/enrichment-engine';
import { prisma } from '@/lib/prisma';
import { encryptApiKey } from '@/lib/crypto';
import { normalizeDomain } from '@/lib/utils/domain';
import { z } from 'zod';

const leadSchema = z.object({
  companyName: z.string().min(2),
  domain: z.string().min(3),
  industry: z.string().optional()
});

export async function enrichSingleLead(payload: z.infer<typeof leadSchema>) {
  const validated = leadSchema.parse(payload);
  return runEnrichmentJob({ ...validated, domain: normalizeDomain(validated.domain) });
}

export async function saveProviderCredential(provider: string, apiKey: string, isEnabled = true) {
  if (!provider || !apiKey) throw new Error('Provider and API key are required.');

  const encrypted = encryptApiKey(apiKey);

  return prisma.providerCredential.upsert({
    where: { provider },
    update: { ...encrypted, isEnabled },
    create: { provider, ...encrypted, isEnabled }
  });
}

export async function fetchDashboardData() {
  const [leads, jobs, credentials] = await Promise.all([
    prisma.lead.findMany({ include: { contacts: true }, orderBy: { updatedAt: 'desc' } }),
    prisma.enrichmentJob.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { lead: true } }),
    prisma.providerCredential.findMany({ orderBy: { provider: 'asc' } })
  ]);

  return { leads, jobs, credentials };
}
