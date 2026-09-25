'use client';

import React, { useState } from 'react';
import {
  Split,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  ArrowRight,
} from 'lucide-react';

interface SimulatedSegment {
  id: string;
  name: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaStyle: string;
  matchedRule: string;
  edgeLatencyMs: number;
}

const PRESET_SEGMENTS: SimulatedSegment[] = [
  {
    id: 'seg-default',
    name: 'Default (Baseline Organic)',
    badge: 'GENERAL AUDIENCE',
    headline: 'AI-Native Headless CMS for Modern Digital Teams',
    subheadline: 'Decouple presentation from structured content with automated vector retrieval and governance.',
    ctaText: 'Explore Platform Features',
    ctaStyle: 'btn-secondary',
    matchedRule: 'Fallback Baseline (No specific audience condition satisfied)',
    edgeLatencyMs: 9,
  },
  {
    id: 'seg-enterprise',
    name: 'Enterprise Decision Maker',
    badge: 'HIGH INTENT B2B',
    headline: 'Adobe Experience Cloud Parity with Autonomous GenAI Architecture',
    subheadline: 'Eliminate content bottlenecks with sub-15ms edge personalization, 100% HITL governance, and pgvector embeddings.',
    ctaText: 'Schedule Architecture Deep-Dive',
    ctaStyle: 'btn-firefly',
    matchedRule: 'traits.companySize > 500 OR referrer contains "linkedin"',
    edgeLatencyMs: 11,
  },
  {
    id: 'seg-new-visitor',
    name: 'First-Time Developer Visitor',
    badge: 'NEW VISITOR',
    headline: 'Instant Headless CMS API with Streaming RAG Copilot',
    subheadline: 'Spin up high-speed TypeScript APIs, Next.js 15 App Router frontends, and Groq Llama-3.3 inference in seconds.',
    ctaText: 'Read Developer Quickstart',
    ctaStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    matchedRule: 'context.isNewVisitor == true',
    edgeLatencyMs: 12,
  },
];

export default function VisualABSimulator() {
  const [activePreset, setActivePreset] = useState<'all' | string>('all');
  const [simulatedDevice, setSimulatedDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [visitorTraits, setVisitorTraits] = useState({
    isNew: true,
    referrer: 'google.com',
    industry: 'Enterprise Software',
  });

  // Calculate live dynamic match based on controls
  const resolveActiveSegment = (): SimulatedSegment => {
    if (visitorTraits.referrer.includes('linkedin') || visitorTraits.industry.includes('Enterprise')) {
      return PRESET_SEGMENTS[1]!;
    }
    if (visitorTraits.isNew) {
      return PRESET_SEGMENTS[2]!;
    }
    return PRESET_SEGMENTS[0]!;
  };

  const resolved = resolveActiveSegment();

  return (
    <div className="surface-card rounded-3xl border border-white/[0.08] p-6 space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#E8380D] to-[#FFB347] flex items-center justify-center">
              <Split className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Visual Audience A/B Multi-Segment Simulator</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              LIVE EDGE MOCKUP
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Preview how personalized headlines, CTAs, and layout variations resolve side-by-side at edge nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setSimulatedDevice('desktop')}
              className={`p-1.5 rounded-lg transition ${
                simulatedDevice === 'desktop' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Desktop View"
              aria-label="Desktop preview"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setSimulatedDevice('mobile')}
              className={`p-1.5 rounded-lg transition ${
                simulatedDevice === 'mobile' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Mobile View"
              aria-label="Mobile preview"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* View Filter */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActivePreset('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activePreset === 'all'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Side-by-Side (3)
            </button>
            <button
              type="button"
              onClick={() => setActivePreset('resolved')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activePreset === 'resolved'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Live Resolved Only
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Parameters Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block mb-1.5 flex items-center gap-1">
            <Globe className="h-3 w-3 text-blue-400" />
            <span>Referrer Source</span>
          </label>
          <select
            value={visitorTraits.referrer}
            onChange={(e) => setVisitorTraits({ ...visitorTraits, referrer: e.target.value })}
            className="w-full bg-[#12151e] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E8380D]/50"
          >
            <option value="direct">Direct Traffic (None)</option>
            <option value="google.com">Google Organic Search</option>
            <option value="linkedin.com/enterprise">LinkedIn Enterprise Campaign</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block mb-1.5 flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Visitor Lifecycle</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisitorTraits({ ...visitorTraits, isNew: true })}
              className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition ${
                visitorTraits.isNew
                  ? 'bg-[#E8380D]/20 border-[#E8380D]/50 text-white'
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              First-Time
            </button>
            <button
              type="button"
              onClick={() => setVisitorTraits({ ...visitorTraits, isNew: false })}
              className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition ${
                !visitorTraits.isNew
                  ? 'bg-[#E8380D]/20 border-[#E8380D]/50 text-white'
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              Returning
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block mb-1.5 flex items-center gap-1">
            <Sliders className="h-3 w-3 text-emerald-400" />
            <span>Target Vertical Trait</span>
          </label>
          <select
            value={visitorTraits.industry}
            onChange={(e) => setVisitorTraits({ ...visitorTraits, industry: e.target.value })}
            className="w-full bg-[#12151e] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E8380D]/50"
          >
            <option value="General Consumer">General Consumer</option>
            <option value="Enterprise Software">Enterprise Software / SaaS</option>
            <option value="Financial Banking">Financial Services & Banking</option>
          </select>
        </div>
      </div>

      {/* Visual Preview Grid */}
      <div
        className={`grid gap-4 ${
          activePreset === 'resolved'
            ? 'grid-cols-1 max-w-2xl mx-auto'
            : simulatedDevice === 'mobile'
            ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
            : 'grid-cols-1 lg:grid-cols-3'
        }`}
      >
        {(activePreset === 'resolved' ? [resolved] : PRESET_SEGMENTS).map((seg) => {
          const isActivelyDelivered = seg.id === resolved.id;

          return (
            <div
              key={seg.id}
              className={`relative rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isActivelyDelivered
                  ? 'border-[#E8380D]/60 bg-gradient-to-b from-[#161a26] to-[#0c0e14] shadow-xl shadow-[#E8380D]/10 ring-1 ring-[#E8380D]/30'
                  : 'border-white/[0.07] bg-[#0c0e14]/90 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Segment Pill Badge */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 font-bold uppercase tracking-wider block w-fit mb-1">
                    {seg.badge}
                  </span>
                  <p className="text-xs font-bold text-white">{seg.name}</p>
                </div>
                {isActivelyDelivered && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SERVED</span>
                  </div>
                )}
              </div>

              {/* Rendered Experience Mockup */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#FFB347] bg-[#E8380D]/10 px-2.5 py-0.5 rounded-full border border-[#E8380D]/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Target Dynamic Hero</span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-snug tracking-tight">
                    {seg.headline}
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {seg.subheadline}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition ${seg.ctaStyle}`}
                  >
                    <span>{seg.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Edge Delivery Telemetry Bar */}
              <div className="p-3 bg-black/50 border-t border-white/[0.05] text-[10px] font-mono flex items-center justify-between text-zinc-400">
                <span className="truncate pr-2 text-zinc-500" title={seg.matchedRule}>
                  Rule: {seg.matchedRule}
                </span>
                <span className="text-emerald-400 shrink-0 font-bold">
                  {seg.edgeLatencyMs}ms Edge
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
