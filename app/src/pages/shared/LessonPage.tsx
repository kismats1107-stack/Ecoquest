import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleCheck, Lightbulb, Sparkles, Zap } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { Mascot } from '@/components/brand/Mascot';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card, Pill } from '@/components/ui/Card';
import { Confetti } from '@/components/ui/Confetti';
import { ProgressBar } from '@/components/ui/Progress';
import { tones } from '@/components/ui/tones';
import { GAMIFICATION } from '@/config/gamification';
import { getLesson, getTopic } from '@/data';
import { getGame } from '@/data/games';
import { topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { Lesson, Topic } from '@/types';

export default function LessonPage() {
  const { topicId } = useParams();
  const { mode } = useMode();
  const topic = topicId ? getTopic(topicId) : undefined;
  const lesson = topicId ? getLesson(topicId) : undefined;
  useDocumentTitle(topic?.name ?? 'Lesson');
  if (!topic || !lesson || topic.mode !== mode) return <Navigate to={paths(mode).learn} replace />;
  return mode === 'kids' ? <KidsLesson topic={topic} lesson={lesson} /> : <PlusLesson topic={topic} lesson={lesson} />;
}

function useLessonCompletion(topic: Topic) {
  const { mode, progress } = useMode();
  const { completeLesson } = useApp();
  const done = Boolean(progress.lessons[topic.id]);
  const [justDone, setJustDone] = useState(false);
  const complete = () => {
    if (done) return;
    if (completeLesson(mode, topic.id)) setJustDone(true);
  };
  return { done, justDone, complete };
}

function KidsLesson({ topic, lesson }: { topic: Topic; lesson: Lesson }) {
  const navigate = useNavigate();
  const p = paths('kids');
  const [card, setCard] = useState(0);
  const { done, justDone, complete } = useLessonCompletion(topic);
  const total = lesson.sections.length + 1; // + summary card
  const isSummary = card === lesson.sections.length;
  const section = lesson.sections[card];
  const tone = tones[topic.tone];

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={p.learn} className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-fun text-sm font-semibold text-slate-600 shadow-sm hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All topics
      </Link>
      <div className="mb-4 flex items-center gap-3">
        <span className={cn('grid size-14 place-items-center rounded-2xl text-4xl', tone.soft)} aria-hidden>
          {topic.emoji}
        </span>
        <div>
          <h1 className="font-fun text-3xl font-semibold text-ink">{lesson.title}</h1>
          <p className="text-slate-600">{lesson.intro}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2" aria-label={`Card ${card + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cn('h-2.5 flex-1 rounded-full transition', i <= card ? 'bg-emerald-500' : 'bg-emerald-100')} />
        ))}
      </div>

      <Card className="relative min-h-[340px] overflow-hidden border-2 border-emerald-100">
        {justDone && <Confetti count={36} />}
        <AnimatePresence mode="wait">
          <motion.div key={card} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }} className="p-6 sm:p-8">
            {!isSummary && section ? (
              <div className="text-center">
                <div className="mb-3 text-7xl" aria-hidden>
                  {section.emoji}
                </div>
                <h2 className="font-fun text-2xl font-semibold text-ink sm:text-3xl">{section.heading}</h2>
                <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-slate-700">{section.body}</p>
                {section.fact && (
                  <p className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-left font-semibold text-amber-900">
                    <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-500" aria-hidden />
                    <span>
                      <span className="font-fun">Did you know? </span>
                      {section.fact}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Mascot mood={done ? 'cheer' : 'happy'} className="size-28" />
                <h2 className="mt-2 font-fun text-2xl font-semibold text-ink">Great reading!</h2>
                <p className="mt-2 max-w-md text-lg text-slate-700">{lesson.takeaway}</p>
                {done ? (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-fun font-semibold text-emerald-800">
                    <CircleCheck className="size-5" aria-hidden /> {justDone ? `+${GAMIFICATION.lessonXp} Eco Stars earned!` : 'Lesson complete'}
                  </p>
                ) : (
                  <Button size="xl" chunky className="mt-5" onClick={complete} icon={<Check className="size-5" aria-hidden />}>
                    I learned it! +{GAMIFICATION.lessonXp} ⭐
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="outline" size="lg" chunky onClick={() => setCard((c) => Math.max(0, c - 1))} disabled={card === 0} icon={<ArrowLeft className="size-5" aria-hidden />}>
          Back
        </Button>
        {!isSummary ? (
          <Button size="lg" chunky onClick={() => setCard((c) => Math.min(total - 1, c + 1))} iconRight={<ArrowRight className="size-5" aria-hidden />}>
            Next
          </Button>
        ) : (
          <Button size="lg" chunky className="bg-orange-500 hover:bg-orange-600" style={{ '--btn-shadow-color': '#c2410c' } as CSSProperties} onClick={() => navigate(p.generatorFor(topic.id))} icon={<Zap className="size-5" aria-hidden />}>
            Quiz me!
          </Button>
        )}
      </div>
    </div>
  );
}

function PlusLesson({ topic, lesson }: { topic: Topic; lesson: Lesson }) {
  const p = paths('plus');
  const { progress } = useMode();
  const { done, justDone, complete } = useLessonCompletion(topic);
  const tone = tones[topic.tone];
  const mastery = topicMastery(progress, topic.id);
  const stat = progress.topicStats[topic.id];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article className="min-w-0">
        <Link to={p.learn} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Learn
        </Link>
        <div className={cn('mb-6 rounded-card bg-gradient-to-br p-6 text-white', tone.gradient)}>
          <p className="text-sm font-bold opacity-90">
            <span aria-hidden>{topic.emoji}</span> {topic.name}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{lesson.title}</h1>
          <p className="mt-2 max-w-2xl text-white/90">{lesson.intro}</p>
        </div>

        {lesson.keyStats && (
          <dl className="mb-6 grid gap-3 sm:grid-cols-3">
            {lesson.keyStats.map((k) => (
              <Card key={k.label} className="p-4">
                <dt className="sr-only">{k.label}</dt>
                <dd>
                  <span className="block text-2xl font-black text-ink">{k.value}</span>
                  <span className="mt-1 block text-sm text-slate-600">{k.label}</span>
                </dd>
              </Card>
            ))}
          </dl>
        )}

        <div className="space-y-4">
          {lesson.sections.map((sec, i) => (
            <Card key={sec.heading} className="p-5 sm:p-6">
              <h2 className="flex items-center gap-3 text-lg font-extrabold text-ink">
                <span className="grid size-7 place-items-center rounded-lg bg-teal-50 text-sm font-black text-teal-700">{i + 1}</span>
                {sec.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-700">{sec.body}</p>
              {sec.bullets && (
                <ul className="mt-3 space-y-1.5">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[15px] text-slate-700">
                      <Check className="mt-1 size-4 shrink-0 text-teal-600" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lesson.mythFact && (
            <Card className="p-5">
              <h2 className="mb-3 font-extrabold text-ink">Myth vs fact</h2>
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900">
                <span className="font-bold">Myth: </span>
                {lesson.mythFact.myth}
              </p>
              <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                <span className="font-bold">Fact: </span>
                {lesson.mythFact.fact}
              </p>
            </Card>
          )}
          {lesson.keyTerms && (
            <Card className="p-5">
              <h2 className="mb-3 font-extrabold text-ink">Key terms</h2>
              <dl className="space-y-2 text-sm">
                {lesson.keyTerms.map((t) => (
                  <div key={t.term}>
                    <dt className="font-bold text-ink">{t.term}</dt>
                    <dd className="text-slate-600">{t.definition}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </div>

        <Card className="relative mt-6 overflow-hidden border-teal-200 bg-teal-50/60 p-5">
          {justDone && <Confetti count={20} />}
          <p className="flex items-start gap-2 font-semibold text-teal-900">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
            {lesson.takeaway}
          </p>
        </Card>
      </article>

      <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <p className="text-sm font-bold text-slate-500">Topic mastery</p>
          <p className="mt-1 text-3xl font-black text-ink tabular">{Math.round(mastery * 100)}%</p>
          <ProgressBar value={mastery} className="mt-2" label="Topic mastery" />
          <p className="mt-2 text-xs text-slate-500">{stat ? `${stat.correct}/${stat.answered} correct across ${stat.quizzes} quiz${stat.quizzes === 1 ? '' : 'zes'}` : 'No quizzes on this topic yet.'}</p>
          <div className="mt-4 space-y-2">
            {done ? (
              <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
                <CircleCheck className="size-4" aria-hidden /> {justDone ? `Completed · +${GAMIFICATION.lessonXp} XP` : 'Lesson completed'}
              </p>
            ) : (
              <Button variant="secondary" full onClick={complete} icon={<BookOpen className="size-4" aria-hidden />}>
                Mark as complete · +{GAMIFICATION.lessonXp} XP
              </Button>
            )}
            <Link to={p.generatorFor(topic.id)} className={buttonClasses({ full: true })}>
              <Zap className="size-4" aria-hidden /> Generate a quiz
            </Link>
          </div>
        </Card>
        <Card className="p-5">
          <p className="mb-2 text-sm font-bold text-slate-500">Reinforce with a challenge</p>
          <div className="space-y-2">
            {topic.games.map((g) => {
              const def = getGame(g);
              return (
                <Link key={g} to={p.game(g)} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-ink hover:border-teal-300 hover:bg-teal-50/50">
                  <span className="text-xl" aria-hidden>
                    {def.emoji}
                  </span>
                  {def.name}
                  <ArrowRight className="ml-auto size-4 text-slate-400" aria-hidden />
                </Link>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-500">
            <Sparkles className="size-4 text-violet-500" aria-hidden /> Related topics
          </p>
          <div className="flex flex-wrap gap-2">
            {topic.related.map((id) => {
              const t = getTopic(id);
              return t ? (
                <Link key={id} to={p.lesson(id)}>
                  <Pill className={cn(tones[t.tone].chip, 'hover:brightness-95')}>
                    {t.emoji} {t.name}
                  </Pill>
                </Link>
              ) : null;
            })}
          </div>
        </Card>
      </aside>
    </div>
  );
}
