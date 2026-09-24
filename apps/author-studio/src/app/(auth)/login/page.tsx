'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import AtmosphericBackground from '@/components/ui/AtmosphericBackground';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('editor@contentpilot.ai');
  const [password, setPassword] = useState('Editor123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<{ data: { token: string; user: { name: string; email: string } } }>(
        '/api/auth/login',
        { email, password }
      );

      localStorage.setItem('cp_token', res.data.token);
      localStorage.setItem('cp_user', JSON.stringify(res.data.user));

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06070a] px-4 py-12 relative overflow-hidden select-none">
      <AtmosphericBackground />

      <div className="w-full max-w-md space-y-8 rounded-3xl specular-card-elevated p-8 sm:p-10 relative z-10 border border-white/[0.12] shadow-2xl">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#eb1000] via-[#fa383e] to-[#ff6b81] text-white shadow-xl shadow-[#eb1000]/30 border border-white/20">
            <Layers className="h-7 w-7" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">ContentPilot AI</h2>
            <span className="rounded-lg bg-[#eb1000]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff4d6d] border border-[#eb1000]/30">
              ADOBE SUITE
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Author Studio • RAG Copilot • Agentic Personalization
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Enterprise Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-xl border border-white/10 bg-[#0c0e14] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#eb1000] focus:ring-1 focus:ring-[#eb1000]/40 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-xl border border-white/10 bg-[#0c0e14] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#eb1000] focus:ring-1 focus:ring-[#eb1000]/40 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Quick Demo Switchers */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-mono">Demo Accounts:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@contentpilot.ai');
                  setPassword('Admin123!');
                }}
                className="rounded-lg bg-white/[0.06] hover:bg-white/10 px-2.5 py-1 text-[11px] text-cyan-300 font-mono transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('editor@contentpilot.ai');
                  setPassword('Editor123!');
                }}
                className="rounded-lg bg-white/[0.06] hover:bg-white/10 px-2.5 py-1 text-[11px] text-[#ff4d6d] font-mono transition"
              >
                Editor
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-adobe-primary w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Author Studio'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-white/[0.08] text-center flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Adobe Experience Cloud Architecture (AEM + Target + Sensei)</span>
        </div>
      </div>
    </div>
  );
}
