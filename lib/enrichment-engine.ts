import { prisma } from '@/lib/prisma';
import { providerRegistry } from '@/lib/providers/registry';
import { normalizeDomain } from '@/lib/utils/domain';
import { decryptApiKey } from '@/lib/crypto';
import type { EnrichedContact, EnrichmentInput } from '@/types/enrichment';

const cooldowns = new Map<string, number>();

function inCooldown(provider: string): boolean {
  const until = cooldowns.get(provider);
  return !!until && Date.now() < until;
}

function setCooldown(provider: string): void {
  cooldowns.set(provider, Date.now() + 60_000);
}

export async function runEnrichmentJob(rawInput: EnrichmentInput) {
  const input = {
    ...rawInput,
    domain: normalizeDomain(rawInput.domain)
  };

  const existingLead = await prisma.lead.findUnique({
    where: { domain: input.domain },
    include: { contacts: true }
  });

  if (existingLead?.contacts.some((c) => c.emailVerified)) {
    return {
      lead: existingLead,
      contacts: existingLead.contacts,
      message: 'Lead already enriched with verified contact; skipped.'
    };
  }

  const lead =
    existingLead ||
    (await prisma.lead.create({
      data: {
        companyName: input.companyName,
        domain: input.domain,
        industry: input.industry,
        status: 'QUEUED'
      }
    }));

  const job = await prisma.enrichmentJob.create({
    data: {
      leadId: lead.id,
      status: 'RUNNING',
      startedAt: new Date(),
      fallbackHistory: [],
      attemptLog: []
    }
  });

  const providers = providerRegistry();
  const fallbackHistory: string[] = [];
  const attemptLog: Array<Record<string, string | boolean>> = [];
  let successfulContacts: EnrichedContact[] = [];

  for (const provider of providers) {
    if (inCooldown(provider.name)) {
      fallbackHistory.push(`${provider.name}:cooldown-skip`);
      attemptLog.push({ provider: provider.name, success: false, reason: 'cooldown active' });
      continue;
    }

    const credential = await prisma.providerCredential.findUnique({ where: { provider: provider.name } });
    if (!credential || !credential.isEnabled) {
      fallbackHistory.push(`${provider.name}:credential-missing`);
      attemptLog.push({ provider: provider.name, success: false, reason: 'credential missing/disabled' });
      continue;
    }

    const apiKey = decryptApiKey(credential.encryptedApiKey, credential.keyIv, credential.keyTag);
    const result = await provider.execute(input, apiKey);

    attemptLog.push({ provider: provider.name, success: result.success, reason: result.reason ?? 'ok' });

    if (result.rateLimited) {
      setCooldown(provider.name);
      fallbackHistory.push(`${provider.name}:rate-limited`);
      continue;
    }

    if (result.success && result.contacts.length > 0) {
      successfulContacts = result.contacts;
      break;
    }

    fallbackHistory.push(`${provider.name}:no-verified-data`);
  }

  if (successfulContacts.length > 0) {
    await prisma.contact.createMany({
      data: successfulContacts.map((contact) => ({ ...contact, leadId: lead.id })),
      skipDuplicates: true
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'COMPLETED', lastEnrichedAt: new Date() }
    });

    await prisma.enrichmentJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        fallbackHistory,
        attemptLog
      }
    });
  } else {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'FAILED' }
    });

    await prisma.enrichmentJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        fallbackHistory,
        attemptLog,
        errorMessage: 'No verified contacts found from enabled providers.'
      }
    });
  }

  const refreshed = await prisma.lead.findUnique({ where: { id: lead.id }, include: { contacts: true } });
  return { lead: refreshed, contacts: refreshed?.contacts ?? [], fallbackHistory, attemptLog };
}
