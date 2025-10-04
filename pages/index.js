import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="relative min-h-screen flex items-center pt-24 md:pt-28 overflow-hidden rounded-tl-[60px] rounded-bl-[60px] dark:rounded-none bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Top-left logo block (blended, theme-aware) */}
      <div className="absolute top-10 left-6 z-50">
        <div className="inline-flex items-center justify-center px-0 py-0 bg-transparent rounded-none shadow-none ring-0">
          {/* Light mode logo */}
          <img src="/img/logo.svg" alt="App logo" className="h-20 md:h-24 w-auto object-contain drop-shadow-md block dark:hidden" />
          {/* Dark mode logo */}
          <img src="/img/darkmodelogo.svg" alt="App logo dark" className="h-16 md:h-20 w-auto object-contain drop-shadow-md hidden dark:block" />
        </div>
      </div>

      {/* Left Section - Login Card (stronger glass, no overlap) */}
      <div className="w-full max-w-xl ml-8 mt-1 md:mt-0 relative z-20">
        <div className="bg-gradient-to-br from-red-600/70 to-red-950/70 dark:from-slate-800/70 dark:to-slate-900/70 rounded-3xl p-8 md:p-10 relative shadow-2xl ring-1 ring-white/10 dark:ring-white/5">
          <div className="absolute inset-0 m-4 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/10 backdrop-blur-md rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]" />

          <div className="relative z-10">
            <h1 className="text-4xl text-white font-semibold">Login</h1>
            <p className="mt-3 text-white/80 text-base">Login to access your Abɔnten account</p>

            <form
              className="mt-8 space-y-5"
              onSubmit={async (e)=>{
                e.preventDefault();
                setError('');
                setMessage('');
                if (!supabase) {
                  setError('Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart dev server.');
                  return;
                }
                if (!email || !password) {
                  setError('Email and password are required.');
                  return;
                }
                try {
                  setLoading(true);
                  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                  if (signInError) {
                    setError(signInError.message);
                    return;
                  }
                  if (data?.session) {
                    setMessage('Logged in. Redirecting…');
                    setTimeout(()=>router.push('/dashboard'), 200);
                  } else {
                    setMessage('Check your email to continue.');
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unexpected error');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div>
                <label htmlFor="email" className="block text-sm text-white/90 mb-1">Email</label>
                <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-lg px-4 py-3 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800/80 dark:focus:bg-slate-800 dark:placeholder:text-slate-400" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-white/90 mb-1">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg px-4 py-3 pr-12 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800/80 dark:focus:bg-slate-800 dark:placeholder:text-slate-400" />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-100 bg-red-700/60 border border-red-400/60 rounded-md p-2 text-sm">{error}</div>
              )}
              {message && (
                <div className="text-emerald-100 bg-emerald-700/60 border border-emerald-400/60 rounded-md p-2 text-sm">{message}</div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#354BAE] text-white font-semibold py-3 rounded-lg hover:bg-[#2f429b] transition disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400">{loading ? 'Signing in…' : 'Sign in'}</button>
            </form>
          </div>
        </div>
      </div>
      {/* Right-side illustration (full height, flush to right, no overlap) */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[62%] z-10 overflow-hidden rounded-tl-[180px] rounded-bl-[60px]">
        <img src="/img/llus1.png" alt="Login illustration" className="w-full h-full object-cover object-center" />
        {/* Dark edge overlay to counter bleed */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/20 to-transparent opacity-25" />
        {/* Ultra-thin white hairline for crisp join */}
        <div className="absolute left-0 inset-y-0 w-px bg-white rounded-tl-[180px] rounded-bl-[60px]" />
      </div>
    </div>
  );
}
