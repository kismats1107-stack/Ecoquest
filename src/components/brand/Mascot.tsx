import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type MascotMood = 'happy' | 'cheer' | 'think' | 'oops';

/** "Sprouty" — the EcoQuest Kids guide. Pure SVG, so it scales crisply and works offline. */
export function Mascot({ mood = 'happy', className, animate = true }: { mood?: MascotMood; className?: string; animate?: boolean }) {
  const mouth = {
    happy: 'M40 66 Q50 76 60 66',
    cheer: 'M38 63 Q50 82 62 63 Z',
    think: 'M42 70 Q50 67 58 70',
    oops: 'M42 72 Q50 64 58 72',
  }[mood];

  return (
    <motion.svg
      viewBox="0 0 100 110"
      className={cn('size-24', className)}
      role="img"
      aria-label="Sprouty the EcoQuest mascot"
      animate={animate ? (mood === 'cheer' ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] } : { y: [0, -4, 0] }) : undefined}
      transition={{ duration: mood === 'cheer' ? 0.7 : 3, repeat: mood === 'cheer' ? 1 : Infinity, ease: 'easeInOut' }}
    >
      {/* sprout */}
      <path d="M50 26 C50 18 50 14 50 10" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M50 14 C40 4 30 8 30 14 C38 18 46 18 50 14Z" fill="#4ade80" />
      <path d="M50 12 C60 0 72 4 72 10 C64 16 56 16 50 12Z" fill="#22c55e" />
      {/* body */}
      <ellipse cx="50" cy="66" rx="38" ry="40" fill="#4ade80" />
      <ellipse cx="50" cy="70" rx="30" ry="30" fill="#86efac" opacity="0.55" />
      {/* cheeks */}
      <circle cx="30" cy="68" r="5" fill="#fda4af" opacity="0.7" />
      <circle cx="70" cy="68" r="5" fill="#fda4af" opacity="0.7" />
      {/* eyes */}
      {mood === 'cheer' ? (
        <>
          <path d="M33 54 Q38 48 43 54" stroke="#14532d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M57 54 Q62 48 67 54" stroke="#14532d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="38" cy="54" rx="5" ry={mood === 'oops' ? 4 : 6} fill="#14532d" />
          <ellipse cx="62" cy="54" rx="5" ry={mood === 'oops' ? 4 : 6} fill="#14532d" />
          <circle cx="40" cy="52" r="1.8" fill="#fff" />
          <circle cx="64" cy="52" r="1.8" fill="#fff" />
        </>
      )}
      {/* mouth */}
      <path d={mouth} stroke="#14532d" strokeWidth="3.5" fill={mood === 'cheer' ? '#f43f5e' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
      {mood === 'think' && <circle cx="80" cy="34" r="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />}
    </motion.svg>
  );
}
