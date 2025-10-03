import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!supabase) {
      setError('Auth is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the dev server.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user && !data.session) {
        setMessage('Account created. Please check your email to confirm your address.');
      } else if (data?.session) {
        setMessage('Signed up and logged in.');
      } else {
        setMessage('Sign up initiated.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen items-start pt-10 md:pt-14 pb-0 px-4 md:px-8 overflow-hidden bg-[url('/img/illus2.png')] bg-cover bg-center" style={{ backgroundSize: '120% 120%', backgroundPosition: '40% 40%' }}>

      {/* Global top-right logo pill */}
      <div className="absolute top-10 right-2 md:top-14 md:right-4 z-50">
        <div className="inline-flex items-center justify-center h-16 md:h-20 px-0 bg-transparent backdrop-blur-0 shadow-none ring-0 rounded-none drop-shadow-md">
          <img src="/img/logo.svg" alt="App logo" className="h-12 md:h-14 w-auto object-contain" />
        </div>
      </div>

      {/* Subtle overlay to soften background image */}
      <div className="absolute inset-0 bg-white/70 md:bg-white/65 backdrop-blur-[2.5px] z-10 pointer-events-none" />

      {/* Full-width background illustration applied to wrapper; no separate panel needed */}

      {/* Centered Sign Up Card over background */}
      <div className="w-full max-w-[860px] mx-auto mt-0 relative z-20 -translate-x-4 md:-translate-x-6">
        <div className="bg-gradient-to-br from-red-600/70 to-red-950/70 rounded-3xl p-5 md:p-6 relative ring-1 ring-white/30 shadow-xl">
          {/* Blur Overlay */}
          <div className="absolute inset-0 m-4 bg-white/10 border border-white/20 backdrop-blur-[3px] rounded-xl" />

          {/* Form Content */}
          <div className="relative z-10 pb-1">
            <h1 className="text-3xl md:text-[1.9rem] text-white font-semibold">Sign up</h1>
            <p className="mt-2 text-white/80 text-sm md:text-base">Let's get you all set up so you can access your personal account.</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-white/90 mb-1">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="John"
                    className="w-full rounded-lg px-4 py-2.5 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm text-white/90 mb-1">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Doe"
                    className="w-full rounded-lg px-4 py-2.5 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="block text-sm text-white/90 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john.doe@gmail.com"
                    className="w-full rounded-lg px-4 py-2.5 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-white/90 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-1234"
                    className="w-full rounded-lg px-4 py-2.5 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-white/90 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full rounded-lg px-4 py-2.5 pr-12 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 p-2 rounded-md"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5Z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M2.1 3.51 3.5 2.1l18.4 18.4-1.41 1.41-3.23-3.23A11.9 11.9 0 0 1 12 19c-5 0-9-4-10-7a14 14 0 0 1 4.36-5.58L2.1 3.5Zm6.9 6.9a3 3 0 0 0 4.59 3.82l-4.6-4.6Zm3-4.91c5 0 9 4 10 7a14 14 0 0 1-3.38 4.65l-1.45-1.45A11.9 11.9 0 0 0 21 12c-1-3-5-7-10-7-1.1 0-2.15.2-3.12.56l-1.5-1.5A13.9 13.9 0 0 1 12 5.5Z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm text-white/90 mb-1">Confirm password</label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full rounded-lg px-4 py-2.5 pr-12 bg-white/90 focus:bg-white outline-none ring-2 ring-transparent focus:ring-white/60 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 p-2 rounded-md"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5Z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M2.1 3.51 3.5 2.1l18.4 18.4-1.41 1.41-3.23-3.23A11.9 11.9 0 0 1 12 19c-5 0-9-4-10-7a14 14 0 0 1 4.36-5.58L2.1 3.5Zm6.9 6.9a3 3 0 0 0 4.59 3.82l-4.6-4.6Zm3-4.91c5 0 9 4 10 7a14 14 0 0 1-3.38 4.65l-1.45-1.45A11.9 11.9 0 0 0 21 12c-1-3-5-7-10-7-1.1 0-2.15.2-3.12.56l-1.5-1.5A13.9 13.9 0 0 1 12 5.5Z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms agreement */}
              <label className="inline-flex items-start gap-3 text-white/90">
                <input type="checkbox" required className="mt-1 h-4 w-4" />
                <span className="text-sm">
                  I agree to all the{' '}
                  <a className="underline underline-offset-2">Terms</a>
                  {' '}and{' '}
                  <a className="underline underline-offset-2">Privacy Policies</a>
                </span>
              </label>

              {error && (
                <div className="text-red-100 bg-red-700/60 border border-red-400/60 rounded-md p-2 text-sm">{error}</div>
              )}
              {message && (
                <div className="text-emerald-100 bg-emerald-700/60 border border-emerald-400/60 rounded-md p-2 text-sm">{message}</div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#354BAE] text-white font-semibold py-2.5 md:py-3 rounded-lg hover:bg-[#2f429b] transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <p className="text-sm text-white/80 text-center">
                Already have an account?{' '}
                <Link href="/" className="underline underline-offset-2">Login</Link>
              </p>

              {/* Social signup */}
              <div className="mt-3 mb-1 hidden md:block">
                <p className="text-center text-white/70 text-sm mb-3">Or Sign up with</p>
                <div className="grid grid-cols-3 gap-5">
                  <button type="button" aria-label="Continue with Facebook" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24H12.82v-9.294H9.691V11.06h3.129V8.41c0-3.1 1.893-4.788 4.659-4.788 1.324 0 2.463.098 2.794.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.314h3.592l-.467 3.646h-3.125V24h6.127C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z"/></svg>
                  </button>
                  <button type="button" aria-label="Continue with Google" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.58 31.91 29.162 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.285 16.736 18.783 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.869 5.053 29.729 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 43c5.072 0 9.67-1.938 13.186-5.1l-6.084-5.147C29.109 34.869 26.701 36 24 36c-5.137 0-9.537-3.063-11.285-7.441l-6.54 5.034C9.48 39.556 16.227 43 24 43z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.077-3.394 5.487-6.201 6.771.003-.001.006-.003.009-.004l6.084 5.147C33.03 40.954 38.926 38 43 32c1.259-2.058 2-4.609 2-7.5 0-1.341-.138-2.65-.389-3.917z"/></svg>
                  </button>
                  <button type="button" aria-label="Continue with Apple" className="w-full border-2 border-white/80 rounded-xl py-3 bg-white/0/0 hover:bg-white/10 transition inline-flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.25)_inset]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white/90"><path d="M16.365 1.43c0 1.14-.422 2.058-1.265 2.753-.843.69-1.785 1.087-2.83 1.183-.12-1.127.333-2.08 1.36-2.857.64-.486 1.39-.751 2.251-.792.197.015.34.035.427.06.04.12.057.27.057.45zm3.403 16.55c-.346.8-.756 1.52-1.228 2.157-.64.86-1.164 1.454-1.57 1.78-.627.58-1.3.878-2.018.897-.513 0-1.133-.147-1.86-.44-.729-.292-1.4-.44-2.015-.44-.64 0-1.327.148-2.062.44-.736.293-1.33.448-1.783.47-.68.03-1.366-.275-2.06-.92-.44-.4-.974-1.02-1.6-1.86-.686-.92-1.25-1.987-1.69-3.203-.473-1.3-.71-2.552-.71-3.76 0-1.39.3-2.59.898-3.6.47-.8 1.095-1.432 1.875-1.897.78-.47 1.624-.71 2.533-.73.497 0 1.15.17 1.958.51.806.34 1.326.51 1.56.51.18 0 .73-.2 1.65-.6.88-.36 1.623-.51 2.227-.45 1.646.132 2.884.777 3.71 1.94-1.47.89-2.197 2.14-2.18 3.757.02 1.252.47 2.291 1.345 3.115.4.38.88.676 1.437.89-.115.33-.237.65-.366.96z"/></svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      
    </div>
  );
}
