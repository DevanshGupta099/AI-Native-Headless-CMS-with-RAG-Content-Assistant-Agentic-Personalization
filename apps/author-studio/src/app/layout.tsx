import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ContentPilot AI | Enterprise Content Intelligence Studio',
  description: 'AI-Native Headless CMS Author Studio with RAG Assistant, Agentic Personalization & Vector Intelligence',
  metadataBase: new URL('http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#09090b] font-sans text-[#F5F5F7] antialiased selection:bg-[#E8380D]/30 selection:text-[#FFB347]">
        {children}
      </body>
    </html>
  );
}
