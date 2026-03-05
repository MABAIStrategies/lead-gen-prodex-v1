import type { EnrichmentProvider } from '@/types/enrichment';
import { ApolloProvider } from './apollo';
import { HunterProvider } from './hunter';
import { TombaProvider } from './tomba';
import { DropcontactProvider } from './dropcontact';
import { VoilaNorbertProvider } from './voilanorbert';

const providerMap: Record<string, EnrichmentProvider> = {
  apollo: new ApolloProvider(),
  hunter: new HunterProvider(),
  tomba: new TombaProvider(),
  dropcontact: new DropcontactProvider(),
  voilanorbert: new VoilaNorbertProvider()
};

export function providerRegistry(enabledProviders?: string[]): EnrichmentProvider[] {
  const list = (enabledProviders?.length ? enabledProviders : Object.keys(providerMap))
    .map((name) => providerMap[name])
    .filter(Boolean);

  return list.sort((a, b) => a.priority - b.priority);
}
