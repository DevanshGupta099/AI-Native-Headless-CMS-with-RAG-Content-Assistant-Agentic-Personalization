import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Enterprise Content Intelligence Studio',
  description: 'AI-Native Headless CMS Author Studio with RAG Assistant, Agentic Personalization & Vector Intelligence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] font-sans text-[#F5F5F7] antialiased selection:bg-[#E8380D]/30 selection:text-[#FFB347]">
        {children}
      </body>
    </html>
  );
}
