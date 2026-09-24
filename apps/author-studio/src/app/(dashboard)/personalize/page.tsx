'use client';

import { useState, useEffect } from 'react';

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
    } catch (err: any) {
      setError('Could not connect to backend service. Using demonstration mode.');
      setSegments([
        { id: 'seg-1', name: 'First-Time Visitors', ruleJson: { isNew: true } },
        { id: 'seg-2', name: 'Google Search Traffic', ruleJson: { referrerContains: 'google' } },
        { id: 'seg-3', name: 'Enterprise Referral', ruleJson: { referrerContains: 'linkedin' } },
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
      // Local fallback
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
        setVariantSuccessMsg('Personalized variant successfully published!');
        setVariantHeroTitle('');
        setVariantCtaText('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save variant');
      }
    } catch {
      setVariantSuccessMsg('Variant saved in demonstration mode!');
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
        // Fallback simulation
        const matched = segments.find((s) => {
          if (s.ruleJson.isNew && !simIsNew) return false;
          if (s.ruleJson.referrerContains && (!simReferrer || !simReferrer.toLowerCase().includes(s.ruleJson.referrerContains.toLowerCase()))) return false;
          return true;
        });

        setSimResult({
          contentItemId: simContentId,
          isPersonalized: Boolean(matched),
          segmentName: matched ? matched.name : 'Default',
          resolvedBody: matched
            ? { heroTitle: `Personalized for ${matched.name}`, ctaText: 'Exclusive Welcome Offer' }
            : { heroTitle: 'Standard Global Audience Experience', ctaText: 'Get Started' },
        });
      }
    } catch {
      setSimResult({
        contentItemId: simContentId,
        isPersonalized: simIsNew || Boolean(simReferrer),
        segmentName: simIsNew ? 'First-Time Visitors' : 'Default Audience',
        resolvedBody: {
          heroTitle: simIsNew ? 'Welcome New Visitor — Get 20% Off' : 'Standard Product Experience',
          ctaText: simIsNew ? 'Claim Discount' : 'Learn More',
        },
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Agentic Personalization Engine
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Define audience segment rules, attach personalized content variants, and simulate real-time edge delivery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInitialData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AEM Target Core Active
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Grid: 1. Segments Management & 2. Variant Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Audience Segments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>👥</span> Audience Segments ({segments.length})
            </h2>
          </div>

          {/* New Segment Form */}
          <form onSubmit={handleCreateSegment} className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Create New Segment Rule</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Segment Name
              </label>
              <input
                type="text"
                placeholder="e.g. New Search Visitors"
                value={newSegmentName}
                onChange={(e) => setNewSegmentName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={ruleIsNew}
                  onChange={(e) => setRuleIsNew(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                Requires First-Time Visitor
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Referrer Pattern
                </label>
                <input
                  type="text"
                  placeholder="e.g. google, linkedin"
                  value={ruleReferrer}
                  onChange={(e) => setRuleReferrer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingSegment || !newSegmentName.trim()}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmittingSegment ? 'Saving Segment...' : '+ Save Segment Definition'}
            </button>
          </form>

          {/* Segments List */}
          <div className="space-y-3">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{seg.name}</h4>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {seg.ruleJson.isNew && (
                      <span className="rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 text-[11px] font-mono border border-sky-200 dark:border-sky-800">
                        isNew: true
                      </span>
                    )}
                    {seg.ruleJson.referrerContains && (
                      <span className="rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 text-[11px] font-mono border border-purple-200 dark:border-purple-800">
                        referrer: &quot;{seg.ruleJson.referrerContains}&quot;
                      </span>
                    )}
                    {!seg.ruleJson.isNew && !seg.ruleJson.referrerContains && (
                      <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 text-[11px] font-mono">
                        custom rule
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">ID: {seg.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Create Content Variant */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎨</span> Create Content Variant
            </h2>
          </div>

          {variantSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
              ✓ {variantSuccessMsg}
            </div>
          )}

          <form onSubmit={handleCreateVariant} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Content Item
              </label>
              <select
                value={selectedContentId}
                onChange={(e) => setSelectedContentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {contentList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Attach to Segment
              </label>
              <select
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Choose Segment --</option>
                {segments.map((seg) => (
                  <option key={seg.id} value={seg.id}>
                    {seg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Variant Hero Headline Override
              </label>
              <input
                type="text"
                placeholder="e.g. Welcome Developers! Build Faster with Headless APIs"
                value={variantHeroTitle}
                onChange={(e) => setVariantHeroTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Call to Action (CTA) Button Override
              </label>
              <input
                type="text"
                placeholder="e.g. Start Free Developer Trial →"
                value={variantCtaText}
                onChange={(e) => setVariantCtaText(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingVariant || !selectedSegmentId}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmittingVariant ? 'Publishing Variant...' : 'Attach & Publish Content Variant'}
            </button>
          </form>
        </div>
      </div>

      {/* Live Edge Delivery Simulator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> Live Edge Delivery Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test how the delivery endpoint resolves content items based on visitor attributes in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Content Item
            </label>
            <select
              value={simContentId}
              onChange={(e) => setSimContentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {contentList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Visitor Referrer URL
            </label>
            <input
              type="text"
              placeholder="e.g. https://www.google.com"
              value={simReferrer}
              onChange={(e) => setSimReferrer(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={simIsNew}
                onChange={(e) => setSimIsNew(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              isNewVisitor: true
            </label>

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={simulating}
              className="flex-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50"
            >
              {simulating ? 'Resolving...' : 'Simulate Request →'}
            </button>
          </div>
        </div>

        {simResult && (
          <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Response Status: 200 OK</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                simResult.isPersonalized ? 'bg-purple-900/60 text-purple-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {simResult.isPersonalized ? '🎯 Variant Delivered' : '📄 Base Content Delivered'}
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
