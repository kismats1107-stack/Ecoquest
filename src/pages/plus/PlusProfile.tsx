import {
  Award,
  CheckCircle2,
  Coins,
  Globe2,
  Leaf,
  ListChecks,
  Recycle,
  Sparkles,
  TrendingUp,
  Wind,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { DataSettings, ExperienceSwitcher } from '@/components/profile/ProfileControls';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

export default function PlusProfile() {
  const { profile, updateProfile } = useApp();
  const { progress } = useMode();
  const [editOpen, setEditOpen] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name ?? 'Yatri Dekivadiya');
  useDocumentTitle('Profile · EcoQuest 15+');

  const level = levelFromXp(progress.xp);
  const rank = rankFor('plus', level.level);
  const p = paths('plus');

  const topicProgress = [
    { title: 'Climate Change', pct: topicMastery(progress, 'climate-change') || 80, color: 'bg-[#52B788]', icon: Globe2 },
    { title: 'Biodiversity', pct: topicMastery(progress, 'biodiversity-ecosystems') || 60, color: 'bg-[#7E57C2]', icon: Leaf },
    { title: 'Renewable Energy', pct: topicMastery(progress, 'renewable-energy') || 40, color: 'bg-[#29B6F6]', icon: Wind },
    { title: 'Waste Management', pct: topicMastery(progress, 'circular-economy-waste') || 70, color: 'bg-[#FFA726]', icon: Recycle },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
    }
    setEditOpen(false);
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Top Header Card (Matching Earthly Screen 6) */}
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar avatarId={String(profile?.avatarId ?? '1')} size="lg" className="ring-4 ring-[#2D6A4F]/20 shadow-md" />
              <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-[#13382B] text-white shadow text-xs">
                🌱
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {profile?.name ?? 'Yatri Dekivadiya'}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Sparkles className="size-3 text-emerald-600" /> {rank.name}
                </span>
                <span className="text-xs font-semibold text-slate-500">· EcoQuest 15+</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 4 Stat Tiles Row (Level, Total Points, Quizzes, Badges) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Level */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Level</span>
            <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            Level {level.level}
          </p>
          <span className="mt-1 block text-xs font-bold text-[#2D6A4F]">{rank.name}</span>
        </div>

        {/* Tile 2: Total Points */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Points</span>
            <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Coins className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tabular">
            {progress.xp.toLocaleString('en')}
          </p>
          <span className="mt-1 block text-xs font-semibold text-slate-500">Lifetime points</span>
        </div>

        {/* Tile 3: Quizzes */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quizzes</span>
            <div className="flex size-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <ListChecks className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tabular">
            {progress.attempts.length || 12}
          </p>
          <span className="mt-1 block text-xs font-semibold text-slate-500">Completed tests</span>
        </div>

        {/* Tile 4: Badges */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Badges</span>
            <div className="flex size-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Award className="size-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tabular">
            {progress.badges.length || 4}
          </p>
          <span className="mt-1 block text-xs font-semibold text-slate-500">Earned achievements</span>
        </div>
      </div>

      {/* Progress Overview (Matching Earthly Screen 6) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Progress Overview
          </h2>
          <Link to={p.progress} className="text-xs font-black text-[#2D6A4F] hover:underline">
            View Details →
          </Link>
        </div>

        <div className="space-y-4">
          {topicProgress.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-slate-500" />
                    <span>{item.title}</span>
                  </div>
                  <span className="font-mono text-slate-600">{item.pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mb-4">
          Recent Activity
        </h2>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Completed Climate Change Quiz</p>
                <p className="text-[11px] font-semibold text-slate-400">2 hours ago</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">+100 pts</span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                <Award className="size-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Earned Green Warrior Badge</p>
                <p className="text-[11px] font-semibold text-slate-400">1 day ago</p>
              </div>
            </div>
            <span className="text-xs font-black text-purple-800 bg-purple-50 px-3 py-1 rounded-full">+300 pts</span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Reached Level 3 (Eco Learner)</p>
                <p className="text-[11px] font-semibold text-slate-400">2 days ago</p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full">+500 pts</span>
          </div>
        </div>
      </div>

      {/* Switcher & Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExperienceSwitcher mode="plus" />
        <DataSettings mode="plus" />
      </div>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-bold text-slate-700 mb-1">
              Your Name
            </label>
            <input
              id="name-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-[#2D6A4F] focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-full px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#13382B] px-5 py-2 text-xs font-black text-white hover:bg-[#1B4332]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
