'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ContentItemDetail, ContentVersionSummary, AgentRun } from '@contentpilot/shared';

export default function ContentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [item, setItem] = useState<ContentItemDetail | null>(null);
  const [versions, setVersions] = useState<ContentVersionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [runningAgent, setRunningAgent] = useState(false);
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemRes, versionsRes] = await Promise.all([
        api.get<{ data: ContentItemDetail }>(`/api/content/${id}`),
        api.get<{ data: ContentVersionSummary[] }>(`/api/content/${id}/versions`),
      ]);

      const data = itemRes.data;
      setItem(data);
      setTitle(data.title);

      const rawBody = data.currentVersion?.bodyJson?.text;
      setBodyText(typeof rawBody === 'string' ? rawBody : JSON.stringify(data.currentVersion?.bodyJson || {}, null, 2));
      setVersions(versionsRes.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load content item');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.put<{ data: ContentItemDetail }>(`/api/content/${id}`, {
        title,
        body: {
          text: bodyText,
        },
      });

      setItem(res.data);
      setSuccessMsg('Saved successfully as a new version!');
      const versionsRes = await api.get<{ data: ContentVersionSummary[] }>(`/api/content/${id}/versions`);
      setVersions(versionsRes.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update content');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post<{ data: ContentItemDetail }>(`/api/content/${id}/publish`);
      setItem(res.data);
      setSuccessMsg('Published! Background vector embedding pipeline triggered.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to publish content');
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleRunAgent = async () => {
    setRunningAgent(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post<{ data: AgentRun }>('/api/assistant/agent/execute', {
        task: 'prepare_publish',
        contentId: id,
      });

      setAgentRun(res.data);
      setSuccessMsg('Agent completed all 3 preparation tools. Review the checklist below.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Agent execution failed');
      }
    } finally {
      setRunningAgent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Content item not found.</p>
        <Link href="/content" className="mt-2 text-indigo-600 hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/content" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
              ← Content Library
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-slate-500">/{item.slug}</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{item.title}</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                item.status === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {item.status}
            </span>
            <span className="text-xs text-slate-500">v{item.currentVersion?.versionNo || 1}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunAgent}
            disabled={runningAgent}
            className="rounded-lg bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-100 transition focus:outline-none dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>{runningAgent ? 'Running Agent Tools...' : 'Prep for Publish (AI)'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save New Version'}
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing || item.status === 'PUBLISHED'}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : item.status === 'PUBLISHED' ? 'Published' : 'Publish Content'}
          </button>

          <a
            href={`http://localhost:3002/content/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Live Preview ↗
          </a>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">{error}</div>}
      {successMsg && (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">{successMsg}</div>
      )}

      {/* Agent Execution Trace Panel (when executed) */}
      {agentRun && (
        <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Agent Execution Trace • {agentRun.task}
                </h3>
                <p className="text-xs text-slate-500">
                  Run ID: {agentRun.id} • Status: <span className="font-semibold text-emerald-600">{agentRun.status}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              Human-in-the-Loop Approval Required
            </span>
          </div>

          {/* Timeline of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {agentRun.steps.map((step) => {
              const data = step.output.data as Record<string, unknown>;
              return (
                <div
                  key={step.stepIndex}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Step {step.stepIndex + 1}: {step.toolName.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{step.output.durationMs}ms</span>
                    </div>

                    {step.toolName === 'generate_meta_description' && data && (
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Recommended Meta Description:</p>
                        <p className="italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          "{String(data.metaDescription || '')}"
                        </p>
                        <p className="text-[10px] text-slate-400">{String(data.charCount || 0)} characters</p>
                      </div>
                    )}

                    {step.toolName === 'check_seo_score' && data && (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">SEO Health Score:</span>
                          <span className="text-sm font-extrabold text-emerald-600">{String(data.score)}% (Grade {String(data.grade)})</span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {Array.isArray(data.checks) &&
                            data.checks.map((c: { name: string; pass: boolean; detail: string }, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">{c.name}</span>
                                <span className={c.pass ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                                  {c.pass ? '✓ Pass' : '✗ Check'}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {step.toolName === 'suggest_audience_segment' && data && (
                      <div className="text-xs space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Suggested Segment:</span>
                        <div className="rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 p-2.5 border border-indigo-100 dark:border-indigo-900">
                          <p className="font-bold text-indigo-700 dark:text-indigo-300">{String(data.segmentName || '')}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{String(data.reasoning || '')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span>✓</span> Validated
                    </span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Approve Step
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main 2-Column Editor Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Editor Area (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Body Content
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {bodyText.length} characters • ~{Math.round(bodyText.length / 4)} tokens
                </span>
              </div>
              <textarea
                rows={16}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="mt-1 block w-full font-mono text-xs rounded-lg border border-slate-300 p-3.5 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Version History Sidebar (1 column) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Version Snapshots
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">Immutable historical versions for audit and diffs.</p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {versions.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Version {v.versionNo}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {new Date(v.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {v.versionNo === item.currentVersion?.versionNo && (
                    <span className="rounded bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🤖</span> AI Publishing Copilot
            </div>
            <p>
              When published, this content will be automatically chunked and embedded into pgvector (384 dimensions) for RAG assistant retrieval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
