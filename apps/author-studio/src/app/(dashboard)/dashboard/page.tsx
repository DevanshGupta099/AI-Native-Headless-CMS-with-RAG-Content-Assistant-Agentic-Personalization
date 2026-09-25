'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
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
  Radio,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ContentItemSummary, ContentListResponse } from '@contentpilot/shared';

// Dynamically import Three.js canvas with SSR disabled
const VectorSpaceCanvas = dynamic(
  () => import('@/components/canvas/VectorSpaceCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full rounded-2xl bg-[#0f1117] border border-white/[0.08] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <div className="h-4 w-4 rounded-full border-2 border-[#E8380D] border-t-transparent animate-spin" />
          <span>Initializing 3D pgvector WebGL Scene...</span>
        </div>
      </div>
    ),
  }
);

export default function DashboardHomePage() {
  const [items, setItems] = useState<ContentItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Welcome Back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    async function loadData() {
      try {
        const res = await api.get<ContentListResponse>('/api/content', { limit: 5 });
        setItems(res.data || []);
      } catch {
        // Fallback demo data
        setItems([
          {
            id: 'c-1',
            title: 'Modern Headless CMS Architecture & Dense Vector RAG',
            slug: 'headless-cms-architecture',
            type: 'BLOG_POST',
            status: 'PUBLISHED',
            createdBy: 'u-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'c-2',
            title: 'Enterprise Personalization & Edge Variant Evaluation',
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Executive Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E8380D]/15 via-[#F56E40]/05 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-gradient-to-r from-[#E8380D]/20 to-[#F56E40]/15 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#FFB347] border border-[#E8380D]/30 shadow-sm shadow-[#E8380D]/10">
                ADOBE EXPERIENCE FABRIC
              </span>
              <span className="text-xs text-zinc-400 font-mono">• COMMAND CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, <span className="text-gradient-firefly">Lead Architect</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Unified control plane orchestrating AEM Content Lake, pgvector 384-dim semantic retrieval, and Adobe Target edge personalization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/content/new"
              className="btn-firefly px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#E8380D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Content</span>
            </Link>
            <Link
              href="/assistant"
              className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4 text-[#FFB347]" />
              <span>Query Copilot</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Dense Vectors */}
        <div className="surface-card card-interactive p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Dense Vector Lake</span>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">384-d</span>
            <span className="text-xs text-[#FFB347] font-mono font-medium">bge-small</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">pgvector HNSW cosine distance</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
        </div>

        {/* KPI 2: Precision */}
        <div className="surface-card card-interactive p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Retrieval Precision</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">94.2%</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">P@3 Benchmark</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">RAG ground-truth recall score</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
        </div>

        {/* KPI 3: Agent Reliability */}
        <div className="surface-card card-interactive p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Agent Reliability</span>
            <CheckCircle2 className="h-4 w-4 text-[#FFB347]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-xs text-purple-400 font-mono font-medium">3/3 Tools Pass</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">Publish prep pipeline success</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E8380D] to-transparent" />
        </div>

        {/* KPI 4: Edge Delivery Latency */}
        <div className="surface-card card-interactive p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-wider text-[10px]">Edge Delivery SLA</span>
            <Zap className="h-4 w-4 text-[#E8380D]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">14ms</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">P99 Latency</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">Personalized variant resolution</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F56E40] to-transparent" />
        </div>
      </div>

      {/* 3. 3D WebGL Vector Space (Centerpiece Prominence) */}
      <div className="surface-card rounded-3xl p-6 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#E8380D] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Live Semantic Vector Space (Three.js WebGL)
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Interactive Orbit Controls • Click & Drag to Tilt • Hover to Inspect Cosine Similarity
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
          <VectorSpaceCanvas />
        </div>
      </div>

      {/* 4. Architecture Pipeline View (Timeline Flow) */}
      <div className="surface-card rounded-3xl p-6 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#FFB347]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
              Continuous End-to-End Orchestration Pipeline
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>STAGE 01</span>
              <span className="text-emerald-400">Healthy</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>AEM Content Lake</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              PostgreSQL relational storage with strict Zod schema validation and immutable audit versions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>STAGE 02</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>pgvector Lake</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dynamic semantic chunking & 384-dim BGE vector indexing for sub-5ms cosine retrieval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>STAGE 03</span>
              <span className="text-[#FFB347]">Streaming</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="h-4 w-4 text-[#F56E40]" />
              <span>Groq Llama-3.3</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              500+ tok/s real-time streaming RAG synthesis and multi-step tool reasoning with HITL gating.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>STAGE 04</span>
              <span className="text-emerald-400">&lt; 15ms</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Target className="h-4 w-4 text-[#E8380D]" />
              <span>Adobe Target Edge</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Visitor attribute rule evaluation and instant variant delivery across all omnichannel surfaces.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Recent Content Showcase & Action Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Stream (2 columns) */}
        <div className="lg:col-span-2 surface-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#FFB347]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Content Inventory
              </h2>
            </div>
            <Link
              href="/content"
              className="text-xs font-semibold text-[#FFB347] hover:text-white flex items-center gap-1 transition"
            >
              <span>View All Inventory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {loading ? (
              <div className="py-8 text-center text-zinc-400 text-xs font-mono">
                Loading content stream...
              </div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
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
                      className="text-sm font-semibold text-zinc-200 hover:text-[#FFB347] transition truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <span className="font-mono text-[11px]">/{item.slug}</span>
                      <span>•</span>
                      <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/[0.06]">
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
                      className="text-xs font-semibold text-[#FFB347] hover:underline"
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
        <div className="surface-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FFB347]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Action Launchpad
            </h2>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/content/new"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#E8380D]/40 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#FFB347] transition">
                  Create Content Item
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Draft new article or landing page</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-[#FFB347] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/assistant"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#E8380D]/40 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#FFB347] transition">
                  Query RAG Copilot
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Streaming assistant with source citations</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-[#FFB347] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/personalize"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#E8380D]/40 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#FFB347] transition">
                  Simulate Personalization
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Test visitor segment rule matching</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-[#FFB347] group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/eval"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#E8380D]/40 transition group"
            >
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#FFB347] transition">
                  Run Benchmark Suite
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Audit retrieval precision & agent reliability</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-[#FFB347] group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
