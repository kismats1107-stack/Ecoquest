import {
  Award,
  BookOpen,
  ChartColumn,
  Gamepad2,
  House,
  Leaf,
  Menu,
  Trophy,
  User,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/context';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { AccountMenu, LogoutButton } from './AccountMenu';
import { CelebrationLayer } from './CelebrationLayer';
import { ModeGuard } from './ModeGuard';

type NavKey = 'dashboard' | 'quizzes' | 'leaderboard' | 'badges' | 'progress' | 'learn' | 'challenges' | 'profile';

const NAV: { to: string; key: NavKey; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/plus', key: 'dashboard', label: 'Home', icon: House, end: true },
  { to: '/plus/quizzes', key: 'quizzes', label: 'Quizzes', icon: Gamepad2 },
  { to: '/plus/leaderboard', key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/plus/badges', key: 'badges', label: 'Badges', icon: Award },
  { to: '/plus/progress', key: 'progress', label: 'My Progress', icon: ChartColumn },
  { to: '/plus/learn', key: 'learn', label: 'Topics', icon: BookOpen },
  { to: '/plus/challenges', key: 'challenges', label: 'Challenges', icon: Zap },
  { to: '/plus/profile', key: 'profile', label: 'Profile', icon: User },
];

// 4 Primary icons matching floating bottom bar in Image 2 Screen 2
const FLOATING_DOCK = [
  { to: '/plus', label: 'Home', icon: House, end: true },
  { to: '/plus/quizzes', label: 'Quizzes', icon: Gamepad2, end: false },
  { to: '/plus/leaderboard', label: 'Leaderboard', icon: Trophy, end: false },
  { to: '/plus/profile', label: 'Profile', icon: User, end: false },
];

function PlusShell() {
  const s = useStrings();
  const { profile } = useApp();
  const { progress } = useMode();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const level = levelFromXp(progress.xp);
  const rank = rankFor('plus', level.level);
  const secondaryActive = NAV.some(
    (n) => !['dashboard', 'quizzes', 'leaderboard', 'profile'].includes(n.key) && location.pathname.startsWith(n.to),
  );

  return (
    <div data-mode="plus" className="min-h-dvh bg-[#F7F2EB] text-slate-900 selection:bg-[#52B788] selection:text-white font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        {s.nav.skipToContent}
      </a>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white text-slate-900 lg:flex shadow-xs">
        {/* Brand Header */}
        <Link to="/plus" className="flex h-20 items-center gap-3 px-6" aria-label="EcoQuest 15+ dashboard">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-sm">
            <Leaf className="size-5 text-[#95D5B2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">EcoQuest</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                15+
              </span>
            </div>
            <span className="block text-[11px] font-semibold text-slate-400">Play, Learn & Win</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <ul className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-150',
                      isActive
                        ? 'bg-slate-950 text-white shadow-sm font-black'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )
                  }
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Card in Desktop Sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-full overflow-hidden ring-2 ring-emerald-500">
                <Avatar avatarId={profile?.avatarId ?? 'owl'} size="sm" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {profile?.name ? profile.name.split(' ')[0] : 'Alex'}
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                  {rank.emoji} {rank.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-slate-900 bg-white px-2 py-1 rounded-full border border-slate-200">
              <span>💎</span>
              <span>{progress.coins > 0 ? progress.coins : 20}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <Link to="/plus" className="flex items-center gap-2" aria-label="EcoQuest 15+ dashboard">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#2D6A4F] text-white">
            <Leaf className="size-4 text-[#95D5B2]" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">EcoQuest 15+</span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold">
          {/* Diamonds pill */}
          <div className="flex items-center gap-1 rounded-full bg-[#FAF7F2] border border-slate-200 px-2.5 py-1 text-xs font-black text-slate-900">
            <span>💎</span>
            <span className="tabular">{progress.coins > 0 ? progress.coins : 20}</span>
          </div>

          {profile && <AccountMenu size="xs" />}
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main" className="px-4 pt-6 pb-28 sm:px-6 lg:ml-64 lg:px-10 lg:pt-8 lg:pb-12">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>

      {/* FLOATING WHITE BOTTOM PILL NAVIGATION BAR MATCHING IMAGE 2 SCREEN 2 */}
      <nav
        aria-label="Floating Navigation"
        className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-sm rounded-full bg-white/95 p-2 shadow-2xl backdrop-blur-md border border-slate-200/80 lg:hidden"
      >
        <ul className="flex items-center justify-around gap-1">
          {FLOATING_DOCK.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="flex-1 flex justify-center">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-center rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-slate-950 text-white px-4 py-2 shadow-md gap-1.5'
                      : 'text-slate-400 hover:text-slate-900 size-10',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="size-5" aria-hidden />
                    {isActive && <span className="text-xs font-black">{label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* More items toggle */}
          <li className="flex justify-center">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                'flex items-center justify-center size-10 rounded-full transition-all',
                secondaryActive ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-900',
              )}
              aria-label="More navigation options"
            >
              <Menu className="size-5" />
            </button>
          </li>
        </ul>
      </nav>

      {/* More Modal */}
      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="Explore EcoQuest 15+">
        <ul className="grid grid-cols-2 gap-2">
          {NAV.filter((n) => !['dashboard', 'quizzes', 'leaderboard', 'profile'].includes(n.key)).map(
            ({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-bold text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 shadow-xs"
                >
                  <Icon className="size-5 text-[#2D6A4F]" aria-hidden />
                  {label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <LogoutButton className="mt-4 w-full" />
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
