import Link from 'next/link';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  updatedAt: string;
}

async function getPublishedContent(): Promise<ContentItem[]> {
  try {
    const res = await fetch('http://localhost:3001/api/content?status=PUBLISHED', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function DeliveryHomePage() {
  const items = await getPublishedContent();

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
            ✨ AI-Native Experience Delivery
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Next-Gen CMS with Agentic Personalization
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Content served dynamically using rule-based audience segmentation, vector-indexed RAG embeddings, and automated publishing workflows.
          </p>
        </div>
      </section>

      {/* Published Content Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Published Stories</h2>
          <span className="text-xs text-slate-500">{items.length} items live</span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-800">
            <p className="text-base font-medium">No published content available yet</p>
            <p className="mt-1 text-xs">
              Open the Author Studio to create and publish your first article.
            </p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
            >
              Open Author Studio →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {item.type.replace('_', ' ')}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-xs text-slate-400">
                  <span>
                    {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition dark:text-indigo-400">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
