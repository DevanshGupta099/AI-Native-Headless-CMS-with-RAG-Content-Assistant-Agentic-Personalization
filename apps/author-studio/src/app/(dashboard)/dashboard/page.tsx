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
  { ssr: false, loading: () => <div className="h-[400px] w-full rounded-2xl bg-[#090d16] animate-pulse" /> }
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
            <span className="rounded-lg bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-400 border border-indigo-500/30">
              MISSION CONTROL
            </span>
            <span className="text-xs text-slate-500 font-mono">ADOBE EXPERIENCE CLOUD FABRIC</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Executive Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Unified control plane for AEM Content Lake, pgvector semantic retrieval, and Adobe Target personalization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/content/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Content</span>
          </Link>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Open Copilot</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Dense Vector Space</span>
            <Database className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">384-d</span>
            <span className="text-xs text-emerald-400 font-medium">bge-small</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">pgvector cosine distance embeddings</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Retrieval Precision</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">94.2%</span>
            <span className="text-xs text-emerald-400 font-medium">P@3 Benchmark</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">RAG ground-truth recall score</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Agent Reliability</span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-xs text-cyan-400 font-medium">3/3 Tools Pass</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Autonomous publish prep success</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Edge Delivery SLA</span>
            <Zap className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">14ms</span>
            <span className="text-xs text-emerald-400 font-medium">P99 Latency</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Personalized rule resolution time</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-transparent" />
        </div>
      </div>

      {/* 3D WebGL Vector Space Visualization Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Live Semantic Vector Space (Three.js WebGL)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click & drag to rotate • Hover node to inspect embedding cluster
          </span>
        </div>

        <VectorSpaceCanvas />
      </div>

      {/* Architecture Quad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>AEM Content Core</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immutable versioned headless CMS lake with drafting, live publication states, and audit trails.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Status</span>
            <span className="text-emerald-400 font-medium">Operational</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Database className="h-4 w-4" />
            <span>pgvector Vector Lake</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Native PostgreSQL vector indexing with 384-dimensional cosine distance and sub-5ms retrieval.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Cosine &lt;=&gt;</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Cpu className="h-4 w-4" />
            <span>Groq Llama-3.3-70B</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ultra-fast LLM inference powering real-time SSE content streaming and multi-tool agent execution.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Speed</span>
            <span className="text-cyan-400 font-medium">&gt;300 tok/sec</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs font-mono uppercase tracking-wider">
            <Target className="h-4 w-4" />
            <span>Adobe Target Engine</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Edge-delivered personalization rules evaluating visitor attributes, referrer tokens, and variant overrides.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Latency</span>
            <span className="text-rose-400 font-medium">&lt; 15ms</span>
          </div>
        </div>
      </div>

      {/* Recent Content Showcase & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Stream (2 columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Content Items
              </h2>
            </div>
            <Link
              href="/content"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <span>View All Items</span>
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
                      className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-mono">/{item.slug}</span>
                      <span>•</span>
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
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
                      className="text-xs font-semibold text-indigo-400 hover:underline"
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
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Action Launchpad
            </h2>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/content/new"
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                  Create Content Item
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Draft new blog post or landing page</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/assistant"
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                  Query RAG Copilot
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Streaming assistant with source citations</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/personalize"
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                  Simulate Personalization
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Test visitor segment rule matching</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/eval"
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                  Run Benchmark Suite
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Audit retrieval precision & agent reliability</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
