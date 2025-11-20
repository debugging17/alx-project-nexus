import React from 'react';

export default function Sidebar({
    user,
    currentUserAvatarLetter,
    activeView,
    setActiveView,
    handleSignOut
}) {
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

    return (
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
                                        onClick={() => setActiveView(item.label)}
                                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-base font-medium transition ${activeView === item.label
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
    );
}
