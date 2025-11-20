import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { supabase } from '../lib/supabaseClient';
import { apolloClient } from '../lib/apolloClient';
import { GET_POSTS, GET_USERS } from '../lib/graphql/queries';
import { resolveAvatarLetter } from '../lib/utils';

// Components
import Sidebar from '../components/dashboard/Sidebar';
import RightPanel from '../components/dashboard/RightPanel';
import PostList from '../components/dashboard/PostList';
import CreatePost from '../components/dashboard/CreatePost';

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

  // Data Fetching
  const { data: postsData, loading: postsLoading, error: postsError, refetch: refetchPosts } = useQuery(GET_POSTS);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS);

  const posts = postsData?.postsCollection?.edges.map(e => e.node) || [];
  const suggestedUsers = usersData?.usersCollection?.edges.map(e => e.node) || [];

  // Navigation state
  const [activeView, setActiveView] = useState('Home');

  // Post creation modal state
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Image lightbox state
  const [lightboxImage, setLightboxImage] = useState(null);

  const currentUserAvatarLetter = resolveAvatarLetter({
    avatar: user?.user_metadata?.avatar,
    avatar_letter: user?.user_metadata?.avatar_letter,
    first_name: user?.user_metadata?.first_name,
    last_name: user?.user_metadata?.last_name,
    email: user?.email,
  });

  // Session Management
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

  // Render content based on active view
  const renderViewContent = () => {
    switch (activeView) {
      case 'Home':
        return (
          <>
            {/* Compose Section Trigger */}
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
                  placeholder="What's happening?"
                  onClick={() => setShowComposeModal(true)}
                  readOnly
                  className="h-24 w-full resize-none bg-transparent text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none cursor-pointer dark:text-slate-100 dark:placeholder:text-slate-500"
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
                    <button
                      onClick={() => setShowComposeModal(true)}
                      className="px-6 py-2.5 rounded-full text-base font-semibold bg-indigo-600 text-white transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Posts Feed */}
            <PostList
              posts={posts}
              loading={postsLoading}
              error={postsError}
              currentUserAvatarLetter={currentUserAvatarLetter}
              setLightboxImage={setLightboxImage}
            />
          </>
        );

      case 'Explore':
        return (
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 mb-4">
                <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 16 2-6 6-2-2 6-6 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Explore</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Discover trending topics and new creators</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {['#Technology', '#Design', '#Art', '#Music'].map(tag => (
                  <button key={tag} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">{tag}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Trending</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 mb-4">
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 15a3 3 0 0 0 3-3 6 6 0 1 0-12 0 3 3 0 0 0 3 3" />
                  <path d="M5 15h14l-1 5H6l-1-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Notifications</h2>
              <p className="text-slate-600 dark:text-slate-400">You&apos;re all caught up!</p>
              <div className="mt-8 space-y-3">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100">New follower</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">John Doe started following you</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">2 hours ago</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100">Post liked</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Jane Smith liked your post</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Messages':
        return (
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mb-4">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Messages</h2>
              <p className="text-slate-600 dark:text-slate-400">No new messages</p>
              <button className="mt-6 px-6 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition">
                Start a conversation
              </button>
            </div>
          </div>
        );

      case 'Profile':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-24 w-24 -mt-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-lg border-4 border-white dark:border-slate-800">
                    {currentUserAvatarLetter}
                  </div>
                  <button className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    Edit Profile
                  </button>
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user?.user_metadata?.first_name || 'User'}</h2>
                  <p className="text-slate-600 dark:text-slate-400">{user?.email}</p>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">Creative professional passionate about design and technology.</p>
                  <div className="flex gap-6 mt-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">128</span>
                      <span className="text-slate-600 dark:text-slate-400 ml-1">Following</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">1.2K</span>
                      <span className="text-slate-600 dark:text-slate-400 ml-1">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-6">
              <h3 className="font-bold text-lg mb-4">Your Posts</h3>
              <PostList
                posts={posts.filter(post => post.user_id === user?.id || post.author?.id === user?.id)}
                loading={postsLoading}
                error={postsError}
                currentUserAvatarLetter={currentUserAvatarLetter}
                setLightboxImage={setLightboxImage}
              />
            </div>
          </div>
        );

      default:
        return null;
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
          <Sidebar
            user={user}
            currentUserAvatarLetter={currentUserAvatarLetter}
            activeView={activeView}
            setActiveView={setActiveView}
            handleSignOut={handleSignOut}
          />

          {/* Center Feed */}
          <main className="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7">
            {renderViewContent()}
          </main>

          {/* Right Sidebar */}
          <RightPanel
            usersLoading={usersLoading}
            usersError={usersError}
            suggestedUsers={suggestedUsers}
            initialNewsArticles={initialNewsArticles}
            newsError={newsError}
          />
        </div>
        {authError && <div className="mt-6 text-red-800 bg-red-100 border border-red-300 rounded p-3 text-base dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60">{authError}</div>}
      </div>

      {/* Compose Modal */}
      <CreatePost
        show={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        user={user}
        currentUserAvatarLetter={currentUserAvatarLetter}
        onPostCreated={refetchPosts}
      />

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
