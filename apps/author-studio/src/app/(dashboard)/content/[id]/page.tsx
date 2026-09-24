'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ContentItemDetail, ContentVersionSummary } from '@contentpilot/shared';

export default function ContentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [item, setItem] = useState<ContentItemDetail | null>(null);
  const [versions, setVersions] = useState<ContentVersionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
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
      // Reload version history
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
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
          >
            Live Preview ↗
          </a>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">{error}</div>
      )}
      {successMsg && (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">{successMsg}</div>
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
