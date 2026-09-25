import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import AtmosphericBackground from '@/components/ui/AtmosphericBackground';
import Logo from '@/components/ui/Logo';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Enterprise Experience Delivery Fabric',
  description: 'AI-Native Headless CMS content delivery with personalized experiences and vector retrieval',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#09090b] text-[#F5F5F7] font-sans antialiased selection:bg-[#E8380D]/30 selection:text-[#FFB347] relative">
        <AtmosphericBackground />

        <header className="border-b border-white/[0.07] bg-[#09090b]/85 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="hover:opacity-95 transition">
              <Logo size="md" subtitle="Experience Delivery Fabric" badge="EDGE" />
            </Link>

            <nav className="flex items-center gap-4 text-xs font-medium text-zinc-400">
              <Link href="/" className="hover:text-white transition">
                Showcase
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08] hover:border-white/20 transition shadow-sm"
              >
                <span>Author Studio</span>
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 relative z-10">
          {children}
        </main>

        <footer className="border-t border-white/[0.07] py-8 text-center text-xs text-zinc-400 font-mono relative z-10 bg-[#09090b]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-400">© 2026 ContentPilot AI • Mirrored Enterprise Consulting Stack (AEM + Target + Sensei)</p>
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
