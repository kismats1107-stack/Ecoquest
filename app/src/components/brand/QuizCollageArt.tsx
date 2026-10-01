import { Lightbulb, Trophy } from 'lucide-react';

export function QuizCollageArt({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Graphic Elements */}
      <div className="relative size-64 sm:size-72 flex items-center justify-center">
        {/* Purple abstract backdrop */}
        <div className="absolute top-4 left-6 size-44 rounded-full bg-[#7C3AED]/20 blur-xl" />

        {/* Orange sun circle */}
        <div className="absolute top-8 left-10 size-28 rounded-full bg-[#FF8E53]" />

        {/* Purple curved arch */}
        <div className="absolute top-14 left-4 w-20 h-28 rounded-t-full bg-[#8B5CF6]" />

        {/* Yellow card with lightbulb */}
        <div className="absolute top-16 right-6 w-20 h-24 rounded-2xl bg-[#FFE66D] border-2 border-slate-900 shadow-[3px_3px_0_#0f172a] rotate-12 flex flex-col items-center justify-center z-10">
          <Lightbulb className="size-8 text-amber-900 fill-amber-300" />
        </div>

        {/* Question bubble */}
        <div className="absolute top-4 right-16 size-12 rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-md z-10">
          ?
        </div>

        {/* Central Illustrated Thinker Photo / Art */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            alt="Person thinking"
            className="size-44 sm:size-48 object-cover rounded-full border-4 border-white shadow-xl ring-2 ring-slate-900/10 grayscale-[30%] contrast-110"
          />
        </div>

        {/* Black doodle sparkles & dashes */}
        <span className="absolute top-6 left-2 font-black text-2xl text-slate-800 animate-pulse">✦</span>
        <span className="absolute bottom-10 left-6 font-black text-xl text-slate-800">✹</span>
        <span className="absolute top-2 right-4 font-black text-lg text-slate-800">✧</span>
        <span className="absolute bottom-8 right-8 font-black text-2xl text-amber-500">★</span>
      </div>
    </div>
  );
}

export function QuizIntroHero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="mx-auto max-w-sm rounded-[2.5rem] bg-[#F7F2EB] border-2 border-slate-900/10 p-6 shadow-xl text-center">
      {/* Quiz Brand Header */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Quiz</h2>
        <Trophy className="size-8 text-amber-500 fill-amber-400 drop-shadow-sm" />
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
        Play, Learn & Win
      </p>

      {/* Collage Illustration */}
      <QuizCollageArt className="my-2" />

      {/* Title & Copy */}
      <h3 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
        Challenge Your Brain
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed px-2">
        Join millions of players around the world and test your knowledge in fun and exciting quizzes.
      </p>

      {/* Get Started Button */}
      <button
        type="button"
        onClick={onGetStarted}
        className="mt-6 w-full rounded-full bg-slate-950 py-4 text-sm font-black text-white shadow-lg hover:bg-slate-800 transition active:scale-98"
      >
        Get Started
      </button>
    </div>
  );
}
