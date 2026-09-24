'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ContentType, ContentItemDetail } from '@contentpilot/shared';

export default function NewContentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('BLOG_POST');
  const [bodyText, setBodyText] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post<{ data: ContentItemDetail }>('/api/content', {
        type,
        title,
        body: {
          text: bodyText,
        },
        meta: {
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        },
      });

      router.push(`/content/${res.data.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create content item');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <Link href="/content" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition">
            ← Back to Library
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create New Content Item</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Content Title
            </label>
            <input
              type="text"
              placeholder="e.g., Enterprise Guide to RAG Architectures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Content Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="BLOG_POST">Blog Post</option>
              <option value="LANDING_PAGE">Landing Page</option>
              <option value="PRODUCT_PAGE">Product Page</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Content Body
          </label>
          <p className="text-xs text-slate-500 mb-2">Write full text or Markdown. This content will be chunked & indexed for RAG upon publishing.</p>
          <textarea
            rows={12}
            placeholder="Type content text here..."
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="block w-full font-mono text-xs rounded-lg border border-slate-300 p-3.5 shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tags & Keywords
          </label>
          <input
            type="text"
            placeholder="AI, CMS, Enterprise, Personalization (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/content"
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Save Draft & Edit'}
          </button>
        </div>
      </form>
    </div>
  );
}
