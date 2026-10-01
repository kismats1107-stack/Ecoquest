import { motion } from 'framer-motion';
import { Flame, Gamepad2, Star, Timer, X } from 'lucide-react';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { GameShell } from '@/components/games/GameShell';
import { QuestionView } from '@/components/quiz/QuestionView';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getTopic } from '@/data';
import { getGame } from '@/data/games';
import { skippedGameRecord } from '@/engine/games/rewards';
import { gameForBreak } from '@/engine/quiz/plan';
import { summarizeSession } from '@/engine/quiz/scoring';
import { activeBreakIndex, currentQuestion, sessionReducer, timeLimitMs, type QuizSession } from '@/engine/quiz/session';
import { useCountdown } from '@/hooks/useCountdown';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { sessionStore } from '@/services/storage/sessionStore';
import { useApp } from '@/store/context';
import type { GameRecord } from '@/types';

export default function QuizPage() {
  const { mode } = useMode();
  // Resume a saved session; a question in progress gets a fresh timer after a reload.
  const [initial] = useState<QuizSession | null>(() => {
    const saved = sessionStore.load(mode);
    if (saved && saved.phase === 'question') return { ...saved, questionStartedAt: Date.now() };
    return saved;
  });
  if (!initial) return <Navigate to={paths(mode).generator} replace />;
  return <QuizRunner initial={initial} />;
}

function QuizRunner({ initial }: { initial: QuizSession }) {
  const s = useStrings();
  const app = useApp();
  const { mode, progress } = useMode();
  const navigate = useNavigate();
  const kids = mode === 'kids';
  const [session, dispatch] = useReducer(sessionReducer, initial);
  const [confirmExit, setConfirmExit] = useState(false);
  const committed = useRef(false);
  const topic = getTopic(session.quiz.topicId);
  useDocumentTitle(`${session.quiz.topicName} quiz`);

  // Persist every step so a refresh resumes where the learner left off.
  useEffect(() => {
    if (session.phase !== 'complete') sessionStore.save(mode, session);
  }, [session, mode]);

  // Completion: score, commit rewards once, then show results.
  useEffect(() => {
    if (session.phase !== 'complete' || committed.current) return;
    committed.current = true;
    const dailyAlreadyCompleted = progress.daily?.dateKey === app.today && progress.daily.completed;
    const summary = summarizeSession(session, mode, { dailyAlreadyCompleted, now: Date.now() });
    const { attempt, outcome } = app.completeQuiz(session, summary);
    navigate(paths(mode).results(attempt.id), { replace: true, state: { summary, outcome } });
  }, [session, mode, app, progress.daily, navigate]);

  const question = currentQuestion(session);
  const limit = timeLimitMs(session);
  const remaining = useCountdown(
    limit,
    session.phase === 'question',
    () => dispatch({ type: 'timeout', index: session.index, now: Date.now() }),
    `${session.quiz.id}:${session.index}`,
  );

  const answer = session.phase === 'feedback' ? session.answers[session.index] ?? null : null;
  const onAnswer = useCallback((i: number) => dispatch({ type: 'answer', index: session.index, selected: i, now: Date.now() }), [session.index]);
  const onHint = () => {
    if (app.buyHint(mode)) dispatch({ type: 'hint', index: session.index });
  };
  const onNext = () => dispatch({ type: 'next', now: Date.now() });

  const isLast = session.index + 1 >= session.quiz.questions.length;
  const gameNext = session.gameBreaks.includes(session.index + 1) && session.games.length < session.gameBreaks.indexOf(session.index + 1) + 1 && !isLast;
  const nextLabel = isLast ? s.quiz.seeResults : gameNext ? `${s.quiz.challengeTime.replace('!', '')}` : s.quiz.next;

  const xpSoFar = session.answers.reduce((t, a) => t + a.xp, 0) + session.games.reduce((t, g) => t + g.xp, 0);
  const secondsLeft = Math.ceil(remaining / 1000);
  const urgent = session.phase === 'question' && remaining <= 5000;

  const exit = () => {
    sessionStore.clear(mode);
    navigate(paths(mode).generator, { replace: true });
  };

  const breakIdx = activeBreakIndex(session);
  const gameId = topic ? gameForBreak(topic, breakIdx) : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setConfirmExit(true)}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-black/5 hover:text-ink"
          aria-label={s.quiz.exit}
        >
          <X className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
            <span className={cn('truncate font-bold text-ink', kids && 'font-fun text-base font-semibold')}>
              <span aria-hidden>{topic?.emoji} </span>
              {session.quiz.topicName}
              {session.dailyKey && <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-700">{kids ? s.daily.kidsTitle : s.daily.title}</span>}
            </span>
            <span className="shrink-0 font-semibold text-slate-500 tabular">{s.quiz.questionOf(Math.min(session.index + 1, session.quiz.questions.length), session.quiz.questions.length)}</span>
          </div>
          {/* Segmented progress with game markers */}
          <ol className="flex items-center gap-1" aria-label="Quiz progress">
            {session.quiz.questions.map((q, i) => {
              const a = session.answers[i];
              return (
                <li key={q.id} className="flex flex-1 items-center gap-1">
                  <span
                    className={cn(
                      'block h-2.5 flex-1 rounded-full transition-colors',
                      a ? (a.correct ? 'bg-emerald-500' : 'bg-rose-400') : i === session.index ? (kids ? 'bg-amber-300' : 'bg-teal-300') : 'bg-slate-200',
                    )}
                    aria-label={`Question ${i + 1}: ${a ? (a.correct ? 'correct' : 'incorrect') : i === session.index ? 'current' : 'upcoming'}`}
                  />
                  {session.gameBreaks.includes(i + 1) && (
                    <Gamepad2 className={cn('size-3.5 shrink-0', session.games.length > session.gameBreaks.indexOf(i + 1) ? 'text-orange-500' : 'text-slate-300')} aria-label="10-second challenge" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-black/5">
            <Star className="size-4 fill-amber-400 text-amber-500" aria-hidden />
            <span className="tabular">{xpSoFar}</span> {kids ? s.common.ecoStars : 'XP'}
          </span>
          {session.combo >= 2 && (
            <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-700">
              <Flame className="size-4" aria-hidden /> {s.quiz.combo(session.combo)}
            </motion.span>
          )}
        </div>
        {session.phase === 'question' && (
          <div
            className={cn('inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-black tabular shadow-sm ring-1 ring-black/5', urgent ? 'bg-rose-100 text-rose-700' : 'bg-white text-ink')}
            role="timer"
            aria-label={`${secondsLeft} seconds left`}
          >
            <Timer className={cn('size-4', urgent && 'animate-pulse')} aria-hidden />
            {secondsLeft}s
            <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 sm:block" aria-hidden>
              <span className={cn('block h-full rounded-full transition-[width] duration-100 ease-linear', urgent ? 'bg-rose-500' : kids ? 'bg-amber-400' : 'bg-teal-600')} style={{ width: `${(remaining / limit) * 100}%` }} />
            </span>
          </div>
        )}
      </div>

      {(session.phase === 'question' || session.phase === 'feedback') && (
        <QuestionView
          key={question.id}
          mode={mode}
          question={question}
          answer={answer}
          hintUsed={session.hintsUsed.includes(question.id)}
          coins={progress.coins}
          nextLabel={nextLabel}
          onAnswer={onAnswer}
          onHint={onHint}
          onNext={onNext}
        />
      )}

      {session.phase === 'game' && gameId && (
        <GameShell
          key={`break-${breakIdx}`}
          gameId={gameId}
          topicId={session.quiz.topicId}
          context="quiz"
          onContinue={(best: GameRecord) => dispatch({ type: 'gameDone', record: best, now: Date.now() })}
          onSkip={() => dispatch({ type: 'gameDone', record: skippedGameRecord(gameId, getGame(gameId).target, Date.now(), session.quiz.topicId), now: Date.now() })}
        />
      )}

      {session.phase === 'complete' && <p className="py-20 text-center font-semibold text-slate-500">Calculating your results…</p>}

      <Modal open={confirmExit} onClose={() => setConfirmExit(false)} title={s.quiz.exitConfirmTitle}>
        <p className="text-slate-600">{s.quiz.exitConfirmBody}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setConfirmExit(false)} data-autofocus>
            {s.quiz.keepPlaying}
          </Button>
          <Button variant="danger" onClick={exit}>
            {s.quiz.exitConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
