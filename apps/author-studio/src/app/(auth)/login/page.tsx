'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

      router.push('/content');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ContentPilot AI</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Author Studio & Enterprise Copilot</p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quick test logins:</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@contentpilot.ai');
                  setPassword('Admin123!');
                }}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Admin
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('editor@contentpilot.ai');
                  setPassword('Editor123!');
                }}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Editor
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Author Studio'}
          </button>
        </form>
      </div>
    </div>
  );
}
