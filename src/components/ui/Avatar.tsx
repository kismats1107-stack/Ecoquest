import { getAvatar } from '@/data/avatars';
import { cn } from '@/lib/cn';

const SIZES = {
  xs: 'size-7 text-base',
  sm: 'size-9 text-xl',
  md: 'size-12 text-2xl',
  lg: 'size-16 text-4xl',
  xl: 'size-24 text-6xl',
} as const;

export function Avatar({ avatarId, size = 'md', className, label }: { avatarId: string; size?: keyof typeof SIZES; className?: string; label?: string }) {
  const avatar = getAvatar(avatarId);
  return (
    <span
      role="img"
      aria-label={label ?? `${avatar.label} avatar`}
      className={cn('inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br ring-2 ring-white', avatar.bg, SIZES[size], className)}
    >
      <span aria-hidden className="leading-none">
        {avatar.emoji}
      </span>
    </span>
  );
}
