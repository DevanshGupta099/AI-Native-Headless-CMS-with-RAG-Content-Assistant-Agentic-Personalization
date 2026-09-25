'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Database, ShieldCheck, Zap, ExternalLink, Sparkles } from 'lucide-react';
import HeroParticleField from '@/components/canvas/HeroParticleField';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-24 pb-16">
      {/* 3D WebGL Particle Constellation */}
      <HeroParticleField />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Floating Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 bg-gradient-to-r from-[#E8380D]/10 via-[#F56E40]/10 to-transparent border border-[#E8380D]/30 backdrop-blur-md mb-8 shadow-lg shadow-[#E8380D]/5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8380D] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F56E40]" />
          </span>
          <span className="text-xs font-mono font-medium text-[#FFB347] tracking-wider uppercase">
            Adobe Consulting Stack • Next-Gen GenAI Architecture
          </span>
          <span className="text-zinc-500 text-xs">•</span>
          <span className="text-xs text-zinc-300 font-mono">v4.2 Production Ready</span>
        </motion.div>

        {/* Master Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]"
        >
          AI-Native Content Intelligence{' '}
          <span className="text-gradient-firefly block sm:inline">
            for Enterprise Scale
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed"
        >
          A unified, headless ecosystem fusing{' '}
          <span className="text-zinc-200 font-medium">AEM Content Lakes</span>,{' '}
          <span className="text-zinc-200 font-medium">Target Personalization</span>, and{' '}
          <span className="text-zinc-200 font-medium">Sensei GenAI Agent Tooling</span> with dense vector retrieval and human-in-the-loop governance.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
        >
          <Link
            href="/dashboard"
            className="btn-firefly px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 group shadow-xl shadow-[#E8380D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#architecture"
            className="btn-secondary px-6 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Cpu className="h-4 w-4 text-[#F56E40]" />
            <span>Explore Architecture</span>
          </a>

          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost px-5 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-white/[0.05] transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Live Delivery Edge</span>
          </a>
        </motion.div>

        {/* Feature Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl"
        >
          <div className="surface-card rounded-xl p-3 flex items-center gap-2.5 text-left border border-white/[0.06]">
            <div className="h-8 w-8 rounded-lg bg-[#E8380D]/15 text-[#FFB347] flex items-center justify-center shrink-0 border border-[#E8380D]/25">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">Groq LPUs</p>
              <p className="text-[10px] text-zinc-400 font-mono">Llama-3.3-70B</p>
            </div>
          </div>

          <div className="surface-card rounded-xl p-3 flex items-center gap-2.5 text-left border border-white/[0.06]">
            <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/25">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">pgvector Lake</p>
              <p className="text-[10px] text-zinc-400 font-mono">384-dim BGE</p>
            </div>
          </div>

          <div className="surface-card rounded-xl p-3 flex items-center gap-2.5 text-left border border-white/[0.06]">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">HITL Safety</p>
              <p className="text-[10px] text-zinc-400 font-mono">Zero Auto-Publish</p>
            </div>
          </div>

          <div className="surface-card rounded-xl p-3 flex items-center gap-2.5 text-left border border-white/[0.06]">
            <div className="h-8 w-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">Edge Target</p>
              <p className="text-[10px] text-zinc-400 font-mono">&lt; 15ms Latency</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
