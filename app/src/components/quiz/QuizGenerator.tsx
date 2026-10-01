import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Cpu, Gamepad2, RefreshCw, Sparkles, WandSparkles, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { DIFFICULTIES, QUESTION_COUNTS, TIME_OPTIONS } from '@shared/quizContract';
import { DEFAULT_TIME_PER_QUESTION } from '@/config/gamification';
import { getTopic, getTopics } from '@/data';
import { getGame } from '@/data/games';
import { difficultyMix } from '@/engine/quiz/buildQuiz';
import { gameForBreak, planGameBreaks } from '@/engine/quiz/plan';
import { suggestDifficulty } from '@/engine/quiz/recommendation';
import { useMode } from '@/hooks/useMode';
import { useStartQuiz } from '@/hooks/useStartQuiz';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { generateQuiz, getAIStatus, type AIStatus } from '@/services/quiz';
import type { Difficulty, Quiz } from '@/types';
import { Mascot } from '../brand/Mascot';
import { Button } from '../ui/Button';
import { Card, Pill } from '../ui/Card';
import { difficultyStyles, tones } from '../ui/tones';
import { OptionGroup } from './OptionGroup';

type Phase = 'form' | 'generating' | 'ready';

const MIN_LOADING_MS = 900;

/**
 * "Create Your Challenge" — the core EcoQuest interaction:
 * topic → difficulty → size → GENERATE → a fresh quiz → START.
 */
export function QuizGenerator({ initialTopicId, initialDifficulty }: { initialTopicId?: string | null; initialDifficulty?: string | null }) {
  const s = useStrings();
  const { mode, progress } = useMode();
  const kids = mode === 'kids';
  const topics = getTopics(mode);
  const startQuiz = useStartQuiz(mode);

  const validInitial = initialTopicId && topics.some((t) => t.id === initialTopicId) ? initialTopicId : null;
  const [topicId, setTopicId] = useState<string>(validInitial ?? topics[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    if (initialDifficulty && DIFFICULTIES.includes(initialDifficulty as Difficulty)) return initialDifficulty as Difficulty;
    return suggestDifficulty(progress.topicStats[validInitial ?? topics[0].id])?.difficulty ?? 'easy';
  });
  const [count, setCount] = useState(kids ? 5 : 10);
  const [time, setTime] = useState(DEFAULT_TIME_PER_QUESTION[mode]);
  const [phase, setPhase] = useState<Phase>('form');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [ai, setAi] = useState<AIStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    getAIStatus().then((st) => alive && setAi(st));
    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, []);

  const topic = getTopic(topicId)!;
  const suggestion = suggestDifficulty(progress.topicStats[topicId]);

  const selectTopic = (id: string) => {
    setTopicId(id);
    const sug = suggestDifficulty(progress.topicStats[id]);
    if (sug) setDifficulty(sug.difficulty);
  };

  const avoidQuestions = useMemo(
    () =>
      progress.attempts
        .filter((a) => a.topicId === topicId)
        .slice(0, 3)
        .flatMap((a) => a.questions.map((q) => q.question))
        .slice(0, 30),
    [progress.attempts, topicId],
  );

  const generate = async (preferAI = true) => {
    setPhase('generating');
    setError(null);
    setSlow(false);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const started = Date.now();
    const slowTimer = window.setTimeout(() => !controller.signal.aborted && setSlow(true), 6000);
    try {
      const q = await generateQuiz(
        {
          topicId,
          topicName: topic.name,
          topicSummary: topic.summary,
          difficulty,
          questionCount: count,
          timePerQuestion: time,
          experienceMode: mode,
          avoidQuestions,
        },
        { signal: controller.signal, preferAI },
      );
      const wait = MIN_LOADING_MS - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (controller.signal.aborted) return;
      setQuiz(q);
      setPhase('ready');
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error(err);
      setError('Something went wrong while creating your quiz. Please try again.');
      setPhase('form');
    } finally {
      window.clearTimeout(slowTimer);
    }
  };

  const breaks = quiz ? planGameBreaks(quiz.questions.length) : [];
  const estimatedMin = quiz ? Math.max(1, Math.round((quiz.questions.length * (time * 0.6 + 6) + breaks.length * 18) / 60)) : 0;

  const topicTile = (selected: boolean) =>
    kids
      ? cn(
          'flex flex-col items-center justify-center gap-1 rounded-3xl border-[3px] bg-white px-2 py-3 text-center font-fun text-[15px] font-semibold leading-tight min-h-[104px]',
          selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_4px_0_#16a34a]' : 'border-white text-slate-700 shadow-[0_4px_0_#d6efdc] hover:border-emerald-200',
        )
      : cn(
          'flex items-center gap-3 rounded-xl border bg-white px-3 py-3 text-left text-sm font-semibold',
          selected ? 'border-teal-600 bg-teal-50/60 text-teal-900 ring-2 ring-teal-600/15' : 'border-line text-slate-700 hover:border-teal-300',
        );

  const segment = (selected: boolean) =>
    kids
      ? cn(
          'flex-1 rounded-2xl border-[3px] bg-white px-3 py-3 font-fun text-base font-semibold',
          selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-white text-slate-600 shadow-[0_3px_0_#d6efdc] hover:border-emerald-200',
        )
      : cn('flex-1 rounded-lg px-3 py-2 text-sm font-semibold', selected ? 'bg-white text-teal-800 shadow-sm ring-1 ring-line' : 'text-slate-600 hover:text-ink');

  const segmentWrap = kids ? 'flex gap-2.5' : 'flex gap-1 rounded-xl bg-slate-100 p-1';
  const stepTitle = cn(kids ? 'font-fun text-lg font-semibold text-emerald-900' : 'text-sm font-bold text-ink');

  return (
    <section id="create" aria-labelledby="create-title" className="scroll-mt-24">
      <Card className={cn('relative overflow-hidden', kids ? 'border-2 border-emerald-100 p-5 sm:p-7' : 'p-5 sm:p-7')}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="create-title" className={cn('flex items-center gap-2 font-extrabold tracking-tight text-ink', kids ? 'font-fun text-2xl font-semibold sm:text-3xl' : 'text-xl sm:text-2xl')}>
              {kids ? <span aria-hidden>🎲</span> : <WandSparkles className="size-6 text-teal-700" aria-hidden />}
              {kids ? s.generator.kidsTitle : s.generator.title}
            </h2>
            <p className={cn('mt-1 text-slate-600', kids ? 'text-base' : 'text-sm')}>{s.generator.subtitle}</p>
          </div>
          {ai && (
            <Pill className={ai.enabled ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-600'}>
              {ai.enabled ? <Sparkles className="size-3.5" aria-hidden /> : <Cpu className="size-3.5" aria-hidden />}
              {ai.enabled ? 'AI generation on' : 'Offline generator'}
            </Pill>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {phase === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div>
                <h3 className={cn(stepTitle, 'mb-3')}>1. {s.generator.topicStep}</h3>
                <OptionGroup
                  label={s.generator.topicStep}
                  value={topicId}
                  onChange={selectTopic}
                  options={topics.map((t) => ({ value: t.id, label: t.name }))}
                  className={cn('grid gap-2.5', kids ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}
                  itemClassName={topicTile}
                  renderItem={(opt) => {
                    const t = getTopic(opt.value)!;
                    return kids ? (
                      <>
                        <span className="text-4xl" aria-hidden>
                          {t.emoji}
                        </span>
                        <span>{t.name}</span>
                      </>
                    ) : (
                      <>
                        <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg text-lg', tones[t.tone].soft)} aria-hidden>
                          {t.emoji}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate">{t.name}</span>
                          <span className="block truncate text-xs font-medium text-slate-500">{t.tagline}</span>
                        </span>
                      </>
                    );
                  }}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className={stepTitle}>2. {s.generator.difficultyStep}</h3>
                    {suggestion && (
                      <Pill className="bg-gold-100 text-gold-700">
                        <Sparkles className="size-3" aria-hidden />
                        {s.generator.suggested}: {difficultyStyles[suggestion.difficulty].label}
                      </Pill>
                    )}
                  </div>
                  <OptionGroup
                    label={s.generator.difficultyStep}
                    value={difficulty}
                    onChange={setDifficulty}
                    options={DIFFICULTIES.map((d) => ({ value: d, label: difficultyStyles[d].label }))}
                    className={segmentWrap}
                    itemClassName={segment}
                    renderItem={(opt) => (
                      <span className="flex items-center justify-center gap-1.5">
                        {kids && <span aria-hidden>{difficultyStyles[opt.value].emoji}</span>}
                        {opt.label}
                      </span>
                    )}
                  />
                  {suggestion && <p className="mt-2 text-xs text-slate-500">{suggestion.reason}</p>}
                </div>

                <div>
                  <h3 className={cn(stepTitle, 'mb-3')}>3. {s.generator.countStep}</h3>
                  <OptionGroup
                    label={s.generator.countStep}
                    value={count}
                    onChange={setCount}
                    options={QUESTION_COUNTS.map((n) => ({ value: n, label: `${n}` }))}
                    className={segmentWrap}
                    itemClassName={segment}
                    renderItem={(opt) => (
                      <span>
                        {opt.label} <span className="font-medium opacity-70">{kids ? 'Qs' : 'questions'}</span>
                      </span>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className={cn(stepTitle, 'mb-3 flex items-center gap-2')}>
                  <Clock className="size-4 opacity-70" aria-hidden /> {s.generator.timeStep}
                </h3>
                <OptionGroup
                  label={s.generator.timeStep}
                  value={time}
                  onChange={setTime}
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: s.generator.seconds(t) }))}
                  className={cn(segmentWrap, 'max-w-md')}
                  itemClassName={segment}
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </p>
              )}

              <Button
                size={kids ? 'xl' : 'lg'}
                chunky={kids}
                full
                onClick={() => generate()}
                icon={<Zap className="size-5" aria-hidden />}
                className={kids ? 'bg-orange-500 hover:bg-orange-600' : ''}
                style={kids ? ({ '--btn-shadow-color': '#c2410c' } as CSSProperties) : undefined}
              >
                {s.generator.generate.toUpperCase()}
              </Button>
            </motion.div>
          )}

          {phase === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-14 text-center"
              role="status"
              aria-live="polite"
            >
              {kids ? (
                <Mascot mood="think" className="size-28" />
              ) : (
                <div className="relative size-20" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-teal-500/60"
                      animate={{ scale: [0.4, 1.2], opacity: [0.9, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
                    />
                  ))}
                  <span className="absolute inset-0 grid place-items-center text-3xl">{topic.emoji}</span>
                </div>
              )}
              <p className={cn('font-bold text-ink', kids ? 'font-fun text-2xl font-semibold' : 'text-lg')}>{kids ? s.generator.generatingKids : s.generator.generating}</p>
              <p className="text-sm text-slate-500">
                {topic.name} · {difficultyStyles[difficulty].label} · {s.common.questions(count)}
              </p>
              {slow && (
                <button type="button" onClick={() => generate(false)} className="mt-2 text-sm font-semibold text-accent-ink underline underline-offset-4 hover:text-ink">
                  Taking a while? Use the offline question bank instead
                </button>
              )}
            </motion.div>
          )}

          {phase === 'ready' && quiz && (
            <motion.div key="ready" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className={cn('rounded-2xl p-5 text-center', kids ? 'bg-gradient-to-br from-emerald-100 via-lime-50 to-sky-100' : 'bg-gradient-to-br from-teal-50 to-emerald-50')}>
                <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="mx-auto mb-2 text-5xl" aria-hidden>
                  {topic.emoji}
                </motion.div>
                <p className={cn('font-extrabold text-ink', kids ? 'font-fun text-2xl font-semibold sm:text-3xl' : 'text-xl sm:text-2xl')}>{s.generator.ready}</p>
                <p className="mt-1 text-sm text-slate-600">{quiz.notice ?? (quiz.source === 'ai' ? 'Freshly written by AI and checked by EcoQuest.' : 'Freshly shuffled from EcoQuest’s question bank.')}</p>
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { k: 'Topic', v: topic.name },
                  { k: 'Difficulty', v: difficultyStyles[quiz.difficulty].label },
                  { k: 'Questions', v: String(quiz.questions.length) },
                  { k: s.generator.estimatedTime, v: `~${estimatedMin} min` },
                ].map((row) => (
                  <div key={row.k} className="rounded-xl border border-line bg-white px-3 py-2.5">
                    <dt className="text-xs font-semibold text-slate-500">{row.k}</dt>
                    <dd className="truncate font-bold text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Pill className={quiz.source === 'ai' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-700'}>
                  {quiz.source === 'ai' ? <Sparkles className="size-3.5" aria-hidden /> : <Cpu className="size-3.5" aria-hidden />}
                  {quiz.source === 'ai' ? s.generator.sourceAI : s.generator.sourceLocal}
                </Pill>
                {Object.entries(difficultyMix(quiz))
                  .filter(([, n]) => n > 0)
                  .map(([d, n]) => (
                    <Pill key={d} className={difficultyStyles[d as Difficulty].chip}>
                      {n} {difficultyStyles[d as Difficulty].label.toLowerCase()}
                    </Pill>
                  ))}
                {breaks.length > 0 && (
                  <Pill className="bg-orange-100 text-orange-800">
                    <Gamepad2 className="size-3.5" aria-hidden />
                    {s.generator.includes(breaks.length)}: {[...new Set(breaks.map((_, i) => getGame(gameForBreak(topic, i)).name))].join(', ')}
                  </Pill>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size={kids ? 'xl' : 'lg'} chunky={kids} full onClick={() => startQuiz(quiz)} autoFocus>
                  {s.generator.start.toUpperCase()} →
                </Button>
                <Button variant="outline" size={kids ? 'xl' : 'lg'} chunky={kids} onClick={() => generate()} icon={<RefreshCw className="size-4" aria-hidden />} className="sm:w-auto">
                  {s.generator.regenerate}
                </Button>
              </div>
              <button type="button" onClick={() => setPhase('form')} className="mx-auto block text-sm font-semibold text-slate-500 underline-offset-4 hover:text-ink hover:underline">
                Change topic or settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </section>
  );
}
