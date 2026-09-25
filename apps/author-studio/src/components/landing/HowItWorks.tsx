'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Cpu, Radio, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Author & Ingest',
      subtitle: 'Structured Content Modeling',
      desc: 'Editors compose rich content items in Author Studio. Documents are schema-validated with Zod, assigned versions, and stored with relational consistency in Neon PostgreSQL.',
      icon: Edit3,
      badge: 'Headless CMS',
      details: ['Atomic drafts & version diffs', 'Zod validation pipeline', 'Multi-tenant content isolation'],
    },
    {
      step: '02',
      title: 'Vectorize & Reason',
      subtitle: 'Sensei GenAI Agent Processing',
      desc: 'Upon publication, documents are dynamically chunked and converted into 384-dim dense vectors. The Sensei agent triggers SEO audits, taxonomy tagging, and awaits human sign-off.',
      icon: Cpu,
      badge: 'RAG + Agentic Tooling',
      details: ['HuggingFace 384-dim BGE vectors', 'pgvector HNSW Cosine Indexing', 'HITL Lead Editor Gatekeeper'],
    },
    {
      step: '03',
      title: 'Personalized Edge Delivery',
      subtitle: 'Target-Grade Omnichannel Fabric',
      desc: 'Visitors request experiences through Next.js 15 Edge SSR. The rule engine matches device, geo, and intent signals to resolve tailored content variants in under 15 milliseconds.',
      icon: Radio,
      badge: 'Sub-15ms Edge Fabric',
      details: ['Zero layout shift (CLS)', 'Dynamic Hero & CTA variants', 'Edge caching with instant revalidation'],
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4">
          <span>Lifecycle Architecture</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          From Authoring to <span className="text-gradient-firefly">Edge Delivery</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          A seamless continuous pipeline connecting creation, AI semantic intelligence, and real-time personalized presentation.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="surface-card rounded-2xl p-7 border border-white/[0.08] relative group hover:border-[#E8380D]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-extrabold text-white/20 group-hover:text-[#FFB347]/40 transition-colors">
                    {st.step}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-[#FFB347] border border-[#E8380D]/20">
                    {st.badge}
                  </span>
                </div>

                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#E8380D]/20 to-[#F56E40]/10 text-[#FFB347] flex items-center justify-center mb-4 border border-[#E8380D]/25">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FFB347] transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  {st.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {st.desc}
                </p>
              </div>

              {/* Checklist */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                {st.details.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
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
