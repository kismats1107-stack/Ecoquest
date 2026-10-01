import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, ChevronDown, LogOut, User } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { useLogout } from '@/hooks/useLogout';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { modeName, paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import { Avatar } from '../ui/Avatar';

/** Avatar button with a dropdown: profile, switch experience and log out. */
export function AccountMenu({ size = 'sm' }: { size?: 'xs' | 'sm' }) {
  const s = useStrings();
  const { profile, switchMode } = useApp();
  const { mode, progress } = useMode();
  const navigate = useNavigate();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const kids = mode === 'kids';

  // Close on outside click; focus the first item when opening.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    const t = window.setTimeout(() => menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(), 20);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.clearTimeout(t);
    };
  }, [open]);

  if (!profile) return null;
  const level = levelFromXp(progress.xp);
  const rank = rankFor(mode, level.level);
  const other = mode === 'kids' ? 'plus' : 'kids';

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const item = cn(
    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:bg-slate-100',
    kids ? 'rounded-2xl font-fun text-[15px]' : 'rounded-lg',
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={s.account.menu}
        className="flex items-center gap-1 rounded-full p-0.5 transition hover:bg-black/5"
      >
        <Avatar avatarId={profile.avatarId} size={size} label={profile.name} />
        <ChevronDown className={cn('size-4 text-slate-500 transition', open && 'rotate-180')} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={s.account.menu}
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'absolute top-full right-0 z-50 mt-2 w-64 origin-top-right border bg-white p-2 shadow-xl',
              kids ? 'rounded-3xl border-2 border-emerald-100' : 'rounded-xl border-line',
            )}
          >
            <div className="mb-1 flex items-center gap-3 border-b border-slate-100 px-2 pt-1 pb-3">
              <Avatar avatarId={profile.avatarId} size="md" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">{s.account.signedInAs}</p>
                <p className={cn('truncate font-extrabold text-ink', kids && 'font-fun text-lg font-semibold')}>{profile.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {rank.emoji} {rank.name} · Level {level.level}
                </p>
              </div>
            </div>
            <Link to={paths(mode).profile} role="menuitem" className={item} onClick={() => close(false)}>
              <User className="size-4 text-slate-500" aria-hidden /> {s.account.myProfile}
            </Link>
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                close(false);
                switchMode(other);
                navigate(paths(other).home);
              }}
            >
              <ArrowLeftRight className="size-4 text-slate-500" aria-hidden /> {s.profile.switchTo(modeName(other))}
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              role="menuitem"
              className={cn(item, 'text-rose-600 hover:bg-rose-50 focus-visible:bg-rose-50')}
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              <LogOut className="size-4" aria-hidden /> {s.account.logout}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Plain "Log out" button for profile pages and the sidebar. */
export function LogoutButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const s = useStrings();
  const logout = useLogout();
  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-btn font-bold text-rose-600 transition hover:bg-rose-50',
        compact ? 'px-2.5 py-1.5 text-sm' : 'border-2 border-rose-100 bg-white px-4 py-2.5 text-[15px]',
        className,
      )}
    >
      <LogOut className="size-4" aria-hidden /> {s.account.logout}
    </button>
  );
}
