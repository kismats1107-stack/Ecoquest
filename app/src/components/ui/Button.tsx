import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger' | 'white';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong',
  secondary: 'bg-accent-soft text-accent-ink hover:brightness-[0.97]',
  outline: 'border-2 border-line bg-white text-ink hover:border-accent hover:text-accent-ink',
  ghost: 'text-accent-ink hover:bg-accent-soft',
  gold: 'bg-gold-400 text-ink hover:bg-gold-300',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  white: 'bg-white text-ink hover:bg-white/90',
};

const SHADOW: Record<ButtonVariant, string> = {
  primary: 'var(--accent-shadow)',
  secondary: '#86efac',
  outline: 'var(--line)',
  ghost: 'transparent',
  gold: '#a97f0b',
  danger: '#9f1239',
  white: 'rgb(0 0 0 / 0.15)',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-6 text-base',
  xl: 'h-16 px-8 text-lg',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Kids-style chunky 3D press effect. */
  chunky?: boolean;
  full?: boolean;
  className?: string;
}

export function buttonClasses({ variant = 'primary', size = 'md', chunky = false, full = false, className }: ButtonStyleOptions = {}) {
  return cn(
    'btn inline-flex select-none items-center justify-center gap-2 rounded-btn font-bold whitespace-nowrap transition',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    chunky && variant !== 'ghost' && 'btn-3d mb-[5px]',
    !chunky && variant === 'primary' && 'shadow-sm',
    full ? 'w-full min-w-0 shrink' : 'shrink-0',
    className,
  );
}

export function buttonStyle(variant: ButtonVariant = 'primary', chunky = false): CSSProperties | undefined {
  return chunky ? ({ '--btn-shadow-color': SHADOW[variant] } as CSSProperties) : undefined;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', chunky, full, className, icon, iconRight, children, type = 'button', style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, chunky, full, className })}
      style={{ ...buttonStyle(variant, chunky), ...style }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
});
