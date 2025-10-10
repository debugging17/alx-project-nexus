import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import SplitText from './SplitText';

const Africa = dynamic(() => import('@react-map/africa'), { ssr: false });

const hubBadges = [
  { label: 'Lagos', top: '34%', left: '27%' },
  { label: 'Accra', top: '37%', left: '30%' },
  { label: 'Nairobi', top: '45%', left: '54%' },
  { label: 'Cairo', top: '23%', left: '48%' },
  { label: 'Cape Town', top: '74%', left: '48%' },
  { label: 'Johannesburg', top: '68%', left: '46%' },
  { label: 'Addis Ababa', top: '39%', left: '56%' },
  { label: 'Dakar', top: '31%', left: '23%' },
  { label: 'Abuja', top: '36%', left: '32%' },
  { label: 'Dar es Salaam', top: '51%', left: '57%' },
  { label: 'Antananarivo', top: '60%', left: '78%' },
];

export default function SplashScreen({ onFinished, duration = 3800 }) {
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  const segmentCount = 18;
  const filledSegments = useMemo(
    () =>
      Math.min(
        segmentCount,
        Math.round(Math.max(0, Math.min(progress, 1)) * segmentCount),
      ),
    [progress],
  );

  useEffect(() => {
    const startedAt = performance.now();
    let frameId;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(1, elapsed / duration);
      setProgress(nextProgress);

      if (nextProgress >= 1 && !finishedRef.current) {
        finishedRef.current = true;
        onFinished?.();
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [duration, onFinished]);

  const handleSkip = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      setProgress(1);
      onFinished?.();
    }
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#f8fafc] text-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50/65 to-indigo-50/55" aria-hidden />

      <div className="relative z-10 flex w-full max-w-[1380px] flex-col items-center gap-12 px-6 py-12 md:flex-row md:items-stretch md:justify-between md:gap-16 md:py-16 md:px-10 lg:gap-20">
        <div className="flex w-full flex-1 flex-col justify-between text-center md:max-w-none md:items-start md:text-left">
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:justify-center md:text-left">
            <div className="relative w-fit">
              <img
                src="/img/logo.svg"
                alt="Project Nexus logo"
                className="h-20 w-auto drop-shadow-[0_18px_45px_rgba(99,102,241,0.3)] md:h-24"
              />
              <div className="absolute inset-x-0 -bottom-5 h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-400 blur-md opacity-80" />
            </div>

            <div className="mt-10 max-w-xl space-y-5 text-slate-600">
              <p className="text-xs uppercase tracking-[0.55em] text-[#354BAE] md:text-sm">
                Connecting African Creatives
              </p>
              <SplitText
                text="Discover. Collaborate. Showcase."
                className="text-[2.65rem] font-semibold leading-[1.08] text-slate-900 md:text-[3.35rem] lg:text-[3.75rem] xl:text-[4rem]"
                delay={110}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.15}
                rootMargin="-80px"
                textAlign="left"
                tag="h2"
              />
              <p className="text-sm leading-relaxed text-slate-600 md:text-base lg:text-lg">
                From Lagos to Nairobi, Accra to Cape Town—immerse yourself in a vibrant network of artists, designers, musicians, filmmakers, and storytellers shaping culture across the continent.
              </p>
            </div>
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col gap-4 text-xs text-slate-500 md:text-sm">
            <div className="rounded-lg border border-[#FF0000]/50 bg-white p-4 shadow-[0_8px_30px_rgba(255,0,0,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#354BAE] md:text-sm">
                Loading...
              </p>
              <div className="mt-3 rounded-md border border-[#354BAE]/40 bg-[#eef1ff] p-1 shadow-inner">
                <div className="flex h-4 items-stretch gap-1">
                  {Array.from({ length: segmentCount }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`flex-1 rounded-[2px] transition-colors duration-150 ${
                        idx < filledSegments
                          ? 'bg-[#354BAE] shadow-[inset_0_-1px_0_rgba(0,0,0,0.25)]'
                          : 'bg-[#cbd4ff]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#354BAE] md:text-xs">
              Preparing your nexus • {Math.round(Math.min(1, Math.max(0, progress)) * 100)}%
            </span>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 md:gap-3 md:text-sm">
              <span className="rounded-full border border-[#354BAE]/30 bg-white px-3 py-1 text-[#354BAE] md:px-4 md:py-1.5">
                Live showcases
              </span>
              <span className="rounded-full border border-[#354BAE]/30 bg-white px-3 py-1 text-[#354BAE] md:px-4 md:py-1.5">
                Creator collabs
              </span>
              <span className="rounded-full border border-[#354BAE]/30 bg-white px-3 py-1 text-[#354BAE] md:px-4 md:py-1.5">
                Marketplace
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="mt-10 inline-flex items-center rounded-full border border-[#354BAE]/40 bg-white px-7 py-2 text-xs font-medium text-[#354BAE] transition hover:border-[#354BAE]/60 hover:bg-[#eef1ff] md:mt-12 md:text-sm"
          >
            Skip intro
          </button>
        </div>

        <div className="flex w-full flex-1 items-center justify-center md:h-full">
          <div className="relative w-full max-w-[860px] px-2 md:px-0">
            <div className="relative aspect-[4/3] w-full md:aspect-[16/9] lg:aspect-[21/10]">
              <Africa
                type="select-multiple"
                disableClick
                disableHover
                mapColor="rgba(53, 75, 174, 0.18)"
                strokeColor="#2f3c8d"
                strokeWidth={1.1}
                className="h-full w-full scale-[1.12] transform-gpu mix-blend-multiply drop-shadow-[0_40px_120px_rgba(53,75,174,0.28)]"
              />
              {hubBadges.map((badge) => (
                <span
                  key={badge.label}
                  style={{ top: badge.top, left: badge.left }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#354BAE]/30 bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#354BAE] shadow-[0_6px_16px_rgba(53,75,174,0.18)]"
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
