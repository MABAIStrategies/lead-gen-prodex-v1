'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function LiveLogDrawer({
  open,
  onClose,
  logs
}: {
  open: boolean;
  onClose: () => void;
  logs: Array<{ ts: string; message: string }>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="fixed right-0 top-[74px] z-40 h-[calc(100vh-74px)] w-[360px] border-l border-mab-gold/30 bg-mab-slate/95 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-mab-gold">Live Queue Logs</h3>
            <button onClick={onClose} className="rounded border border-mab-gold/30 px-2 py-1 text-xs">Close</button>
          </div>
          <div className="space-y-2 overflow-auto text-xs">
            {logs.map((log, index) => (
              <div key={`${log.ts}-${index}`} className="rounded border border-mab-gold/20 p-2">
                <p className="text-mab-offWhite/60">{log.ts}</p>
                <p>{log.message}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
