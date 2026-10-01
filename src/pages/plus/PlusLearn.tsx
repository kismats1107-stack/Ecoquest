import { ArrowRight, CircleCheck, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { Card, SectionHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { tones } from '@/components/ui/tones';
import { getTopics } from '@/data';
import { topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';

export default function PlusLearn() {
  const { progress } = useMode();
  useDocumentTitle('Learn');
  const p = paths('plus');
  const topics = getTopics('plus');
  const read = topics.filter((t) => progress.lessons[t.id]).length;

  return (
    <div>
      <SectionHeader
        as="h1"
        title="Learn"
        subtitle="Concise briefings with key data, terms and myth-busting — then put them to the test."
        action={<span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-800">{read}/{topics.length} lessons completed</span>}
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((t) => {
          const tone = tones[t.tone];
          const m = topicMastery(progress, t.id);
          const done = Boolean(progress.lessons[t.id]);
          const stat = progress.topicStats[t.id];
          return (
            <li key={t.id}>
              <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className={cn('flex items-center gap-3 bg-gradient-to-br px-5 py-4 text-white', tone.gradient)}>
                  <span className="text-3xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold">{t.name}</h2>
                    <p className="truncate text-sm text-white/90">{t.tagline}</p>
                  </div>
                  {done && <CircleCheck className="ml-auto size-5 shrink-0" aria-label="Lesson completed" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-slate-600">{t.summary}</p>
                  <div className="mt-auto pt-4">
                    <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                      <span>Mastery</span>
                      <span className="tabular">{stat ? `${Math.round(m * 100)}%` : 'Not started'}</span>
                    </div>
                    <ProgressBar value={m} height="h-1.5" barClassName={tone.bar} trackClassName="bg-slate-100" label={`${t.name} mastery`} />
                    <div className="mt-4 flex gap-2">
                      <Link to={p.lesson(t.id)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-line px-3 py-2 text-sm font-bold text-ink hover:border-teal-400">
                        Read lesson <ArrowRight className="size-4" aria-hidden />
                      </Link>
                      <Link to={p.generatorFor(t.id)} className="inline-flex items-center justify-center gap-1.5 rounded-btn bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-strong">
                        <Zap className="size-4" aria-hidden /> Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
