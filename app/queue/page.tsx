'use client';

import { motion } from 'framer-motion';

export default function QueuePage() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-3 text-xl font-semibold text-mab-gold">Queue Monitor</h2>
      <div className="glass rounded-xl p-4 text-sm text-mab-offWhite/80">
        Provider attempts, fallback history, and active processing are surfaced in the live drawer on Dashboard and persisted in the EnrichmentJob table.
      </div>
    </motion.section>
  );
}
