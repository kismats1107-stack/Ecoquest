import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Coins, Lightbulb, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { GAMIFICATION } from '@/config/gamification';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import type { AnswerRecord, ExperienceMode, QuizQuestion } from '@/types';
import { Mascot } from '../brand/Mascot';
import { Button } from '../ui/Button';
import { Card, Pill } from '../ui/Card';
import { Confetti } from '../ui/Confetti';
import { difficultyStyles } from '../ui/tones';
import { DataFigure } from './DataFigure';

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionView({
  mode,
  question,
  answer,
  hintUsed,
  coins,
  nextLabel,
  onAnswer,
  onHint,
  onNext,
}: {
  mode: ExperienceMode;
  question: QuizQuestion;
  /** Present once the question has been answered (feedback phase). */
  answer: AnswerRecord | null;
  hintUsed: boolean;
  coins: number;
  nextLabel: string;
  onAnswer: (index: number) => void;
  onHint: () => void;
  onNext: () => void;
}) {
  const s = useStrings();
  const kids = mode === 'kids';
  const answered = answer !== null;
  const cost = GAMIFICATION.hintCost;
  const cheer = useMemo(() => {
    const list = answer?.correct ? s.quiz.kidsCorrect : s.quiz.kidsIncorrect;
    return list[Math.floor(Math.random() * list.length)];
  }, [answer, s]);

  // Keyboard: 1–4 / A–D to answer, Enter to continue.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (!answered) {
        const idx = ['1', '2', '3', '4'].indexOf(e.key) !== -1 ? Number(e.key) - 1 : LETTERS.indexOf(e.key.toUpperCase());
        if (idx >= 0 && idx < question.options.length) onAnswer(idx);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answered, question, onAnswer]);

  const typeLabel = s.quiz.types[question.type];

  return (
    <div className="space-y-4">
      <Card className={cn('relative overflow-hidden', kids ? 'border-2 border-emerald-100 p-5 sm:p-7' : 'p-5 sm:p-7')}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill className={difficultyStyles[question.difficulty].chip}>{difficultyStyles[question.difficulty].label}</Pill>
          <Pill className={question.type === 'rapid' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'}>
            {question.type === 'rapid' && '⚡ '}
            {typeLabel}
          </Pill>
          <Pill className="ml-auto bg-emerald-50 text-emerald-800">
            +{question.xp} {kids ? '⭐' : 'XP'}
          </Pill>
        </div>

        {question.visual && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="my-3 text-center text-7xl sm:text-8xl" aria-hidden>
            {question.visual}
          </motion.div>
        )}
        {question.context && (
          <p className={cn('mb-3 rounded-xl border-l-4 px-4 py-3 text-slate-700', kids ? 'border-sky-300 bg-sky-50 text-base' : 'border-teal-500 bg-teal-50/60 text-[15px]')}>{question.context}</p>
        )}
        {question.data && (
          <div className="mb-4">
            <DataFigure data={question.data} />
          </div>
        )}
        <h2 className={cn('font-extrabold text-ink text-balance', kids ? 'font-fun text-2xl leading-snug font-semibold sm:text-[28px]' : 'text-xl leading-snug sm:text-2xl')} id="question-text">
          {question.question}
        </h2>

        <div role="group" aria-labelledby="question-text" className={cn('mt-5 grid gap-3', question.options.length === 2 ? 'grid-cols-2' : 'sm:grid-cols-2')}>
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctAnswer;
            const isChosen = answer?.selected === i;
            const state = !answered ? 'idle' : isCorrect ? 'correct' : isChosen ? 'wrong' : 'dim';
            return (
              <motion.button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => onAnswer(i)}
                animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : state === 'correct' ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  'flex w-full items-center gap-3 text-left font-semibold transition disabled:cursor-default',
                  kids ? 'min-h-16 rounded-2xl border-[3px] px-4 py-3 font-fun text-lg' : 'min-h-14 rounded-xl border-2 px-4 py-3 text-[15px]',
                  state === 'idle' && (kids ? 'border-white bg-white shadow-[0_4px_0_#d6efdc] hover:border-emerald-300' : 'border-line bg-white hover:border-teal-400 hover:bg-teal-50/40'),
                  state === 'correct' && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  state === 'wrong' && 'border-rose-400 bg-rose-50 text-rose-900',
                  state === 'dim' && 'border-line bg-white opacity-55',
                )}
                aria-label={`${LETTERS[i]}: ${opt}${answered ? (isCorrect ? ' — correct answer' : isChosen ? ' — your answer, incorrect' : '') : ''}`}
              >
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-lg text-sm font-black',
                    state === 'correct' ? 'bg-emerald-500 text-white' : state === 'wrong' ? 'bg-rose-500 text-white' : kids ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
                  )}
                  aria-hidden
                >
                  {state === 'correct' ? <Check className="size-4" /> : state === 'wrong' ? <X className="size-4" /> : LETTERS[i]}
                </span>
                <span className="min-w-0">{opt}</span>
              </motion.button>
            );
          })}
        </div>

        {!answered && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {hintUsed ? (
              <p className="flex w-full items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900" role="note">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
                {question.hint}
              </p>
            ) : (
              <Button variant="outline" size="sm" onClick={onHint} disabled={coins < cost} icon={<Lightbulb className="size-4 text-amber-500" aria-hidden />}>
                {coins < cost ? s.quiz.needCoins(cost) : s.quiz.useHint(cost)}
                <span className="inline-flex items-center gap-0.5 text-gold-600">
                  <Coins className="size-3.5" aria-hidden />
                  {cost}
                </span>
              </Button>
            )}
          </div>
        )}
        {answer?.correct && <Confetti count={kids ? 26 : 14} spread={kids ? 200 : 140} />}
      </Card>

      <AnimatePresence>
        {answer && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            <Card className={cn('p-5 sm:p-6', answer.correct ? 'border-emerald-200 bg-emerald-50/70' : answer.timedOut ? 'border-amber-200 bg-amber-50/70' : 'border-rose-200 bg-rose-50/70')}>
              <div className="flex gap-4">
                {kids ? (
                  <Mascot mood={answer.correct ? 'cheer' : 'oops'} className="size-16 shrink-0 sm:size-20" />
                ) : (
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl text-white', answer.correct ? 'bg-emerald-600' : answer.timedOut ? 'bg-amber-500' : 'bg-rose-500')}>
                    {answer.correct ? <Check className="size-6" aria-hidden /> : answer.timedOut ? <Clock className="size-6" aria-hidden /> : <X className="size-6" aria-hidden />}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className={cn('font-extrabold text-ink', kids ? 'font-fun text-2xl font-semibold' : 'text-lg')}>
                    {answer.timedOut ? s.quiz.timesUp : answer.correct ? (kids ? cheer : s.quiz.correct) : kids ? cheer : s.quiz.incorrect}
                    {answer.correct && (
                      <span className="ml-2 text-base font-bold text-emerald-700">
                        +{answer.xp} {kids ? s.common.ecoStars : 'XP'}
                        {answer.fast && ' ⚡'}
                      </span>
                    )}
                  </p>
                  {!answer.correct && (
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {s.quiz.correctAnswerWas} <span className="text-emerald-800">{question.options[question.correctAnswer]}</span>
                    </p>
                  )}
                  <p className={cn('mt-2 text-slate-700', kids ? 'text-base' : 'text-[15px]')}>{question.explanation}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size={kids ? 'lg' : 'md'} chunky={kids} onClick={onNext} autoFocus className="w-full sm:w-auto">
                  {nextLabel} →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
