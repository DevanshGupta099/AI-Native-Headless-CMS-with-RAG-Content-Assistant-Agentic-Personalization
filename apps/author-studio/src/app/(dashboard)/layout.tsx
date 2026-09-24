'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Editor');

  useEffect(() => {
    const token = localStorage.getItem('cp_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const storedUser = localStorage.getItem('cp_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserName(u.name || 'Editor');
      } catch {
        // ignore
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Content Items', href: '/content', icon: '📝' },
    { label: 'AI Copilot', href: '/assistant', icon: '🤖' },
    { label: 'Personalization', href: '/personalize', icon: '🎯' },
    { label: 'Evaluations', href: '/eval', icon: '📊' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg shadow-sm">
              CP
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white leading-none block">ContentPilot</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Author Studio</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User bar at bottom */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-xs shrink-0">
              {userName[0]?.toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{userName}</p>
              <p className="text-[10px] text-slate-500">Authenticated</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-sm p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
              {pathname.split('/')[1] || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live API Connected
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
