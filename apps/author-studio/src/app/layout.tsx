import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Author Studio',
  description: 'AI-Native Headless CMS Author Studio with RAG Assistant & Personalization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
