import React, { useState } from 'react';
import { resolveAvatarLetter, timeSince } from '../../lib/utils';

export default function PostList({
    posts = [],
    loading = false,
    error = null,
    currentUserAvatarLetter,
    setLightboxImage
}) {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [commentingOn, setCommentingOn] = useState(null);

    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) newSet.delete(postId);
            else newSet.add(postId);
            return newSet;
        });
    };

    const handleBookmark = (postId) => {
        setBookmarkedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) newSet.delete(postId);
            else newSet.add(postId);
            return newSet;
        });
    };

    const handleComment = (postId) => {
        setCommentingOn(commentingOn === postId ? null : postId);
    };

    const handleShare = (post) => {
        if (navigator.share) {
            navigator.share({
                title: post.content?.substring(0, 50) || 'Check out this post',
                text: post.content,
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return <div className="text-center py-8">Loading posts...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error loading posts</div>;

    return (
        <div className="mt-4 space-y-4">
            {posts.map(post => (
                <article key={post.id} className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-lg font-semibold text-white shadow-sm aspect-square">
                            {resolveAvatarLetter(post.users || post.author)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-base font-semibold">{post.users?.first_name || post.author?.first_name || 'User'}</p>
                                <span className="text-sm text-slate-500 dark:text-slate-400">{timeSince(post.created_at)}</span>
                            </div>
                            <p className="mt-2 text-base text-slate-700 dark:text-slate-200">{post.content}</p>
                            {post.media && post.media.length > 0 && (
                                <div className={`mt-3 gap-2 ${post.media.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'}`}>
                                    {post.media.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Post media ${idx + 1}`}
                                            className={`w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition ${post.media.length === 1 ? 'h-96 max-h-[500px]' : 'h-64'
                                                }`}
                                            onClick={() => setLightboxImage(url)}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 flex items-center gap-7 text-base text-slate-500 dark:text-slate-400">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center gap-1.5 transition ${likedPosts.has(post.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                                >
                                    <svg className="h-5 w-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Like
                                </button>
                                <button
                                    onClick={() => handleComment(post.id)}
                                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Comment
                                </button>
                                <button
                                    onClick={() => handleShare(post)}
                                    className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400 transition"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                </button>
                                <button
                                    onClick={() => handleBookmark(post.id)}
                                    className={`ml-auto flex items-center gap-1.5 transition ${bookmarkedPosts.has(post.id) ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                                >
                                    <svg className="h-5 w-5" fill={bookmarkedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>
                            {commentingOn === post.id && (
                                <div className="mt-4 flex gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
                                        {currentUserAvatarLetter}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Write a comment..."
                                            rows={2}
                                            className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => setCommentingOn(null)}
                                                className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-4 py-1.5 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-500">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
