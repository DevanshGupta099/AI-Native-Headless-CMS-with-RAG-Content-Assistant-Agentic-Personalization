import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Author Studio',
  description: 'AI-Native Headless CMS Author Studio with RAG Assistant & Personalization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06070a] font-sans text-slate-100 antialiased selection:bg-[#eb1000]/30 selection:text-[#ff6b81]">
        {children}
      </body>
    </html>
  );
}
