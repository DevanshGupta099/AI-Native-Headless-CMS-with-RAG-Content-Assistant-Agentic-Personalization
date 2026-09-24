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
        title: 'Modern Headless CMS Architecture & Vector RAG',
        slug: 'headless-cms-architecture',
        type: 'BLOG_POST',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'c-2',
        title: 'Enterprise Personalization & Edge Rule Evaluation',
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
    <div className="space-y-12">
      {/* 3D WebGL Hero Canvas Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card border border-white/[0.08] shadow-2xl">
        <HeroCanvasWrapper />

        {/* Text Overlay on Hero */}
        <div className="absolute inset-0 z-10 p-8 sm:p-12 flex flex-col justify-between pointer-events-none">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI-Native Experience Delivery Fabric</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Next-Gen CMS with Agentic Personalization
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Content dynamically orchestrated using pgvector 384-dimensional semantic search, rule-based audience segmentation, and automated publishing pipelines.
            </p>
          </div>

          {/* Quick telemetry indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sub-15ms Edge Resolution</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>384-dim Vector Grounding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Human-in-the-Loop Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Published Content Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Featured Published Stories
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {items.length} items live on edge
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500">
            <FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">No published content available yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Open Author Studio to compose, audit, and publish your first story.
            </p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
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
                className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>3 min read</span>
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-indigo-400 group-hover:text-cyan-300 font-semibold transition">
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
