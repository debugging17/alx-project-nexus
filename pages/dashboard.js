import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!supabase) {
          setError('Auth not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
          setLoading(false);
          return;
        }
        const { data } = await supabase.auth.getSession();
        const currentUser = data?.session?.user ?? null;
        if (!mounted) return;
        if (!currentUser) {
          router.replace('/');
          return;
        }
        setUser(currentUser);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load session');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // Keep session in sync
    const { data: sub } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        router.replace('/');
      } else {
        setUser(session.user);
      }
    }) ?? { data: { subscription: null } };

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase?.auth.signOut();
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          >
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-800 bg-red-100 border border-red-300 rounded p-3 text-sm dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60">{error}</div>
        )}

        {loading ? (
          <p className="text-slate-600 dark:text-slate-300">Loading…</p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-200">Welcome{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ''}!</p>
            <pre className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs overflow-auto dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
{JSON.stringify({ id: user?.id, email: user?.email, user_metadata: user?.user_metadata }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
