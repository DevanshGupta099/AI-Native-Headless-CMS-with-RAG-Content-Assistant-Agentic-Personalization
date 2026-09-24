import type { Metadata } from 'next';
import Link from 'next/link';
import { Layers, ExternalLink } from 'lucide-react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Enterprise Experience Delivery',
  description: 'AI-Native Headless CMS content delivery with personalized experiences and vector retrieval',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <header className="border-b border-white/[0.08] bg-[#0b0f19]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">ContentPilot</span>
                  <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-mono font-semibold text-cyan-300 border border-cyan-500/30">
                    EDGE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block -mt-0.5">
                  Experience Delivery Fabric
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <Link href="/" className="hover:text-white transition">
                Showcase
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition"
              >
                <span>Author Studio</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 ContentPilot AI • Mirrored Enterprise Consulting Stack (AEM + Target + Sensei)</p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Edge Delivery SLA: &lt; 15ms</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
