import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export interface BarListItem {
  id: string;
  label: string;
  icon?: string;
  /** 0–1, or null when there is no data yet. */
  value: number | null;
  detail?: string;
}

/**
 * Horizontal single-series bars for category comparisons (e.g. accuracy by topic).
 * Value at the bar tip; detail on hover/focus; untried categories are shown, not hidden.
 */
export function BarList({ items, caption, color = 'var(--accent)', emptyLabel = 'Not tried yet' }: { items: BarListItem[]; caption: string; color?: string; emptyLabel?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <figure>
      <ul className="space-y-2.5" aria-label={caption}>
        {items.map((item) => (
          <li
            key={item.id}
            tabIndex={0}
            onPointerEnter={() => setActive(item.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(item.id)}
            onBlur={() => setActive(null)}
            className="group grid grid-cols-[minmax(0,9.5rem)_1fr_3rem] items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:grid-cols-[minmax(0,12rem)_1fr_3.5rem]"
            aria-label={`${item.label}: ${item.value === null ? emptyLabel : `${Math.round(item.value * 100)}%`}${item.detail ? `, ${item.detail}` : ''}`}
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
              {item.icon && <span aria-hidden>{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="relative h-2.5 rounded-full bg-slate-100">
              {item.value !== null && (
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: color, opacity: active === null || active === item.id ? 1 : 0.45 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(2, item.value * 100)}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              {active === item.id && item.detail && (
                <span className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1 text-xs whitespace-nowrap text-white shadow-lg">{item.detail}</span>
              )}
            </span>
            <span className={cn('text-right text-sm tabular', item.value === null ? 'text-slate-400' : 'font-bold text-ink')}>
              {item.value === null ? '—' : `${Math.round(item.value * 100)}%`}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
