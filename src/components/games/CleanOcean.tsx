import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { oceanFriends, oceanLitter } from '@/data/kids/games';
import { createRng, pick, type Rng } from '@/engine/random';
import type { GameComponentProps } from './types';

interface Floater {
  id: number;
  cell: number;
  emoji: string;
  label: string;
  litter: boolean;
  x: number;
  y: number;
  delay: number;
}

interface Pop {
  id: number;
  x: number;
  y: number;
  text: string;
  good: boolean;
}

const MAX_ON_SCREEN = 9;

/** A 4 × 3 grid of underwater slots, so floating things never overlap. */
const COLS = [13, 38, 62, 87];
const ROWS = [36, 59, 81];
const CELLS = ROWS.flatMap((y) => COLS.map((x) => ({ x, y })));

function spawn(rng: Rng, id: number, taken: Set<number>, litterBias = 0.75): Floater | null {
  const free = CELLS.map((_, i) => i).filter((i) => !taken.has(i));
  if (!free.length) return null;
  const cell = pick(free, rng);
  const litter = rng() < litterBias;
  const thing = pick(litter ? oceanLitter : oceanFriends, rng);
  const jitter = () => (rng() - 0.5) * 6;
  return { id, cell, emoji: thing.emoji, label: thing.label, litter, x: CELLS[cell].x + jitter(), y: CELLS[cell].y + jitter(), delay: rng() * 2 };
}

/** Kids: tap floating litter to clean the ocean — but leave the sea creatures alone! */
export default function CleanOcean({ status, seed, onScore }: GameComponentProps) {
  const rngRef = useRef<Rng>(createRng(seed));
  const nextId = useRef(0);
  const [items, setItems] = useState<Floater[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const scoreRef = useRef(0);
  const popId = useRef(0);
  const playing = status === 'playing';

  // New round: fresh ocean with a few pieces of litter and some sea friends.
  useEffect(() => {
    rngRef.current = createRng(seed);
    nextId.current = 0;
    scoreRef.current = 0;
    const initial: Floater[] = [];
    const taken = new Set<number>();
    for (let i = 0; i < 7; i++) {
      const f = spawn(rngRef.current, nextId.current++, taken, i < 5 ? 1 : 0);
      if (f) {
        initial.push(f);
        taken.add(f.cell);
      }
    }
    setItems(initial);
    setPops([]);
  }, [seed]);

  // Keep the ocean busy while playing.
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setItems((cur) => {
        const trimmed = cur.length >= MAX_ON_SCREEN ? cur.slice(1) : cur;
        const f = spawn(rngRef.current, nextId.current++, new Set(trimmed.map((x) => x.cell)));
        return f ? [...trimmed, f] : trimmed;
      });
    }, 650);
    return () => window.clearInterval(t);
  }, [playing]);

  const tap = (f: Floater) => {
    if (!playing) return;
    setItems((cur) => (f.litter ? cur.filter((x) => x.id !== f.id) : cur));
    scoreRef.current = f.litter ? scoreRef.current + 1 : Math.max(0, scoreRef.current - 1);
    onScore(scoreRef.current);
    const pop: Pop = { id: popId.current++, x: f.x, y: f.y, text: f.litter ? '+1' : 'Oops! −1', good: f.litter };
    setPops((p) => [...p.slice(-5), pop]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== pop.id)), 700);
  };

  return (
    <div
      className="relative h-[360px] overflow-hidden rounded-card border-2 border-sky-200 shadow-card select-none sm:h-[420px]"
      style={{ background: 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 35%, #0284c7 75%, #075985 100%)' }}
    >
      {/* waves & seabed */}
      <svg className="absolute inset-x-0 top-[22%] h-10 w-full text-white/30" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
        <path d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 V40 H0Z" fill="currentColor" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-amber-200/80 to-transparent" aria-hidden />
      <span className="absolute bottom-2 left-4 text-3xl" aria-hidden>
        🪸
      </span>
      <span className="absolute right-6 bottom-1 text-3xl" aria-hidden>
        🌿
      </span>

      <AnimatePresence>
        {items.map((f) => (
          <motion.button
            key={f.id}
            type="button"
            onClick={() => tap(f)}
            disabled={!playing}
            aria-label={f.litter ? `Litter: ${f.label}` : `Sea creature: ${f.label} — don't tap!`}
            className="absolute grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full disabled:cursor-default sm:size-[72px]"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
          >
            <span className="animate-drift block text-5xl drop-shadow-md sm:text-[54px]" style={{ animationDelay: `${f.delay}s` }} aria-hidden>
              {f.emoji}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {pops.map((p) => (
          <motion.span
            key={p.id}
            className={`pointer-events-none absolute -translate-x-1/2 rounded-full px-2 py-0.5 text-sm font-black ${p.good ? 'bg-emerald-400 text-white' : 'bg-rose-500 text-white'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.7 }}
            aria-hidden
          >
            {p.text}
          </motion.span>
        ))}
      </AnimatePresence>

      {status === 'countdown' && (
        <p className="absolute inset-x-0 top-3 text-center font-fun text-lg font-semibold text-white drop-shadow">Tap the trash 🥤 — not the turtles 🐢!</p>
      )}
    </div>
  );
}
