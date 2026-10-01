import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChartColumn,
  Flame,
  Gamepad2,
  Gift,
  Hash,
  ListChecks,
  RefreshCw,
  Sparkles,
  Timer,
  Trophy,
  WandSparkles,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router';
import { DemoStartModal } from '@/components/DemoStartModal';
import { LogoutButton } from '@/components/layout/AccountMenu';
import { CategoryPillsBar } from '@/components/layout/CategoryPillsBar';
import { TopNoticeBar } from '@/components/layout/TopNoticeBar';
import { HeroFeatureCards } from '@/components/brand/HeroFeatureCards';
import { HeroGlobe } from '@/components/brand/HeroGlobe';
import { Logo } from '@/components/brand/Logo';
import { Mascot } from '@/components/brand/Mascot';
import { QuickPinModal } from '@/components/quiz/QuickPinModal';
import { Button, buttonClasses } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useStrings } from '@/i18n';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';

const LOOP: { icon: LucideIcon; title: string; body: string; color: string }[] = [
  { icon: BookOpen, title: 'Learn', body: 'Bite-sized lessons sized for each age group.', color: 'bg-sky-100 text-sky-700' },
  { icon: ListChecks, title: 'Quiz', body: 'Generate a fresh quiz on any topic, any level.', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Timer, title: '10-Second Challenge', body: 'Rapid mini-games that reinforce the topic.', color: 'bg-orange-100 text-orange-700' },
  { icon: Gift, title: 'Reward', body: 'XP, coins, badges, streaks and levels.', color: 'bg-amber-100 text-amber-700' },
  { icon: RefreshCw, title: 'Continue', body: 'Personalised next steps based on your results.', color: 'bg-violet-100 text-violet-700' },
];

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: WandSparkles, title: 'Dynamic quiz generator', body: 'Pick a topic, difficulty and size — EcoQuest builds a fresh, randomised quiz every time. AI-powered when configured, with a curated offline bank as backup.' },
  { icon: Gamepad2, title: 'Six 10-second games', body: 'Recycle Sort, Memory Match, Clean the Ocean, Carbon Footprint, Food-Web Puzzle and Eco Decisions — woven into every quiz.' },
  { icon: Award, title: 'Meaningful gamification', body: 'XP, coins for hints, levels, 14 badges, daily streaks and a daily Eco Challenge that keep learners coming back.' },
  { icon: Trophy, title: 'Leaderboards', body: 'Global, weekly and friends rankings for 15+, and a friendly, non-competitive Eco Heroes board for kids.' },
  { icon: ChartColumn, title: 'Progress analytics', body: 'Accuracy trends, weekly XP and topic mastery for teens — simple visual progress for kids.' },
  { icon: WifiOff, title: 'Works offline', body: 'Runs entirely in the browser with local saving. Firebase and AI plug in through environment variables.' },
];

export function Landing() {
  const s = useStrings();
  const { profile } = useApp();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  useDocumentTitle('');

  const enter = (mode: ExperienceMode) => {
    if (profile) navigate(paths(mode).home);
    else navigate(`/start?mode=${mode}`);
  };
  const continueHref = profile ? paths(profile.activeMode).home : '/start';

  const handleHeaderPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinOpen(true);
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F5]">
      {/* Top Privacy & Cookie Notice Bar (from Image 1) */}
      <TopNoticeBar />

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" aria-label="EcoQuest home" className="shrink-0">
            <Logo />
          </Link>

          {/* Join Game? Enter PIN banner inspired by Image 1 */}
          <div className="hidden md:flex items-center">
            <form
              onSubmit={handleHeaderPinSubmit}
              className="flex items-center gap-2 rounded-full border-2 border-rose-200 bg-[#FFD1CC]/70 px-4 py-1.5 shadow-sm transition hover:bg-[#FFD1CC]"
            >
              <span className="text-xs font-black text-rose-900 tracking-tight">Join Game? Enter PIN:</span>
              <div
                onClick={() => setPinOpen(true)}
                className="flex cursor-pointer items-center justify-center rounded-full border border-rose-300 bg-white px-3 py-1 font-mono text-xs font-bold text-slate-700 shadow-inner"
              >
                123 456
              </div>
            </form>
          </div>

          <nav aria-label="Sections" className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#features-cards" className="hover:text-ink">
              Create & AI
            </a>
            <a href="#how" className="hover:text-ink">
              How it works
            </a>
            <a href="#experiences" className="hover:text-ink">
              Experiences
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPinOpen(true)}
              className="md:hidden flex items-center gap-1 rounded-full border border-rose-300 bg-[#FFD1CC] px-2.5 py-1 text-xs font-bold text-rose-900"
            >
              <Hash className="size-3.5" /> PIN
            </button>
            {profile && <LogoutButton compact />}
            <Link
              to={continueHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-[#C8F560] px-4 py-1.5 text-xs sm:text-sm font-black text-slate-950 shadow-[0_3px_0_#0f172a] transition hover:bg-[#b5e347] active:translate-y-0.5 active:shadow-none"
            >
              {profile ? (
                <>
                  <span className="sm:hidden">Continue</span>
                  <span className="hidden sm:inline">{s.account.continueAs(profile.name)}</span>
                </>
              ) : (
                'Sign in'
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Category Pills Bar (from Image 1) */}
      <CategoryPillsBar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_85%_10%,#d1fae5_0%,transparent_60%),radial-gradient(700px_400px_at_0%_80%,#e0f2fe_0%,transparent_60%)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:py-16">
            <div>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
                <Sparkles className="size-4" aria-hidden /> {s.brand.tagline}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl"
              >
                Learn About Our Planet.{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">One Challenge at a Time.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-xl text-lg text-slate-600">
                EcoQuest transforms environmental education into interactive quizzes, rapid mini-games, AI challenges and real rewards — built for classrooms and self-learners alike.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={continueHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_0_#0f172a] transition hover:bg-slate-800 active:translate-y-1 active:shadow-none"
                >
                  {profile ? `Continue your journey` : 'Start Your Eco Journey'} <ArrowRight className="size-5" aria-hidden />
                </Link>
                <Button variant="outline" size="lg" onClick={() => setDemoOpen(true)}>
                  🎓 Continue as Demo Student
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-slate-500 font-medium">No sign-up needed · Works 100% offline · Instant AI generator</p>
            </div>
            <HeroGlobe />
          </div>
        </section>

        {/* Feature Cards (Create a Quiz & A.I. from Image 1) */}
        <section id="features-cards" className="mx-auto max-w-6xl px-4 py-4 md:py-6">
          <HeroFeatureCards />
        </section>

        {/* Learning loop */}
        <section id="how" className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">The EcoQuest learning loop</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Every session turns knowledge into action.</h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {LOOP.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="absolute top-4 right-4 text-xs font-black text-slate-300">0{i + 1}</span>
                  <span className={`grid size-11 place-items-center rounded-xl ${step.color}`}>
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Experiences */}
        <section id="experiences" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">One platform · Two experiences</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Age-appropriate by design — not just a different colour.</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {/* Kids */}
              <article data-mode="kids" className="relative overflow-hidden rounded-[2rem] border-2 border-amber-200 bg-gradient-to-br from-amber-100 via-lime-50 to-sky-100 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-fun text-sm font-semibold text-amber-800">{s.brand.kids}</p>
                    <h3 className="mt-1 font-fun text-4xl font-semibold text-ink">{s.brand.kidsMotto}</h3>
                  </div>
                  <Mascot mood="cheer" className="size-24 shrink-0" />
                </div>
                <div className="mt-6 rounded-3xl border-2 border-white bg-white/90 p-4 shadow-[0_4px_0_#d6efdc]">
                  <p className="font-fun text-lg font-semibold text-ink">🌱 Which one helps plants grow?</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 font-fun font-semibold">
                    {['💧 Water', '🧴 Plastic', '💨 Smoke', '🛢️ Oil'].map((o, i) => (
                      <span key={o} className={`rounded-2xl border-[3px] px-3 py-2 ${i === 0 ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-white text-slate-600'}`}>
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="mt-6 grid gap-2 font-fun text-[15px] font-semibold text-slate-700 sm:grid-cols-2">
                  {['🗺️ Eco Journey adventure map', '🎮 Recycle Sort, Memory Match & Clean the Ocean', '⭐ Eco Stars and friendly Eco Heroes', '🌱 Seedling → Earth Hero ranks'].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button size="lg" chunky className="mt-6 bg-orange-500 hover:bg-orange-600" style={{ '--btn-shadow-color': '#c2410c' } as CSSProperties} onClick={() => enter('kids')}>
                  Enter EcoQuest Kids <ArrowRight className="size-5" aria-hidden />
                </Button>
              </article>

              {/* 15+ */}
              <article data-mode="plus" className="relative overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="bg-plus-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
                <div className="relative">
                  <p className="text-sm font-bold text-teal-700">{s.brand.plus}</p>
                  <h3 className="mt-1 text-4xl font-extrabold tracking-tight text-ink">{s.brand.plusMotto}</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-bold text-teal-700 uppercase">Scenario · Hard</p>
                      <p className="mt-1 text-sm font-semibold text-ink">A commuter drives 12 km each way, 5 days a week, at 0.17 kg CO₂/km. Weekly emissions?</p>
                      <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs font-semibold">
                        {['≈ 10 kg', '≈ 20 kg', '≈ 2 kg', '≈ 60 kg'].map((o, i) => (
                          <span key={o} className={`rounded-lg border px-2 py-1.5 ${i === 1 ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-200 text-slate-600'}`}>
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 uppercase">Weekly XP</p>
                      <div className="mt-3 flex h-20 items-end gap-1.5" aria-hidden>
                        {[30, 55, 40, 70, 45, 85, 60].map((h, i) => (
                          <span key={i} className="flex-1 rounded-t-[4px] bg-teal-600" style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.55 }} />
                        ))}
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600">
                        <Flame className="size-3.5" aria-hidden /> 6-day streak · #4 weekly
                      </p>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-2 text-[15px] font-semibold text-slate-700 sm:grid-cols-2">
                    {['Scenario, data & rapid questions', 'Carbon, Food-Web & Eco Decision games', 'Global / weekly / friends leaderboards', 'Accuracy trends & topic mastery'].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-teal-600" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="mt-6" onClick={() => enter('plus')}>
                    Enter EcoQuest 15+ <ArrowRight className="size-5" aria-hidden />
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">Inside EcoQuest</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Built like a real EdTech product.</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <f.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-extrabold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 p-8 text-white sm:p-12">
            <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-white/10" aria-hidden />
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to protect the planet — one challenge at a time?</h2>
            <p className="mt-3 max-w-xl text-emerald-50">Create a profile in seconds, or jump straight in with the demo student.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={continueHref} className={buttonClasses({ variant: 'white', size: 'lg' })}>
                Start Your Eco Journey <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Button variant="ghost" size="lg" className="text-white ring-2 ring-white/40 hover:bg-white/10" onClick={() => setDemoOpen(true)}>
                Continue as Demo Student
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p>{s.brand.tagline} · A gamified environmental learning platform.</p>
        </div>
      </footer>
      <DemoStartModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <QuickPinModal open={pinOpen} onClose={() => setPinOpen(false)} />
    </div>
  );
}
