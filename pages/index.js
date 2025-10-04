import React, { useState } from 'react';
import Link from 'next/link';
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

  const handleOAuth = async (provider) => {
    try {
      setError('');
      setMessage('');
      if (!supabase) {
        setError('Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart dev server.');
        return;
      }
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OAuth sign-in failed');
    }
  };

  const handleForgotPassword = async () => {
    try {
      setError('');
      setMessage('');
      if (!supabase) {
        setError('Auth is not configured.');
        return;
      }
      if (!email) {
        setError('Enter your email above to receive a reset link.');
        return;
      }
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
      });
      setMessage('Password reset email sent. Check your inbox.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send reset email');
    }
  };

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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-white/90">
                  <input type="checkbox" className="h-4 w-4" />
                  <span>Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-white/80 hover:text-white underline underline-offset-2">
                  Forgot password
                </button>
              </div>

              {error && (
                <div className="text-red-100 bg-red-700/60 border border-red-400/60 rounded-md p-2 text-sm">{error}</div>
              )}
              {message && (
                <div className="text-emerald-100 bg-emerald-700/60 border border-emerald-400/60 rounded-md p-2 text-sm">{message}</div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#354BAE] text-white font-semibold py-3 rounded-lg hover:bg-[#2f429b] transition disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400">{loading ? 'Signing in…' : 'Sign in'}</button>

              {/* Sign up link */}
              <p className="text-center text-sm text-white/85">
                Don't have an account?{' '}
                <Link href="/signup" className="underline underline-offset-2 text-white hover:text-white dark:text-indigo-300 hover:dark:text-indigo-200">Sign up</Link>
              </p>

              {/* Social sign in */}
              <div className="mt-2">
                <p className="text-center text-white/70 text-sm mb-3">Or login with</p>
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" onClick={()=>handleOAuth('facebook')} aria-label="Continue with Facebook" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24H12.82v-9.294H9.691V11.06h3.129V8.41c0-3.1 1.893-4.788 4.659-4.788 1.324 0 2.463.098 2.794.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.314h3.592l-.467 3.646h-3.125V24h6.127C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z"/></svg>
                  </button>
                  <button type="button" onClick={()=>handleOAuth('google')} aria-label="Continue with Google" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.58 31.91 29.162 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.285 16.736 18.783 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 43c5.072 0 9.67-1.938 13.186-5.1l-6.084-5.147C29.109 34.869 26.701 36 24 36c-5.137 0-9.537-3.063-11.285-7.441l-6.54 5.034C9.48 39.556 16.227 43 24 43z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.077-3.394 5.487-6.201 6.771.003-.001.006-.003.009-.004l6.084 5.147C33.03 40.954 38.926 38 43 32c1.259-2.058 2-4.609 2-7.5 0-1.341-.138-2.65-.389-3.917z"/></svg>
                  </button>
                  <button type="button" onClick={()=>handleOAuth('apple')} aria-label="Continue with Apple" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90"><path d="M16.365 1.43c0 1.14-.422 2.058-1.265 2.753-.843.69-1.785 1.087-2.83 1.183-.12-1.127.333-2.08 1.36-2.857.64-.486 1.39-.751 2.251-.792.197.015.34.035.427.06.04.12.057.27.057.45zm3.403 16.55c-.346.8-.756 1.52-1.228 2.157-.64.86-1.164 1.454-1.57 1.78-.627.58-1.3.878-2.018.897-.513 0-1.133-.147-1.86-.44-.729-.292-1.4-.44-2.015-.44-.64 0-1.327.148-2.062.44-.736.293-1.33.448-1.783.47-.68.03-1.366-.275-2.06-.92-.44-.4-.974-1.02-1.6-1.86-.686-.92-1.25-1.987-1.69-3.203-.473-1.3-.71-2.552-.71-3.76 0-1.39.3-2.59.898-3.6.47-.8 1.095-1.432 1.875-1.897.78-.47 1.624-.71 2.533-.73.497 0 1.15.17 1.958.51.806.34 1.326.51 1.56.51.18 0 .73-.2 1.65-.6.88-.36 1.623-.51 2.227-.45 1.646.132 2.884.777 3.71 1.94-1.47.89-2.197 2.14-2.18 3.757.02 1.252.47 2.291 1.345 3.115.4.38.88.676 1.437.89-.115.33-.237.65-.366.96z"/></svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Right-side illustration (full height, flush to right, no overlap) */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[62%] z-10 overflow-hidden rounded-tl-[180px] rounded-bl-[60px] dark:rounded-tl-[48px] dark:rounded-bl-[48px]">
        {/* Light mode illustration */}
        <img src="/img/llus1.png" alt="Login illustration" className="w-full h-full object-cover object-[60%_45%] block dark:hidden" />
        {/* Dark mode video illustration */}
        <video
          src="/img/darkmodevid.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center hidden dark:block"
        />
        {/* Softer overlay for better balance; beneath card (z-10) and logo (z-50) */}
        <div className="absolute inset-0 bg-black/[0.005] dark:bg-black/[0.15] backdrop-blur-0" />
        {/* Dark edge overlay to counter bleed */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/20 to-transparent opacity-25" />
        {/* Ultra-thin white hairline for crisp join */}
        <div className="absolute left-0 inset-y-0 w-px bg-white rounded-tl-[180px] rounded-bl-[60px]" />
      </div>
    </div>
  );
}
