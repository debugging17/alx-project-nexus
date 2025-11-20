import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../lib/graphql/queries';

export default function CreatePost({
    show,
    onClose,
    user,
    currentUserAvatarLetter,
    onPostCreated
}) {
    const [postContent, setPostContent] = useState('');
    const [postMedia, setPostMedia] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [createPost, { loading: createPostLoading }] = useMutation(CREATE_POST);

    const handleSaveDraft = () => {
        const draft = {
            id: Date.now(),
            content: postContent,
            media: postMedia,
            createdAt: new Date().toISOString()
        };
        setDrafts(prev => [...prev, draft]);
        setPostContent('');
        setPostMedia([]);
        onClose();
    };

    const handleClose = () => {
        if (postContent.trim() || postMedia.length > 0) {
            if (confirm('Save as draft?')) {
                handleSaveDraft();
                return;
            }
        }
        setPostContent('');
        setPostMedia([]);
        onClose();
    };

    const handlePost = async () => {
        if (!postContent.trim() && postMedia.length === 0) return;

        try {
            await createPost({
                variables: {
                    content: postContent,
                    user_id: user?.id
                }
            });

            if (onPostCreated) await onPostCreated();

            alert('Post created successfully!');
            setPostContent('');
            setPostMedia([]);
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const mediaUrls = files.map(file => URL.createObjectURL(file));
        setPostMedia(prev => [...prev, ...mediaUrls]);
    };

    const handleRemoveMedia = (index) => {
        setPostMedia(prev => prev.filter((_, i) => i !== index));
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        className="rounded-full px-4 py-1.5 text-sm text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                    >
                        Drafts ({drafts.length})
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-lg font-semibold text-white">
                            {currentUserAvatarLetter}
                        </div>
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="What's happening?"
                            rows={4}
                            className="w-full resize-none bg-transparent text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                            autoFocus
                        />
                    </div>

                    {postMedia.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {postMedia.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img src={url} alt={`Upload ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                                    <button
                                        onClick={() => handleRemoveMedia(index)}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="mt-4 flex items-center gap-2 text-base font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
                            <circle cx="12" cy="11" r="2" />
                        </svg>
                        Everyone can reply
                    </button>

                    <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Media Upload */}
                                <label className="cursor-pointer" title="Add media">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleMediaUpload}
                                        className="hidden"
                                    />
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                </label>

                                {/* GIF */}
                                <button
                                    onClick={() => alert('GIF picker coming soon!')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    title="Add GIF"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M4 8h4a2 2 0 0 1 0 4H5v2" />
                                        <path d="M12 8v8" />
                                        <path d="M16 8h5" />
                                        <path d="M19 8v8" />
                                        <path d="M16 12h3" />
                                    </svg>
                                </button>

                                {/* Poll */}
                                <button
                                    onClick={() => alert('Poll feature coming soon!')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    title="Create poll"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <line x1="6" y1="19" x2="6" y2="10" />
                                        <line x1="12" y1="19" x2="12" y2="5" />
                                        <line x1="18" y1="19" x2="18" y2="13" />
                                    </svg>
                                </button>

                                {/* Emoji */}
                                <button
                                    onClick={() => alert('Emoji picker coming soon!')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    title="Add emoji"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                </button>

                                {/* Schedule/Calendar */}
                                <button
                                    onClick={() => alert('Schedule post coming soon!')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    title="Schedule post"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </button>

                                {/* Location */}
                                <button
                                    onClick={() => alert('Add location coming soon!')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    title="Add location"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
                                        <circle cx="12" cy="11" r="2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {postContent.length}/280
                                </span>
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={!postContent.trim() && postMedia.length === 0}
                                    className="rounded-full px-5 py-2 text-base font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 transition hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed dark:text-indigo-200 dark:ring-indigo-500/40 dark:hover:bg-indigo-500/10"
                                >
                                    Draft
                                </button>
                                <button
                                    onClick={handlePost}
                                    disabled={!postContent.trim() && postMedia.length === 0}
                                    className="rounded-full bg-indigo-600 px-6 py-2 text-base font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    {createPostLoading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
