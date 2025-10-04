import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { supabase } from '../lib/supabaseClient';
import { apolloClient } from '../lib/apolloClient';
import { GET_POSTS, GET_USERS } from '../lib/graphql/queries';

// Helper to format time since post
function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m`;
  return `${Math.floor(seconds)}s`;
}

export default function Dashboard() {
  const router = useRouter();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  // Conditionally call queries only if the client is available.
  const { data: postsData, loading: postsLoading, error: postsError } = apolloClient ? useQuery(GET_POSTS) : { data: null, loading: false, error: null };
  const { data: usersData, loading: usersLoading, error: usersError } = apolloClient ? useQuery(GET_USERS) : { data: null, loading: false, error: null };

  if (!apolloClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">
        GraphQL is not configured. Please ensure NEXT_PUBLIC_SUPABASE_GRAPHQL_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file and restart the server.
      </div>
    );
  }

  const posts = postsData?.postsCollection?.edges.map(e => e.node) || [];
  const suggestedUsers = usersData?.usersCollection?.edges.map(e => e.node) || [];

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        if (!supabase) {
          setAuthError('Auth not configured.');
          setSessionLoading(false);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!data?.session?.user) {
          router.replace('/');
          return;
        }
        setUser(data.session.user);
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : 'Failed to load session');
      } finally {
        if (mounted) setSessionLoading(false);
      }
    }
    loadSession();

    const { data: sub } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) router.replace('/');
      else setUser(session.user);
    }) ?? { data: { subscription: null } };

    return () => { mounted = false; sub?.subscription?.unsubscribe?.(); };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase?.auth.signOut();
      router.replace('/');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Failed to sign out');
    }
  };

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Left Nav */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-3">
                <h2 className="px-2 py-1 text-base font-semibold">Menu</h2>
                <nav className="mt-2 text-sm">
                  {['Home', 'Explore', 'Notifications', 'Messages', 'Profile'].map(item => (
                    <li key={item} className="px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer list-none">{item}</li>
                  ))}
                </nav>
                <button onClick={handleSignOut} className="mt-3 w-full px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">Sign out</button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                  <div>
                    <p className="text-sm font-medium truncate">{user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="col-span-12 md:col-span-6 lg:col-span-6">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0" />
                <input type="text" placeholder="What’s happening?" className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">Draft</button>
                <button className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500">Post</button>
              </div>
            </div>

            {postsLoading && <div className="mt-4 text-center">Loading posts...</div>}
            {postsError && <div className="mt-4 text-center text-red-500">Error loading posts: {postsError.message}</div>}
            <div className="mt-4 space-y-4">
              {posts.map(post => (
                <article key={post.id} className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{post.users?.first_name || 'User'}</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{timeSince(post.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{post.content}</p>
                      <div className="mt-3 flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
                        <button className="hover:text-indigo-600 dark:hover:text-indigo-400">Like</button>
                        <button className="hover:text-indigo-600 dark:hover:text-indigo-400">Comment</button>
                        <button className="hover:text-indigo-600 dark:hover:text-indigo-400">Share</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* Right Widgets */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2">
                <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400" />
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold">Who to follow</h3>
                {usersLoading && <div className="text-center text-xs">Loading users...</div>}
                {usersError && <div className="text-center text-xs text-red-500">{usersError.message}</div>}
                <ul className="mt-3 space-y-3 text-sm">
                  {suggestedUsers.map(u => (
                    <li key={u.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 shrink-0" />
                        <span className="font-medium truncate">{u.first_name || u.email.split('@')[0]}</span>
                      </div>
                      <button className="px-3 py-1 rounded-full text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">Follow</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold">Today’s News</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {['Item 1', 'Item 2', 'Item 3'].map(item => <li key={item} className="hover:underline cursor-pointer">{item}</li>)}
                </ul>
              </div>
            </div>
          </aside>
        </div>
        {authError && <div className="mt-6 text-red-800 bg-red-100 border border-red-300 rounded p-3 text-sm dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60">{authError}</div>}
      </div>
    </div>
  );
}
