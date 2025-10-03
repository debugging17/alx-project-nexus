import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!supabase) {
      setError('Auth is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the dev server.');
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      setLoading(true);
      // Note: rememberMe persistence can be customized by creating a separate client with different storage.
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      if (data?.session) {
        setMessage('Logged in successfully. Redirecting…');
        setTimeout(() => {
          router.push('/dashboard');
        }, 300);
      } else {
        setMessage('Check your email to continue.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center pt-20 md:pt-24 overflow-hidden rounded-tl-[60px] rounded-bl-[60px]">
      {/* Top-left logo */}
      <div className="absolute top-6 left-6 z-30">
        <div className="inline-flex items-center justify-center h-16 md:h-20 px-5 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-white/20">
          <Image src="/img/logo.svg" alt="App logo" width={64} height={64} priority />
        </div>
      </div>
      {/* Left Section - Interactive Login Form */}
      <div className="w-full max-w-xl ml-8 mt-1 md:mt-0 relative z-20">
        <div className="bg-gradient-to-br from-red-600/70 to-red-950/70 rounded-3xl p-8 md:p-10 relative">
          {/* Blur Overlay */}
          <div className="absolute inset-0 m-4 bg-white/10 border border-white/20 backdrop-blur-[3px] rounded-xl" />

          {/* Form Content */}
          <div className="relative z-10">
            <h1 className="text-4xl text-white font-semibold">Login</h1>
            <p className="mt-3 text-white/80 text-base">
              Login to access your Abɔnten account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-white/90 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-4 py-3 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-white/90 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg px-4 py-3 pr-12 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-white/90">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Remember me
                </label>
                <a href="#" className="text-white/90 underline-offset-2 hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="text-red-100 bg-red-700/60 border border-red-400/60 rounded-md p-2 text-sm">{error}</div>
              )}
              {message && (
                <div className="text-emerald-100 bg-emerald-700/60 border border-emerald-400/60 rounded-md p-2 text-sm">{message}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#354BAE] text-white font-semibold py-3 rounded-lg hover:bg-[#2f429b] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <p className="mt-4 text-center text-white/90">
                Don’t have an account?{' '}
                <Link href="/signup" className="underline underline-offset-2 hover:text-white">
                  Sign up
                </Link>
              </p>

              {/* Social login divider */}
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/30" />
                  <span className="text-white/70 text-sm">Or login with</span>
                  <div className="flex-1 h-px bg-white/30" />
                </div>

                {/* Social buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Facebook */}
                  <button type="button" aria-label="Continue with Facebook" className="group w-full border-2 border-white rounded-xl py-4 bg-white/0 hover:bg-white/10 transition inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90 group-hover:fill-white"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24H12.82v-9.294H9.691V11.06h3.129V8.41c0-3.1 1.893-4.788 4.659-4.788 1.324 0 2.463.098 2.794.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.314h3.592l-.467 3.646h-3.125V24h6.127C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z"/></svg>
                  </button>

                  {/* Google */}
                  <button type="button" aria-label="Continue with Google" className="group w-full border-2 border-white rounded-xl py-4 bg-white/0 hover:bg-white/10 transition inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.58 31.91 29.162 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.285 16.736 18.783 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 43c5.072 0 9.67-1.938 13.186-5.1l-6.084-5.147C29.109 34.869 26.701 36 24 36c-5.137 0-9.537-3.063-11.285-7.441l-6.54 5.034C9.48 39.556 16.227 43 24 43z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.077-3.394 5.487-6.201 6.771.003-.001.006-.003.009-.004l6.084 5.147C33.03 40.954 38.926 38 43 32c1.259-2.058 2-4.609 2-7.5 0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                  </button>
                  {/* Apple */}
                  <button type="button" aria-label="Continue with Apple" className="group w-full border-2 border-white rounded-xl py-4 bg-white/0 hover:bg-white/10 transition inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90 group-hover:fill-white"><path d="M16.365 1.43c0 1.14-.422 2.058-1.265 2.753-.843.69-1.785 1.087-2.83 1.183-.12-1.127.333-2.08 1.36-2.857.64-.486 1.39-.751 2.251-.792.197.015.34.035.427.06.04.12.057.27.057.45zm3.403 16.55c-.346.8-.756 1.52-1.228 2.157-.64.86-1.164 1.454-1.57 1.78-.627.58-1.3.878-2.018.897-.513 0-1.133-.147-1.86-.44-.729-.292-1.4-.44-2.015-.44-.64 0-1.327.148-2.062.44-.736.293-1.33.448-1.783.47-.68.03-1.366-.275-2.06-.92-.44-.4-.974-1.02-1.6-1.86-.686-.92-1.25-1.987-1.69-3.203-.473-1.3-.71-2.552-.71-3.76 0-1.39.3-2.59.898-3.6.47-.8 1.095-1.432 1.875-1.897.78-.47 1.624-.71 2.533-.73.497 0 1.15.17 1.958.51.806.34 1.326.51 1.56.51.18 0 .73-.2 1.65-.6.88-.36 1.623-.51 2.227-.45 1.646.132 2.884.777 3.71 1.94-1.47.89-2.197 2.14-2.18 3.757.02 1.252.47 2.291 1.345 3.115.4.38.88.676 1.437.89-.115.33-.237.65-.366.96z"/></svg>
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden md:block -ml-6 md:-ml-10 relative z-10 h-full -mt-20 md:-mt-24 h-[calc(100%+5rem)] md:h-[calc(100%+6rem)] rounded-tl-[60px] rounded-bl-[60px] overflow-hidden">
          <img
            src="/img/llus1.png"
            alt="Login illustration"
            className="w-full h-full object-cover object-center"
          />
      </div>
    </div>
  );
}
