'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ContentType, ContentItemDetail } from '@contentpilot/shared';
import ModularBlockEditor from '@/components/editor/ModularBlockEditor';

export default function NewContentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('BLOG_POST');
  const [bodyText, setBodyText] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const handleTemplate = (tmpl: 'blog' | 'landing') => {
    if (tmpl === 'blog') {
      setTitle('Next-Generation Vector Search in Modern Enterprise CMS');
      setType('BLOG_POST');
      setTags('RAG, Vector Search, AI, Headless CMS, pgvector');
      setBodyText(
        `# Next-Generation Vector Search in Modern Enterprise CMS\n\nTraditional content management systems rely on rigid keyword matches. ContentPilot AI brings native pgvector semantic retrieval into the editorial workflow.\n\n## 1. High-Dimensional Vector Embeddings\nEvery published article is transformed into a dense 384-dimensional vector using HuggingFace BGE-small. These vectors preserve semantic relationships across multi-lingual content corpuses.\n\n## 2. Cosine Distance vs Traditional Full-Text Search\nBy computing the cosine distance (<=>) between query vectors and document chunk embeddings, editors and end users discover relevant answers even when phrasing differs completely.\n\n## 3. Grounded Generation with Source Citations\nWhen editors interact with the AI Copilot, every retrieved chunk is validated and presented with exact source citations and similarity percentages.`
      );
    } else {
      setTitle('Enterprise AI-Native Experience Delivery Platform');
      setType('LANDING_PAGE');
      setTags('Personalization, Adobe Target, Edge Delivery, Enterprise');
      setBodyText(
        `# Enterprise AI-Native Experience Delivery Platform\n\nTransform how your organization orchestrates, versions, and delivers personalized content experiences globally.\n\n## Unified Experience Architecture\n- Autonomous Agent Publishing: Automated SEO grading, meta generation, and segment classification.\n- Real-time Edge Delivery: Personalized variants served dynamically with sub-15ms edge resolution.\n- Enterprise Quality Harness: Continuous benchmarking for RAG retrieval precision and agent reliability.\n\nStart delivering hyper-personalized digital experiences today.`
      );
    }
    setEditorKey((k) => k + 1);
  };

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <Link
            href="/content"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Content Library</span>
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            Create New Content Asset
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Author Markdown or structured JSON ready for vectorization and edge delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Load Starter:</span>
          <button
            type="button"
            onClick={() => handleTemplate('blog')}
            className="btn-secondary rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            RAG Article
          </button>
          <button
            type="button"
            onClick={() => handleTemplate('landing')}
            className="btn-secondary rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            Landing Page
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 surface-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Content Title
            </label>
            <input
              type="text"
              placeholder="e.g., Enterprise Architecture for AI-Native Content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-dark mt-1.5 block w-full px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Content Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="input-dark mt-1.5 block w-full px-3.5 py-2.5 text-sm text-zinc-200"
            >
              <option value="BLOG_POST">Blog Post</option>
              <option value="LANDING_PAGE">Landing Page</option>
              <option value="PRODUCT_PAGE">Product Page</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Modular Content Blocks &amp; Live Composition
            </label>
            <span className="text-[11px] text-[#FFB347] font-mono flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Auto-vectorized into 384-dim BGE upon publish</span>
            </span>
          </div>
          <ModularBlockEditor
            key={editorKey}
            initialText={bodyText}
            onChange={(_blocks, plainText) => setBodyText(plainText)}
            onAiAssistedEdit={async (prompt, currentContent) => {
              try {
                const res = await api.post<{ data?: { answer?: string }; reply?: string; message?: string }>('/api/assistant/chat', {
                  message: `Improve or revise the following block based on instruction: "${prompt}".\n\nContent:\n${currentContent}\n\nReturn ONLY the revised block text without preamble.`,
                });
                return res.reply || res.data?.answer || res.message || currentContent;
              } catch {
                return currentContent;
              }
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
            Tags & Keywords (Comma-separated)
          </label>
          <input
            type="text"
            placeholder="AI, RAG, Personalization, AEM, Architecture"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-dark mt-1.5 block w-full px-4 py-2.5 text-sm text-white placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <Link
            href="/content"
            className="btn-secondary rounded-xl px-4 py-2 text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-firefly inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold disabled:opacity-50 shadow-md shadow-[#E8380D]/20"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? 'Creating Asset...' : 'Save Draft & Open Editor'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
