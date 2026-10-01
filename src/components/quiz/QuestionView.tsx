import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Coins, Lightbulb, X } from 'lucide-react';
import { useEffect } from 'react';
import { GAMIFICATION } from '@/config/gamification';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import type { AnswerRecord, ExperienceMode, QuizQuestion } from '@/types';
import { BotanicalVinesArt } from '../brand/EarthlyArt';
import { EarthMascotArt, WaterDropletMascot } from '../brand/KidsArt';
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
      <div className={cn(kids ? '' : 'grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start')}>
        <Card className={cn('relative overflow-hidden', kids ? 'border-2 border-emerald-100 p-5 sm:p-7 rounded-[2rem] bg-white shadow-sm' : 'border border-slate-200/90 rounded-3xl bg-white p-6 sm:p-8 shadow-sm')}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Pill className={difficultyStyles[question.difficulty].chip}>{difficultyStyles[question.difficulty].label}</Pill>
            <Pill className={question.type === 'rapid' ? 'bg-orange-100 text-orange-800' : 'bg-[#E6F4EA] text-[#1E4620] font-bold'}>
              {question.type === 'rapid' && '⚡ '}
              {typeLabel}
            </Pill>
            <Pill className="ml-auto bg-emerald-50 text-emerald-800 font-bold">
              +{question.xp} {kids ? '⭐' : 'XP'}
            </Pill>
          </div>

          {question.visual && (
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="my-3 text-center text-7xl sm:text-8xl" aria-hidden>
              {question.visual}
            </motion.div>
          )}
          {question.context && (
            <p className={cn('mb-4 rounded-2xl border-l-4 px-4 py-3 text-slate-700', kids ? 'border-sky-300 bg-sky-50 text-base font-medium' : 'border-[#2D6A4F] bg-[#FAF7F2] text-[15px]')}>{question.context}</p>
          )}
          {question.data && (
            <div className="mb-4">
              <DataFigure data={question.data} />
            </div>
          )}

          {/* Question Title with Earth Mascot in Kids mode (Screen 2) */}
          <div className="flex items-start gap-4">
            {kids && <EarthMascotArt className="size-14 sm:size-16 shrink-0 drop-shadow" />}
            <h2 className={cn('font-black text-slate-900 text-balance flex-1', kids ? 'font-fun text-2xl leading-snug font-black sm:text-[28px]' : 'text-xl leading-snug sm:text-2xl')} id="question-text">
              {question.question}
            </h2>
          </div>

          <div role="group" aria-labelledby="question-text" className="mt-6 flex flex-col gap-3">
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
                  animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : state === 'correct' ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    'flex w-full items-center gap-3.5 text-left font-semibold transition disabled:cursor-default',
                    kids ? 'min-h-16 rounded-2xl border-[3px] px-4 py-3 font-fun text-lg' : 'min-h-14 rounded-2xl border-2 px-5 py-3.5 text-[15px]',
                    state === 'idle' && (kids ? 'border-white bg-white shadow-[0_4px_0_#d6efdc] hover:border-emerald-300' : 'border-slate-200/90 bg-white hover:border-[#2D6A4F] hover:bg-[#EAF6F0]/40 shadow-sm'),
                    state === 'correct' && 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm',
                    state === 'wrong' && 'border-rose-400 bg-rose-50 text-rose-900',
                    state === 'dim' && 'border-slate-100 bg-slate-50/60 opacity-55',
                  )}
                  aria-label={`${LETTERS[i]}: ${opt}${answered ? (isCorrect ? ' — correct answer' : isChosen ? ' — your answer, incorrect' : '') : ''}`}
                >
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-full text-xs font-black transition-colors',
                      state === 'correct' ? 'bg-emerald-600 text-white' : state === 'wrong' ? 'bg-rose-500 text-white' : kids ? 'bg-emerald-100 text-emerald-800' : 'border border-slate-300 bg-slate-50 text-slate-700',
                    )}
                    aria-hidden
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="min-w-0 flex-1">{opt}</span>
                  {state === 'correct' && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="size-4" />
                    </span>
                  )}
                  {state === 'wrong' && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                      <X className="size-4" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {!answered && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {hintUsed ? (
                <p className="flex w-full items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900" role="note">
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

        {/* Right Botanical Sidebar (Matching Earthly Quiz Screen) */}
        {!kids && (
          <div className="hidden lg:flex flex-col items-center justify-between rounded-3xl border border-[#C2E7D0] bg-white p-6 text-center shadow-sm h-full min-h-[420px]">
            <div className="w-full">
              <BotanicalVinesArt className="w-20 h-56 mx-auto opacity-95" />
            </div>
            <div className="mt-4">
              <p className="font-serif italic text-sm font-bold text-[#13382B] leading-relaxed">
                “Good choices today, healthier planet tomorrow.”
              </p>
              <span className="mt-2 inline-block text-xs font-bold text-[#2D6A4F]">💚 EcoQuest Learning</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            <Card className={cn('p-5 sm:p-6 rounded-[2rem]', kids ? 'border-2 border-emerald-200 bg-[#F0FDF4]' : answer.correct ? 'border-emerald-200 bg-emerald-50/70' : answer.timedOut ? 'border-amber-200 bg-amber-50/70' : 'border-rose-200 bg-rose-50/70')}>
              {kids ? (
                /* Kids feedback with Water Droplet Mascot matching Screen 2 */
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="shrink-0">
                    <WaterDropletMascot className="size-20 sm:size-24 drop-shadow-sm" />
                  </div>
                  <div className="min-w-0 flex-1 w-full rounded-2xl bg-white p-4 sm:p-5 border-2 border-emerald-100 shadow-sm">
                    <p className="font-fun text-xl sm:text-2xl font-black text-emerald-800">
                      {answer.correct ? 'Great choice!' : 'Keep learning!'}
                      {answer.correct && (
                        <span className="ml-2 text-base font-black text-amber-500">
                          +{answer.xp} ⭐
                        </span>
                      )}
                    </p>
                    <p className="font-fun text-sm sm:text-base text-slate-700 font-semibold mt-1.5 leading-relaxed">
                      {question.explanation || (answer.correct ? 'Shorter showers save a lot of water!' : `The best choice was: ${question.options[question.correctAnswer]}`)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl text-white', answer.correct ? 'bg-emerald-600' : answer.timedOut ? 'bg-amber-500' : 'bg-rose-500')}>
                    {answer.correct ? <Check className="size-6" aria-hidden /> : answer.timedOut ? <Clock className="size-6" aria-hidden /> : <X className="size-6" aria-hidden />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-ink text-lg">
                      {answer.timedOut ? s.quiz.timesUp : answer.correct ? s.quiz.correct : s.quiz.incorrect}
                      {answer.correct && (
                        <span className="ml-2 text-base font-bold text-emerald-700">
                          +{answer.xp} XP
                          {answer.fast && ' ⚡'}
                        </span>
                      )}
                    </p>
                    {!answer.correct && (
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {s.quiz.correctAnswerWas} <span className="text-emerald-800">{question.options[question.correctAnswer]}</span>
                      </p>
                    )}
                    <p className="mt-2 text-slate-700 text-[15px]">{question.explanation}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <Button
                  size="lg"
                  chunky={kids}
                  onClick={onNext}
                  autoFocus
                  className={cn(kids ? 'rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black px-9 py-3 text-base shadow-md' : 'w-full sm:w-auto')}
                >
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
