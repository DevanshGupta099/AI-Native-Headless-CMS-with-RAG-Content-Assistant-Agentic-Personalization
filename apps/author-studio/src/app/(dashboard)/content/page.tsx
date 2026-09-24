'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ContentItemSummary, ContentListResponse } from '@contentpilot/shared';

export default function ContentListPage() {
  const [items, setItems] = useState<ContentItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ContentListResponse>('/api/content', {
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        limit: 50,
      });
      setItems(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch content items');
      }
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Published
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Content Library</h1>
          <p className="text-sm text-slate-500">Manage, version, publish, and personalize CMS items.</p>
        </div>
        <Link
          href="/content/new"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          + Create New Content
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white w-64"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Content Types</option>
            <option value="BLOG_POST">Blog Post</option>
            <option value="LANDING_PAGE">Landing Page</option>
            <option value="PRODUCT_PAGE">Product Page</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Active (Draft & Published)</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <button
          onClick={() => fetchContent()}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200">
          {error}
        </div>
      )}

      {/* Content Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Title & Slug</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Last Updated</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                  <p className="mt-2 text-xs">Loading content...</p>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No content items found</p>
                  <p className="mt-1 text-xs text-slate-500">Create your first blog post or landing page to get started.</p>
                  <Link
                    href="/content/new"
                    className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                  >
                    + Create First Item
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <Link
                      href={`/content/${item.id}`}
                      className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs text-slate-500">/{item.slug}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium">
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/content/${item.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
                    >
                      Edit & Prep →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
