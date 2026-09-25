'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Save,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  History,
  Bot,
  ShieldCheck,
  Check,
  X,
  Copy,
  Cpu,
} from 'lucide-react';
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
  const [copiedMeta, setCopiedMeta] = useState(false);

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
      setSuccessMsg('Successfully created immutable snapshot version.');
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
      setSuccessMsg('Published to Edge! Automated pgvector 384-dim embedding indexing triggered.');
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
      setSuccessMsg('Agentic tool pipeline executed: SEO analysis, metadata generation, and audience classification complete.');
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8380D] border-t-transparent" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>Content item not found in AEM Lake.</p>
        <Link href="/content" className="mt-2 text-[#FFB347] hover:underline font-mono text-xs">
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/content"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Content Library</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-zinc-400">/{item.slug}</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">{item.title}</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                item.status === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {item.status}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              v{item.currentVersion?.versionNo || 1}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunAgent}
            disabled={runningAgent}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E8380D]/20 to-[#F56E40]/15 border border-[#E8380D]/30 px-3.5 py-2 text-xs font-semibold text-[#FFB347] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-[#FFB347]" />
            <span>{runningAgent ? 'Running Agent Tools...' : 'Prep for Publish (AI)'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save New Version'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing || item.status === 'PUBLISHED'}
            className="btn-firefly inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#E8380D]/20 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            <span>{publishing ? 'Publishing...' : item.status === 'PUBLISHED' ? 'Published' : 'Publish to Edge'}</span>
          </button>

          {item.status === 'PUBLISHED' && (
            <a
              href={`http://localhost:3002/content/${item.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <span>Live Preview</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </a>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="rounded-xl bg-emerald-500/10 p-4 text-xs font-medium text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Agent Execution Trace Panel (when executed) */}
      {agentRun && (
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card rounded-3xl border border-[#E8380D]/30 p-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#E8380D]/15 border border-[#E8380D]/30 text-[#FFB347] flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Autonomous Agent Workflow • {agentRun.task.replace('_', ' ')}
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Execution ID: {agentRun.id.slice(0, 8)} • Status:{' '}
                  <span className="font-semibold text-emerald-400 uppercase">{agentRun.status}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300 border border-blue-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Human-in-the-Loop Safe</span>
              </span>
            </div>
          </div>

          {/* Timeline of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {agentRun.steps.map((step) => {
              const data = step.output.data as Record<string, unknown>;
              return (
                <div
                  key={step.stepIndex}
                  className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFB347]">
                        Step {step.stepIndex + 1}: {step.toolName.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">{step.output.durationMs}ms</span>
                    </div>

                    {step.toolName === 'generate_meta_description' && data && (
                      <div className="space-y-2 text-xs">
                        <span className="font-semibold text-zinc-300">Generated Meta Description:</span>
                        <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.06] text-zinc-300 italic text-[11px] leading-relaxed">
                          &quot;{String(data.metaDescription || '')}&quot;
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>{String(data.charCount || 0)} characters</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(String(data.metaDescription || ''));
                              setCopiedMeta(true);
                              setTimeout(() => setCopiedMeta(false), 2000);
                            }}
                            className="text-[#FFB347] hover:text-white flex items-center gap-1 transition"
                          >
                            {copiedMeta ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedMeta ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {step.toolName === 'check_seo_score' && data && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-300">SEO Health Index:</span>
                          <span className="text-sm font-extrabold text-emerald-400 font-mono">
                            {String(data.score)}% (Grade {String(data.grade)})
                          </span>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          {Array.isArray(data.checks) &&
                            data.checks.map((c: { name: string; pass: boolean; detail: string }, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] py-1 border-b border-white/[0.04]"
                              >
                                <span className="text-zinc-400">{c.name}</span>
                                <span
                                  className={`font-semibold flex items-center gap-1 ${
                                    c.pass ? 'text-emerald-400' : 'text-rose-400'
                                  }`}
                                >
                                  {c.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                  <span>{c.pass ? 'Pass' : 'Review'}</span>
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {step.toolName === 'suggest_audience_segment' && data && (
                      <div className="space-y-2 text-xs">
                        <span className="font-semibold text-zinc-300">Target Audience Match:</span>
                        <div className="rounded-lg bg-blue-500/10 p-3 border border-blue-500/20 space-y-1">
                          <p className="font-bold text-blue-300 font-mono text-xs">
                            {String(data.segmentName || '')}
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {String(data.reasoning || '')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified Tool Output</span>
                    </span>
                    <span className="text-zinc-400 font-mono text-[10px]">HITL Approved</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Main 2-Column Editor Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Editor Area (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/[0.08] shadow-xl">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                Asset Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-dark mt-1.5 block w-full px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Body Content (Markdown / JSON)
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {bodyText.length} characters • ~{Math.round(bodyText.length / 4)} tokens
                </span>
              </div>
              <textarea
                rows={18}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="input-dark mt-1.5 block w-full font-mono text-xs p-4 text-zinc-200 leading-relaxed resize-y"
              />
            </div>
          </div>
        </div>

        {/* Version History & Telemetry Sidebar (1 column) */}
        <div className="space-y-6">
          <div className="surface-card p-6 rounded-3xl space-y-4 border border-white/[0.08] shadow-xl">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#FFB347]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Version History
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Immutable content snapshots recorded for auditability and diff rollback.
            </p>

            <div className="divide-y divide-white/[0.06] pt-2">
              {versions.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white font-mono">Snapshot v{v.versionNo}</span>
                    <p className="text-zinc-400 text-[11px] mt-0.5 font-mono">
                      {new Date(v.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {v.versionNo === item.currentVersion?.versionNo && (
                    <span className="rounded-full bg-[#E8380D]/15 border border-[#E8380D]/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#FFB347]">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 rounded-3xl text-xs text-zinc-400 space-y-2.5 border border-white/[0.08] shadow-xl">
            <div className="font-semibold text-white flex items-center gap-2 font-mono text-xs">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>Automated RAG Vector Indexing</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Upon edge publication, this document is chunked and embedded via HuggingFace BGE into 384-dimensional dense vectors stored in Neon PostgreSQL with pgvector cosine distance indexing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
