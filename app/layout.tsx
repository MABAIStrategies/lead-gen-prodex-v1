import '@/styles/globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-mab-gold/30 bg-mab-darkBlue/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Image src="/mab-logo.svg" alt="MAB AI Strategies logo" width={42} height={42} />
              <div>
                <p className="text-lg font-semibold">MAB AI Strategies</p>
                <p className="text-xs text-mab-offWhite/70">Lead Gen Engine Prodex</p>
              </div>
            </div>
            <nav className="flex gap-2 text-sm">
              <Link className="rounded px-3 py-2 hover:bg-mab-slate" href="/dashboard">Dashboard</Link>
              <Link className="rounded px-3 py-2 hover:bg-mab-slate" href="/queue">Queue</Link>
              <Link className="rounded px-3 py-2 hover:bg-mab-slate" href="/settings">Settings</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
