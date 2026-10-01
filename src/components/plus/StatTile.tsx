import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** KPI tile: label · value · optional context line. */
export function StatTile({ label, value, icon, sub, children, className }: { label: string; value: ReactNode; icon: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-card border border-line bg-white p-4 shadow-card', className)}>
      <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="grid size-7 place-items-center rounded-lg bg-slate-50 text-slate-600">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
      {children}
    </div>
  );
}
