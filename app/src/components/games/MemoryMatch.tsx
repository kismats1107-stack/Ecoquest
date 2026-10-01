import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { memoryDecks } from '@/data/kids/games';
import { createRng, pick, shuffle } from '@/engine/random';
import { cn } from '@/lib/cn';
import type { GameComponentProps } from './types';

const PAIRS = 4;

/** Kids: peek during the countdown, then match all four pairs of nature cards within 10 seconds. */
export default function MemoryMatch({ status, seed, topicId, onScore, onFinish }: GameComponentProps) {
  const cards = useMemo(() => {
    const rng = createRng(seed);
    const deck = (topicId && memoryDecks[topicId]) || pick(Object.values(memoryDecks), rng);
    const chosen = shuffle(deck, rng).slice(0, PAIRS);
    return shuffle(
      chosen.flatMap((c, i) => [
        { key: `${i}a`, pair: i, ...c },
        { key: `${i}b`, pair: i, ...c },
      ]),
      rng,
    );
  }, [seed, topicId]);

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [fact, setFact] = useState<string | null>(null);
  const lock = useRef(false);
  const playing = status === 'playing';

  useEffect(() => {
    setOpen([]);
    setMatched(new Set());
    setFact(null);
    lock.current = false;
  }, [seed]);

  const flip = (i: number) => {
    if (!playing || lock.current || open.includes(i) || matched.has(cards[i].pair)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next;
    if (cards[a].pair === cards[b].pair) {
      const m = new Set(matched).add(cards[a].pair);
      setMatched(m);
      setOpen([]);
      setFact(`${cards[a].emoji} ${cards[a].fact}`);
      onScore(m.size);
      if (m.size === PAIRS) window.setTimeout(onFinish, 350);
    } else {
      lock.current = true;
      window.setTimeout(() => {
        setOpen([]);
        lock.current = false;
      }, 650);
    }
  };

  return (
    <div className="rounded-card border-2 border-violet-100 bg-gradient-to-b from-white to-violet-50 p-4 shadow-card sm:p-6">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((card, i) => {
          const faceUp = status === 'countdown' || status === 'over' || open.includes(i) || matched.has(card.pair);
          const isMatched = matched.has(card.pair);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(i)}
              disabled={!playing || isMatched}
              aria-label={faceUp ? card.label : `Hidden card ${i + 1}`}
              className="aspect-[3/4] [perspective:600px] disabled:cursor-default"
            >
              <motion.span
                className="relative block size-full [transform-style:preserve-3d]"
                animate={{ rotateY: faceUp ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border-[3px] bg-white [backface-visibility:hidden]',
                    isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-violet-200',
                  )}
                >
                  <span className="text-3xl sm:text-4xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <span className="font-fun text-xs font-semibold text-slate-700 sm:text-sm">{card.label}</span>
                </span>
                <span className="absolute inset-0 grid place-items-center rounded-2xl border-[3px] border-violet-300 bg-gradient-to-br from-violet-400 to-fuchsia-400 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-3xl" aria-hidden>
                    🌿
                  </span>
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 min-h-12 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === 'countdown' ? (
            <motion.p key="peek" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-fun text-lg font-semibold text-violet-800">
              👀 Peek and remember!
            </motion.p>
          ) : fact ? (
            <motion.p key={fact} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-2xl bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
              {fact}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
