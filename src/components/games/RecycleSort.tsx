import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { bins, sortItems, type BinId } from '@/data/kids/games';
import { createRng, shuffle } from '@/engine/random';
import { cn } from '@/lib/cn';
import type { GameComponentProps } from './types';

const BIN_STYLE: Record<BinId, { base: string; active: string; shadow: string }> = {
  recyclable: { base: 'bg-sky-100 border-sky-300 text-sky-900', active: 'bg-sky-200', shadow: 'shadow-[0_5px_0_#0284c7]' },
  organic: { base: 'bg-lime-100 border-lime-400 text-lime-900', active: 'bg-lime-200', shadow: 'shadow-[0_5px_0_#65a30d]' },
  ewaste: { base: 'bg-orange-100 border-orange-300 text-orange-900', active: 'bg-orange-200', shadow: 'shadow-[0_5px_0_#ea580c]' },
};

/** Kids: sort each item into Recyclable, Organic or E-Waste — drag it, tap a bin, or press 1/2/3. */
export default function RecycleSort({ status, seed, onScore }: GameComponentProps) {
  const deck = useMemo(() => shuffle(sortItems, createRng(seed)), [seed]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<{ bin: BinId; ok: boolean; correct: BinId } | null>(null);
  const binRefs = useRef<Record<BinId, HTMLButtonElement | null>>({ recyclable: null, organic: null, ewaste: null });
  const busy = useRef(false);
  const item = deck[index % deck.length];
  const playing = status === 'playing';

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setFlash(null);
    busy.current = false;
  }, [seed]);

  const sort = (bin: BinId) => {
    if (!playing || busy.current) return;
    busy.current = true;
    const ok = item.bin === bin;
    setFlash({ bin, ok, correct: item.bin });
    if (ok) {
      const next = score + 1;
      setScore(next);
      onScore(next);
    }
    window.setTimeout(
      () => {
        setFlash(null);
        setIndex((i) => i + 1);
        busy.current = false;
      },
      ok ? 260 : 650,
    );
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, BinId> = { '1': 'recyclable', '2': 'organic', '3': 'ewaste' };
      if (map[e.key]) sort(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    for (const b of bins) {
      const r = binRefs.current[b.id]?.getBoundingClientRect();
      if (r && x >= r.left && x <= r.right && y >= r.top - 20 && y <= r.bottom) {
        sort(b.id);
        return;
      }
    }
  };

  return (
    <div className="rounded-card border-2 border-emerald-100 bg-gradient-to-b from-white to-emerald-50 p-4 shadow-card select-none sm:p-6">
      <div className="relative grid h-52 place-items-center sm:h-56">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${seed}-${index}`}
            drag={playing}
            dragSnapToOrigin
            dragElastic={0.9}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 1.1, rotate: 4, zIndex: 10 }}
            initial={{ scale: 0.4, opacity: 0, y: -20 }}
            animate={flash && !flash.ok ? { x: [0, -10, 10, -6, 6, 0], scale: 1, opacity: 1, y: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.3, opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className={cn(
              'flex cursor-grab touch-none flex-col items-center gap-1 rounded-3xl border-[3px] bg-white px-8 py-5 shadow-lg active:cursor-grabbing',
              flash ? (flash.ok ? 'border-emerald-400' : 'border-rose-400') : 'border-amber-200',
              status === 'countdown' && 'opacity-60',
            )}
            aria-live="polite"
          >
            <span className="text-7xl" aria-hidden>
              {item.emoji}
            </span>
            <span className="font-fun text-xl font-semibold text-ink">{item.label}</span>
          </motion.div>
        </AnimatePresence>
        {flash && !flash.ok && (
          <p className="absolute bottom-0 rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
            Oops! That goes in {bins.find((b) => b.id === flash.correct)?.label}
          </p>
        )}
        {status === 'playing' && !flash && <p className="pointer-events-none absolute bottom-0 text-sm font-semibold text-slate-500">Drag me — or tap a bin!</p>}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4">
        {bins.map((b, i) => (
          <button
            key={b.id}
            ref={(el) => {
              binRefs.current[b.id] = el;
            }}
            type="button"
            disabled={!playing}
            onClick={() => sort(b.id)}
            className={cn(
              'flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl border-[3px] px-1 py-3 transition active:translate-y-1 disabled:cursor-default',
              BIN_STYLE[b.id].base,
              BIN_STYLE[b.id].shadow,
              flash?.bin === b.id && (flash.ok ? 'ring-4 ring-emerald-400' : 'ring-4 ring-rose-400'),
            )}
            aria-label={`${b.label} bin (key ${i + 1})`}
          >
            <span className="text-4xl" aria-hidden>
              {b.emoji}
            </span>
            <span className="font-fun text-base font-semibold sm:text-lg">{b.label}</span>
            <span className="hidden text-xs font-semibold opacity-70 sm:block">{b.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
