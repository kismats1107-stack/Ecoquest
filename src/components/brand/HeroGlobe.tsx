import { motion } from 'framer-motion';
import { useId } from 'react';

/** Animated hero illustration: a stylised Earth with floating EcoQuest moments around it. */
export function HeroGlobe() {
  const id = useId();
  const chips = [
    { text: '⚡ 10-second challenge', cls: 'top-[6%] -left-[2%] bg-orange-100 text-orange-800', delay: 0 },
    { text: '+20 XP', cls: 'top-[18%] right-[0%] bg-emerald-100 text-emerald-800', delay: 0.6 },
    { text: '🔥 6-day streak', cls: 'bottom-[22%] -left-[4%] bg-rose-100 text-rose-800', delay: 1.2 },
    { text: '💧 Water Guardian unlocked', cls: 'bottom-[6%] right-[2%] bg-sky-100 text-sky-800', delay: 1.8 },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
      <motion.div className="absolute inset-[8%] rounded-full border-2 border-dashed border-emerald-300/70" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">🌱</span>
        <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-3xl">☀️</span>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-3xl">♻️</span>
        <span className="absolute top-1/2 -left-4 -translate-y-1/2 text-3xl">🦋</span>
      </motion.div>
      <motion.svg viewBox="0 0 200 200" className="absolute inset-[18%] drop-shadow-2xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <defs>
          <radialGradient id={`${id}-ocean`} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="0.55" stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#0369a1" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx="100" cy="100" r="92" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="92" fill={`url(#${id}-ocean)`} />
        <g clipPath={`url(#${id}-clip)`} fill="#4ade80">
          <path d="M38 52c14-12 34-14 44-4 8 8 2 20-8 24-12 5-10 18-22 22-14 4-26-8-26-22 0-8 4-14 12-20z" />
          <path d="M110 34c16-4 34 2 42 14 6 10-2 18-12 18-8 0-12 8-20 6-12-3-20-14-18-24 1-6 3-12 8-14z" fill="#22c55e" />
          <path d="M120 96c14-4 30 4 36 16 8 16-2 34-16 42-12 6-24 0-26-12-2-10-12-14-12-24 0-12 8-20 18-22z" />
          <path d="M60 128c10-4 22 2 24 12 2 12-8 24-20 26-10 2-18-6-18-16 0-10 6-18 14-22z" fill="#22c55e" />
        </g>
        <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
        <ellipse cx="70" cy="55" rx="28" ry="14" fill="#fff" opacity="0.18" />
      </motion.svg>
      {chips.map((c) => (
        <motion.span
          key={c.text}
          className={`absolute rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap shadow-lg ring-1 ring-black/5 ${c.cls}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{ opacity: { delay: c.delay }, scale: { delay: c.delay }, y: { duration: 4, repeat: Infinity, delay: c.delay, ease: 'easeInOut' } }}
        >
          {c.text}
        </motion.span>
      ))}
    </div>
  );
}
