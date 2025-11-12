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

export default function AnimatedSplashScreen({ onFinished, duration = 5000 }) {
  const container = useRef(null);
  const progress = useRef(0);
  const finishedRef = useRef(false);

  const segmentCount = 18;
  const filledSegments = useMemo(() =>
    Math.min(
      segmentCount,
      Math.round(Math.max(0, Math.min(progress.current, 1)) * segmentCount),
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress.current],
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!finishedRef.current) {
            finishedRef.current = true;
            onFinished?.();
          }
        },
      });

      tl.fromTo(
        container.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' },
      );

      tl.fromTo(
        '.logo',
        { y: -50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
        '+=0.2',
      );

      tl.fromTo(
        '.headline .char',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.03,
        },
        '+=0.2',
      );

      tl.fromTo(
        '.sub-headline',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
        '+=0.2',
      );

      tl.fromTo(
        '.feature-tag',
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        },
        '+=0.3',
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
        { scale: 1.5, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.5,
          ease: 'power3.out',
        },
        1,
      );

      tl.fromTo(
        '.hub-badge',
        { scale: 0.5, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        },
        1.5,
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

  return (
    <div
      ref={container}
      className="invisible relative flex min-h-screen w-screen items-center justify-start overflow-hidden bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50/65 to-indigo-50/55 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-900/40" aria-hidden />

      <div className="relative z-10 grid h-full w-full max-w-[1260px] grid-cols-1 items-stretch gap-8 pl-3 pr-3 py-6 sm:pl-4 sm:pr-4 sm:py-7 md:grid-cols-[1.05fr,1fr] md:gap-10 md:pl-6 md:pr-5 md:py-8 lg:gap-14 lg:pl-8 lg:pr-6">
        <div className="flex h-full w-full flex-col justify-between text-center md:max-w-[500px] md:text-left">
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left md:pt-1">
            <Link
              href="/"
              className="logo relative block w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-[#354BAE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span className="sr-only">Go to home</span>
              <img
                src="/img/logo.svg"
                alt="Project Nexus logo"
                className="h-20 w-auto drop-shadow-[0_18px_45px_rgba(99,102,241,0.3)] md:h-24"
              />
              <div className="absolute inset-x-0 -bottom-5 h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-400 blur-md opacity-80" />
            </Link>

            <div className="max-w-xl space-y-5 text-slate-600 dark:text-slate-300">
              <p className="sub-headline text-xs uppercase tracking-[0.55em] text-[#354BAE] md:text-sm dark:text-indigo-300">
                Connecting African Creatives
              </p>
              <SplitText
                text="Discover. Collaborate. Showcase."
                className="headline text-[2.3rem] font-semibold leading-[1.03] text-slate-900 dark:text-slate-100 sm:text-[2.45rem] md:text-[2.8rem] lg:text-[3.1rem] xl:text-[3.3rem]"
                splitType="chars"
                tag="h2"
              />
              <p className="sub-headline text-sm leading-relaxed text-slate-600 md:text-[0.95rem] lg:text-[1.02rem] dark:text-slate-300">
                From Lagos to Nairobi, Accra to Cape Town—immerse yourself in a vibrant network of artists, designers, musicians, filmmakers, and storytellers shaping culture across the continent.
              </p>
            </div>
          </div>

          <div className="mt-auto flex w-full max-w-xl flex-col items-center gap-4 pb-2 text-[0.7rem] text-slate-500 dark:text-slate-300 md:items-start md:text-[0.8rem]">
            <div className="w-full rounded-2xl border border-[#FF0000]/45 bg-white/95 p-4 shadow-[0_14px_40px_rgba(255,0,0,0.08)] backdrop-blur-sm sm:p-5 dark:border-indigo-400/35 dark:bg-slate-900/75 dark:shadow-[0_20px_54px_rgba(15,23,42,0.52)]">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-[#354BAE] md:text-xs dark:text-indigo-300">
                Loading...
              </p>
              <div className="mt-3 rounded-lg border border-[#354BAE]/35 bg-[#eef1ff] p-1.5 shadow-inner dark:border-indigo-400/30 dark:bg-slate-800/70">
                <div className="flex h-4 items-stretch gap-1.5">
                  {Array.from({ length: segmentCount }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`flex-1 rounded-[2px] transition-colors duration-150 ${
                        idx < filledSegments
                          ? 'bg-[#354BAE] shadow-[inset_0_-1px_0_rgba(0,0,0,0.22)] dark:bg-indigo-400 dark:shadow-[inset_0_-1px_0_rgba(15,23,42,0.38)]'
                          : 'bg-[#cbd4ff]/90 dark:bg-slate-700/65'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[0.62rem] uppercase tracking-[0.34em] text-[#354BAE] md:text-[0.7rem] dark:text-indigo-300">
              Preparing your nexus • {Math.round(Math.min(1, Math.max(0, progress.current)) * 100)}%
            </span>
            <div className="flex w-full flex-wrap justify-center gap-2 text-[0.72rem] text-slate-500 dark:text-slate-300 md:justify-start md:gap-2.5 md:text-[0.82rem]">
              <span className="feature-tag rounded-full border border-[#354BAE]/30 bg-white/90 px-3.5 py-1.5 text-[#354BAE] shadow-[0_6px_18px_rgba(53,75,174,0.12)] md:px-4 md:py-1.5 dark:border-indigo-400/30 dark:bg-slate-900/75 dark:text-indigo-200">
                Live showcases
              </span>
              <span className="feature-tag rounded-full border border-[#354BAE]/30 bg-white/90 px-3.5 py-1.5 text-[#354BAE] shadow-[0_6px_18px_rgba(53,75,174,0.12)] md:px-4 md:py-1.5 dark:border-indigo-400/30 dark:bg-slate-900/75 dark:text-indigo-200">
                Creator collabs
              </span>
              <span className="feature-tag rounded-full border border-[#354BAE]/30 bg-white/90 px-3.5 py-1.5 text-[#354BAE] shadow-[0_6px_18px_rgba(53,75,174,0.12)] md:px-4 md:py-1.5 dark:border-indigo-400/30 dark:bg-slate-900/75 dark:text-indigo-200">
                Marketplace
              </span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex min-w-[9rem] items-center justify-center rounded-full border border-[#354BAE]/45 bg-white px-5 py-2 text-[0.75rem] font-semibold text-[#354BAE] shadow-[0_10px_26px_rgba(53,75,174,0.15)] transition hover:border-[#354BAE]/60 hover:bg-[#eef1ff] dark:border-indigo-400/40 dark:bg-slate-900/85 dark:text-indigo-200 dark:hover:border-indigo-300/60 dark:hover:bg-slate-800/85 md:self-start md:px-6 md:py-2.5 md:text-[0.88rem]"
            >
              Skip intro
            </button>
          </div>
        </div>

        <div className="flex h-full w-full items-start justify-center">
          <div className="relative flex h-full w-full max-w-[760px] flex-col px-1.5 pb-0 pt-0 sm:px-2 md:px-0 md:pt-0">
            <div className="map-transform-wrapper relative flex h-full w-full flex-col rounded-[44px] bg-white/0">
              <div className="map-transform-spacer flex-none" aria-hidden />
              <div className="map-transform-inner relative flex-1">
                <div className="map-transform-canvas pointer-events-none absolute inset-0 flex items-end justify-center overflow-visible">
                  <Africa
                    type="select-multiple"
                    disableClick
                    disableHover
                    mapColor={'rgba(53, 75, 174, 0.18)'}
                    strokeColor={'#2f3c8d'}
                    strokeWidth={1.1}
                    className={`map-transform-graphic h-full w-auto transform-gpu mix-blend-multiply drop-shadow-[0_32px_96px_rgba(53,75,174,0.22)]`}
                  />
                  {hubBadges.map((badge) => (
                    <span
                      key={badge.label}
                      style={{ top: badge.top, left: badge.left }}
                      className="hub-badge pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#354BAE]/30 bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#354BAE] shadow-[0_6px_16px_rgba(53,75,174,0.18)] dark:border-indigo-400/30 dark:bg-slate-900/80 dark:text-indigo-200 dark:shadow-[0_8px_24px_rgba(79,70,229,0.35)]"
                    >
                      {badge.label}
                    </span>
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
