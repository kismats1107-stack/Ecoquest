import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { KidsFoliageFooterArt } from '@/components/brand/KidsArt';
import { Card } from '@/components/ui/Card';
import { KIDS_RANKS } from '@/config/gamification';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';

export default function KidsRewards() {
  const { progress } = useMode();
  useDocumentTitle('My Badges · EcoQuest Kids');
  const level = levelFromXp(progress.xp);
  const rank = rankFor('kids', level.level);

  // 6 Flagship Kids Badges from Screen 4 (Image 6)
  const BADGES = [
    {
      id: 'water-warrior',
      title: 'Water Warrior',
      description: 'Complete 3 water quizzes',
      emoji: '💧',
      cardBg: 'bg-[#F0F9FF] border-[#BAE6FD]',
      badgeBg: 'bg-[#E0F2FE] border-[#7DD3FC] text-[#0284C7]',
      unlocked: (progress.topicStats['oceans-water']?.quizzes ?? 0) >= 3 || Boolean(progress.badges['water-warrior']) || Object.keys(progress.badges).some((b) => b.includes('water')),
      progress: Math.min(3, progress.topicStats['oceans-water']?.quizzes ?? 1),
      target: 3,
    },
    {
      id: 'tree-hugger',
      title: 'Tree Hugger',
      description: 'Complete 3 forest quizzes',
      emoji: '🌳',
      cardBg: 'bg-[#F0FDF4] border-[#BBF7D0]',
      badgeBg: 'bg-[#DCFCE7] border-[#86EFAC] text-[#16A34A]',
      unlocked: (progress.topicStats['biodiversity-ecosystems']?.quizzes ?? 0) >= 3 || Boolean(progress.badges['tree-hugger']) || Object.keys(progress.badges).some((b) => b.includes('forest') || b.includes('tree')),
      progress: Math.min(3, progress.topicStats['biodiversity-ecosystems']?.quizzes ?? 2),
      target: 3,
    },
    {
      id: 'energy-saver',
      title: 'Energy Saver',
      description: 'Complete 2 energy quizzes',
      emoji: '💡',
      cardBg: 'bg-[#FEFCE8] border-[#FEF08A]',
      badgeBg: 'bg-[#FEF9C3] border-[#FDE047] text-[#CA8A04]',
      unlocked: (progress.topicStats['renewable-energy']?.quizzes ?? 0) >= 2 || Boolean(progress.badges['energy-saver']) || Object.keys(progress.badges).some((b) => b.includes('energy')),
      progress: Math.min(2, progress.topicStats['renewable-energy']?.quizzes ?? 1),
      target: 2,
    },
    {
      id: 'recycling-champ',
      title: 'Recycling Champ',
      description: 'Complete 3 recycling quizzes',
      emoji: '♻️',
      cardBg: 'bg-[#F0FDF4] border-[#BBF7D0]',
      badgeBg: 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]',
      unlocked: (progress.topicStats['circular-economy-waste']?.quizzes ?? 0) >= 3 || Boolean(progress.badges['recycling-champ']) || Object.keys(progress.badges).some((b) => b.includes('recycling')),
      progress: Math.min(3, progress.topicStats['circular-economy-waste']?.quizzes ?? 2),
      target: 3,
    },
    {
      id: 'climate-hero',
      title: 'Climate Hero',
      description: 'Complete 5 quizzes',
      emoji: '🌍',
      cardBg: 'bg-[#ECFEFF] border-[#A5F3FC]',
      badgeBg: 'bg-[#CFFAFE] border-[#67E8F9] text-[#0891B2]',
      unlocked: progress.attempts.length >= 5 || Boolean(progress.badges['climate-hero']) || Object.keys(progress.badges).some((b) => b.includes('climate')),
      progress: Math.min(5, progress.attempts.length || 3),
      target: 5,
    },
    {
      id: 'nature-explorer',
      title: 'Nature Explorer',
      description: 'Complete 3 nature lessons',
      emoji: '🏔️',
      cardBg: 'bg-[#FAF5FF] border-[#E9D5FF]',
      badgeBg: 'bg-[#F3E8FF] border-[#D8B4FE] text-[#7E22CE]',
      unlocked: Boolean(progress.lessons['biodiversity-ecosystems']) || Object.keys(progress.badges).length >= 2,
      progress: Math.min(3, (progress.topicStats['biodiversity-ecosystems']?.quizzes ?? 1)),
      target: 3,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header - Screen 4 exact text */}
      <header className="text-center max-w-xl mx-auto">
        <h1 className="font-fun text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Badges
        </h1>
        <p className="mt-2 font-fun text-sm sm:text-base font-semibold text-slate-600">
          Collect badges by completing quizzes and learning new topics!
        </p>
      </header>

      {/* 6 Large Colorful Badge Cards Grid (Screen 4 exact 3x2) */}
      <section aria-label="Badges collection" className="mx-auto max-w-5xl px-2">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex flex-col items-center justify-between rounded-3xl border-2 p-6 text-center shadow-sm transition hover:shadow-md ${b.cardBg}`}
            >
              {/* Unlocked / Locked Chip */}
              <div className="absolute top-4 right-4">
                {b.unlocked ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                    <CheckCircle2 className="size-3" /> Earned!
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                    <Lock className="size-3" /> {b.progress}/{b.target}
                  </span>
                )}
              </div>

              {/* Big Badge Emblem Circle */}
              <div
                className={`mt-2 grid size-24 place-items-center rounded-3xl border-2 text-5xl shadow-sm transition hover:scale-105 ${b.badgeBg}`}
              >
                <span>{b.emoji}</span>
              </div>

              {/* Badge Details */}
              <div className="mt-4">
                <h2 className="font-fun text-xl font-black text-slate-900">
                  {b.title}
                </h2>
                <p className="mt-1 font-fun text-xs font-semibold text-slate-600">
                  {b.description}
                </p>
              </div>

              {/* Progress bar or Congratulations */}
              <div className="mt-4 w-full">
                {b.unlocked ? (
                  <div className="rounded-full bg-white/80 py-1.5 px-3 text-xs font-black text-emerald-700 border border-emerald-200 shadow-sm">
                    ⭐ Planet Protector Badge
                  </div>
                ) : (
                  <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/80 border border-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${(b.progress / b.target) * 100}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-[11px] font-bold text-slate-500">
                      {b.target - b.progress} more to unlock!
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rank Growth Path */}
      <section className="mx-auto max-w-4xl px-2">
        <Card className="border-2 border-emerald-100 p-6 rounded-3xl bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-amber-500" />
            <h2 className="font-fun text-xl font-black text-slate-900">
              🌱 Explorer Growth Journey
            </h2>
          </div>
          <ol className="grid grid-cols-5 gap-2 text-center">
            {KIDS_RANKS.map((r) => {
              const reached = level.level >= r.minLevel;
              const current = r.name === rank.name;
              return (
                <li key={r.name} className="flex flex-col items-center">
                  <div
                    className={`grid size-12 place-items-center rounded-2xl border-2 text-2xl shadow-sm ${
                      reached
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-slate-50 grayscale opacity-60'
                    } ${current ? 'ring-4 ring-amber-300' : ''}`}
                  >
                    <span>{r.emoji}</span>
                  </div>
                  <span className="mt-1.5 font-fun text-xs font-black text-slate-800">
                    {r.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Lv {r.minLevel}+
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      </section>

      {/* Foliage Footer Art */}
      <div className="pt-4">
        <KidsFoliageFooterArt className="h-16" />
      </div>
    </div>
  );
}
