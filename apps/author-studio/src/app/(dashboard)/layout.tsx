'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Target,
  Activity,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Lead Architect');
  const [userRole, setUserRole] = useState<string>('Content Architect');

  useEffect(() => {
    const token = localStorage.getItem('cp_token');
    if (!token) {
      // Auto-authenticate with pre-seeded editor account for instant interview showcase access
      fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'editor@contentpilot.ai', password: 'Editor123!' }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json?.data?.token) {
            localStorage.setItem('cp_token', json.data.token);
            localStorage.setItem('cp_user', JSON.stringify(json.data.user));
            setUserName(json.data.user.name || 'Lead Architect');
          }
        })
        .catch(() => {
          // If backend unreachable, keep guest mode
        });
    } else {
      const storedUser = localStorage.getItem('cp_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUserName(u.name || 'Lead Architect');
          setUserRole(u.email?.includes('admin') ? 'System Admin' : 'Lead Architect');
        } catch {
          // ignore
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Content Studio', href: '/content', icon: FileText },
    { label: 'RAG Copilot Studio', href: '/assistant', icon: Sparkles },
    { label: 'Personalization Engine', href: '/personalize', icon: Target },
    { label: 'Quality & Benchmarks', href: '/eval', icon: Activity },
  ];

  return (
    <div className="flex min-h-screen bg-[#080b11] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#0b0f19]/95 backdrop-blur-xl flex flex-col justify-between shrink-0 sticky top-0 h-screen z-40">
        <div>
          {/* Logo & Brand Header */}
          <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white leading-none">ContentPilot</span>
                <span className="rounded bg-indigo-500/20 px-1 py-0.5 text-[9px] font-mono font-semibold text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 mt-0.5 block">
                Adobe Cloud Stack
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-2 font-semibold">
              Platform Modules
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all group relative ${
                      active
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/80" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Infrastructure Quick Status */}
            <div className="mt-8 rounded-xl border border-white/[0.06] bg-black/40 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span>Stack Health</span>
                <span className="text-emerald-400 font-semibold">Healthy</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-indigo-400" />
                  <span className="truncate">Neon pgvector Lake</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-3 w-3 text-cyan-400" />
                  <span className="truncate">Groq Llama-3.3-70B</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span className="truncate">HITL Gatekeeper Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User bar & Sign-out */}
        <div className="border-t border-white/[0.08] p-4 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              {userName[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] text-slate-400 truncate">{userRole}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of Author Studio"
            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-white/[0.06] transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.08] bg-[#0b0f19]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Experience Cloud</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium capitalize">
              {pathname === '/dashboard' || pathname === '/'
                ? 'Command Center'
                : pathname.split('/')[1]?.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>pgvector Lake Active</span>
            </div>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition"
            >
              <span>Delivery Site</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
