import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { getTopic, getTopics } from '@/data';
import { formatDuration, formatRelative } from '@/engine/dates';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import type { QuizAttempt } from '@/types';
import { EmptyState } from '../ui/Card';
import { difficultyStyles } from '../ui/tones';

/** Previous quiz attempts with a topic filter; each row opens the full review. */
export function AttemptHistory({ attempts, limit = 20 }: { attempts: QuizAttempt[]; limit?: number }) {
  const [topic, setTopic] = useState('all');
  const list = attempts.filter((a) => topic === 'all' || a.topicId === topic).slice(0, limit);
  if (!attempts.length) return <EmptyState icon="📝" title="No attempts yet" body="Generate your first quiz above — every attempt is saved here." />;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <label htmlFor="history-topic" className="text-sm font-semibold text-slate-600">
          Topic
        </label>
        <select id="history-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="h-9 rounded-lg border border-line bg-white px-2 text-sm font-semibold text-ink">
          <option value="all">All topics</option>
          {getTopics('plus').map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-2.5">
                Topic
              </th>
              <th scope="col" className="px-4 py-2.5">
                Difficulty
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                Score
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                Accuracy
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                XP
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                Time
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                When
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((a) => (
              <tr key={a.id} className="bg-white hover:bg-teal-50/40">
                <td className="px-4 py-2.5">
                  <Link to={paths('plus').results(a.id)} className="flex items-center gap-2 font-bold text-ink hover:text-teal-700 hover:underline">
                    <span aria-hidden>{getTopic(a.topicId)?.emoji}</span>
                    {a.topicName}
                    {a.source === 'ai' && <Sparkles className="size-3.5 text-violet-500" aria-label="AI-generated" />}
                    {a.isDaily && <span className="rounded bg-gold-100 px-1.5 text-[10px] font-bold text-gold-700 uppercase">Daily</span>}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', difficultyStyles[a.difficulty].chip)}>{difficultyStyles[a.difficulty].label}</span>
                </td>
                <td className="px-4 py-2.5 text-right tabular">
                  {a.score}/{a.total}
                </td>
                <td className={cn('px-4 py-2.5 text-right font-bold tabular', a.accuracy >= 0.8 ? 'text-emerald-700' : a.accuracy >= 0.6 ? 'text-amber-700' : 'text-rose-600')}>{Math.round(a.accuracy * 100)}%</td>
                <td className="px-4 py-2.5 text-right tabular">+{a.xpEarned}</td>
                <td className="px-4 py-2.5 text-right text-slate-500 tabular">{formatDuration(a.timeTakenMs)}</td>
                <td className="px-4 py-2.5 text-right text-slate-500">{formatRelative(a.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!list.length && <p className="mt-3 text-sm text-slate-500">No attempts for this topic yet.</p>}
    </div>
  );
}
