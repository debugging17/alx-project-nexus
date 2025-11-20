import { useMemo, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from './SplitText';

const Africa = dynamic(() => import('@react-map/africa'), { ssr: false });

const hubBadges = [
  { label: 'Lagos', top: '34%', left: '27%' },
  { label: 'Accra', top: '37%', left: '30%' },
  { label: 'Nairobi', top: '45%', left: '54%' },
  { label: 'Cairo', top: '17%', left: '50%' },
  { label: 'Cape Town', top: '84%', left: '47%' },
  { label: 'Johannesburg', top: '79%', left: '44%' },
  { label: 'Addis Ababa', top: '34%', left: '57%' },
  { label: 'Dakar', top: '26%', left: '22%' },
  { label: 'Abuja', top: '30%', left: '33%' },
  { label: 'Dar es Salaam', top: '56%', left: '58%' },
  { label: 'Antananarivo', top: '66%', left: '80%' },
];

const MAP_LAYOUT = {
  base: { topGap: '3.4rem', scale: 1.92 },
  md: { topGap: '3.8rem', scale: 2.02 },
  lg: { topGap: '4.1rem', scale: 2.08 },
};

export default function AnimatedSplashScreen({ onFinished, duration = 15000 }) {
  const container = useRef(null);
  const mapContainer = useRef(null);
  const progress = useRef(0);
  const finishedRef = useRef(false);
  const [activeCity, setActiveCity] = useState(null);

  const segmentCount = 18;
  const filledSegments = useMemo(() =>
    Math.min(
      segmentCount,
      Math.round(Math.max(0, Math.min(progress.current, 1)) * segmentCount),
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress.current],
  );

  const { contextSafe } = useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Only auto-finish if no city is selected to avoid interrupting interaction
          if (!finishedRef.current && !activeCity) {
            finishedRef.current = true;
            onFinished?.();
          }
        },
      });

      tl.fromTo(
        container.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
      );

      tl.fromTo(
        '.logo',
        { y: -30, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)' },
        '+=0.3',
      );

      tl.fromTo(
        '.headline .char',
        { y: 50, autoAlpha: 0, rotateX: -90 },
        {
          y: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 1.0,
          ease: 'back.out(1.7)',
          stagger: 0.03,
        },
        '+=0.5',
      );

      tl.fromTo(
        '.sub-headline',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' },
        '<+=0.5',
      );

      tl.fromTo(
        '.feature-tag',
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
        },
        '+=0.2',
      );

      tl.to(
        progress,
        {
          current: 1,
          duration: duration / 1000 - tl.duration(),
          ease: 'linear',
        },
        0,
      );

      tl.fromTo(
        '.map-transform-graphic',
        { scale: 1.4, autoAlpha: 0, filter: 'blur(10px)' },
        {
          scale: 1,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 2.5,
          ease: 'power3.out',
        },
        1.5,
      );

      tl.fromTo(
        '.hub-badge',
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: {
            amount: 1.5,
            from: 'random'
          },
        },
        2.5,
      );
    },
    { scope: container },
  );

  const handleSkip = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinished?.();
    }
  };

  const handleCityClick = contextSafe((city) => {
    setActiveCity(city);
    const scale = 3.5;
    const xPercent = (50 - parseFloat(city.left)) * scale;
    const yPercent = (50 - parseFloat(city.top)) * scale;

    gsap.to(mapContainer.current, {
      scale: scale,
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 1.5,
      ease: 'power4.inOut',
    });

    // Fade out other badges
    gsap.to('.hub-badge', {
      autoAlpha: 0,
      scale: 0,
      duration: 0.5,
      overwrite: true,
    });

    // Show only active badge (custom logic or just keep it hidden and show a detail card?)
    // Let's keep the active one visible but scaled down inversely? 
    // Or simpler: hide all badges and show a "Welcome to [City]" overlay.
  });

  const handleBackToMap = contextSafe(() => {
    setActiveCity(null);
    gsap.to(mapContainer.current, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      duration: 1.2,
      ease: 'power4.inOut',
    });

    gsap.to('.hub-badge', {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.05,
    });
  });

  return (
    <div
      ref={container}
      className="invisible relative flex min-h-screen w-screen items-center justify-start overflow-hidden bg-slate-950 text-slate-100 font-sans"
    >
      {/* Dynamic Animated Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 animate-pulse" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" aria-hidden />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.1 }} />

      <div className="relative z-10 grid h-full w-full max-w-[1260px] grid-cols-1 items-stretch gap-8 pl-3 pr-3 py-6 sm:pl-4 sm:pr-4 sm:py-7 md:grid-cols-[1.05fr,1fr] md:gap-10 md:pl-6 md:pr-5 md:py-8 lg:gap-14 lg:pl-8 lg:pr-6">
        <div className={`flex h-full w-full flex-col justify-between text-center md:max-w-[500px] md:text-left transition-opacity duration-500 ${activeCity ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left md:pt-1">
            <Link
              href="/"
              className="logo relative block w-fit focus:outline-none"
            >
              <span className="sr-only">Go to home</span>
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Nexus</span>
              </div>
            </Link>

            <div className="max-w-xl space-y-6">
              <p className="sub-headline inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-300 backdrop-blur-md">
                Connecting African Creatives
              </p>
              <SplitText
                text="Discover. Collaborate. Showcase."
                className="headline text-5xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 sm:text-6xl md:text-7xl"
                splitType="chars"
                tag="h2"
              />
              <p className="sub-headline text-lg leading-relaxed text-slate-400 md:text-xl">
                From Lagos to Nairobi, Accra to Cape Town—immerse yourself in a vibrant network of artists, designers, musicians, filmmakers, and storytellers shaping culture across the continent.
              </p>
            </div>
          </div>

          <div className="mt-auto flex w-full max-w-xl flex-col items-center gap-6 pb-4 md:items-start">
            {/* Glassmorphism Loading Card */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium uppercase tracking-widest text-indigo-300">
                  Initializing Nexus
                </p>
                <span className="text-xs font-mono text-slate-400">
                  {Math.round(Math.min(1, Math.max(0, progress.current)) * 100)}%
                </span>
              </div>

              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(1, Math.max(0, progress.current)) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex w-full flex-wrap justify-center gap-3 md:justify-start">
              {['Live showcases', 'Creator collabs', 'Marketplace'].map((tag) => (
                <span key={tag} className="feature-tag rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white">
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 transition hover:bg-indigo-50 md:self-start"
            >
              <span className="relative z-10">Enter Nexus</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 transition group-hover:opacity-10" />
            </button>
          </div>
        </div>

        {/* Detail View Overlay */}
        <div className={`absolute inset-0 z-20 flex flex-col items-start justify-center p-8 transition-all duration-500 ${activeCity ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {activeCity && (
            <div className="max-w-md space-y-6">
              <button
                onClick={handleBackToMap}
                className="flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-white transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to map
              </button>
              <h2 className="text-6xl font-bold text-white">{activeCity.label}</h2>
              <p className="text-xl text-slate-300">
                A thriving hub of creativity and innovation. Explore the local scene, connect with top talent, and discover unique opportunities in {activeCity.label}.
              </p>
              <button
                onClick={handleSkip}
                className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
              >
                Explore {activeCity.label}
              </button>
            </div>
          )}
        </div>

        <div className="flex h-full w-full items-start justify-center">
          <div className="relative flex h-full w-full max-w-[760px] flex-col px-1.5 pb-0 pt-0 sm:px-2 md:px-0 md:pt-0">
            <div className="map-transform-wrapper relative flex h-full w-full flex-col rounded-[44px]">
              <div className="map-transform-spacer flex-none" aria-hidden />
              <div className="map-transform-inner relative flex-1">
                <div
                  ref={mapContainer}
                  className="map-transform-canvas absolute inset-0 flex items-end justify-center overflow-visible"
                >
                  <Africa
                    type="select-multiple"
                    disableClick
                    disableHover
                    mapColor={'rgba(99, 102, 241, 0.1)'}
                    strokeColor={'rgba(129, 140, 248, 0.6)'}
                    strokeWidth={1.5}
                    className={`map-transform-graphic h-full w-auto transform-gpu drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]`}
                  />
                  {hubBadges.map((badge) => (
                    <button
                      key={badge.label}
                      onClick={() => handleCityClick(badge)}
                      style={{ top: badge.top, left: badge.left }}
                      className="hub-badge absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/30 bg-indigo-950/80 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)] backdrop-blur-md transition hover:scale-110 hover:bg-indigo-900 hover:text-white cursor-pointer z-10"
                    >
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      {badge.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <style jsx>{`
              .map-transform-wrapper {
                --map-top-gap: ${MAP_LAYOUT.base.topGap};
                --map-scale: ${MAP_LAYOUT.base.scale};
                overflow: visible;
              }
              .map-transform-spacer {
                height: var(--map-top-gap);
              }
              .map-transform-graphic {
                transform-origin: top center;
                transform: scale(var(--map-scale));
              }
              .map-transform-inner {
                position: relative;
              }
              .map-transform-canvas {
                position: absolute;
              }
              @media (min-width: 768px) {
                .map-transform-wrapper {
                  --map-top-gap: ${MAP_LAYOUT.md.topGap};
                  --map-scale: ${MAP_LAYOUT.md.scale};
                }
              }
              @media (min-width: 1024px) {
                .map-transform-wrapper {
                  --map-top-gap: ${MAP_LAYOUT.lg.topGap};
                  --map-scale: ${MAP_LAYOUT.lg.scale};
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
