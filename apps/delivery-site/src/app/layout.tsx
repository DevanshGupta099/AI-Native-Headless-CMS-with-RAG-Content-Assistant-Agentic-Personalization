import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Enterprise Showcase',
  description: 'AI-Native Headless CMS content delivery with personalized experiences',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <header className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                CP
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">ContentPilot</span>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 transition"
              >
                Author Studio ↗
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
          {children}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
          <p>© 2026 ContentPilot AI. Mirrored Enterprise Consulting Stack (AEM + Target + Analytics).</p>
        </footer>
      </body>
    </html>
  );
}
