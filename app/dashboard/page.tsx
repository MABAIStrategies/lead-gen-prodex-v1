'use client';

import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LeadTable } from '@/app/components/lead-table';
import { LiveLogDrawer } from '@/app/components/live-log-drawer';

type LeadInput = { companyName: string; domain: string; industry?: string };

type DashboardRow = {
  company: string;
  decisionMaker: string;
  title: string;
  email: string;
  confidence: string;
  source: string;
};

export default function DashboardPage() {
  const [lead, setLead] = useState<LeadInput>({ companyName: '', domain: '', industry: '' });
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [logs, setLogs] = useState<Array<{ ts: string; message: string }>>([]);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const log = (message: string) => setLogs((current) => [{ ts: new Date().toISOString(), message }, ...current]);

  const handleEnrich = async (payload: LeadInput) => {
    log(`Starting enrichment for ${payload.companyName} (${payload.domain})`);

    const response = await fetch('/api/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();
    if (!body.ok) {
      log(`❌ ${body.error}`);
      return;
    }

    const contacts = body.result.contacts || [];
    const nextRows = contacts.map((contact: { fullName: string; title: string; email: string; confidence: string; sourceProvider: string }) => ({
      company: body.result.lead?.companyName || payload.companyName,
      decisionMaker: contact.fullName,
      title: contact.title,
      email: contact.email,
      confidence: contact.confidence,
      source: contact.sourceProvider
    }));
    setRows((prev) => [...nextRows, ...prev]);
    log(`✅ Enriched ${nextRows.length} contacts.`);
  };

  const handleBulkCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (result) => {
        const leads = result.data as Array<Record<string, string>>;
        for (const row of leads) {
          await handleEnrich({
            companyName: row['Company Name'] || row.companyName,
            domain: row.Website || row.domain,
            industry: row.Industry || row.industry
          });
        }
      }
    });
  };

  const exportCsv = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'enriched-leads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const stats = useMemo(() => ({ total: rows.length, high: rows.filter((r) => r.confidence === 'HIGH').length }), [rows]);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <section className="mb-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-xl p-4 shadow-glow">
          <h1 className="mb-2 text-2xl font-semibold text-mab-gold">Hyper-Interactive Lead Enrichment Dashboard</h1>
          <p className="mb-4 text-sm text-mab-offWhite/80">Map company names and domains to verified decision-makers with deterministic fallback logic.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded border border-mab-gold/30 bg-transparent px-3 py-2" placeholder="Company Name" value={lead.companyName} onChange={(e) => setLead({ ...lead, companyName: e.target.value })} />
            <input className="rounded border border-mab-gold/30 bg-transparent px-3 py-2" placeholder="Website / Domain" value={lead.domain} onChange={(e) => setLead({ ...lead, domain: e.target.value })} />
            <input className="rounded border border-mab-gold/30 bg-transparent px-3 py-2" placeholder="Industry" value={lead.industry} onChange={(e) => setLead({ ...lead, industry: e.target.value })} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded bg-mab-gold px-4 py-2 font-semibold text-mab-darkBlue hover:opacity-90" onClick={() => handleEnrich(lead)}>Enrich Now</button>
            <label className="cursor-pointer rounded border border-mab-gold/40 px-4 py-2">
              Upload CSV
              <input className="hidden" type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleBulkCsv(e.target.files[0])} />
            </label>
            <button className="rounded border border-mab-gold/40 px-4 py-2" onClick={exportCsv}>Export CSV</button>
            <button className="rounded border border-mab-gold/40 px-4 py-2" onClick={() => setDrawerOpen((v) => !v)}>Toggle Live Logs</button>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <Image src="/professional-headshot.svg" alt="Professional headshot" width={360} height={240} className="mb-3 w-full rounded-lg border border-mab-gold/20" />
          <p className="text-sm">Total Enriched Contacts: <span className="text-mab-gold">{stats.total}</span></p>
          <p className="text-sm">High Confidence Emails: <span className="text-mab-gold">{stats.high}</span></p>
        </div>
      </section>
      <LeadTable rows={rows} />
      <LiveLogDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} logs={logs} />
    </motion.div>
  );
}
