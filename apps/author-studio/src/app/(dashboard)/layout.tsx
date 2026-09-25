'use client';

import React, { useEffect, useState } from 'react';
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
  ShieldCheck,
  Database,
  Cpu,
  Menu,
  X,
  ChevronRight,
  Radio,
} from 'lucide-react';
import AtmosphericBackground from '@/components/ui/AtmosphericBackground';
import Logo from '@/components/ui/Logo';
import WorkspaceSwitcher from '@/components/ui/WorkspaceSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Lead Architect');
  const [userRole, setUserRole] = useState<string>('Content Architect');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

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
          // Keep guest mode
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

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { label: 'Content Studio', href: '/content', icon: FileText, badge: 'AEM' },
    { label: 'RAG Copilot Studio', href: '/assistant', icon: Sparkles, badge: 'Sensei' },
    { label: 'Personalization Engine', href: '/personalize', icon: Target, badge: 'Target' },
    { label: 'Quality & Benchmarks', href: '/eval', icon: Activity, badge: 'RAGAS' },
  ];

  const currentNav = navItems.find(
    (item) => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  ) || navItems[0];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header with Custom SVG Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-5">
          <Link href="/" className="hover:opacity-95 transition">
            <Logo size="md" subtitle="Adobe Experience Fabric" badge="AI" />
          </Link>
          {mobileNavOpen && (
            <button
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation drawer"
              className="md:hidden p-1.5 rounded-lg bg-white/[0.05] text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-3 pb-2 font-semibold">
              Platform Modules
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all group relative ${
                      active
                        ? 'bg-gradient-to-r from-[#E8380D]/18 via-[#F56E40]/10 to-transparent text-white border border-[#E8380D]/35 shadow-sm shadow-[#E8380D]/15'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    {/* Left Accent Indicator Bar */}
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#E8380D] to-[#FFB347] shadow-[0_0_8px_rgba(232,56,13,0.8)]" />
                    )}

                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        active ? 'text-[#FFB347]' : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    />
                    <span className="flex-1 truncate">{item.label}</span>

                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        active
                          ? 'bg-[#E8380D]/20 text-[#FFB347] border border-[#E8380D]/30'
                          : 'bg-white/[0.04] text-zinc-400 border border-white/5'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Infrastructure Quick Status Telemetry */}
          <div className="rounded-2xl border border-white/[0.07] bg-black/40 p-4 space-y-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <span className="font-semibold text-zinc-400">Stack Telemetry</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-2 text-[11px] text-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-blue-400" />
                  <span>Neon pgvector</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">384-dim</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-[#F56E40]" />
                  <span>Groq Llama-3.3</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Active</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>HITL Gatekeeper</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400">Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User bar & Sign-out */}
      <div className="border-t border-white/[0.08] p-4 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#E8380D]/30 to-[#FFB347]/20 border border-[#E8380D]/35 text-[#FFB347] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {userName[0]?.toUpperCase() || 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-zinc-200 truncate">{userName}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-zinc-400 truncate font-mono">{userRole}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Sign out of Author Studio"
          title="Sign out of Author Studio"
          className="text-zinc-400 hover:text-rose-400 p-2 rounded-xl hover:bg-white/[0.06] transition"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#F5F5F7] flex overflow-x-hidden">
      {/* Dynamic Atmospheric Background */}
      <AtmosphericBackground />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/[0.08] bg-[#09090b]/85 backdrop-blur-2xl flex-col justify-between shrink-0 sticky top-0 h-screen z-40 relative">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-[#0f1117] border-r border-white/10 z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open mobile navigation drawer"
              className="md:hidden p-2 rounded-xl bg-white/[0.05] text-zinc-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="text-zinc-500 hidden sm:inline">Adobe Experience Cloud</span>
              <ChevronRight className="h-3 w-3 text-zinc-600 hidden sm:inline" />
              <span className="text-white font-medium capitalize">
                {currentNav?.label ?? 'Command Center'}
              </span>
            </div>
          </div>

          {/* Header Right Workspace Switcher & Delivery Link */}
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>pgvector Active</span>
            </div>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition shadow-sm"
            >
              <span>Delivery Site</span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
          </div>
        </header>

        {/* Page Content Stream */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
