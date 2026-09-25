'use client';

import React from 'react';
import { Check, Layers } from 'lucide-react';

export default function ComparisonTable() {
  const comparison = [
    {
      capability: 'Headless Content Modeling',
      adobeProduct: 'Adobe Experience Manager (AEM Sites)',
      contentPilot: 'Content Lake + Studio with Zod schema enforcement and atomic versions',
      status: true,
    },
    {
      capability: 'Personalized Experiences',
      adobeProduct: 'Adobe Target (Audiences & Activities)',
      contentPilot: 'Dynamic Persona Rule Matrix with sub-15ms edge variant resolution',
      status: true,
    },
    {
      capability: 'Generative AI Assistant',
      adobeProduct: 'Adobe Sensei GenAI Copilot',
      contentPilot: 'Dense RAG Assistant (Llama-3.3-70B) with verifiable source citations',
      status: true,
    },
    {
      capability: 'Autonomous Agent Tooling',
      adobeProduct: 'AEM Assets GenAI Microservices',
      contentPilot: 'Multi-step "Prep for Publish" agent (SEO, Tone, Summary, Taxonomy)',
      status: true,
    },
    {
      capability: 'Vector Retrieval Fabric',
      adobeProduct: 'Proprietary Adobe Experience Platform Vectors',
      contentPilot: 'Neon Serverless PostgreSQL + pgvector 384-dim dense HNSW index',
      status: true,
    },
    {
      capability: 'Human-in-the-Loop Safety',
      adobeProduct: 'Enterprise Workflow Approval Rules',
      contentPilot: 'Cryptographic HITL Gatekeeper — 0% automated unapproved publishing',
      status: true,
    },
    {
      capability: 'Retrieval Quality Harness',
      adobeProduct: 'Adobe Experience Platform Telemetry',
      contentPilot: 'Automated RAGAS Precision@3, Faithfulness, and Answer Relevancy benchmarks',
      status: true,
    },
  ];

  return (
    <section id="compare" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/20 mb-4">
          <Layers className="h-3.5 w-3.5" />
          <span>Enterprise Equivalence</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Mirrored to <span className="text-gradient-firefly">Adobe Experience Cloud</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          How ContentPilot AI aligns with, modernizes, and supercharges the enterprise software stack used by the world’s leading digital brands.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="surface-card rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6 font-semibold">Enterprise Capability</th>
                <th className="py-4 px-6 font-semibold">Adobe Experience Cloud Component</th>
                <th className="py-4 px-6 font-semibold text-[#FFB347]">ContentPilot AI Architecture</th>
                <th className="py-4 px-6 text-center font-semibold">Parity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {comparison.map((row) => (
                <tr
                  key={row.capability}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6 font-semibold text-white font-sans">
                    {row.capability}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 font-mono text-[11px]">
                    {row.adobeProduct}
                  </td>
                  <td className="py-4 px-6 text-zinc-200 font-medium">
                    {row.contentPilot}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
