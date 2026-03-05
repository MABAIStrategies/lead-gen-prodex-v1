'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const providers = ['apollo', 'hunter', 'tomba', 'dropcontact', 'voilanorbert'];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const save = async (provider: string) => {
    const response = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, apiKey: keys[provider], isEnabled: true })
    });
    const body = await response.json();
    setMessage(body.ok ? `${provider} key saved securely.` : `${provider} failed: ${body.error}`);
  };

  return (
    <motion.section initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="mb-4 text-xl font-semibold text-mab-gold">Provider API Key Vault</h2>
      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider} className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium uppercase tracking-wide">{provider}</h3>
              <button className="rounded bg-mab-gold px-3 py-1 text-xs font-semibold text-mab-darkBlue" onClick={() => save(provider)}>Save</button>
            </div>
            <input type="password" placeholder={`${provider} API Key`} value={keys[provider] || ''} onChange={(e) => setKeys((k) => ({ ...k, [provider]: e.target.value }))} className="w-full rounded border border-mab-gold/30 bg-transparent px-3 py-2" />
          </div>
        ))}
      </div>
      {message && <p className="mt-4 text-sm text-mab-offWhite/80">{message}</p>}
    </motion.section>
  );
}
