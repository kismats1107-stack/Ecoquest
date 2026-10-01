import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { foodChains, trophicLevels } from '@/data/15plus/games';
import { createRng, shuffle } from '@/engine/random';
import { cn } from '@/lib/cn';
import type { GameComponentProps } from './types';

/** 15+: rebuild food chains in order — producer → primary → secondary → tertiary consumer. */
export default function FoodWeb({ status, seed, onScore }: GameComponentProps) {
  const chains = useMemo(() => {
    const rng = createRng(seed);
    return shuffle(foodChains, rng).map((c) => ({ ...c, order: shuffle([0, 1, 2, 3], rng) }));
  }, [seed]);
  const [chainIdx, setChainIdx] = useState(0);
  const [placed, setPlaced] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const scoreRef = useRef(0);
  const busy = useRef(false);
  const playing = status === 'playing';
  const chain = chains[chainIdx % chains.length];

  useEffect(() => {
    setChainIdx(0);
    setPlaced(0);
    setWrong(null);
    setCompleted(0);
    scoreRef.current = 0;
    busy.current = false;
  }, [seed]);

  const pickOrganism = (organismIndex: number) => {
    if (!playing || busy.current || organismIndex < placed) return;
    if (organismIndex === placed) {
      scoreRef.current += 1;
      onScore(scoreRef.current);
      const next = placed + 1;
      setPlaced(next);
      if (next === 4) {
        busy.current = true;
        setCompleted((c) => c + 1);
        window.setTimeout(() => {
          setChainIdx((i) => i + 1);
          setPlaced(0);
          busy.current = false;
        }, 450);
      }
    } else {
      setWrong(organismIndex);
      window.setTimeout(() => setWrong(null), 350);
    }
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) pickOrganism(chain.order[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-lg font-bold text-ink">
          <span aria-hidden>{chain.emoji}</span> {chain.ecosystem} food chain
        </p>
        <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">{completed} complete</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${seed}-${chainIdx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {/* Slots */}
          <ol className="mb-5 flex items-stretch gap-1 sm:gap-2" aria-label="Food chain slots">
            {trophicLevels.map((level, i) => (
              <Fragment key={level}>
                <li
                  className={cn(
                    'flex min-h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-1.5 text-center',
                    i < placed ? 'border-solid border-lime-500 bg-lime-50' : i === placed && playing ? 'border-teal-400 bg-teal-50/50' : 'border-slate-200 bg-slate-50',
                  )}
                >
                  {i < placed ? (
                    <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                      <span className="text-3xl" aria-hidden>
                        {chain.organisms[i].emoji}
                      </span>
                      <span className="text-xs font-bold text-ink">{chain.organisms[i].name}</span>
                    </motion.span>
                  ) : (
                    <span className="text-[11px] leading-tight font-semibold text-slate-400 sm:text-xs">{level}</span>
                  )}
                </li>
                {i < 3 && <ArrowRight className="size-4 shrink-0 self-center text-slate-300" aria-hidden />}
              </Fragment>
            ))}
          </ol>

          {/* Organism choices */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {chain.order.map((orgIdx, i) => {
              const org = chain.organisms[orgIdx];
              const used = orgIdx < placed;
              return (
                <motion.button
                  key={org.name}
                  type="button"
                  disabled={!playing || used}
                  onClick={() => pickOrganism(orgIdx)}
                  animate={wrong === orgIdx ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left transition disabled:cursor-default',
                    used ? 'border-transparent bg-slate-50 opacity-40' : wrong === orgIdx ? 'border-rose-400 bg-rose-50' : 'border-line bg-white hover:border-teal-400 hover:shadow-sm',
                  )}
                  aria-label={`${org.name} (key ${i + 1})`}
                >
                  <span className="text-2xl" aria-hidden>
                    {org.emoji}
                  </span>
                  <span className="min-w-0 text-sm font-bold text-ink">{org.name}</span>
                  <kbd className="ml-auto hidden rounded border border-slate-200 px-1.5 text-[10px] font-semibold text-slate-400 sm:inline">{i + 1}</kbd>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 text-center text-xs text-slate-500">Energy flows from the producer up to the top predator.</p>
    </div>
  );
}
