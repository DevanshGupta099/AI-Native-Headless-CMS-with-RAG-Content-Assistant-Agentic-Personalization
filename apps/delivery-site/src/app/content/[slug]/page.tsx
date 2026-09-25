import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getContentBySlug(slug: string) {
  try {
    const listRes = await fetch(`http://localhost:3001/api/content?status=PUBLISHED`, {
      cache: 'no-store',
    });
    if (!listRes.ok) return null;
    const json = await listRes.json();
    const item = (json.data || []).find((i: { slug: string }) => i.slug === slug);
    if (!item) return null;

    const detailRes = await fetch(`http://localhost:3001/api/content/${item.id}`, {
      cache: 'no-store',
    });
    if (!detailRes.ok) return null;
    const detailJson = await detailRes.json();
    return detailJson.data;
  } catch {
    return null;
  }
}

export default async function ContentArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const content = await getContentBySlug(resolvedParams.slug);

  if (!content) {
    notFound();
  }

  const rawBody = content.currentVersion?.bodyJson?.text || '';

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Published Stories</span>
        </Link>

        {/* Metadata Chips */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
          <span className="rounded-md bg-[#E8380D]/15 border border-[#E8380D]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFB347] uppercase tracking-wider">
            {content.type.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span>
              {new Date(content.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>4 min read</span>
          </div>
          <span>•</span>
          <span>Version {content.currentVersion?.versionNo || 1}</span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {content.title}
        </h1>

        {/* Author & Edge Resolution Badge */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 pt-2 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-[#FFB347]" />
            <span>Published by {content.creator?.name || 'Lead Architect'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Edge Delivery SLA: &lt; 15ms</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="surface-card rounded-3xl p-8 sm:p-10 border border-white/[0.08] shadow-xl">
        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-zinc-200">
          {rawBody}
        </div>
      </div>

      {/* Article Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Story Showcase</span>
        </Link>
        <a
          href={`http://localhost:3000/content/${content.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#FFB347] hover:text-white transition flex items-center gap-1"
        >
          <span>Open in Author Studio Editor</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
