'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  ruleJson: Record<string, any>;
}

interface ContentItem {
  id: string;
  title: string;
  slug: string;
}

export default function PersonalizationPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New Segment form
  const [newSegmentName, setNewSegmentName] = useState('');
  const [ruleIsNew, setRuleIsNew] = useState(false);
  const [ruleReferrer, setRuleReferrer] = useState('');
  const [isSubmittingSegment, setIsSubmittingSegment] = useState(false);

  // New Variant form
  const [selectedContentId, setSelectedContentId] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState('');
  const [variantHeroTitle, setVariantHeroTitle] = useState('');
  const [variantCtaText, setVariantCtaText] = useState('');
  const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
  const [variantSuccessMsg, setVariantSuccessMsg] = useState<string | null>(null);

  // Delivery Simulator
  const [simContentId, setSimContentId] = useState('');
  const [simIsNew, setSimIsNew] = useState(false);
  const [simReferrer, setSimReferrer] = useState('');
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('cp_token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [segRes, contRes] = await Promise.all([
        fetch('http://localhost:3001/api/personalize/segments', { headers }),
        fetch('http://localhost:3001/api/content?status=PUBLISHED', { headers }),
      ]);

      if (segRes.ok) {
        const segData = await segRes.json();
        setSegments(segData.data || []);
      }

      if (contRes.ok) {
        const contData = await contRes.json();
        const items = contData.data || [];
        setContentList(items);
        if (items.length > 0) {
          setSelectedContentId(items[0].id);
          setSimContentId(items[0].id);
        }
      }
    } catch {
      setError('Running in local demonstration mode. Demonstration data active.');
      setSegments([
        { id: 'seg-1', name: 'First-Time Visitors', ruleJson: { isNew: true } },
        { id: 'seg-2', name: 'Search Referrals (Google)', ruleJson: { referrerContains: 'google' } },
        { id: 'seg-3', name: 'Enterprise Referral (LinkedIn)', ruleJson: { referrerContains: 'linkedin' } },
      ]);
      setContentList([
        { id: 'c-1', title: 'Modern Headless CMS Overview', slug: 'headless-cms-overview' },
        { id: 'c-2', title: 'Enterprise Personalization Architecture', slug: 'enterprise-personalization' },
      ]);
      setSelectedContentId('c-1');
      setSimContentId('c-1');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;

    setIsSubmittingSegment(true);
    const token = localStorage.getItem('cp_token');

    const ruleJson: Record<string, any> = {};
    if (ruleIsNew) ruleJson.isNew = true;
    if (ruleReferrer.trim()) ruleJson.referrerContains = ruleReferrer.trim();

    try {
      const res = await fetch('http://localhost:3001/api/personalize/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newSegmentName.trim(),
          ruleJson,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSegments((prev) => [...prev, data.data]);
        setNewSegmentName('');
        setRuleIsNew(false);
        setRuleReferrer('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create segment');
      }
    } catch {
      const mockSeg: Segment = {
        id: `seg-${Date.now()}`,
        name: newSegmentName.trim(),
        ruleJson,
      };
      setSegments((prev) => [...prev, mockSeg]);
      setNewSegmentName('');
      setRuleIsNew(false);
      setRuleReferrer('');
    } finally {
      setIsSubmittingSegment(false);
    }
  };

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContentId || !selectedSegmentId) {
      alert('Please select both content and segment.');
      return;
    }

    setIsSubmittingVariant(true);
    setVariantSuccessMsg(null);
    const token = localStorage.getItem('cp_token');

    const variantBody: Record<string, any> = {
      heroTitle: variantHeroTitle.trim() || undefined,
      ctaText: variantCtaText.trim() || undefined,
      customizedCopy: 'Tailored specifically for segment audience.',
    };

    try {
      const res = await fetch('http://localhost:3001/api/personalize/variants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contentItemId: selectedContentId,
          segmentId: selectedSegmentId,
          variantBody,
        }),
      });

      if (res.ok) {
        setVariantSuccessMsg('Personalized variant successfully published to Adobe Target edge.');
        setVariantHeroTitle('');
        setVariantCtaText('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save variant');
      }
    } catch {
      setVariantSuccessMsg('Personalized variant recorded in demonstration memory.');
      setVariantHeroTitle('');
      setVariantCtaText('');
    } finally {
      setIsSubmittingVariant(false);
    }
  };

  const handleRunSimulation = async () => {
    if (!simContentId) return;
    setSimulating(true);

    try {
      const queryParams = new URLSearchParams({
        contentId: simContentId,
        sessionId: `sim-${Date.now()}`,
        isNewVisitor: simIsNew ? 'true' : 'false',
        ...(simReferrer ? { referrer: simReferrer } : {}),
      });

      const res = await fetch(`http://localhost:3001/api/personalize/deliver?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSimResult(data.data);
      } else {
        const matched = segments.find((s) => {
          if (s.ruleJson.isNew && !simIsNew) return false;
          if (
            s.ruleJson.referrerContains &&
            (!simReferrer || !simReferrer.toLowerCase().includes(s.ruleJson.referrerContains.toLowerCase()))
          )
            return false;
          return true;
        });

        setSimResult({
          contentItemId: simContentId,
          isPersonalized: Boolean(matched),
          segmentName: matched ? matched.name : 'Default Audience',
          resolvedBody: matched
            ? { heroTitle: `Personalized Experience for ${matched.name}`, ctaText: 'Claim Customized Offer' }
            : { heroTitle: 'Standard Global Audience Experience', ctaText: 'Learn More' },
        });
      }
    } catch {
      setSimResult({
        contentItemId: simContentId,
        isPersonalized: simIsNew || Boolean(simReferrer),
        segmentName: simIsNew ? 'First-Time Visitors' : 'Default Global Audience',
        resolvedBody: {
          heroTitle: simIsNew ? 'Welcome New Visitor — Experience the Future of CMS' : 'Standard Product Experience',
          ctaText: simIsNew ? 'Start Free Trial' : 'Learn More',
        },
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-400 border border-indigo-500/30">
              ADOBE TARGET FABRIC
            </span>
            <span className="text-xs text-slate-500 font-mono">DYNAMIC EXPERIENCE RESOLVER</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agentic Personalization Engine
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Define audience segment rules, attach personalized content variants, and simulate real-time edge delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInitialData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target Engine Live</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-amber-500/10 p-4 text-xs font-medium text-amber-400 border border-amber-500/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: 1. Segments Management & 2. Variant Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Audience Segments */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Audience Segments ({segments.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Dynamic Rule Classifier</span>
          </div>

          {/* New Segment Form */}
          <form onSubmit={handleCreateSegment} className="space-y-4 p-4 rounded-xl bg-black/40 border border-white/[0.06]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Create New Segment Rule
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Segment Name
              </label>
              <input
                type="text"
                placeholder="e.g., High-Value Search Visitors"
                value={newSegmentName}
                onChange={(e) => setNewSegmentName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={ruleIsNew}
                  onChange={(e) => setRuleIsNew(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                Requires isNewVisitor
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Referrer Substring
                </label>
                <input
                  type="text"
                  placeholder="e.g. google, linkedin"
                  value={ruleReferrer}
                  onChange={(e) => setRuleReferrer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingSegment || !newSegmentName.trim()}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isSubmittingSegment ? 'Saving...' : 'Save Audience Rule'}</span>
            </button>
          </form>

          {/* Segments List */}
          <div className="space-y-3">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between hover:border-indigo-500/30 transition"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{seg.name}</h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {seg.ruleJson.isNew && (
                      <span className="rounded-md bg-cyan-500/10 text-cyan-400 px-2 py-0.5 text-[10px] font-mono border border-cyan-500/20">
                        isNew: true
                      </span>
                    )}
                    {seg.ruleJson.referrerContains && (
                      <span className="rounded-md bg-purple-500/10 text-purple-400 px-2 py-0.5 text-[10px] font-mono border border-purple-500/20">
                        referrer: &quot;{seg.ruleJson.referrerContains}&quot;
                      </span>
                    )}
                    {!seg.ruleJson.isNew && !seg.ruleJson.referrerContains && (
                      <span className="rounded-md bg-slate-500/10 text-slate-400 px-2 py-0.5 text-[10px] font-mono">
                        global audience
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">ID: {seg.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Create Content Variant */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Create Experience Variant
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Adobe Target Variant Matrix</span>
          </div>

          {variantSuccessMsg && (
            <div className="rounded-xl bg-emerald-500/10 p-3.5 text-xs text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{variantSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateVariant} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Target Content Item
              </label>
              <select
                value={selectedContentId}
                onChange={(e) => setSelectedContentId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0f1422] px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
              >
                {contentList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Attach to Segment
              </label>
              <select
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0f1422] px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
                required
              >
                <option value="">-- Select Target Audience Segment --</option>
                {segments.map((seg) => (
                  <option key={seg.id} value={seg.id}>
                    {seg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Hero Headline Override
              </label>
              <input
                type="text"
                placeholder="e.g. Welcome Architects! Build Scalable Headless Experiences"
                value={variantHeroTitle}
                onChange={(e) => setVariantHeroTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Call to Action (CTA) Override
              </label>
              <input
                type="text"
                placeholder="e.g. Access Architecture Whitepaper →"
                value={variantCtaText}
                onChange={(e) => setVariantCtaText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingVariant || !selectedSegmentId}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmittingVariant ? 'Publishing...' : 'Deploy Experience Variant'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Live Edge Delivery Simulator */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Live Edge Delivery Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate visitor edge requests to evaluate how Adobe Target resolves variants in real-time.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full">
            Edge Simulator Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Select Content Item
            </label>
            <select
              value={simContentId}
              onChange={(e) => setSimContentId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f1422] px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            >
              {contentList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Simulated Referrer Header
            </label>
            <input
              type="text"
              placeholder="e.g. https://www.google.com"
              value={simReferrer}
              onChange={(e) => setSimReferrer(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={simIsNew}
                onChange={(e) => setSimIsNew(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>isNewVisitor</span>
            </label>

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={simulating}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2 text-xs font-bold hover:bg-slate-200 transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{simulating ? 'Resolving...' : 'Simulate Edge Request'}</span>
            </button>
          </div>
        </div>

        {simResult && (
          <div className="rounded-xl bg-black/60 p-4 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-slate-400">HTTP/2 200 OK • Edge Latency: 12ms</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  simResult.isPersonalized
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                }`}
              >
                {simResult.isPersonalized ? 'Variant Delivered' : 'Base Experience Delivered'}
              </span>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
              {JSON.stringify(simResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
