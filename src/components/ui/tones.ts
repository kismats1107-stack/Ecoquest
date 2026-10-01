import type { TopicTone } from '@/types';

export interface ToneClasses {
  soft: string;
  chip: string;
  text: string;
  bar: string;
  border: string;
  gradient: string;
  ring: string;
}

/** Full class strings (Tailwind needs to see them literally) for each topic colour family. */
export const tones: Record<TopicTone, ToneClasses> = {
  emerald: { soft: 'bg-emerald-50', chip: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-700', bar: 'bg-emerald-500', border: 'border-emerald-200', gradient: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-300' },
  sky: { soft: 'bg-sky-50', chip: 'bg-sky-100 text-sky-800', text: 'text-sky-700', bar: 'bg-sky-500', border: 'border-sky-200', gradient: 'from-sky-400 to-blue-500', ring: 'ring-sky-300' },
  amber: { soft: 'bg-amber-50', chip: 'bg-amber-100 text-amber-800', text: 'text-amber-700', bar: 'bg-amber-500', border: 'border-amber-200', gradient: 'from-amber-300 to-orange-400', ring: 'ring-amber-300' },
  orange: { soft: 'bg-orange-50', chip: 'bg-orange-100 text-orange-800', text: 'text-orange-700', bar: 'bg-orange-500', border: 'border-orange-200', gradient: 'from-orange-400 to-rose-400', ring: 'ring-orange-300' },
  lime: { soft: 'bg-lime-50', chip: 'bg-lime-100 text-lime-800', text: 'text-lime-700', bar: 'bg-lime-500', border: 'border-lime-200', gradient: 'from-lime-400 to-emerald-500', ring: 'ring-lime-300' },
  teal: { soft: 'bg-teal-50', chip: 'bg-teal-100 text-teal-800', text: 'text-teal-700', bar: 'bg-teal-500', border: 'border-teal-200', gradient: 'from-teal-400 to-cyan-500', ring: 'ring-teal-300' },
  violet: { soft: 'bg-violet-50', chip: 'bg-violet-100 text-violet-800', text: 'text-violet-700', bar: 'bg-violet-500', border: 'border-violet-200', gradient: 'from-violet-400 to-fuchsia-400', ring: 'ring-violet-300' },
  rose: { soft: 'bg-rose-50', chip: 'bg-rose-100 text-rose-800', text: 'text-rose-700', bar: 'bg-rose-500', border: 'border-rose-200', gradient: 'from-rose-400 to-orange-400', ring: 'ring-rose-300' },
  cyan: { soft: 'bg-cyan-50', chip: 'bg-cyan-100 text-cyan-800', text: 'text-cyan-700', bar: 'bg-cyan-500', border: 'border-cyan-200', gradient: 'from-cyan-400 to-sky-500', ring: 'ring-cyan-300' },
  slate: { soft: 'bg-slate-50', chip: 'bg-slate-200 text-slate-800', text: 'text-slate-700', bar: 'bg-slate-500', border: 'border-slate-200', gradient: 'from-slate-400 to-teal-600', ring: 'ring-slate-300' },
};

export const difficultyStyles = {
  easy: { label: 'Easy', chip: 'bg-emerald-100 text-emerald-800', emoji: '🌱' },
  medium: { label: 'Medium', chip: 'bg-amber-100 text-amber-800', emoji: '🌿' },
  hard: { label: 'Hard', chip: 'bg-rose-100 text-rose-800', emoji: '🌳' },
} as const;
