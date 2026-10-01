import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Footprints } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { carbonDecisions, type CarbonOption } from '@/data/15plus/games';
import { createRng, shuffle } from '@/engine/random';
import { cn } from '@/lib/cn';
import type { GameComponentProps } from './types';

const fmt = (kg: number) => (kg < 1 ? kg.toFixed(2) : kg < 10 ? kg.toFixed(1) : Math.round(kg).toString());

/** 15+: rapid choices between everyday options — keep the carbon footprint meter low. */
export default function CarbonFootprint({ status, seed, onScore }: GameComponentProps) {
  const rounds = useMemo(() => {
    const rng = createRng(seed);
    return shuffle(carbonDecisions, rng).map((d) => ({ ...d, lowFirst: rng() < 0.5 }));
  }, [seed]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [footprint, setFootprint] = useState(0);
  const [saved, setSaved] = useState(0);
  const [reveal, setReveal] = useState<{ choseLow: boolean } | null>(null);
  const busy = useRef(false);
  const scoreRef = useRef(0);
  const playing = status === 'playing';
  const round = rounds[index % rounds.length];
  const options: { opt: CarbonOption; low: boolean }[] = round.lowFirst
    ? [{ opt: round.low, low: true }, { opt: round.high, low: false }]
    : [{ opt: round.high, low: false }, { opt: round.low, low: true }];

  useEffect(() => {
    setIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setFootprint(0);
    setSaved(0);
    setReveal(null);
    busy.current = false;
  }, [seed]);

  const choose = (side: 0 | 1) => {
    if (!playing || busy.current) return;
    busy.current = true;
    const { opt, low } = options[side];
    setFootprint((f) => f + opt.kg);
    if (low) {
      setSaved((s) => s + (round.high.kg - round.low.kg));
      scoreRef.current += 1;
      setScore(scoreRef.current);
      onScore(scoreRef.current);
    }
    setReveal({ choseLow: low });
    window.setTimeout(() => {
      setReveal(null);
      setIndex((i) => i + 1);
      busy.current = false;
    }, 520);
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A', '1'].includes(e.key)) choose(0);
      if (['ArrowRight', 'd', 'D', '2'].includes(e.key)) choose(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Meter: 0–60 kg band (flights blow straight past it, which is the point).
  const meter = Math.min(1, footprint / 60);
  const meterColor = meter < 0.35 ? 'bg-emerald-500' : meter < 0.7 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
            <Footprints className="size-3.5" aria-hidden /> Your footprint
          </p>
          <p className="text-2xl font-black text-ink tabular">
            {fmt(footprint)} <span className="text-sm font-semibold text-slate-500">kg CO₂e</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden>
            <motion.div className={cn('h-full rounded-full', meterColor)} animate={{ width: `${meter * 100}%` }} />
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs font-bold text-emerald-700 uppercase">CO₂e avoided</p>
          <p className="text-2xl font-black text-emerald-800 tabular">
            {fmt(saved)} <span className="text-sm font-semibold text-emerald-700">kg</span>
          </p>
          <p className="mt-1 text-xs text-emerald-700">{score} low-carbon choices</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${seed}-${index}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <p className="mb-3 text-center text-lg font-bold text-ink sm:text-xl">{round.prompt}</p>
          <div className="grid grid-cols-2 gap-3">
            {options.map(({ opt, low }, i) => {
              const shown = reveal !== null;
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={!playing}
                  onClick={() => choose(i as 0 | 1)}
                  className={cn(
                    'flex min-h-36 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition hover:-translate-y-0.5 disabled:cursor-default',
                    !shown && 'border-line bg-white hover:border-teal-400 hover:shadow-md',
                    shown && low && 'border-emerald-500 bg-emerald-50',
                    shown && !low && 'border-rose-300 bg-rose-50',
                  )}
                  aria-label={`${opt.label} (${i === 0 ? 'left arrow' : 'right arrow'})`}
                >
                  <span className="text-4xl" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="font-bold text-ink">{opt.label}</span>
                  <span className={cn('text-sm font-semibold tabular transition-opacity', shown ? 'opacity-100' : 'opacity-0')}>{fmt(opt.kg)} kg CO₂e</span>
                  <span className="mt-1 hidden items-center gap-1 text-xs text-slate-400 sm:flex" aria-hidden>
                    {i === 0 ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 min-h-5 text-center text-sm font-semibold" aria-live="polite">
        {reveal && (reveal.choseLow ? <span className="text-emerald-700">Low-carbon choice ✓</span> : <span className="text-rose-600">Higher footprint — the other option was lower</span>)}
      </p>
    </div>
  );
}
