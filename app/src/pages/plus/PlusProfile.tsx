import { Coins, Crosshair, Flame, ListChecks, Star } from 'lucide-react';
import { Link } from 'react-router';
import { DataSettings, ExperienceSwitcher, ProfileHeader } from '@/components/profile/ProfileControls';
import { StatTile } from '@/components/plus/StatTile';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { Card, SectionHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { levelFromXp } from '@/engine/gamification/levels';
import { overallAccuracy } from '@/engine/gamification/progress';
import { currentStreak } from '@/engine/gamification/streak';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

export default function PlusProfile() {
  const { today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Profile');
  const level = levelFromXp(progress.xp);
  const st = progress.stats;

  return (
    <div className="space-y-6">
      <ProfileHeader mode="plus" />

      <section aria-label="Profile statistics" className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="XP" icon={<Star className="size-4" />} value={progress.xp.toLocaleString('en')} sub={`Level ${level.level}`}>
          <ProgressBar value={level.progress} className="mt-2" height="h-1.5" label="Level progress" />
        </StatTile>
        <StatTile label="Coins" icon={<Coins className="size-4" />} value={progress.coins.toLocaleString('en')} />
        <StatTile label="Streak" icon={<Flame className="size-4" />} value={`${currentStreak(progress.streak, today)} days`} sub={`Best ${progress.streak.best}`} />
        <StatTile label="Accuracy" icon={<Crosshair className="size-4" />} value={st.questionsAnswered ? `${Math.round(overallAccuracy(progress) * 100)}%` : '—'} />
        <StatTile label="Quizzes" icon={<ListChecks className="size-4" />} value={st.quizzesCompleted} sub={`${st.questionsAnswered} questions · ${st.hintsUsed} hints`} />
      </section>

      <Card className="p-5 sm:p-6">
        <SectionHeader title="Badges" action={<Link to={paths('plus').rewards} className="text-sm font-semibold text-teal-700 hover:underline">All badges</Link>} />
        <BadgeGrid mode="plus" progress={progress} filter="unlocked" limit={6} />
        {Object.keys(progress.badges).length === 0 && <p className="text-sm text-slate-500">No badges yet — complete your first quiz to earn Eco Starter.</p>}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ExperienceSwitcher mode="plus" />
        <DataSettings mode="plus" />
      </div>
    </div>
  );
}
