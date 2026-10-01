import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Check, ChevronDown, Clock, Coins, RefreshCw, Sparkles, Star, Target, Trophy, X, Zap } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { GoldenTrophyArt } from '@/components/brand/EarthlyArt';
import { Mascot } from '@/components/brand/Mascot';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card, Pill } from '@/components/ui/Card';
import { useApp } from '@/store/context';
import { Confetti } from '@/components/ui/Confetti';
import { difficultyStyles } from '@/components/ui/tones';
import { iconFor } from '@/components/ui/icons';
import { DAILY_CHALLENGE } from '@/config/gamification';
import { getTopic, getTopics } from '@/data';
import { getBadge } from '@/data/badges';
import { getGame } from '@/data/games';
import { formatDuration, formatRelative } from '@/engine/dates';
import { rankFor } from '@/engine/gamification/levels';
import { recommendNext } from '@/engine/quiz/recommendation';
import type { QuizSummary } from '@/engine/quiz/scoring';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import type { RewardOutcome } from '@/types';

export default function ResultsPage() {
  const s = useStrings();
  const { attemptId } = useParams();
  const { mode, progress } = useMode();
  const navigate = useNavigate();
  const location = useLocation();
  const kids = mode === 'kids';
  const p = paths(mode);
  const attempt = progress.attempts.find((a) => a.id === attemptId);
  const fresh = location.state as { summary?: QuizSummary; outcome?: RewardOutcome | null } | null;
  useDocumentTitle(attempt ? `${attempt.topicName} results` : 'Results');

  if (!attempt) return <Navigate to={p.generator} replace />;

  const summary = fresh?.summary;
  const outcome = fresh?.outcome ?? null;
  const topic = getTopic(attempt.topicId);
  const accuracyPct = Math.round(attempt.accuracy * 100);
  const stars = summary?.stars ?? (attempt.accuracy >= 0.9 ? 3 : attempt.accuracy >= 0.7 ? 2 : attempt.accuracy >= 0.4 ? 1 : 0);
  const shownStars = kids ? Math.max(1, stars) : stars;
  const rec = recommendNext(attempt, progress, getTopics(mode));
  const recTopic = getTopic(rec.topicId);
  const levelUp = outcome && outcome.levelAfter > outcome.levelBefore;
  const headline = kids ? s.result.kidsTitle : accuracyPct >= 85 ? 'Outstanding work!' : accuracyPct >= 60 ? 'Quiz complete — solid effort!' : 'Quiz complete — keep going!';
  const playedGames = attempt.games.filter((g) => !g.skipped);

  const { profile } = useApp();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      {!kids ? (
        <Card className="relative overflow-hidden rounded-[2rem] border border-[#C2E7D0] bg-[#FAF7F2] p-8 sm:p-10 shadow-sm text-center">
          {summary && attempt.accuracy >= 0.6 && <Confetti count={28} spread={220} />}
          
          {/* Centered Golden Trophy with Laurels */}
          <div className="mx-auto flex justify-center">
            <GoldenTrophyArt className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md" />
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Great Job, {profile?.name?.split(' ')[0] ?? 'Yatri'}! 🎉
          </h1>

          {/* Score line */}
          <p className="mt-2 text-2xl sm:text-3xl font-black text-[#13382B]">
            You scored {attempt.score}/{attempt.total}
          </p>
          <p className="text-sm font-bold text-slate-500">
            That’s {accuracyPct}% correct!
          </p>

          {/* Stat Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#FFFBEB] px-5 py-2 text-sm font-black text-amber-900 shadow-sm">
              <Star className="size-4 fill-amber-400 text-amber-500" />
              <span>+{attempt.xpEarned} Points Earned</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-[#FAF5FF] px-5 py-2 text-sm font-black text-purple-900 shadow-sm">
              <Trophy className="size-4 text-purple-600" />
              <span>+{outcome?.newBadges?.length ? outcome.newBadges.length : 1} Badge Earned</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                document.getElementById('breakdown')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-1/2 rounded-full border-2 border-slate-900 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_3px_0_#0f172a] hover:bg-slate-50 active:translate-y-0.5 active:shadow-none"
            >
              View Answers
            </button>
            <Link
              to={p.home}
              className="w-full sm:w-1/2 inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-[#13382B] px-6 py-3 text-sm font-black text-white shadow-[0_3px_0_#0f172a] hover:bg-[#1B4332] active:translate-y-0.5 active:shadow-none"
            >
              Continue →
            </Link>
          </div>

          {/* Motivational Botanical Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 text-center font-serif italic text-sm font-bold text-[#2D6A4F]">
            🌿 Every quiz brings you closer to a greener planet!
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden border-2 border-emerald-100">
          {summary && attempt.accuracy >= 0.6 && <Confetti count={40} spread={260} />}
          <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left bg-gradient-to-br from-emerald-100 via-lime-50 to-sky-100">
            <Mascot mood={attempt.accuracy >= 0.6 ? 'cheer' : 'happy'} className="size-28 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-500">
                <span aria-hidden>{topic?.emoji} </span>
                {attempt.topicName} · {difficultyStyles[attempt.difficulty].label}
                {attempt.source === 'ai' && <Sparkles className="ml-1 inline size-3.5 text-violet-500" aria-label="AI-generated" />}
              </p>
              <h1 className="mt-1 font-extrabold text-ink font-fun text-3xl font-semibold sm:text-4xl">{headline}</h1>
              <div className="mt-2 flex justify-center gap-1 sm:justify-start" aria-label={`${shownStars} out of 3 stars`}>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25 + i * 0.18, type: 'spring', stiffness: 300, damping: 12 }}>
                    <Star className={cn('size-10', i < shownStars ? 'fill-amber-400 text-amber-500' : 'fill-slate-200 text-slate-300')} aria-hidden />
                  </motion.span>
                ))}
              </div>
              <p className="mt-2 text-slate-600">
                You answered <strong className="text-ink">{attempt.score}</strong> of <strong className="text-ink">{attempt.total}</strong> correctly
                {!summary && <> · {formatRelative(attempt.completedAt)}</>}.
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 divide-line border-t border-line sm:grid-cols-4 sm:divide-x">
            {[
              { icon: <Target className="size-4" aria-hidden />, k: s.result.score, v: `${attempt.score}/${attempt.total}` },
              { icon: <Check className="size-4" aria-hidden />, k: s.result.accuracy, v: `${accuracyPct}%` },
              { icon: <Clock className="size-4" aria-hidden />, k: s.result.time, v: formatDuration(attempt.timeTakenMs) },
              { icon: <Zap className="size-4" aria-hidden />, k: 'Challenges', v: playedGames.length ? `${playedGames.filter((g) => g.success).length}/${playedGames.length} won` : '—' },
            ].map((row) => (
              <div key={row.k} className="px-5 py-4">
                <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  {row.icon}
                  {row.k}
                </dt>
                <dd className="mt-0.5 text-xl font-black text-ink tabular">{row.v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Rewards */}
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-extrabold text-ink">
            <Trophy className="size-5 text-gold-500" aria-hidden /> {s.result.rewards}
          </h2>
          <div className="mb-4 flex gap-3">
            <div className="flex-1 rounded-2xl bg-emerald-50 p-3 text-center">
              <p className="text-3xl font-black text-emerald-700 tabular">+{attempt.xpEarned}</p>
              <p className="text-xs font-bold text-emerald-800">{kids ? s.common.ecoStars : 'XP'}</p>
            </div>
            <div className="flex-1 rounded-2xl bg-gold-50 p-3 text-center">
              <p className="text-3xl font-black text-gold-700 tabular">+{attempt.coinsEarned}</p>
              <p className="text-xs font-bold text-gold-700">{s.common.coins}</p>
            </div>
          </div>
          {summary && (
            <ul className="space-y-1.5 text-sm">
              {summary.lines.map((l) => (
                <li key={l.label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">{l.label}</span>
                  <span className="shrink-0 font-bold text-ink tabular">
                    +{l.xp} {kids ? '⭐' : 'XP'}
                    {l.coins > 0 && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-gold-700">
                        <Coins className="size-3.5" aria-hidden />+{l.coins}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {attempt.isDaily && (
            <p className={cn('mt-4 rounded-xl px-3 py-2 text-sm font-semibold', attempt.dailySuccess ? 'bg-gold-50 text-gold-700' : 'bg-amber-50 text-amber-800')}>
              {attempt.dailySuccess ? `☀️ ${s.result.dailyDone}` : s.result.dailyMissed(Math.round(DAILY_CHALLENGE[mode].targetAccuracy * 100))}
            </p>
          )}
          {levelUp && outcome && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
              <p className="text-xs font-bold tracking-wide uppercase opacity-90">Level up!</p>
              <p className="text-lg font-extrabold">
                {rankFor(mode, outcome.levelAfter).emoji} Level {outcome.levelAfter} · {rankFor(mode, outcome.levelAfter).name}
              </p>
            </motion.div>
          )}
          {outcome && outcome.newBadges.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-ink">{s.result.newBadges}</p>
              <ul className="flex flex-wrap gap-2">
                {outcome.newBadges.map((id) => {
                  const b = getBadge(id);
                  if (!b) return null;
                  const Icon = iconFor(b.icon);
                  return (
                    <li key={id} className="inline-flex items-center gap-2 rounded-full bg-gold-50 py-1 pr-3 pl-1 text-sm font-bold text-gold-700 ring-1 ring-gold-100">
                      <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-white">
                        {kids ? <span aria-hidden>{b.emoji}</span> : <Icon className="size-4" aria-hidden />}
                      </span>
                      {b.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Card>

        {/* Next step */}
        <Card className={cn('p-5 sm:p-6 lg:col-span-3', kids ? 'border-2 border-sky-100' : '')}>
          <h2 className="mb-3 flex items-center gap-2 font-extrabold text-ink">
            <Sparkles className="size-5 text-violet-500" aria-hidden /> {s.result.nextStep}
          </h2>
          <div className={cn('rounded-2xl p-4', rec.kind === 'review' ? 'bg-amber-50' : 'bg-gradient-to-br from-violet-50 to-sky-50')}>
            <div className="flex items-start gap-3">
              <span className="text-4xl" aria-hidden>
                {recTopic?.emoji}
              </span>
              <div className="min-w-0">
                <p className={cn('font-extrabold text-ink', kids ? 'font-fun text-xl font-semibold' : 'text-lg')}>{rec.title}</p>
                <p className="mt-1 text-slate-700">{rec.message}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill className={difficultyStyles[rec.difficulty].chip}>{difficultyStyles[rec.difficulty].label}</Pill>
                  {recTopic && <Pill className="bg-white text-slate-700">{recTopic.name}</Pill>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {rec.reviewLesson && (
              <Link to={p.lesson(attempt.topicId)} className={buttonClasses({ variant: 'secondary', size: kids ? 'lg' : 'md', chunky: kids })}>
                <BookOpen className="size-4" aria-hidden /> {s.result.readLesson}
              </Link>
            )}
            <Button size={kids ? 'lg' : 'md'} chunky={kids} onClick={() => navigate(p.generatorFor(rec.topicId, rec.difficulty))} iconRight={<ArrowRight className="size-4" aria-hidden />}>
              {s.result.tryRecommended}
            </Button>
            {rec.alternative && (
              <Button variant="outline" size={kids ? 'lg' : 'md'} chunky={kids} onClick={() => navigate(p.generatorFor(rec.alternative!.topicId, rec.alternative!.difficulty))}>
                {rec.alternative.title}
              </Button>
            )}
            <Button variant="outline" size={kids ? 'lg' : 'md'} chunky={kids} onClick={() => navigate(p.generatorFor(attempt.topicId))} icon={<RefreshCw className="size-4" aria-hidden />}>
              {s.result.generateAnother}
            </Button>
          </div>
        </Card>
      </div>

      {/* Review */}
      <Card id="breakdown" className="p-5 sm:p-6">
        <h2 className="mb-3 font-extrabold text-ink">{s.result.review}</h2>
        <ol className="space-y-2">
          {attempt.questions.map((q, i) => {
            const a = attempt.answers[i];
            return (
              <li key={q.id}>
                <details className="group rounded-xl border border-line bg-white open:bg-slate-50/60">
                  <summary className="flex cursor-pointer list-none items-start gap-3 p-3.5 [&::-webkit-details-marker]:hidden">
                    <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white', a?.correct ? 'bg-emerald-500' : 'bg-rose-400')} aria-label={a?.correct ? 'Correct' : 'Incorrect'}>
                      {a?.correct ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold text-ink">
                      {i + 1}. {q.question}
                    </span>
                    <ChevronDown className="mt-0.5 size-5 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="space-y-1.5 px-3.5 pb-3.5 pl-12 text-sm">
                    {q.context && <p className="text-slate-500 italic">{q.context}</p>}
                    <p>
                      <span className="font-semibold text-slate-500">{s.result.yourAnswer}: </span>
                      <span className={a?.correct ? 'font-bold text-emerald-700' : 'font-bold text-rose-700'}>{a?.selected != null ? q.options[a.selected] : s.result.noAnswer}</span>
                    </p>
                    {!a?.correct && (
                      <p>
                        <span className="font-semibold text-slate-500">{s.quiz.correctAnswerWas} </span>
                        <span className="font-bold text-emerald-700">{q.options[q.correctAnswer]}</span>
                      </p>
                    )}
                    <p className="text-slate-700">{q.explanation}</p>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
        {playedGames.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            10-second challenges: {playedGames.map((g) => `${getGame(g.gameId).name} (${g.score}${g.success ? ' ✓' : ''})`).join(' · ')}
          </p>
        )}
      </Card>
    </div>
  );
}
