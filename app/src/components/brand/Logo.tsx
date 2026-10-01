import { useId } from 'react';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id}-g)`} />
      <path d="M46 16C30 16 18 25 18 39c0 3 .6 5.5 1.6 7.6C25 34 34 28 42 25c-9 5-15.5 12-19 23.2 2.3 1.2 5 1.8 8 1.8 14 0 21-12 15-34z" fill="#fff" />
      <circle cx="47" cy="47" r="7" fill="#facc15" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

export function Logo({ variant = 'default', className, sub }: { variant?: 'default' | 'kids' | 'plus'; className?: string; sub?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn('text-xl font-extrabold tracking-tight text-ink', variant === 'kids' && 'font-fun font-semibold')}>
          Eco<span className="text-emerald-600">Quest</span>
          {variant === 'kids' && <span className="ml-1 rounded-lg bg-amber-300 px-1.5 py-0.5 align-middle text-xs font-bold text-amber-900">KIDS</span>}
          {variant === 'plus' && <span className="ml-1 rounded-md bg-teal-700 px-1.5 py-0.5 align-middle text-[11px] font-bold text-white">15+</span>}
        </span>
        {sub && <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">{sub}</span>}
      </span>
    </span>
  );
}
