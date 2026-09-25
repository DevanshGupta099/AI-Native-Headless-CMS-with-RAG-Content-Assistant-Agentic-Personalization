'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Layers, ShieldCheck, Globe, Sparkles } from 'lucide-react';

export default function TechStack() {
  const stack = [
    {
      category: 'INFERENCE COMPUTE',
      title: 'Groq LPU Architecture',
      spec: 'Llama-3.3-70B-Versatile',
      detail: 'Ultra-low latency streaming inference for RAG synthesis and multi-step agent reasoning.',
      stat: '500+ tokens/sec',
      icon: Cpu,
    },
    {
      category: 'VECTOR INTELLIGENCE',
      title: 'Neon Serverless PostgreSQL',
      spec: 'pgvector 0.7 + HNSW Indexes',
      detail: 'Relational ACID persistence married with dense 384-dimensional cosine distance similarity.',
      stat: '< 4ms query lookup',
      icon: Database,
    },
    {
      category: 'SEMANTIC EMBEDDINGS',
      title: 'HuggingFace BGE Model',
      spec: 'BAAI/bge-small-en-v1.5',
      detail: 'State-of-the-art dense embedding representations trained on massive enterprise text corpora.',
      stat: '384 Dimensions',
      icon: Sparkles,
    },
    {
      category: 'EXPERIENCE FRAMEWORK',
      title: 'Next.js 15 App Router',
      spec: 'React 19 + TypeScript Strict',
      detail: 'Zero-JS Server Components for the edge delivery engine with instant client-side hydration.',
      stat: 'Sub-15ms edge dispatch',
      icon: Globe,
    },
    {
      category: 'ENTERPRISE GOVERNANCE',
      title: 'HITL Safety Gatekeeper',
      spec: 'Zod Schemas + JWT Tokens',
      detail: 'Human-in-the-loop verification pipeline prevents unauthorized automated content mutations.',
      stat: '100% Policy Enforced',
      icon: ShieldCheck,
    },
    {
      category: 'INTERACTIVE VISUALIZATION',
      title: 'Three.js & Framer Motion',
      spec: 'WebGL Vector Shaders',
      detail: 'Hardware-accelerated 3D vector constellation canvas and smooth fluid motion.',
      stat: '60 FPS Smooth Render',
      icon: Layers,
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4">
          <Terminal className="h-3.5 w-3.5" />
          <span>Under the Hood</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Enterprise Open-Stack{' '}
          <span className="text-gradient-firefly">Engineering</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Built on production-grade infrastructure designed for zero downtime, sub-second generation, and robust developer ergonomics.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stack.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="surface-card rounded-2xl p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-black/60"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    {item.category}
                  </span>
                  <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-300 group-hover:text-[#FFB347] transition-colors border border-white/5">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FFB347] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mb-3 font-medium">
                  {item.spec}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400">Performance Metric</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{item.stat}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
