'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  Archive,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ContentItemSummary, ContentListResponse } from '@contentpilot/shared';

export default function ContentListPage() {
  const [items, setItems] = useState<ContentItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Published</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-400 border border-zinc-500/20 font-mono">
            <Archive className="h-3 w-3" />
            <span>Archived</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FFB347] border border-amber-500/20 font-mono">
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </span>
        );
    }
  };

  const types = [
    { label: 'All Types', val: '' },
    { label: 'Blog Posts', val: 'BLOG_POST' },
    { label: 'Landing Pages', val: 'LANDING_PAGE' },
    { label: 'Product Pages', val: 'PRODUCT_PAGE' },
  ];

  const statuses = [
    { label: 'All Statuses', val: '' },
    { label: 'Draft', val: 'DRAFT' },
    { label: 'Published', val: 'PUBLISHED' },
    { label: 'Archived', val: 'ARCHIVED' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#E8380D]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#FFB347] border border-[#E8380D]/30">
              AEM CONTENT FABRIC
            </span>
            <span className="text-xs text-zinc-400 font-mono">• ASSET INVENTORY</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Content Studio Library
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Author, version, publish, and personalize enterprise headless CMS assets with dense vector retrieval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/content/new"
            className="btn-firefly inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg shadow-[#E8380D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Content</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-card rounded-2xl p-4 space-y-3 border border-white/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search content by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark w-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500"
            />
          </div>

          {/* View Mode Toggle & Refresh */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-[#E8380D]/20 text-[#FFB347] border border-[#E8380D]/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="List Table View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-[#E8380D]/20 text-[#FFB347] border border-[#E8380D]/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={fetchContent}
              disabled={loading}
              className="btn-secondary inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#FFB347]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mr-2">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {types.map((t) => (
            <button
              key={t.label}
              onClick={() => setTypeFilter(t.val)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                typeFilter === t.val
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}

          <span className="text-zinc-600">|</span>

          {statuses.map((s) => (
            <button
              key={s.label}
              onClick={() => setStatusFilter(s.val)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === s.val
                  ? 'bg-[#E8380D]/20 text-[#FFB347] border border-[#E8380D]/30'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div className="surface-card rounded-2xl py-20 text-center text-zinc-400 border border-white/[0.08]">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#E8380D] border-t-transparent" />
          <p className="mt-3 text-xs font-mono">Querying AEM Content Lake...</p>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="surface-card rounded-2xl py-20 text-center text-zinc-400 border border-white/[0.08]">
          <div className="h-12 w-12 rounded-2xl bg-[#E8380D]/10 text-[#FFB347] flex items-center justify-center mx-auto mb-4 border border-[#E8380D]/20">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No content items found</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {search || typeFilter || statusFilter
              ? 'Try adjusting your search criteria or filter tags.'
              : 'Create your first blog post or enterprise landing page to seed the lake.'}
          </p>
          <Link
            href="/content/new"
            className="mt-5 btn-firefly inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Item</span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="surface-card card-interactive rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between group hover:border-[#E8380D]/40 shadow-lg shadow-black/40"
            >
              <div>
                {/* Top Status & Type Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                    {item.type.replace('_', ' ')}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                {/* Title */}
                <Link
                  href={`/content/${item.id}`}
                  className="font-bold text-white group-hover:text-[#FFB347] transition line-clamp-2 text-base leading-snug mb-2"
                >
                  {item.title}
                </Link>

                {/* Slug */}
                <p className="text-xs font-mono text-zinc-400 truncate mb-4">
                  /{item.slug}
                </p>
              </div>

              {/* Bottom Metadata & Actions */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  {new Date(item.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/content/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] text-zinc-200 border border-white/10 hover:border-[#E8380D]/40 hover:text-white transition"
                  >
                    <Sparkles className="h-3 w-3 text-[#FFB347]" />
                    <span>Edit & Prep</span>
                  </Link>

                  {item.status === 'PUBLISHED' && (
                    <a
                      href={`http://localhost:3002/content/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on Delivery Site"
                      className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List Table View */
        <div className="surface-card rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="px-6 py-4">Title & Slug</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {items.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-white/[0.02] transition group"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/content/${item.id}`}
                      className="font-semibold text-white group-hover:text-[#FFB347] transition block text-sm"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[11px] font-mono text-zinc-400">/{item.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-zinc-300">
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-zinc-400">
                    {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/content/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#E8380D]/40 hover:text-white transition"
                      >
                        <Sparkles className="h-3 w-3 text-[#FFB347]" />
                        <span>Edit & AI Prep</span>
                      </Link>
                      {item.status === 'PUBLISHED' && (
                        <a
                          href={`http://localhost:3002/content/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on Delivery Site"
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/[0.06] text-zinc-400 hover:text-white transition"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
