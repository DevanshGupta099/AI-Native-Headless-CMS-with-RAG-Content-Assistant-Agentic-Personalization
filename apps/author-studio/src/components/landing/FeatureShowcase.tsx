'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Target,
  Cpu,
  Activity,
  CheckCircle2,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 'studio',
      title: 'Content Studio',
      tabLabel: 'Content Studio',
      icon: FileText,
      tagline: 'Enterprise Headless Content Modeling & Version Control',
      description:
        'Author structured, multimodal content items with instantaneous drafts, semantic tagging, and version diffing. Matches Adobe Experience Manager (AEM) authoring models.',
      highlights: [
        'Prisma-backed atomic draft & publication lifecycles',
        'Automatic 384-dim semantic chunking upon publish',
        'Version history rollback with line-by-line diffing',
        'Full JSON & GraphQL headless content delivery endpoints',
      ],
      preview: {
        type: 'content',
        title: 'Transforming Omnichannel Experiences with Generative RAG',
        badge: 'PUBLISHED',
        slug: '/enterprise-rag-architecture-2026',
        author: 'Lead Architect',
        updated: '2 minutes ago',
        chunks: '8 Semantic Chunks',
        status: 'Synced with pgvector Lake',
      },
    },
    {
      id: 'rag',
      title: 'RAG Copilot Studio',
      tabLabel: 'RAG Copilot',
      icon: Sparkles,
      tagline: 'Grounded Assistant with Dense Vector Citations',
      description:
        'Query your enterprise content lake using hybrid vector similarity and keyword search. Real-time SSE streaming delivers answers strictly grounded with clickable citations.',
      highlights: [
        'HuggingFace BGE-small-en-v1.5 embeddings model',
        'Sub-10ms pgvector cosine distance similarity lookup',
        'Zero hallucination guarantee with strict grounding prompts',
        'Direct links back to source content items & chunk offsets',
      ],
      preview: {
        type: 'chat',
        query: 'What are our edge latency guarantees for personalized variants?',
        response:
          'Based on our Enterprise Experience Delivery architecture, dynamic variants resolve at the edge with an SLA under 15ms. The visitor persona rules are evaluated locally without roundtrip database latency.',
        citation: 'Article: Enterprise Edge Delivery Fabric (Similarity: 96.4%)',
      },
    },
    {
      id: 'personalize',
      title: 'Personalization Engine',
      tabLabel: 'Personalization',
      icon: Target,
      tagline: 'Adobe Target-Grade Dynamic Variant Resolution',
      description:
        'Create audience segments based on device, geography, and behavior. Preview personalized content experiences in real-time with the interactive Delivery Simulator.',
      highlights: [
        'Contextual segment rule evaluation (Device, Geo, Referrer)',
        'Content variant overrides (Title, Hero CTA, Banner)',
        'Interactive real-time variant simulator with JSON payload audit',
        'Edge middleware compatibility for zero-CLS delivery',
      ],
      preview: {
        type: 'matrix',
        segment: 'Enterprise Decision Maker (US / Desktop)',
        activeRule: 'Matches: Device == Desktop AND Region == NA',
        deliveredVariant: 'Hero Title: "Enterprise Experience Management at Quantum Scale"',
        baselineVariant: 'Hero Title: "Modern Headless CMS for Developers"',
        lift: '+34.2% Simulated CTR',
      },
    },
    {
      id: 'agent',
      title: 'Autonomous Agent Pipeline',
      tabLabel: 'Agent Pipeline',
      icon: Cpu,
      tagline: 'Sensei GenAI Multi-Step Tool Orchestration',
      description:
        'Trigger the "Prep for Publish" agentic workflow. The agent invokes discrete tools for SEO auditing, tone analysis, excerpt synthesis, and tag taxonomy generation.',
      highlights: [
        'Multi-step ReAct tool calling via Groq Llama-3.3-70B',
        'Mandatory Human-in-the-Loop (HITL) approval gate',
        'Complete execution audit trace with step latencies',
        'Non-destructive suggestion staging with editor veto',
      ],
      preview: {
        type: 'agent',
        steps: [
          { name: 'Tool: seo_analyzer', status: 'Passed', score: '98/100 SEO Score' },
          { name: 'Tool: tone_checker', status: 'Verified', score: 'Authoritative / Enterprise' },
          { name: 'Tool: excerpt_generator', status: 'Generated', score: '160 chars synthesized' },
          { name: 'Gate: hitl_gatekeeper', status: 'Awaiting Sign-off', score: 'Ready for Lead Editor' },
        ],
      },
    },
    {
      id: 'eval',
      title: 'Quality & Benchmarks',
      tabLabel: 'Quality Harness',
      icon: Activity,
      tagline: 'RAGAS-Grade Telemetry & Precision Scoring',
      description:
        'Continuously benchmark your retrieval and generation pipelines. Measure Context Precision, Faithfulness, and Answer Relevancy across test datasets.',
      highlights: [
        'Automated synthetic test suite execution',
        'Context Precision@3 scoring benchmarked at 94.2%',
        '100% Agent tool execution reliability verification',
        'Historical quality regression tracking and alerts',
      ],
      preview: {
        type: 'metrics',
        kpis: [
          { label: 'Faithfulness', val: '0.96', target: '>= 0.90' },
          { label: 'Answer Relevancy', val: '0.94', target: '>= 0.85' },
          { label: 'Context Precision', val: '0.92', target: '>= 0.85' },
          { label: 'Edge Latency', val: '12ms', target: '< 15ms' },
        ],
      },
    },
  ];

  const current = features[activeTab] ?? features[0]!;

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Feature Matrix</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Engineered for <span className="text-gradient-firefly">Mission-Critical Content</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Explore the modules powering next-generation content orchestration and real-time personalized delivery.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          const isActive = idx === activeTab;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'text-white bg-gradient-to-r from-[#E8380D]/20 to-[#F56E40]/15 border border-[#E8380D]/40 shadow-lg shadow-[#E8380D]/10'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#FFB347]' : 'text-zinc-400'}`} />
              <span>{feat.tabLabel}</span>
              {isActive && (
                <motion.span
                  layoutId="activeTabBadge"
                  className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-[#E8380D] to-[#FFB347]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Feature Content Showcase Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="surface-card rounded-3xl p-8 sm:p-10 border border-white/[0.09] shadow-2xl shadow-black/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Column: Details & Checklist */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.05] border border-white/10 text-xs font-mono text-[#FFB347]">
              {current.tagline}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {current.description}
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {current.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/25">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-300 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFB347] hover:text-white transition group"
              >
                <span>Launch in Command Center</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Mockup Preview */}
          <div className="lg:col-span-6">
            <div className="surface-elevated rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-xl">
              {/* Window Controls Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] font-mono text-zinc-400">
                    contentpilot-orchestrator // {current.id}.view
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Preview Content Variations */}
              {current.preview.type === 'content' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                      {current.preview.badge}
                    </span>
                    <span className="text-zinc-400 text-[10px]">{current.preview.updated}</span>
                  </div>
                  <h4 className="text-sm font-sans font-bold text-white leading-snug">
                    {current.preview.title}
                  </h4>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <p className="text-[11px] text-zinc-400">
                      <span className="text-zinc-400">Route:</span> {current.preview.slug}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      <span className="text-zinc-400">Author:</span> {current.preview.author}
                    </p>
                    <p className="text-[11px] text-[#FFB347]">
                      <span className="text-zinc-400">Status:</span> {current.preview.status}
                    </p>
                  </div>
                </div>
              )}

              {current.preview.type === 'chat' && (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200">
                    <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                      USER QUERY
                    </p>
                    <p className="font-sans font-medium">{current.preview.query}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#E8380D]/10 via-[#F56E40]/05 to-transparent border border-[#E8380D]/30 text-zinc-200">
                    <p className="font-mono text-[10px] text-[#FFB347] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      RAG SYNTHESIS (GROQ LLAMA-3.3-70B)
                    </p>
                    <p className="font-sans text-xs leading-relaxed text-zinc-300 mb-2.5">
                      {current.preview.response}
                    </p>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      {current.preview.citation}
                    </div>
                  </div>
                </div>
              )}

              {current.preview.type === 'matrix' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <p className="text-[10px] text-zinc-400 uppercase">Target Persona</p>
                    <p className="text-white font-sans font-semibold mt-0.5">{current.preview.segment}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <p className="text-[10px] text-emerald-400 uppercase">Resolved Experience Variant</p>
                    <p className="text-xs font-sans font-medium mt-0.5">{current.preview.deliveredVariant}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                    <span>Performance Uplift:</span>
                    <span className="text-emerald-400 font-bold">{current.preview.lift}</span>
                  </div>
                </div>
              )}

              {current.preview.type === 'agent' && (
                <div className="space-y-2 font-mono text-xs">
                  {current.preview.steps?.map((st, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-zinc-300">{st.name}</span>
                      <span className="text-[11px] text-[#FFB347] font-semibold">{st.score}</span>
                    </div>
                  ))}
                </div>
              )}

              {current.preview.type === 'metrics' && (
                <div className="grid grid-cols-2 gap-3 font-mono">
                  {current.preview.kpis?.map((k, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-[10px] text-zinc-400 uppercase">{k.label}</p>
                      <p className="text-lg font-bold text-white mt-0.5">{k.val}</p>
                      <p className="text-[9px] text-emerald-400 mt-0.5">Target: {k.target}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
