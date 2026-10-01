import type { QuestionData } from '@/types';

/** Labelled horizontal bars for data-interpretation questions — every value is printed, since it's needed to answer. */
export function DataFigure({ data }: { data: QuestionData }) {
  const max = Math.max(...data.points.map((p) => p.value));
  return (
    <figure className="rounded-xl border border-line bg-slate-50/70 p-4">
      <figcaption className="mb-3 text-sm font-bold text-ink">
        {data.title} <span className="font-medium text-slate-500">({data.unit})</span>
      </figcaption>
      <ul className="space-y-2">
        {data.points.map((p) => (
          <li key={p.label} className="grid grid-cols-[minmax(0,8.5rem)_1fr_auto] items-center gap-3 text-sm">
            <span className="truncate font-semibold text-slate-700">{p.label}</span>
            <span className="h-3 rounded-full bg-white ring-1 ring-line">
              <span className="block h-full rounded-full bg-teal-600" style={{ width: `${Math.max(2, (p.value / max) * 100)}%` }} />
            </span>
            <span className="font-bold text-ink tabular">{p.value.toLocaleString('en')}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
