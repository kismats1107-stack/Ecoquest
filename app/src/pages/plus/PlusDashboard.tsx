import {
  ArrowRight,
  Clapperboard,
  Flame,
  FlaskConical,
  Landmark,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { QuizIntroHero } from '@/components/brand/QuizCollageArt';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { currentStreak } from '@/engine/gamification/streak';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/context';

export default function PlusDashboard() {
  const { profile, today } = useApp();
  const { progress } = useMode();
  const navigate = useNavigate();
  useDocumentTitle('Quiz · EcoQuest 15+');

  const [showWelcomeIntro, setShowWelcomeIntro] = useState(false);

  const level = levelFromXp(progress.xp);
  const rank = rankFor('plus', level.level);
  const streak = currentStreak(progress.streak, today);
  const userName = profile?.name ? profile.name.split(' ')[0] : 'Alex';

  // 4 Flagship Categories matching Image 2 Screen 2
  const CATEGORIES = [
    {
      id: 'science',
      title: 'Science',
      count: '12 Quizzes',
      icon: FlaskConical,
      cardBg: 'bg-[#2D6A4F] hover:bg-[#245640]',
      textColor: 'text-white',
      badgeColor: 'bg-emerald-800/40 text-emerald-200',
    },
    {
      id: 'histori',
      title: 'Histori',
      count: '95 Quizzes',
      icon: Landmark,
      cardBg: 'bg-[#E9A825] hover:bg-[#D4961D]',
      textColor: 'text-white',
      badgeColor: 'bg-amber-800/40 text-amber-100',
    },
    {
      id: 'movies',
      title: 'Movies',
      count: '12 Quizzes',
      icon: Clapperboard,
      cardBg: 'bg-[#DE5444] hover:bg-[#C94738]',
      textColor: 'text-white',
      badgeColor: 'bg-rose-800/40 text-rose-100',
    },
    {
      id: 'sports',
      title: 'Sports',
      count: '12 Quizzes',
      icon: Trophy,
      cardBg: 'bg-[#5B67CA] hover:bg-[#4E5AB8]',
      textColor: 'text-white',
      badgeColor: 'bg-indigo-800/40 text-indigo-100',
    },
  ];

  // 2 Trending Quizzers Cards matching Image 2 Screen 2
  const TRENDING_QUIZZES = [
    {
      id: 'space-explorer',
      title: 'Space Explorer',
      description: 'Explore the universe and beyond',
      questions: '10 Questions',
      bgGradient: 'from-[#6366F1] to-[#4F46E5]',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
      actionTo: '/plus/quizzes',
    },
    {
      id: 'world-history',
      title: 'World History',
      description: 'Ancient civilisations, climate & geography',
      questions: '10 Questions',
      bgGradient: 'from-[#059669] to-[#047857]',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      actionTo: '/plus/quizzes',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto font-sans">
      {/* Optional Welcome Modal (Screen 1 in Image 2) */}
      {showWelcomeIntro && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowWelcomeIntro(false)}
              className="absolute -top-3 -right-3 size-9 rounded-full bg-slate-900 text-white font-black flex items-center justify-center shadow-lg hover:bg-slate-800 z-20"
            >
              ✕
            </button>
            <QuizIntroHero onGetStarted={() => setShowWelcomeIntro(false)} />
          </div>
        </div>
      )}

      {/* TOP HEADER MATCHING IMAGE 2 SCREEN 2 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-bold text-slate-500">Hi, {userName}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ready for a quiz?
          </h1>
        </div>

        {/* Top Right: Diamonds Pill Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWelcomeIntro(true)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Intro Screen</span>
          </button>

          <div
            className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-slate-200/80 font-black text-sm text-slate-900"
            title="Diamonds earned"
          >
            <span className="text-base">💎</span>
            <span className="tabular">{progress.coins > 0 ? progress.coins : 20}</span>
          </div>
        </div>
      </div>

      {/* 1. DAILY CHALLENGE BANNER (SCREEN 2 TOP CARD) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] p-6 sm:p-8 text-white shadow-lg">
        {/* Festive Confetti Circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <span className="absolute top-3 left-10 size-2.5 rounded-full bg-amber-300" />
          <span className="absolute top-12 left-1/3 size-3 rounded-full bg-pink-300" />
          <span className="absolute bottom-6 left-1/4 size-2 rounded-full bg-cyan-300" />
          <span className="absolute top-6 right-1/3 size-2.5 rounded-full bg-yellow-200" />
          <span className="absolute bottom-10 right-16 size-3.5 rounded-full bg-emerald-300" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-wider uppercase backdrop-blur-xs">
              <Trophy className="size-3.5 text-amber-300" />
              Daily Challenge
            </div>
            <p className="mt-2 text-sm sm:text-base font-semibold text-white/95">
              Answer 10 questions and win 25 diamonds
            </p>

            {/* Progress Bar 6/10 */}
            <div className="mt-4 max-w-xs">
              <div className="flex items-center justify-between text-xs font-black mb-1.5">
                <span className="text-white/80">Challenge Progress</span>
                <span className="font-mono text-white">6/10</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all duration-500 w-[60%]" />
              </div>
            </div>

            {/* Play Now Button */}
            <button
              type="button"
              onClick={() => navigate('/plus/quizzes')}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-sm font-black text-white shadow-md hover:bg-slate-900 transition active:scale-95"
            >
              Play Now
            </button>
          </div>

          {/* Right: Champion Photo with Trophy */}
          <div className="flex justify-center sm:justify-end">
            <div className="relative size-36 sm:size-40 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden ring-4 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                alt="Winner celebrating daily challenge"
                className="size-full object-cover object-center"
              />
              <div className="absolute bottom-1 right-1 bg-amber-400 size-9 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Trophy className="size-5 text-amber-900 fill-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORIES SECTION MATCHING IMAGE 2 SCREEN 2 */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Categories
          </h2>
          <Link
            to="/plus/quizzes"
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate('/plus/quizzes')}
                className={cn(
                  'flex flex-col items-start justify-between rounded-3xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 text-left h-36 cursor-pointer',
                  cat.cardBg,
                )}
              >
                <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-xs backdrop-blur-xs">
                  <Icon className="size-5 stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="text-base font-black text-white tracking-tight">{cat.title}</h3>
                  <span className="mt-0.5 inline-block text-[11px] font-bold text-white/80">
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TRENDING QUIZZERS SECTION MATCHING IMAGE 2 SCREEN 2 */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trending Quizzers
          </h2>
          <Link
            to="/plus/quizzes"
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TRENDING_QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              className={cn(
                'relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-white shadow-md flex items-center justify-between gap-4',
                quiz.bgGradient,
              )}
            >
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-xl font-black text-white tracking-tight">{quiz.title}</h3>
                <p className="mt-1 text-xs text-white/85 line-clamp-2">{quiz.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black backdrop-blur-xs">
                    📄 {quiz.questions}
                  </span>
                  <Link
                    to={quiz.actionTo}
                    className="size-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-sm hover:scale-110 transition"
                    aria-label={`Play ${quiz.title}`}
                  >
                    <Play className="size-3.5 fill-slate-900 ml-0.5" />
                  </Link>
                </div>
              </div>

              {/* Right Avatar / Image */}
              <div className="shrink-0">
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="size-24 rounded-2xl object-cover border-2 border-white/50 shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CURRENT LEARNER STATS & STREAK */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Flame className="size-6 fill-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              {streak > 0 ? `${streak} Day Quiz Streak` : 'Start Your Streak Today!'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Rank: {rank.emoji} {rank.name} · Level {level.level}
            </p>
          </div>
        </div>

        <Link
          to="/plus/leaderboard"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
        >
          <span>View Leaderboard</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
