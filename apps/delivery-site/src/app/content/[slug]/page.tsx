import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  Calendar,
  User,
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
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Published Stories</span>
        </Link>

        {/* Metadata Chips */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
            {content.type.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
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
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>4 min read</span>
          </div>
          <span>•</span>
          <span>Version {content.currentVersion?.versionNo || 1}</span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {content.title}
        </h1>

        {content.creator && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span>Published by {content.creator.name}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="border-t border-white/[0.08] pt-8">
        <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
          {rawBody}
        </div>
      </div>

      {/* Editorial Footer */}
      <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Delivered via ContentPilot Edge SSR • Vector Grounded</span>
        </div>

        <a
          href={`http://localhost:3000/content/${content.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition"
        >
          <span>Edit in Author Studio</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
