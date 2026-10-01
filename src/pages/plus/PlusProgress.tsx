import { CircleCheck, Crosshair, Gamepad2, ListChecks, MessageCircleQuestion, Star } from 'lucide-react';
import { BarList } from '@/components/charts/BarList';
import { ColumnChart } from '@/components/charts/ColumnChart';
import { LineChart } from '@/components/charts/LineChart';
import { AttemptHistory } from '@/components/plus/AttemptHistory';
import { StatTile } from '@/components/plus/StatTile';
import { Card, EmptyState, SectionHeader } from '@/components/ui/Card';
import { difficultyStyles } from '@/components/ui/tones';
import { getTopics } from '@/data';
import { lastNDays, parseDateKey } from '@/engine/dates';
import { overallAccuracy } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';
import type { Difficulty } from '@/types';

export default function PlusProgress() {
  const { today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Progress');
  const st = progress.stats;
  const topics = getTopics('plus');

  const trend = progress.attempts
    .slice(0, 12)
    .reverse()
    .map((a) => ({
      label: new Date(a.completedAt).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
      value: a.accuracy * 100,
      detail: `${a.topicName} · ${difficultyStyles[a.difficulty].label} · ${new Date(a.completedAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}`,
    }));

  const byDifficulty = (['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
    let answered = 0;
    let correct = 0;
    for (const a of progress.attempts) {
      a.questions.forEach((q, i) => {
        if (q.difficulty !== d) return;
        answered++;
        if (a.answers[i]?.correct) correct++;
      });
    }
    return { d, answered, correct };
  });

  const days = lastNDays(14, today);

  return (
    <div className="space-y-6">
      <SectionHeader as="h1" title="Progress" subtitle="Your learning analytics across every topic, quiz and challenge." />

      <section aria-label="Summary statistics" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Overall accuracy" icon={<Crosshair className="size-4" />} value={st.questionsAnswered ? `${Math.round(overallAccuracy(progress) * 100)}%` : '—'} />
        <StatTile label="Questions answered" icon={<MessageCircleQuestion className="size-4" />} value={st.questionsAnswered.toLocaleString('en')} />
        <StatTile label="Correct answers" icon={<CircleCheck className="size-4" />} value={st.correctAnswers.toLocaleString('en')} sub={`${st.fastAnswers} lightning-fast`} />
        <StatTile label="XP earned" icon={<Star className="size-4" />} value={st.xpEarned.toLocaleString('en')} sub={`${st.coinsEarned.toLocaleString('en')} coins earned`} />
        <StatTile label="Quizzes completed" icon={<ListChecks className="size-4" />} value={st.quizzesCompleted} sub={`${st.perfectQuizzes} perfect`} />
        <StatTile label="Challenges completed" icon={<Gamepad2 className="size-4" />} value={st.gamesPlayed} sub={`${st.gamesWon} won · ${st.dailyCompleted} daily`} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <SectionHeader title="Topic performance" subtitle="Accuracy by topic — hover a bar for details" />
          <BarList
            caption="Accuracy by topic"
            items={topics.map((t) => {
              const s = progress.topicStats[t.id];
              return { id: t.id, label: t.name, icon: t.emoji, value: s && s.answered ? s.correct / s.answered : null, detail: s ? `${s.correct}/${s.answered} correct · ${s.quizzes} quiz${s.quizzes === 1 ? '' : 'zes'}` : undefined };
            })}
          />
        </Card>
        <Card className="p-5 sm:p-6">
          <SectionHeader title="Accuracy trend" subtitle="Your last 12 quizzes, oldest to newest" />
          {trend.length ? <LineChart data={trend} caption="Quiz accuracy over recent attempts" /> : <EmptyState icon="📈" title="No quizzes yet" body="Complete a quiz to start your trend line." />}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <SectionHeader title="XP over the last 14 days" />
          <ColumnChart
            data={days.map((d) => ({
              label: parseDateKey(d).toLocaleDateString('en', { day: 'numeric' }),
              value: progress.dailyXp[d] ?? 0,
              title: parseDateKey(d).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }),
            }))}
            unit="XP"
            caption="XP earned per day over the last 14 days"
            highlightIndex={13}
          />
        </Card>
        <Card className="p-5 sm:p-6">
          <SectionHeader title="By difficulty" />
          <ul className="space-y-4">
            {byDifficulty.map(({ d, answered, correct }) => (
              <li key={d}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${difficultyStyles[d].chip}`}>{difficultyStyles[d].label}</span>
                  <span className="font-bold text-ink tabular">{answered ? `${Math.round((correct / answered) * 100)}%` : '—'}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${answered ? (correct / answered) * 100 : 0}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {correct}/{answered} correct
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <SectionHeader title="Quiz history" subtitle="Open any attempt to review questions, your answers and explanations." />
        <AttemptHistory attempts={progress.attempts} limit={40} />
      </Card>
    </div>
  );
}
