import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-card border border-line bg-white shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  as: Tag = 'h2',
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <Tag className={cn('font-extrabold tracking-tight text-ink', Tag === 'h1' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl')}>{title}</Tag>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap', className)}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-white/60 px-6 py-10 text-center">
      <div className="text-4xl" aria-hidden>
        {icon}
      </div>
      <p className="font-bold text-ink">{title}</p>
      {body && <p className="max-w-sm text-sm text-slate-600">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
