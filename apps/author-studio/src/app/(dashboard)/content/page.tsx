'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  Clock,
  Archive,
  Sparkles,
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Published</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-500/20">
            <Archive className="h-3 w-3" />
            <span>Archived</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#eb1000]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#ff4d6d] border border-[#eb1000]/30">
              AEM CONTENT FABRIC
            </span>
            <span className="text-xs text-slate-500 font-mono">ASSET INVENTORY</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Content Library</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Author, version, publish, and personalize enterprise headless CMS assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/content/new"
            className="btn-adobe-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Content</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl specular-card p-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search content by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0c0e14] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#eb1000] focus:ring-1 focus:ring-[#eb1000]/40 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0e14] px-3 py-2 text-xs text-slate-200 focus:border-[#eb1000] focus:outline-none"
            >
              <option value="">All Content Types</option>
              <option value="BLOG_POST">Blog Post</option>
              <option value="LANDING_PAGE">Landing Page</option>
              <option value="PRODUCT_PAGE">Product Page</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0e14] px-3 py-2 text-xs text-slate-200 focus:border-[#eb1000] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchContent}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20">
          {error}
        </div>
      )}

      {/* Content Table */}
      <div className="rounded-2xl specular-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Title & Slug</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#eb1000] border-t-transparent" />
                  <p className="mt-3 text-xs font-mono">Querying AEM Content Lake...</p>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  <FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No content items found</p>
                  <p className="mt-1 text-xs text-slate-500">Create your first blog post or landing page to get started.</p>
                  <Link
                    href="/content/new"
                    className="mt-4 btn-adobe-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create First Item</span>
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-white/[0.03] transition group"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/content/${item.id}`}
                      className="font-semibold text-white group-hover:text-cyan-300 transition block text-sm"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[11px] font-mono text-slate-500">/{item.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-slate-300">
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-400">
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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#eb1000]/40 hover:text-white transition"
                      >
                        <Sparkles className="h-3 w-3 text-[#ff4d6d]" />
                        <span>Edit & AI Prep</span>
                      </Link>
                      {item.status === 'PUBLISHED' && (
                        <a
                          href={`http://localhost:3002/content/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on Delivery Site"
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/[0.06] text-slate-400 hover:text-cyan-300 transition"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
