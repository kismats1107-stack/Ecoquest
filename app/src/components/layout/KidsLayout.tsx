import { BookOpen, Coins, Flame, Gamepad2, House, Star, Trophy, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, Outlet, Link } from 'react-router';
import { currentStreak } from '@/engine/gamification/streak';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/context';
import { Logo } from '../brand/Logo';
import { AccountMenu } from './AccountMenu';
import { CelebrationLayer } from './CelebrationLayer';
import { ModeGuard } from './ModeGuard';

const NAV = [
  { to: '/kids', key: 'home', icon: House, end: true, color: 'text-emerald-600' },
  { to: '/kids/learn', key: 'learn', icon: BookOpen, end: false, color: 'text-sky-600' },
  { to: '/kids/play', key: 'play', icon: Gamepad2, end: false, color: 'text-orange-500' },
  { to: '/kids/rewards', key: 'rewards', icon: Trophy, end: false, color: 'text-amber-500' },
  { to: '/kids/profile', key: 'profile', icon: User, end: false, color: 'text-violet-600' },
] as const;

function StatChip({ icon, value, label, className }: { icon: ReactNode; value: number; label: string; className: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-2.5 py-1 text-sm font-extrabold sm:px-3', className)} title={label}>
      {icon}
      <span className="tabular">{value.toLocaleString('en')}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function KidsShell() {
  const s = useStrings();
  const { today } = useApp();
  const { progress } = useMode();
  const streak = currentStreak(progress.streak, today);

  return (
    <div data-mode="kids" className="bg-kids-sky min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        {s.nav.skipToContent}
      </a>
      <header className="sticky top-0 z-30 border-b-2 border-emerald-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/kids" className="shrink-0 rounded-xl" aria-label="EcoQuest Kids home">
            <span className="hidden sm:inline">
              <Logo variant="kids" />
            </span>
            <span className="sm:hidden">
              <Logo variant="kids" className="[&>span:last-child]:hidden" />
            </span>
          </Link>
          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, key, icon: Icon, end, color }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn('font-fun flex items-center gap-2 rounded-2xl px-3.5 py-2 text-[15px] font-semibold transition', isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-emerald-50')
                }
              >
                <Icon className={cn('size-5', color)} aria-hidden />
                {s.nav[key]}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <StatChip icon={<Star className="size-4 fill-amber-400 text-amber-500" aria-hidden />} value={progress.xp} label={s.common.ecoStars} className="border-amber-200 text-amber-700" />
            <StatChip icon={<Coins className="size-4 text-gold-600" aria-hidden />} value={progress.coins} label={s.common.coins} className="hidden border-yellow-200 text-gold-700 min-[400px]:inline-flex" />
            <StatChip icon={<Flame className="size-4 fill-orange-400 text-orange-500" aria-hidden />} value={streak} label={`${s.common.streak} (days)`} className="border-orange-200 text-orange-600" />
            <AccountMenu />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pt-5 pb-32 lg:pb-12">
        <Outlet />
      </main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-emerald-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {NAV.map(({ to, key, icon: Icon, end, color }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn('font-fun flex h-[68px] flex-col items-center justify-center gap-1 text-[13px] font-semibold transition', isActive ? 'text-emerald-800' : 'text-slate-500')
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn('grid h-9 w-14 place-items-center rounded-2xl transition', isActive && 'bg-emerald-100')}>
                      <Icon className={cn('size-6', isActive ? color : 'text-slate-400')} aria-hidden />
                    </span>
                    {s.nav[key]}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <CelebrationLayer />
    </div>
  );
}

export function KidsLayout() {
  return (
    <ModeGuard mode="kids">
      <KidsShell />
    </ModeGuard>
  );
}
