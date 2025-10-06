import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const SplashScreen = dynamic(() => import('../components/SplashScreen'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
      <div className="animate-pulse text-sm uppercase tracking-[0.4em] text-indigo-200">Loading intro…</div>
    </div>
  ),
});

export default function SplashPage() {
  const router = useRouter();

  const redirectToHome = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('splashShown', 'true');
      window.localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
    router.replace('/');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const status = window.sessionStorage.getItem('splashShown');
    if (status === 'true') {
      redirectToHome();
    }
  }, [redirectToHome]);

  const handleFinish = () => {
    redirectToHome();
  };

  return <SplashScreen onFinished={handleFinish} duration={15000} />;
}
