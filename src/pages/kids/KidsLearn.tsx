import { motion } from 'framer-motion';
import { BookOpen, CircleCheck, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { buttonClasses } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { tones } from '@/components/ui/tones';
import { getTopics } from '@/data';
import { topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';

export default function KidsLearn() {
  const { progress } = useMode();
  useDocumentTitle('Learn');
  const p = paths('kids');

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-fun text-3xl font-semibold text-ink sm:text-4xl">📚 What do you want to learn today?</h1>
        <p className="mt-1 text-lg text-slate-600">Read the picture cards, then test yourself with a quiz!</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getTopics('kids').map((t, i) => {
          const tone = tones[t.tone];
          const mastery = topicMastery(progress, t.id);
          const read = Boolean(progress.lessons[t.id]);
          return (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn('flex flex-col rounded-[1.75rem] border-2 bg-white p-4 shadow-card', tone.border)}
            >
              <div className={cn('mb-3 grid h-28 place-items-center rounded-3xl bg-gradient-to-br', tone.gradient)}>
                <span className="text-6xl drop-shadow" aria-hidden>
                  {t.emoji}
                </span>
              </div>
              <h2 className="font-fun text-xl font-semibold text-ink">{t.name}</h2>
              <p className="text-sm text-slate-600">{t.tagline}</p>
              <div className="mt-3">
                <ProgressBar value={mastery} barClassName={tone.bar} trackClassName="bg-slate-100" label={`${t.name} progress`} />
                <p className="mt-1 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{Math.round(mastery * 100)}% explored</span>
                  {read && (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CircleCheck className="size-3.5" aria-hidden /> Read
                    </span>
                  )}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to={p.lesson(t.id)} className={buttonClasses({ variant: 'secondary', size: 'md', chunky: true })}>
                  <BookOpen className="size-4" aria-hidden /> Read
                </Link>
                <Link to={p.generatorFor(t.id)} className={buttonClasses({ size: 'md', chunky: true })}>
                  <Zap className="size-4" aria-hidden /> Quiz
                </Link>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
