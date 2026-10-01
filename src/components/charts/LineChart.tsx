import { useState, type PointerEvent } from 'react';
import { useElementWidth } from '@/hooks/useElementWidth';

export interface LinePoint {
  label: string;
  value: number;
  detail?: string;
}

/**
 * Single-series line (2px) with a 10% area wash, ringed markers and a crosshair that snaps
 * to the nearest point. Values are percentages (0–100).
 */
export function LineChart({ data, height = 200, caption, color = 'var(--accent)' }: { data: LinePoint[]; height?: number; caption: string; color?: string }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const padLeft = 40;
  const padRight = 34;
  const padTop = 14;
  const padBottom = 22;
  const plotW = Math.max(100, width - padLeft - padRight);
  const plotH = height - padTop - padBottom;
  const x = (i: number) => padLeft + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => padTop + plotH - (v / 100) * plotH;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ');
  const area = data.length ? `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z` : '';
  const last = data.length - 1;

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left + padLeft;
    let best = 0;
    data.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    });
    setActive(best);
  };

  return (
    <figure className="relative">
      <div ref={ref} className="w-full min-w-0 overflow-hidden" style={{ height }}>
        {width > 0 && (
        <svg width={width} height={height} className="block overflow-visible" role="img" aria-label={caption}>
          {[0, 50, 100].map((t) => (
            <g key={t}>
              <line x1={padLeft} x2={padLeft + plotW} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={padLeft - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-slate-500 text-[11px] tabular">
                {t}%
              </text>
            </g>
          ))}
          {data.length > 1 && <path d={area} fill={color} opacity={0.1} />}
          {data.length > 1 && <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
          {active !== null && <line x1={x(active)} x2={x(active)} y1={padTop} y2={y(0)} stroke="#94a3b8" strokeWidth={1} />}
          {data.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d.value)} r={i === active || i === last ? 5 : 4} fill={color} stroke="#fff" strokeWidth={2} />
          ))}
          {data.length > 0 && active === null && (
            <text x={x(last) + 9} y={y(data[last].value)} dy="0.32em" className="fill-slate-800 text-[11px] font-bold tabular">
              {Math.round(data[last].value)}%
            </text>
          )}
          {data.map((d, i) =>
            data.length <= 12 || i % 2 === 0 ? (
              <text key={`l${i}`} x={x(i)} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[10px]">
                {d.label}
              </text>
            ) : null,
          )}
          <rect
            x={padLeft - 10}
            y={padTop}
            width={plotW + 20}
            height={plotH}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label={`${caption}. Use left and right arrow keys to read values.`}
            onFocus={() => setActive(last)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? last) - 1));
              if (e.key === 'ArrowRight') setActive((a) => Math.min(last, (a ?? last) + 1));
            }}
            className="outline-none focus-visible:stroke-[var(--accent)] focus-visible:stroke-2"
          />
        </svg>
        )}
      </div>
      {active !== null && width > 0 && data[active] && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: Math.min(Math.max(x(active), 70), width - 70), top: Math.max(0, y(data[active].value) - 52) }}
          role="status"
        >
          <span className="block font-bold tabular">{Math.round(data[active].value)}% accuracy</span>
          <span className="block text-slate-300">{data[active].detail ?? data[active].label}</span>
        </div>
      )}
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.detail ?? d.label}</th>
              <td>{Math.round(d.value)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
