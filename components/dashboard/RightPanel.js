import React from 'react';
import NewsFeed from './NewsFeed';
import { resolveAvatarLetter } from '../../lib/utils';

export default function RightPanel({
    usersLoading,
    usersError,
    suggestedUsers = [],
    initialNewsArticles = [],
    newsError = null
}) {
    return (
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4 ml-auto lg:mr-12 xl:mr-22 w-full max-w-sm space-y-4 pr-4 lg:pr-6 xl:pr-8">
                {/* Search Form */}
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

                {/* Who to follow */}
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

                {/* News Feed */}
                <NewsFeed initialArticles={initialNewsArticles} initialError={newsError} />
            </div>
        </aside>
    );
}
