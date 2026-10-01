import { useState } from 'react';
import { useElementWidth } from '@/hooks/useElementWidth';
import { niceMax, roundedTopRect } from './chartUtils';

export interface ColumnDatum {
  label: string;
  value: number;
  /** Long label for tooltips and the table view. */
  title?: string;
}

/**
 * Single-series column chart (one hue, hairline grid, ≤24px columns with 4px rounded data-ends).
 * Each column is focusable and shows its value on hover/focus; a hidden table carries every value.
 */
export function ColumnChart({
  data,
  height = 200,
  unit = '',
  caption,
  highlightIndex,
  color = 'var(--accent)',
}: {
  data: ColumnDatum[];
  height?: number;
  unit?: string;
  caption: string;
  highlightIndex?: number;
  color?: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const padLeft = 36;
  const padBottom = 24;
  const padTop = 18;
  const plotW = Math.max(100, width - padLeft);
  const plotH = height - padBottom - padTop;
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const band = plotW / data.length;
  const barW = Math.min(24, band * 0.55);
  const ticks = [0, max / 2, max];
  const y = (v: number) => padTop + plotH - (v / max) * plotH;
  const fmt = (v: number) => `${Math.round(v).toLocaleString('en')}${unit ? ` ${unit}` : ''}`;

  return (
    <figure className="relative">
      <div ref={ref} className="w-full min-w-0 overflow-hidden" style={{ height }}>
        {width > 0 && (
        <svg width={width} height={height} className="block overflow-visible" role="img" aria-label={caption}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padLeft} x2={width} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={padLeft - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-slate-500 text-[11px] tabular">
                {Math.round(t).toLocaleString('en')}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = padLeft + band * i + (band - barW) / 2;
            const h = Math.max(0, y(0) - y(d.value));
            const isActive = active === i;
            const showLabel = isActive || (active === null && i === highlightIndex && d.value > 0);
            return (
              <g key={d.label + i}>
                {h > 0 && <path d={roundedTopRect(x, y(d.value), barW, h, 4)} fill={color} opacity={active === null || isActive ? 1 : 0.45} />}
                {h === 0 && <line x1={x} x2={x + barW} y1={y(0) - 1} y2={y(0) - 1} stroke={color} strokeOpacity={0.35} strokeWidth={2} />}
                {showLabel && (
                  <text x={x + barW / 2} y={y(d.value) - 6} textAnchor="middle" className="fill-slate-800 text-[11px] font-bold tabular">
                    {Math.round(d.value).toLocaleString('en')}
                  </text>
                )}
                <text x={x + barW / 2} y={height - 6} textAnchor="middle" className={i === highlightIndex ? 'fill-slate-800 text-[11px] font-bold' : 'fill-slate-500 text-[11px]'}>
                  {d.label}
                </text>
                {/* Hit target larger than the mark */}
                <rect
                  x={padLeft + band * i}
                  y={padTop}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${d.title ?? d.label}: ${fmt(d.value)}`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-default outline-none focus-visible:stroke-[var(--accent)] focus-visible:stroke-2"
                />
              </g>
            );
          })}
        </svg>
        )}
      </div>
      {active !== null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
          style={{ left: padLeft + band * active + band / 2, top: Math.max(0, y(data[active].value) - 44) }}
          role="status"
        >
          <span className="block font-bold tabular">{fmt(data[active].value)}</span>
          <span className="block text-slate-300">{data[active].title ?? data[active].label}</span>
        </div>
      )}
      <figcaption className="sr-only">{caption}</figcaption>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.title ?? d.label}</th>
              <td>{fmt(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
