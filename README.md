# Lead Gen Engine Prodex (MAB AI Strategies)

Production-ready Next.js App Router lead enrichment engine with deterministic provider fallback, encrypted credential storage, and an interactive dashboard.

## Stack
- Next.js 14 (App Router)
- Prisma + Neon Postgres
- Tailwind + Framer Motion + TanStack Table
- NextAuth (Credentials)

## Setup
1. Install dependencies: `npm install`
2. Set env vars:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `CREDENTIAL_ENCRYPTION_KEY` (minimum 32 chars)
3. Run Prisma:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
4. Run app: `npm run dev`

## Core Capabilities
- Lead, Contact, EnrichmentJob, ProviderCredential schema
- Plugin provider abstraction + registry (Apollo and Hunter fully wired, others configurable)
- Sequential fallback orchestration with 60-second provider cooldown on 429
- Server-side-only provider execution and credential encryption at rest
- Dashboard with single/bulk CSV enrichment, live log drawer, filters, and export
