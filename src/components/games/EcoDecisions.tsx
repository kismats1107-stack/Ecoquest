import { AnimatePresence, motion } from 'framer-motion';
import { Landmark, Leaf } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { decisionGroupsForTopic, ecoDecisions } from '@/data/15plus/games';
import { getTopic } from '@/data';
import { createRng, shuffle } from '@/engine/random';
import { cn } from '@/lib/cn';
import type { GameComponentProps } from './types';

/** 15+: you run the city — pick sustainable policies fast and watch the consequences. */
export default function EcoDecisions({ status, seed, topicId, onScore }: GameComponentProps) {
  const deck = useMemo(() => {
    const rng = createRng(seed);
    const group = topicId ? getTopic(topicId)?.group : undefined;
    const groups = group ? decisionGroupsForTopic[group] : undefined;
    const themed = groups ? ecoDecisions.filter((d) => groups.includes(d.group)) : [];
    const rest = ecoDecisions.filter((d) => !themed.includes(d));
    return [...shuffle(themed, rng), ...shuffle(rest, rng)].map((d) => ({ ...d, goodFirst: rng() < 0.5 }));
  }, [seed, topicId]);

  const [index, setIndex] = useState(0);
  const [health, setHealth] = useState(50);
  const [result, setResult] = useState<{ good: boolean; text: string } | null>(null);
  const scoreRef = useRef(0);
  const busy = useRef(false);
  const playing = status === 'playing';
  const card = deck[index % deck.length];
  const choices = card.goodFirst
    ? [{ ...card.good, good: true }, { ...card.bad, good: false }]
    : [{ ...card.bad, good: false }, { ...card.good, good: true }];

  useEffect(() => {
    setIndex(0);
    setHealth(50);
    setResult(null);
    scoreRef.current = 0;
    busy.current = false;
  }, [seed]);

  const decide = (i: 0 | 1) => {
    if (!playing || busy.current) return;
    busy.current = true;
    const c = choices[i];
    if (c.good) {
      scoreRef.current += 1;
      onScore(scoreRef.current);
    }
    setHealth((h) => Math.max(0, Math.min(100, h + (c.good ? 12 : -12))));
    setResult({ good: c.good, text: c.outcome });
    window.setTimeout(() => {
      setResult(null);
      setIndex((x) => x + 1);
      busy.current = false;
    }, 700);
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A', '1'].includes(e.key)) decide(0);
      if (['ArrowRight', 'd', 'D', '2'].includes(e.key)) decide(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs font-bold tracking-wide text-slate-500 uppercase">
          <span className="flex items-center gap-1.5">
            <Leaf className="size-3.5 text-emerald-600" aria-hidden /> Planet health
          </span>
          <span className="tabular">{health}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={health} aria-label="Planet health">
          <motion.div
            className={cn('h-full rounded-full', health >= 60 ? 'bg-emerald-500' : health >= 40 ? 'bg-amber-500' : 'bg-rose-500')}
            animate={{ width: `${health}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${seed}-${index}`} initial={{ opacity: 0, rotateX: -12 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
          <div className="mb-4 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-slate-800 to-teal-900 p-4 text-white">
            <Landmark className="mt-0.5 size-6 shrink-0 text-teal-300" aria-hidden />
            <div>
              <p className="text-xs font-bold tracking-wide text-teal-300 uppercase">City briefing</p>
              <p className="text-lg font-bold">{card.situation}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {choices.map((c, i) => (
              <button
                key={c.label}
                type="button"
                disabled={!playing}
                onClick={() => decide(i as 0 | 1)}
                className={cn(
                  'min-h-20 rounded-2xl border-2 px-4 py-3 text-left font-bold text-ink transition disabled:cursor-default',
                  result ? (c.good ? 'border-emerald-500 bg-emerald-50' : 'border-rose-300 bg-rose-50') : 'border-line bg-white hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md',
                )}
                aria-label={`${c.label} (${i === 0 ? 'left arrow' : 'right arrow'})`}
              >
                <span className="mr-2 inline-grid size-6 place-items-center rounded-md bg-slate-100 text-xs text-slate-500" aria-hidden>
                  {i === 0 ? '←' : '→'}
                </span>
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 min-h-12" aria-live="polite">
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('rounded-xl px-4 py-2.5 text-sm font-semibold', result.good ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700')}
          >
            {result.good ? '✓ ' : '✗ '}
            {result.text}
          </motion.p>
        )}
      </div>
    </div>
  );
}
