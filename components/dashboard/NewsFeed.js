import React, { useState, useEffect } from 'react';

export default function NewsFeed({ initialArticles = [], initialError = null }) {
    const [newsArticles, setNewsArticles] = useState(initialArticles);
    const [newsLoading, setNewsLoading] = useState(false);
    const [currentNewsError, setCurrentNewsError] = useState(initialError);
    const hasNewsError = Boolean(currentNewsError);

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

    useEffect(() => {
        if (newsArticles.length === 0 && !initialError) {
            fetchNews();
        }
        const interval = setInterval(() => {
            fetchNews();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800 lg:min-w-[260px] xl:min-w-[280px]">
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
    );
}
