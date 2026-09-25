import React from 'react';
import Link from 'next/link';
import HeroCanvasWrapper from '@/components/canvas/HeroCanvasWrapper';
import {
  FileText,
  ArrowUpRight,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ExternalLink,
  Target,
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  updatedAt: string;
}

async function getPublishedContent(): Promise<ContentItem[]> {
  try {
    const res = await fetch('http://localhost:3001/api/content?status=PUBLISHED', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      {
        id: 'c-1',
        title: 'Modern Headless CMS Architecture & Dense Vector RAG',
        slug: 'headless-cms-architecture',
        type: 'BLOG_POST',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'c-2',
        title: 'Enterprise Personalization & Edge Variant Evaluation',
        slug: 'enterprise-personalization',
        type: 'LANDING_PAGE',
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }
}

export default async function DeliveryHomePage() {
  const items = await getPublishedContent();

  return (
    <div className="space-y-16 pb-16">
      {/* 1. 3D WebGL Hero Neural Wave Section */}
      <section className="relative rounded-3xl overflow-hidden surface-card border border-white/[0.08] shadow-2xl">
        <HeroCanvasWrapper />

        {/* Text Overlay on Hero */}
        <div className="absolute inset-0 z-10 p-8 sm:p-12 flex flex-col justify-between pointer-events-none">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8380D]/20 to-[#F56E40]/15 px-3.5 py-1 text-xs font-mono font-semibold text-[#FFB347] border border-[#E8380D]/30 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8380D] animate-pulse" />
              <span>AI-NATIVE EXPERIENCE DELIVERY FABRIC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Delivery with{' '}
              <span className="text-gradient-firefly">Agentic Personalization</span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Stories and omnichannel experiences dynamically orchestrated using pgvector 384-dimensional dense semantic vectors, Adobe Target audience rules, and autonomous publish pipelines.
            </p>
          </div>

          {/* Quick Telemetry Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#FFB347]" />
              <span>Sub-15ms Edge Resolution</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E8380D]" />
              <span>384-dim Dense Retrieval</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% HITL Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Personalization Edge Context Banner */}
      <section className="surface-card rounded-2xl p-5 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#E8380D]/15 border border-[#E8380D]/30 text-[#FFB347] flex items-center justify-center shrink-0">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live Edge Audience Simulation Active
            </p>
            <p className="text-xs text-zinc-400">
              Visitor attributes (Referrer, Device, Geo) dynamically swap headlines and CTAs without client flicker.
            </p>
          </div>
        </div>

        <a
          href="http://localhost:3000/personalize"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
        >
          <span>Open Target Simulator</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      {/* 3. Published Content Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-[#FFB347]" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Featured Published Stories
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {items.length} items live on edge
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl surface-card border-dashed border-white/10 p-12 text-center text-zinc-400">
            <FileText className="h-8 w-8 mx-auto text-zinc-500 mb-2" />
            <p className="text-sm font-semibold text-white">No published content available yet</p>
            <p className="mt-1 text-xs text-zinc-400">
              Open Author Studio to compose, audit, and publish your first story into the lake.
            </p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="mt-4 btn-firefly inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-lg shadow-[#E8380D]/20"
            >
              <span>Open Author Studio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="surface-card card-interactive rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group border border-white/[0.08] shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFB347]">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span>3 min read</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#FFB347] transition leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#FFB347] group-hover:text-white font-semibold transition">
                    <span>Read Story</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
