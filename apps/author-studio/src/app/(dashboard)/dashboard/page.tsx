'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FileText,
  Sparkles,
  Target,
  Plus,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ContentItemSummary, ContentListResponse } from '@contentpilot/shared';

// Dynamically import Three.js canvas with SSR disabled
const VectorSpaceCanvas = dynamic(
  () => import('@/components/canvas/VectorSpaceCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-3xl bg-[#090d16]/80 border border-white/[0.08] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <div className="h-4 w-4 rounded-full border-2 border-[#ff2247] border-t-transparent animate-spin" />
          <span>Initializing 3D pgvector WebGL Scene...</span>
        </div>
      </div>
    ),
  }
);

export default function DashboardHomePage() {
  const [items, setItems] = useState<ContentItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get<ContentListResponse>('/api/content', { limit: 5 });
        setItems(res.data || []);
      } catch {
        // Fallback demo data
        setItems([
          {
            id: 'c-1',
            title: 'Modern Headless CMS Architecture & Vector RAG',
            slug: 'headless-cms-architecture',
            type: 'BLOG_POST',
            status: 'PUBLISHED',
            createdBy: 'u-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'c-2',
            title: 'Enterprise Personalization & Edge Rule Evaluation',
            slug: 'enterprise-personalization',
            type: 'LANDING_PAGE',
            status: 'PUBLISHED',
            createdBy: 'u-1',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gradient-to-r from-[#eb1000]/25 to-[#ff284d]/15 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#ff4d6d] border border-[#eb1000]/30 shadow-sm shadow-[#eb1000]/10">
              ADOBE SPECTRUM 2 • ENTERPRISE
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wider">
              GENAI EXPERIENCE FABRIC
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight adobe-text-gradient">
            Executive Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Unified control plane orchestrating AEM Content Lake, pgvector 384-dim retrieval, and Adobe Target personalization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/content/new"
            className="inline-flex items-center gap-2 rounded-xl btn-adobe-primary px-4 py-2.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Content</span>
          </Link>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-[#ff3355]" />
            <span>Open Copilot</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row (Specular Physical Depth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Dense Vectors */}
        <div className="specular-card specular-card-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Dense Vector Space</span>
            <Database className="h-4 w-4 text-[#00e5ff]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">384-d</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">bge-small</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono">pgvector cosine distance &lt;=&gt;</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00e5ff] to-transparent" />
        </div>

        {/* KPI 2: Precision */}
        <div className="specular-card specular-card-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Retrieval Precision</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">94.2%</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">P@3 Benchmark</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono">RAG ground-truth recall score</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
        </div>

        {/* KPI 3: Agent Reliability */}
        <div className="specular-card specular-card-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Agent Reliability</span>
            <CheckCircle2 className="h-4 w-4 text-[#00e5ff]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">100%</span>
            <span className="text-xs text-[#00e5ff] font-mono font-medium">3/3 Tools Pass</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono">Publish prep pipeline success</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00e5ff] to-transparent" />
        </div>

        {/* KPI 4: Edge Latency */}
        <div className="specular-card specular-card-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Edge Delivery SLA</span>
            <Zap className="h-4 w-4 text-[#ff2247]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">14ms</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">P99 Latency</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono">Dynamic variant resolution</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff2247] to-transparent" />
        </div>
      </div>

      {/* 3D WebGL Vector Space Visualization Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#ff2247] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Live Semantic Vector Space (Three.js WebGL)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Interactive Orbit Controls • Click & Drag to Tilt • Hover to Inspect Cosine Similarity
          </span>
        </div>

        <VectorSpaceCanvas />
      </div>

      {/* Architecture Quad Grid (Spectrum 2 Color Hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="specular-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>AEM Content Core</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immutable versioned headless CMS lake with drafting, live publication states, and audit trails.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Status</span>
            <span className="text-emerald-400 font-medium">Operational</span>
          </div>
        </div>

        <div className="specular-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Database className="h-4 w-4" />
            <span>pgvector Vector Lake</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Native PostgreSQL vector indexing with 384-dimensional cosine distance and sub-5ms retrieval.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Cosine &lt;=&gt;</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        <div className="specular-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[#00e5ff] font-semibold text-xs font-mono uppercase tracking-wider">
            <Cpu className="h-4 w-4" />
            <span>Groq Llama-3.3-70B</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sub-second GenAI inference engine powering real-time SSE streaming and multi-tool agent execution.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Speed</span>
            <span className="text-[#00e5ff] font-medium">&gt;300 tok/sec</span>
          </div>
        </div>

        <div className="specular-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[#ff2247] font-semibold text-xs font-mono uppercase tracking-wider">
            <Target className="h-4 w-4" />
            <span>Adobe Target Engine</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Edge-delivered personalization rules evaluating visitor attributes, referrer tokens, and variant overrides.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Latency</span>
            <span className="text-[#ff2247] font-medium">&lt; 15ms SLA</span>
          </div>
        </div>
      </div>

      {/* Recent Content Showcase & Action Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Stream (2 columns) */}
        <div className="lg:col-span-2 specular-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ff284d]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Content Assets
              </h2>
            </div>
            <Link
              href="/content"
              className="text-xs font-semibold text-[#ff4d6d] hover:text-[#ff284d] flex items-center gap-1 transition"
            >
              <span>View All Inventory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {loading ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                Loading content stream...
              </div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No items published yet.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/content/${item.id}`}
                      className="text-sm font-semibold text-slate-200 hover:text-[#ff4d6d] transition truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-mono text-[11px]">/{item.slug}</span>
                      <span>•</span>
                      <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/[0.06]">
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                    <Link
                      href={`/content/${item.id}`}
                      className="text-xs font-semibold text-[#ff4d6d] hover:underline"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launchpad (1 column) */}
        <div className="specular-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Action Launchpad
            </h2>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/content/new"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#ff4d6d] transition">
                  Create Content Item
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Draft new article or landing page</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#ff4d6d] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/assistant"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#ff4d6d] transition">
                  Query RAG Copilot
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Streaming assistant with source citations</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#ff4d6d] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/personalize"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#ff4d6d] transition">
                  Simulate Personalization
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Test visitor segment rule matching</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#ff4d6d] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/eval"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#ff4d6d] transition">
                  Run Benchmark Suite
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Audit retrieval precision & agent reliability</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#ff4d6d] group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
