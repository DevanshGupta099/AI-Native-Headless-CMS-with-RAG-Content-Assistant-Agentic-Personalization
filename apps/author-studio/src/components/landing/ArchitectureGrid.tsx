'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Binary, Brain, Zap, Cpu } from 'lucide-react';

export default function ArchitectureGrid() {
  const pillars = [
    {
      id: 'lake',
      number: '01',
      title: 'Content Lake Architecture',
      subtitle: 'AEM Core Repository Equivalent',
      description: 'Structured, versioned document storage with schema validation, draft/published workflows, and zero-loss audit trails.',
      icon: Database,
      accent: 'from-blue-500/20 via-blue-500/10 to-transparent',
      borderColor: 'group-hover:border-blue-500/40',
      iconColor: 'text-blue-400',
      badge: 'Prisma + PostgreSQL 16',
      metrics: [
        { label: 'Storage', val: 'PostgreSQL Relational' },
        { label: 'Audit Trail', val: 'Immutable Timestamps' },
      ],
    },
    {
      id: 'vector',
      number: '02',
      title: 'Dense Vector Intelligence',
      subtitle: 'pgvector Semantic Retrieval Fabric',
      description: 'Automatic text chunking and 384-dimensional dense vector embeddings indexed with HNSW cosine distance for sub-5ms semantic lookup.',
      icon: Binary,
      accent: 'from-[#E8380D]/20 via-[#F56E40]/10 to-transparent',
      borderColor: 'group-hover:border-[#E8380D]/40',
      iconColor: 'text-[#FFB347]',
      badge: 'BAAI/bge-small-en-v1.5',
      metrics: [
        { label: 'Embedding Space', val: '384 Dimensions' },
        { label: 'Vector Index', val: 'pgvector HNSW Cosine' },
      ],
    },
    {
      id: 'agent',
      number: '03',
      title: 'Autonomous Agent Pipeline',
      subtitle: 'Adobe Sensei GenAI Equivalent',
      description: 'Multi-step agent orchestrator running SEO verification, tone checks, automated summary generation, with mandatory HITL approval.',
      icon: Brain,
      accent: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/40',
      iconColor: 'text-amber-400',
      badge: 'Groq Llama-3.3-70B',
      metrics: [
        { label: 'Reasoning Engine', val: 'Llama-3.3-70B Versatile' },
        { label: 'Safety Gate', val: '100% HITL Enforced' },
      ],
    },
    {
      id: 'delivery',
      number: '04',
      title: 'Edge Personalization Fabric',
      subtitle: 'Adobe Target & Experience Delivery',
      description: 'Real-time visitor persona classification and dynamic variant resolution served at the edge under 15ms latency SLAs.',
      icon: Zap,
      accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
      badge: 'Next.js 15 Edge SSR',
      metrics: [
        { label: 'Edge Resolution', val: '< 15ms Latency' },
        { label: 'Context Engine', val: 'Geo + Device + Behavior' },
      ],
    },
  ];

  return (
    <section id="architecture" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4"
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Core Infrastructure Architecture</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
        >
          Four Pillars of{' '}
          <span className="text-gradient-firefly">Enterprise GenAI</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-zinc-400"
        >
          Architected to replicate and elevate Adobe Experience Cloud enterprise standards with modern open AI foundations and microsecond response times.
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group surface-card rounded-2xl p-7 border border-white/[0.08] ${pillar.borderColor} transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1`}
            >
              {/* Corner Ambient Glow */}
              <div
                className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${pillar.accent} blur-3xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`}
              />

              <div>
                {/* Header row: Number + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-zinc-400 tracking-wider">
                    MODULE // {pillar.number}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/10">
                    {pillar.badge}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className={`p-2.5 rounded-xl bg-white/[0.05] border border-white/10 ${pillar.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FFB347] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mt-4">
                  {pillar.description}
                </p>
              </div>

              {/* Metrics Footer */}
              <div className="mt-8 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-4">
                {pillar.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      {m.label}
                    </p>
                    <p className="text-xs font-semibold text-zinc-200 mt-0.5">
                      {m.val}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
