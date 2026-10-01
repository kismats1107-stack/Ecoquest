import { AnimatePresence, motion } from 'framer-motion';
import { Coins, Keyboard, Lightbulb, Play, RotateCcw, Star, Timer, Trophy, X } from 'lucide-react';
import { lazy, Suspense, useCallback, useRef, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { getGame } from '@/data/games';
import { makeGameRecord } from '@/engine/games/rewards';
import { randomSeed } from '@/engine/random';
import { useCountdown } from '@/hooks/useCountdown';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import type { GameId, GameRecord } from '@/types';
import { Mascot } from '../brand/Mascot';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Confetti } from '../ui/Confetti';
import type { GameComponentProps } from './types';

const GAMES: Record<GameId, LazyExoticComponent<ComponentType<GameComponentProps>>> = {
  'recycle-sort': lazy(() => import('./RecycleSort')),
  'memory-match': lazy(() => import('./MemoryMatch')),
  'clean-ocean': lazy(() => import('./CleanOcean')),
  'carbon-footprint': lazy(() => import('./CarbonFootprint')),
  'food-web': lazy(() => import('./FoodWeb')),
  'eco-decisions': lazy(() => import('./EcoDecisions')),
};

type Phase = 'intro' | 'countdown' | 'playing' | 'result';

/**
 * Runs one 10-second challenge: instructions → 3-2-1 → 10-second round → result → replay.
 * `onRound` fires after each round (standalone play commits rewards there);
 * `onContinue` returns the best round to the quiz.
 */
export function GameShell({
  gameId,
  topicId,
  context,
  onRound,
  onContinue,
  onSkip,
  onExit,
}: {
  gameId: GameId;
  topicId?: string;
  context: 'quiz' | 'standalone';
  onRound?: (record: GameRecord) => void;
  onContinue?: (best: GameRecord) => void;
  onSkip?: () => void;
  onExit?: () => void;
}) {
  const s = useStrings();
  const { mode } = useMode();
  const kids = mode === 'kids';
  const def = getGame(gameId);
  const Game = GAMES[gameId];

  const [phase, setPhaseState] = useState<Phase>('intro');
  const phaseRef = useRef<Phase>('intro');
  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);
  const [round, setRound] = useState(0);
  const [seed, setSeed] = useState(randomSeed);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [record, setRecord] = useState<GameRecord | null>(null);
  const bestRef = useRef<GameRecord | null>(null);

  const finish = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const rec = makeGameRecord(def, scoreRef.current, context, Date.now(), topicId);
    if (!bestRef.current || rec.score > bestRef.current.score) bestRef.current = rec;
    setRecord(rec);
    setPhase('result');
    onRound?.(rec);
  }, [def, context, topicId, onRound, setPhase]);

  const countdownLeft = useCountdown(3000, phase === 'countdown', () => setPhase('playing'), `cd-${round}`);
  const timeLeft = useCountdown(def.durationSec * 1000, phase === 'playing', finish, `play-${round}`);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setRecord(null);
    setSeed(randomSeed());
    setRound((r) => r + 1);
    setPhase('countdown');
  };

  const onScore = useCallback((value: number) => {
    scoreRef.current = value;
    setScore(value);
  }, []);

  const status = phase === 'countdown' ? 'countdown' : phase === 'playing' ? 'playing' : 'over';
  const secondsLeft = Math.ceil(timeLeft / 100) / 10;
  const urgent = phase === 'playing' && timeLeft <= 3000;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <Card className={cn('overflow-hidden', kids && 'border-2 border-orange-100')}>
              <div className={cn('px-6 pt-6 pb-5 text-center', kids ? 'bg-gradient-to-br from-orange-100 via-amber-50 to-sky-100' : 'bg-gradient-to-br from-teal-50 to-emerald-50')}>
                {context === 'quiz' && (
                  <p className={cn('mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase', kids ? 'bg-orange-500 text-white' : 'bg-teal-700 text-white')}>
                    <Timer className="size-3.5" aria-hidden /> {s.quiz.challengeTime}
                  </p>
                )}
                <div className="text-6xl" aria-hidden>
                  {def.emoji}
                </div>
                <h2 className={cn('mt-2 font-extrabold text-ink', kids ? 'font-fun text-3xl font-semibold' : 'text-2xl')}>{def.name}</h2>
                <p className="mt-1 text-slate-600">{def.tagline}</p>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="mb-2 text-sm font-bold tracking-wide text-slate-500 uppercase">{s.game.howToPlay}</h3>
                  <ol className="space-y-2">
                    {def.howTo.map((step, i) => (
                      <li key={i} className="flex gap-3 text-[15px] text-slate-700">
                        <span className={cn('grid size-6 shrink-0 place-items-center rounded-full text-xs font-black text-white', kids ? 'bg-orange-500' : 'bg-teal-700')}>{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    <Timer className="size-4" aria-hidden /> {def.durationSec} seconds
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    <Trophy className="size-4" aria-hidden /> {s.game.target(def.target, def.scoreLabel)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    <Keyboard className="size-4" aria-hidden /> {def.controls}
                  </span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size={kids ? 'xl' : 'lg'} chunky={kids} full onClick={start} icon={<Play className="size-5" aria-hidden />} autoFocus>
                    {s.game.start}
                  </Button>
                  {onSkip && (
                    <Button variant="ghost" size={kids ? 'xl' : 'lg'} onClick={onSkip} className="sm:w-auto">
                      {s.game.skip}
                    </Button>
                  )}
                  {onExit && !onSkip && (
                    <Button variant="ghost" size={kids ? 'xl' : 'lg'} onClick={onExit} className="sm:w-auto" icon={<X className="size-4" aria-hidden />}>
                      {s.common.back}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {(phase === 'countdown' || phase === 'playing') && (
          <motion.div key={`play-${round}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-3 flex items-center gap-3">
              <div className={cn('flex items-center gap-2 rounded-2xl px-3 py-2 font-black tabular', urgent ? 'bg-rose-100 text-rose-700' : kids ? 'bg-white text-orange-600' : 'bg-white text-teal-800', 'shadow-sm ring-1 ring-black/5')}>
                <Timer className={cn('size-5', urgent && 'animate-pulse')} aria-hidden />
                <span className="w-12 text-xl" aria-label={`${Math.ceil(timeLeft / 1000)} seconds left`}>
                  {phase === 'countdown' ? def.durationSec.toFixed(1) : secondsLeft.toFixed(1)}
                </span>
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-black/5" aria-hidden>
                <div
                  className={cn('h-full rounded-full transition-[width] duration-100 ease-linear', urgent ? 'bg-rose-500' : kids ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500')}
                  style={{ width: `${(phase === 'countdown' ? 1 : timeLeft / (def.durationSec * 1000)) * 100}%` }}
                />
              </div>
              <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-black/5">
                <span className="block text-[10px] font-bold tracking-wide text-slate-500 uppercase">{s.game.score}</span>
                <motion.span key={score} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="block text-xl font-black text-ink tabular">
                  {score}
                </motion.span>
              </div>
            </div>
            <div className="relative">
              <Suspense fallback={<div className="h-80 animate-pulse rounded-card bg-white/60" />}>
                <Game status={status} topicId={topicId} seed={seed} onScore={onScore} onFinish={finish} />
              </Suspense>
              <AnimatePresence>
                {phase === 'countdown' && (
                  <motion.div
                    className="absolute inset-0 z-20 grid place-items-center rounded-card bg-white/55 backdrop-blur-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-live="assertive"
                  >
                    <div className="text-center">
                      <p className="text-sm font-bold tracking-wide text-slate-600 uppercase">{s.game.getReady}</p>
                      <motion.p
                        key={Math.ceil(countdownLeft / 1000)}
                        initial={{ scale: 1.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn('text-8xl font-black', kids ? 'font-fun text-orange-500' : 'text-teal-700')}
                      >
                        {Math.max(1, Math.ceil(countdownLeft / 1000))}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {phase === 'result' && record && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className={cn('relative overflow-hidden text-center', kids && 'border-2')}>
              {record.success && <Confetti count={kids ? 36 : 22} />}
              <div className={cn('px-6 pt-8 pb-6', record.success ? (kids ? 'bg-gradient-to-br from-emerald-100 to-lime-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50') : 'bg-gradient-to-br from-amber-50 to-orange-50')}>
                {kids ? (
                  <Mascot mood={record.success ? 'cheer' : 'oops'} className="mx-auto size-24" />
                ) : (
                  <div className={cn('mx-auto grid size-16 place-items-center rounded-2xl text-3xl', record.success ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white')}>
                    {record.success ? <Trophy className="size-8" aria-hidden /> : <Timer className="size-8" aria-hidden />}
                  </div>
                )}
                <h2 className={cn('mt-3 font-extrabold text-ink', kids ? 'font-fun text-3xl font-semibold' : 'text-2xl')} aria-live="polite">
                  {record.success ? s.game.success : s.game.failure}
                </h2>
                <p className="mt-1 text-slate-600">
                  You scored <strong className="text-ink">{record.score}</strong> {def.scoreLabel} · goal {def.target}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-black text-emerald-700 shadow-sm">
                    <Star className="size-4 fill-amber-400 text-amber-500" aria-hidden />+{record.xp} {kids ? s.common.ecoStars : s.common.xp}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-black text-gold-700 shadow-sm">
                    <Coins className="size-4" aria-hidden />+{record.coins}
                  </span>
                </div>
                {context === 'quiz' && <p className="mt-2 text-xs text-slate-500">Your best round is added to this quiz’s rewards.</p>}
              </div>
              <div className="space-y-4 p-6 text-left">
                <div className="flex gap-3 rounded-2xl bg-sky-50 p-4 text-[15px] text-sky-900">
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-sky-600" aria-hidden />
                  <p>
                    <span className="font-bold">{s.game.whatYouLearned}: </span>
                    {def.learning}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {context === 'quiz' ? (
                    <>
                      <Button size={kids ? 'xl' : 'lg'} chunky={kids} full onClick={() => onContinue?.(bestRef.current ?? record)} autoFocus>
                        {s.game.continueQuiz} →
                      </Button>
                      <Button variant="outline" size={kids ? 'xl' : 'lg'} chunky={kids} onClick={start} icon={<RotateCcw className="size-4" aria-hidden />} className="sm:w-auto">
                        {s.game.playAgain}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size={kids ? 'xl' : 'lg'} chunky={kids} full onClick={start} icon={<RotateCcw className="size-5" aria-hidden />} autoFocus>
                        {s.game.playAgain}
                      </Button>
                      {onExit && (
                        <Button variant="outline" size={kids ? 'xl' : 'lg'} chunky={kids} onClick={onExit} className="sm:w-auto">
                          {s.game.backToGames}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
