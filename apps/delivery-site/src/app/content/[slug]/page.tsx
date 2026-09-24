import Link from 'next/link';
import { notFound } from 'next/navigation';

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
      <div>
        <Link href="/" className="text-xs font-semibold text-indigo-600 hover:underline">
          ← Back to All Stories
        </Link>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider text-indigo-600">
            {content.type.replace('_', ' ')}
          </span>
          <span>•</span>
          <span>
            {new Date(content.updatedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>•</span>
          <span>v{content.currentVersion?.versionNo || 1}</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {content.title}
        </h1>
        {content.creator && (
          <p className="mt-2 text-xs text-slate-400">By {content.creator.name}</p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
        <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap font-sans">
          {rawBody}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Delivered via ContentPilot SSR</span>
        <a
          href={`http://localhost:3000/content/${content.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 hover:underline dark:text-indigo-400 font-semibold"
        >
          Edit in Author Studio ↗
        </a>
      </div>
    </article>
  );
}
