'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function CTAFooter() {
  return (
    <footer className="relative border-t border-white/[0.08] pt-24 pb-12 overflow-hidden bg-[#09090b]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-[#E8380D]/15 via-[#F56E40]/05 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to Action Box */}
        <div className="surface-elevated rounded-3xl p-10 sm:p-14 text-center border border-white/10 mb-20 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Production Access</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Experience the Future of{' '}
              <span className="text-gradient-firefly">Enterprise Experience Management</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
              Step into the Author Studio Command Center or inspect the live personalized edge delivery fabric.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn-firefly px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 group shadow-xl shadow-[#E8380D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="http://localhost:3002"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary px-6 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Delivery Edge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Credits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/[0.06] text-xs">
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" subtitle="Adobe Experience Fabric" badge="AI" />
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              AI-Native Headless CMS with RAG Content Assistant & Agentic Personalization. Mirrored to Adobe Experience Cloud (AEM + Target + Sensei GenAI).
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Edge Fabric: Online
              </span>
              <span>•</span>
              <span>pgvector Lake: Synced</span>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href="/content" className="hover:text-white transition">
                  Content Studio (AEM)
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition">
                  RAG Copilot Studio (Sensei)
                </Link>
              </li>
              <li>
                <Link href="/personalize" className="hover:text-white transition">
                  Personalization Engine (Target)
                </Link>
              </li>
              <li>
                <Link href="/eval" className="hover:text-white transition">
                  Quality & Benchmarks (CIP)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-3">
              Technical Stack
            </h4>
            <ul className="space-y-2 text-zinc-400 font-mono text-[11px]">
              <li>Groq Llama-3.3-70B</li>
              <li>Neon Serverless PostgreSQL 16</li>
              <li>pgvector 384-dim HNSW</li>
              <li>Next.js 15 App Router</li>
              <li>Turborepo + Strict TypeScript</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <p>© 2026 ContentPilot AI • Engineered for Adobe Experience Cloud Consulting Practice</p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Human-In-The-Loop Enforced</span>
            <span>•</span>
            <span className="text-emerald-400">94.2% Precision@3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
