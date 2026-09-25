'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function MetricsSection() {
  const metrics = [
    {
      label: 'RAG Context Precision@3',
      val: '94.2%',
      sub: 'Dense BGE-small retrieval benchmark',
      progress: 94.2,
      accent: 'text-[#FFB347]',
      bar: 'bg-gradient-to-r from-[#E8380D] to-[#FFB347]',
    },
    {
      label: 'Agent Tool Reliability',
      val: '100%',
      sub: 'Multi-step tool execution validation',
      progress: 100,
      accent: 'text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    },
    {
      label: 'Edge Delivery Latency',
      val: '< 15ms',
      sub: 'Personalized dynamic variant resolution',
      progress: 88,
      accent: 'text-blue-400',
      bar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    },
    {
      label: 'HITL Policy Enforcement',
      val: '100%',
      sub: 'Zero unauthorized mutations to live lake',
      progress: 100,
      accent: 'text-purple-400',
      bar: 'bg-gradient-to-r from-purple-500 to-pink-400',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Container with glowing backdrop */}
      <div className="surface-card rounded-3xl p-8 sm:p-12 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#E8380D]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4">
            <Activity className="h-3.5 w-3.5" />
            <span>Telemetry & Quality Benchmarks</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tested & Verified for <span className="text-gradient-firefly">Enterprise SLAs</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Rigorous evaluation metrics measured across our synthetic retrieval testbed and production edge edge-nodes.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-mono text-zinc-400 mb-2">{m.label}</p>
                <p className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${m.accent} mb-2`}>
                  {m.val}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{m.sub}</p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${m.bar}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
