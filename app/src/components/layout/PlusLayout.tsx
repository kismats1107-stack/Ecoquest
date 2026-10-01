import { Award, BookOpen, ChartColumn, Coins, Flame, LayoutDashboard, ListChecks, Menu, Trophy, User, Zap, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { currentStreak } from '@/engine/gamification/streak';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/context';
import { Logo } from '../brand/Logo';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/Progress';
import { AccountMenu, LogoutButton } from './AccountMenu';
import { CelebrationLayer } from './CelebrationLayer';
import { ModeGuard } from './ModeGuard';

type NavKey = 'dashboard' | 'learn' | 'quizzes' | 'challenges' | 'leaderboard' | 'badges' | 'progress' | 'profile';
const NAV: { to: string; key: NavKey; icon: LucideIcon; end?: boolean }[] = [
  { to: '/plus', key: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/plus/learn', key: 'learn', icon: BookOpen },
  { to: '/plus/quizzes', key: 'quizzes', icon: ListChecks },
  { to: '/plus/challenges', key: 'challenges', icon: Zap },
  { to: '/plus/leaderboard', key: 'leaderboard', icon: Trophy },
  { to: '/plus/badges', key: 'badges', icon: Award },
  { to: '/plus/progress', key: 'progress', icon: ChartColumn },
  { to: '/plus/profile', key: 'profile', icon: User },
];
const PRIMARY_MOBILE: NavKey[] = ['dashboard', 'learn', 'quizzes', 'challenges'];

function PlusShell() {
  const s = useStrings();
  const { profile, today } = useApp();
  const { progress } = useMode();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const level = levelFromXp(progress.xp);
  const rank = rankFor('plus', level.level);
  const streak = currentStreak(progress.streak, today);
  const secondaryActive = NAV.some((n) => !PRIMARY_MOBILE.includes(n.key) && location.pathname.startsWith(n.to));

  return (
    <div data-mode="plus" className="min-h-dvh bg-page">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        {s.nav.skipToContent}
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <Link to="/plus" className="flex h-16 items-center px-5" aria-label="EcoQuest 15+ dashboard">
          <Logo variant="plus" />
        </Link>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {NAV.map(({ to, key, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                      isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('size-[18px]', isActive ? 'text-teal-700' : 'text-slate-400')} aria-hidden />
                      {s.nav[key]}
                      {isActive && <span className="ml-auto size-1.5 rounded-full bg-teal-600" aria-hidden />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {profile && (
          <div className="m-3 rounded-2xl border border-line bg-slate-50/60 p-3">
            <Link to="/plus/profile" className="block rounded-xl transition hover:opacity-80">
              <div className="flex items-center gap-3">
                <Avatar avatarId={profile.avatarId} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{profile.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    Level {level.level} · {rank.name}
                  </p>
                </div>
              </div>
              <ProgressBar value={level.progress} className="mt-3" height="h-1.5" label="Progress to next level" />
            </Link>
            <LogoutButton compact className="mt-2 w-full" />
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Link to="/plus" aria-label="EcoQuest 15+ dashboard">
          <Logo variant="plus" />
        </Link>
        <div className="ml-auto flex items-center gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-1 text-gold-700" title={s.common.coins}>
            <Coins className="size-4" aria-hidden />
            <span className="tabular">{progress.coins}</span>
            <span className="sr-only">{s.common.coins}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-orange-600" title={s.common.streak}>
            <Flame className="size-4" aria-hidden />
            <span className="tabular">{streak}</span>
            <span className="sr-only">day streak</span>
          </span>
          {profile && (
            <span className="ml-1">
              <AccountMenu size="xs" />
            </span>
          )}
        </div>
      </header>

      <main id="main" className="px-4 pt-5 pb-28 sm:px-6 lg:ml-64 lg:px-10 lg:pt-8 lg:pb-12">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Floating Bottom Dock inspired by Image 2 Screen 2 */}
      <nav aria-label="Main" className="fixed bottom-3 inset-x-3 z-40 mx-auto max-w-md rounded-full border-2 border-slate-900 bg-white/95 p-1 shadow-[0_5px_0_#0f172a] backdrop-blur-md lg:hidden">
        <ul className="flex items-center justify-around">
          {NAV.filter((n) => PRIMARY_MOBILE.includes(n.key)).map(({ to, key, icon: Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-black transition',
                    isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-ink',
                  )
                }
              >
                <Icon className="size-4" aria-hidden />
                <span>{s.nav[key]}</span>
              </NavLink>
            </li>
          ))}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                'flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-black transition',
                secondaryActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-ink',
              )}
              aria-haspopup="dialog"
            >
              <Menu className="size-4" aria-hidden />
              <span>{s.nav.more}</span>
            </button>
          </li>
        </ul>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <ul className="grid grid-cols-2 gap-2">
          {NAV.filter((n) => !PRIMARY_MOBILE.includes(n.key)).map(({ to, key, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-line px-3 py-3 text-sm font-semibold text-ink hover:border-teal-300 hover:bg-teal-50"
              >
                <Icon className="size-5 text-teal-700" aria-hidden />
                {s.nav[key]}
              </Link>
            </li>
          ))}
        </ul>
        <LogoutButton className="mt-3 w-full" />
      </Modal>
      <CelebrationLayer />
    </div>
  );
}

export function PlusLayout() {
  return (
    <ModeGuard mode="plus">
      <PlusShell />
    </ModeGuard>
  );
}
