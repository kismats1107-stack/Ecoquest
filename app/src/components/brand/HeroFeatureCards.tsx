import { Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StudentPointingIllustration, StudentTabletIllustration } from './CharacterIllustrations';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

export function HeroFeatureCards({ className }: { className?: string }) {
  const { mode } = useMode();
  const { profile } = useApp();
  const navigate = useNavigate();

  const handleEditor = () => {
    if (profile) navigate(paths(mode).generator);
    else navigate('/start');
  };

  const handleAi = () => {
    if (profile) navigate(`${paths(mode).generator}?ai=true`);
    else navigate('/start');
  };

  return (
    <div className={`grid gap-5 md:grid-cols-2 ${className ?? ''}`}>
      {/* Card 1: Create a quiz / Quiz editor */}
      <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-[#163832] p-6 text-white shadow-[0_6px_0_#0a1f1b] transition-all hover:-translate-y-0.5 sm:p-8">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-12 -left-12 size-40 rounded-full bg-emerald-500/15 blur-2xl" />

        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="shrink-0 transition-transform duration-300 hover:scale-105">
            <StudentTabletIllustration />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-fun text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Create a quiz</h3>
            <p className="mt-2 text-sm text-emerald-100/90 font-medium max-w-xs">
              Play for free with 300 participants · Custom rules, timers & question counts
            </p>
            <button
              type="button"
              onClick={handleEditor}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-slate-950 bg-[#22c55e] px-7 py-3 text-base font-extrabold text-slate-950 shadow-[0_4px_0_#0f172a] transition hover:bg-[#16a34a] active:translate-y-1 active:shadow-none"
            >
              Quiz editor
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: A.I. / Quiz generator */}
      <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-[#163832] p-6 text-white shadow-[0_6px_0_#0a1f1b] transition-all hover:-translate-y-0.5 sm:p-8">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-sky-500/15 blur-2xl" />

        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="order-1 sm:order-2 shrink-0 transition-transform duration-300 hover:scale-105">
            <StudentPointingIllustration />
          </div>

          <div className="order-2 sm:order-1 flex flex-col items-center sm:items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 px-3 py-0.5 text-xs font-black tracking-wider text-sky-300 uppercase">
              <Sparkles className="size-3.5" /> Next-Gen
            </div>
            <h3 className="mt-1 font-fun text-3xl font-extrabold tracking-tight sm:text-4xl text-white">A.I.</h3>
            <p className="mt-2 text-sm text-sky-100/90 font-medium max-w-xs">
              Generate a quiz from any subject, curriculum or environmental topic in seconds
            </p>
            <button
              type="button"
              onClick={handleAi}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-slate-950 bg-[#38bdf8] px-7 py-3 text-base font-extrabold text-slate-950 shadow-[0_4px_0_#0f172a] transition hover:bg-[#0284c7] hover:text-white active:translate-y-1 active:shadow-none"
            >
              <Wand2 className="size-4" /> Quiz generator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
