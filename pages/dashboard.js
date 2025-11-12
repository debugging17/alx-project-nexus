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

export default function Dashboard({ initialNewsArticles = [], newsError = null }) {
  if (!apolloClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">
        GraphQL is not configured. Please ensure NEXT_PUBLIC_SUPABASE_GRAPHQL_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file and restart the server.
      </div>
    );
  }

  return <DashboardContent initialNewsArticles={initialNewsArticles} newsError={newsError} />;
}

function DashboardContent({ initialNewsArticles, newsError }) {
  const router = useRouter();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GET_POSTS);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS);

  const posts = postsData?.postsCollection?.edges.map(e => e.node) || [];
  const suggestedUsers = usersData?.usersCollection?.edges.map(e => e.node) || [];
  const [newsArticles, setNewsArticles] = useState(() => initialNewsArticles);
  const [newsLoading, setNewsLoading] = useState(false);
  const [currentNewsError, setCurrentNewsError] = useState(newsError);
  const hasNewsError = Boolean(currentNewsError);
  const resolveAvatarLetter = (entity) => {
    if (!entity) return 'U';
    const source = typeof entity === 'string' ? entity : entity.avatar || entity.avatar_letter || entity.avatar_letter_override;
    if (typeof source === 'string' && source.trim()) {
      return source.trim().charAt(0).toUpperCase();
    }
    const first = typeof entity === 'string' ? entity : entity.first_name;
    if (typeof first === 'string' && first.trim()) {
      return first.trim().charAt(0).toUpperCase();
    }
    const last = typeof entity === 'string' ? undefined : entity.last_name;
    if (typeof last === 'string' && last.trim()) {
      return last.trim().charAt(0).toUpperCase();
    }
    const email = typeof entity === 'string' ? entity : entity.email;
    if (typeof email === 'string' && email.trim()) {
      return email.trim().charAt(0).toUpperCase();
    }
    return 'U';
  };

  const currentUserAvatarLetter = resolveAvatarLetter({
    avatar: user?.user_metadata?.avatar,
    avatar_letter: user?.user_metadata?.avatar_letter,
    first_name: user?.user_metadata?.first_name,
    last_name: user?.user_metadata?.last_name,
    email: user?.email,
  });

  // Fetch news articles from API
  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setCurrentNewsError(null);
      const response = await fetch('/api/news');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch news');
      }
      const data = await response.json();
      setNewsArticles(data.articles || []);
    } catch (error) {
      setCurrentNewsError(error instanceof Error ? error.message : 'Unable to load news');
    } finally {
      setNewsLoading(false);
    }
  };

  // Poll news every 5 minutes
  useEffect(() => {
    // Initial fetch if no articles
    if (newsArticles.length === 0 && !newsError) {
      fetchNews();
    }

    // Set up polling interval (5 minutes)
    const interval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems = [
    {
      label: 'Home',
      active: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </svg>
      ),
    },
    {
      label: 'Explore',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 16 2-6 6-2-2 6-6 2z" />
        </svg>
      ),
    },
    {
      label: 'Notifications',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15a3 3 0 0 0 3-3 6 6 0 1 0-12 0 3 3 0 0 0 3 3" />
          <path d="M5 15h14l-1 5H6l-1-5z" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.582-6 8-6s8 2 8 6" />
        </svg>
      ),
    },
  ];

  const composeActions = [
    {
      label: 'Media',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      label: 'GIF',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8h4a2 2 0 0 1 0 4H5v2" />
          <path d="M12 8v8" />
          <path d="M16 8h5" />
          <path d="M19 8v8" />
          <path d="M16 12h3" />
        </svg>
      ),
    },
    {
      label: 'Poll',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="19" x2="6" y2="10" />
          <line x1="12" y1="19" x2="12" y2="5" />
          <line x1="18" y1="19" x2="18" y2="13" />
        </svg>
      ),
    },
    {
      label: 'Emoji',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
    {
      label: 'Photo',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3h4l2 3h4l2-3h4v18H5z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
    },
    {
      label: 'Location',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      ),
    },
  ];

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

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
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
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-4 xl:pl-0 xl:pr-28 py-4 md:py-6">
        <div className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-5 xl:gap-8">
          {/* Left Nav */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3">
            <div className="sticky top-4 lg:-ml-5 xl:-ml-10">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-100 px-4 py-4 dark:bg-slate-700/40">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-semibold text-white shadow-sm aspect-square">
                    {currentUserAvatarLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold truncate">{user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-sm text-slate-500 truncate dark:text-slate-300">{user?.email}</p>
                  </div>
                </div>
                <nav className="mt-6">
                  <ul className="space-y-1">
                    {navItems.map(item => (
                      <li key={item.label}>
                        <button
                          type="button"
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-base font-medium transition ${
                            item.active
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/40 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-inherit shadow-sm dark:bg-slate-900/50">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <button
                  onClick={handleSignOut}
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-slate-950 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7">
            <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
              <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                <button type="button" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-slate-700 dark:hover:text-slate-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Close
                </button>
                <button type="button" className="rounded-full px-4 py-1.5 text-sm text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10">Drafts</button>
              </div>
              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl font-semibold text-white shadow-sm aspect-square">
                  {currentUserAvatarLetter}
                </div>
                <textarea
                  rows={3}
                  placeholder="What’s happening?"
                  className="h-24 w-full resize-none bg-transparent text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <button type="button" className="mt-4 flex items-center gap-2 text-base font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
                <span className="inline-flex h-6 w-6 items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                </span>
                Everyone can reply
              </button>
              <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-indigo-600 dark:text-indigo-300">
                    {composeActions.map(action => (
                      <button
                        key={action.label}
                        type="button"
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50/60 text-current transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
                        aria-label={action.label}
                      >
                        {action.icon}
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100 dark:bg-slate-700">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button className="px-5 py-2.5 rounded-full text-base font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 transition hover:bg-indigo-50 dark:text-indigo-200 dark:ring-indigo-500/40 dark:hover:bg-indigo-500/10">
                      Draft
                    </button>
                    <button className="px-6 py-2.5 rounded-full text-base font-semibold bg-indigo-600 text-white transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <div className="mt-4 space-y-4">
              {posts.map(post => (
                <article key={post.id} className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-lg font-semibold text-white shadow-sm aspect-square">
                      {resolveAvatarLetter(post.users)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-semibold">{post.users?.first_name || 'User'}</p>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{timeSince(post.created_at)}</span>
                      </div>
                      <p className="mt-2 text-base text-slate-700 dark:text-slate-200">{post.content}</p>
                      <div className="mt-4 flex items-center gap-7 text-base text-slate-500 dark:text-slate-400">
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
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4 ml-auto lg:mr-12 xl:mr-22 w-full max-w-sm space-y-4 pr-4 lg:pr-6 xl:pr-8">
              <form className="relative flex w-full items-center rounded-full border border-slate-200 bg-white pl-4 pr-12 py-2.5 dark:border-slate-700 dark:bg-slate-800 lg:min-w-[260px] xl:min-w-[280px] lg:mt-2 xl:mt-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500"
                  aria-label="Submit search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" />
                  </svg>
                </button>
              </form>
              <div className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800 lg:min-w-[260px] xl:min-w-[280px]">
                <h3 className="text-base font-semibold">Who to follow</h3>
                {usersLoading && <div className="text-center text-sm">Loading users...</div>}
                {usersError && <div className="text-center text-sm text-red-500">{usersError.message}</div>}
                <ul className="mt-3 space-y-3 text-base">
                  {suggestedUsers.map(u => (
                    <li key={u.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-cyan-500 text-base font-semibold text-white shadow-sm aspect-square">
                          {resolveAvatarLetter(u)}
                        </div>
                        <span className="font-medium truncate">{u.first_name || u.email.split('@')[0]}</span>
                      </div>
                      <button className="px-4 py-1.5 rounded-full text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">Follow</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-6 py-4 lg:min-w-[260px] xl:min-w-[280px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Latest News</h3>
                  <button
                    onClick={fetchNews}
                    disabled={newsLoading}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Refresh news"
                  >
                    {newsLoading ? (
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                </div>
                {hasNewsError && (
                  <p className="mt-2 text-sm text-red-500">
                    {currentNewsError}
                  </p>
                )}
                {!hasNewsError && !newsLoading && newsArticles.length === 0 && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    No news items found for today.
                  </p>
                )}
                {newsLoading && newsArticles.length === 0 && (
                  <div className="mt-3 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
                      </div>
                    ))}
                  </div>
                )}
                <ul className="mt-3 space-y-3 text-base">
                  {newsArticles.slice(0, 5).map(article => (
                    <li key={article.link || article.title} className="hover:underline">
                      <a
                        href={article.link || article.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <p className="font-medium text-slate-800 dark:text-slate-100 line-clamp-2">{article.title}</p>
                        {(article.source_id || article.pubDate) && (
                          <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                            {article.source_id ? article.source_id : new Date(article.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
        {authError && <div className="mt-6 text-red-800 bg-red-100 border border-red-300 rounded p-3 text-base dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60">{authError}</div>}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    return {
      props: {
        initialNewsArticles: [],
        newsError: 'News service is not configured.'
      }
    };
  }

  // Free tier doesn't support from_date/to_date, use latest news
  const params = new URLSearchParams({
    apikey: apiKey,
    language: 'en',
    category: 'top',
    country: 'us,gb,ca,au',
    size: '10'
  });

  try {
    const response = await fetch(`https://newsdata.io/api/1/news?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      return { props: { initialNewsArticles: [], newsError: `News request failed: ${text}` } };
    }
    const payload = await response.json();
    return { props: { initialNewsArticles: payload?.results || [], newsError: null } };
  } catch (error) {
    return {
      props: {
        initialNewsArticles: [],
        newsError: error instanceof Error ? error.message : 'Unable to fetch news.'
      }
    };
  }
}
