import React, { useEffect, useState } from 'react';

// Small theme toggle using Tailwind's `dark` class on <html>
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    setMounted(true);
    // Load preference
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);
  }, []);

  const applyTheme = (next) => {
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
      className={[
        'fixed right-4 top-4 z-[60] rounded-full border px-3 py-2 text-sm font-medium shadow-md transition-colors',
        theme === 'dark'
          ? 'bg-white text-slate-900 border-white/60 hover:bg-white/95'
          : 'bg-slate-900 text-white border-slate-800 hover:bg-black'
      ].join(' ')}
    >
      <span className="inline-flex items-center gap-2">
        {theme === 'dark' ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79l1.8-1.79m10.48 0l1.79-1.79l1.79 1.79l-1.79 1.79l-1.79-1.79M12 4V1h-0v3h0m0 19v-3h0v3h0M4 13H1v-0h3v0m22 0h-3v0h3v0M6.76 19.16l-1.8 1.79l-1.79-1.79l1.79-1.79l1.8 1.79M19.24 19.16l1.79 1.79l1.79-1.79l-1.79-1.79l-1.79 1.79M12 6a6 6 0 1 1 0 12A6 6 0 0 1 12 6Z"/></svg>
            Light
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 2a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9c0-1.59-.41-3.08-1.12-4.38c-.22-.4-.76-.47-1.08-.16A7 7 0 0 1 7.54 17.62c-.31.32-.24.86.16 1.08C8.92 19.41 10.41 19.82 12 19.82A9 9 0 0 0 12 2Z"/></svg>
            Dark
          </>
        )}
      </span>
    </button>
  );
}
