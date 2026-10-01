import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Option<T extends string | number> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
}

/** Accessible single-select group (radiogroup with roving arrow-key focus). */
export function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
  itemClassName,
  renderItem,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: (selected: boolean) => string;
  renderItem?: (option: Option<T>, selected: boolean) => ReactNode;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + options.length) % options.length;
    onChange(options[next].value);
    const group = e.currentTarget.parentElement;
    (group?.children[next] as HTMLElement | undefined)?.focus();
  };

  const hasSelection = options.some((o) => o.value === value);

  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!hasSelection && i === 0) ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn('transition', itemClassName?.(selected))}
          >
            {renderItem ? renderItem(opt, selected) : opt.label}
          </button>
        );
      })}
    </div>
  );
}
