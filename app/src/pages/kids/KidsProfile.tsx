import { Coins, Flame, Gamepad2, ListChecks, Star, Target } from 'lucide-react';
import { DataSettings, ExperienceSwitcher, ProfileHeader } from '@/components/profile/ProfileControls';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { tones } from '@/components/ui/tones';
import { getTopics } from '@/data';
import { currentStreak } from '@/engine/gamification/streak';
import { overallAccuracy, topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';

export default function KidsProfile() {
  const { today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Profile');
  const stats = [
    { icon: <Star className="size-6 fill-amber-400 text-amber-500" aria-hidden />, label: 'Eco Stars', value: progress.xp },
    { icon: <Coins className="size-6 text-gold-600" aria-hidden />, label: 'Coins', value: progress.coins },
    { icon: <Flame className="size-6 fill-orange-400 text-orange-500" aria-hidden />, label: 'Day streak', value: currentStreak(progress.streak, today) },
    { icon: <ListChecks className="size-6 text-sky-600" aria-hidden />, label: 'Quizzes', value: progress.stats.quizzesCompleted },
    { icon: <Target className="size-6 text-emerald-600" aria-hidden />, label: 'Right answers', value: progress.stats.correctAnswers },
    { icon: <Gamepad2 className="size-6 text-violet-600" aria-hidden />, label: 'Games won', value: progress.stats.gamesWon },
  ];
  const badges = Object.keys(progress.badges).length;

  return (
    <div className="space-y-6">
      <ProfileHeader mode="kids" />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((st) => (
          <li key={st.label} className="flex flex-col items-center rounded-3xl border-2 border-slate-100 bg-white p-4 text-center">
            {st.icon}
            <span className="mt-1 font-fun text-2xl font-semibold text-ink tabular">{st.value.toLocaleString('en')}</span>
            <span className="text-sm font-semibold text-slate-500">{st.label}</span>
          </li>
        ))}
      </ul>

      <Card id="progress" className="scroll-mt-24 border-2 border-emerald-100 p-5 sm:p-6">
        <h2 className="font-fun text-2xl font-semibold text-ink">🌿 My Nature Progress</h2>
        <p className="mb-4 text-slate-600">
          {progress.stats.questionsAnswered > 0
            ? `You get ${Math.round(overallAccuracy(progress) * 100)}% of answers right — and you have ${badges} badge${badges === 1 ? '' : 's'}!`
            : 'Play a quiz to start growing your garden of knowledge!'}
        </p>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {getTopics('kids').map((t) => {
            const m = topicMastery(progress, t.id);
            return (
              <li key={t.id}>
                <div className="mb-1 flex items-center justify-between font-fun text-lg font-semibold">
                  <span>
                    <span aria-hidden>{t.emoji}</span> {t.name}
                  </span>
                  <span className="text-slate-600 tabular">{Math.round(m * 100)}%</span>
                </div>
                <ProgressBar value={m} height="h-4" barClassName={tones[t.tone].bar} trackClassName="bg-slate-100" label={`${t.name} progress`} />
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ExperienceSwitcher mode="kids" />
        <DataSettings mode="kids" />
      </div>
    </div>
  );
}
