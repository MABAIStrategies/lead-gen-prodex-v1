export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0];
}

export function smtpToConfidence(smtpStatus?: string): 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN' {
  if (!smtpStatus) return 'UNKNOWN';
  const normalized = smtpStatus.toLowerCase();
  if (['valid', 'deliverable', 'verified'].includes(normalized)) return 'HIGH';
  if (['accept_all', 'risky', 'unknown'].includes(normalized)) return 'MEDIUM';
  if (['invalid', 'undeliverable'].includes(normalized)) return 'LOW';
  return 'UNKNOWN';
}
