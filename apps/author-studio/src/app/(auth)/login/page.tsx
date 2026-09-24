'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

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
    <div className="flex min-h-screen items-center justify-center bg-[#080b11] px-4 py-12 relative overflow-hidden bg-grid-pattern">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 rounded-3xl glass-panel-glow p-8 backdrop-blur-2xl relative z-10 border border-white/[0.08]">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-xl shadow-indigo-600/30">
            <Layers className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">ContentPilot AI</h2>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-indigo-400 border border-indigo-500/30">
              ADOBE CLOUD
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
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
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
                className="block w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Quick Demo Switchers */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-mono">Demo Accounts:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@contentpilot.ai');
                  setPassword('Admin123!');
                }}
                className="rounded-lg bg-white/[0.05] hover:bg-white/10 px-2.5 py-1 text-[11px] text-indigo-300 font-mono transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('editor@contentpilot.ai');
                  setPassword('Editor123!');
                }}
                className="rounded-lg bg-white/[0.05] hover:bg-white/10 px-2.5 py-1 text-[11px] text-indigo-300 font-mono transition"
              >
                Editor
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Author Studio'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-white/[0.06] text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Mirrored Adobe Experience Cloud Architecture (AEM + Target + Sensei)
          </p>
        </div>
      </div>
    </div>
  );
}
