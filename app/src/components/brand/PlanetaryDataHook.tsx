import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

interface Die {
  r: number;
  c: number;
  failed: boolean;
  sector: string;
}

export function PlanetaryDataHook({ onDemoClick }: { onDemoClick?: () => void }) {
  const { profile } = useApp();
  const { mode } = useMode();
  const navigate = useNavigate();
  const [hoveredDie, setHoveredDie] = useState<Die | null>(null);

  // Generate 64x64 circular wafer grid with realistic edge-ring and defect clusters
  const { dies } = useMemo(() => {
    const grid: Die[] = [];
    const size = 38; // 38x38 matrix fits cleanly and performs smoothly
    const center = size / 2;
    const radius = size / 2 - 1.2;
    let failed = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dx = c - center + 0.5;
        const dy = r - center + 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Within circular wafer
        if (dist <= radius) {
          // Edge ring has high concentration of failures (similar to semiconductor edge ring / planetary perimeter)
          const isEdge = dist > radius - 2.8;
          const edgeFail = isEdge && (r * 13 + c * 7) % 5 <= 1;

          // Scattered internal defect clusters (deforestation, ocean heatwaves)
          const cluster1 = Math.hypot(dx - 5, dy + 6) < 3.2 && (r + c) % 2 === 0;
          const cluster2 = Math.hypot(dx + 7, dy - 4) < 2.5 && (r * 3 + c) % 3 === 0;
          const cluster3 = Math.hypot(dx - 3, dy - 8) < 2.8 && (r * 5 + c * 2) % 4 === 0;
          const randomScatter = (r * 31 + c * 17) % 53 === 0;

          const isFailed = edgeFail || cluster1 || cluster2 || cluster3 || randomScatter;
          if (isFailed) failed++;

          grid.push({
            r,
            c,
            failed: isFailed,
            sector: `BIOME-${Math.abs(Math.round(dx * 4 + dy * 2)) % 99 + 1}`,
          });
        }
      }
    }
    return { dies: grid, totalDies: grid.length, failedCount: failed };
  }, []);

  const handleStartChallenge = () => {
    if (profile) navigate(`${paths(mode).generator}?topic=climate-change&difficulty=medium`);
    else navigate('/start?topic=climate-change');
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-slate-200/80 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left Column: Circular Biome Matrix / Wafer Map */}
          <div className="flex flex-col items-center justify-center">
            {/* Top Monospace Technical Label */}
            <div className="w-full max-w-[380px] sm:max-w-[430px] flex items-center justify-between text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-3">
              <span>LOT E-4471</span>
              <span>·</span>
              <span>STATION-07</span>
              <span>·</span>
              <span>BIOME-03</span>
              <span>·</span>
              <span>CMP-IPCC</span>
            </div>

            {/* Circular Wafer Matrix Container */}
            <div className="relative size-[340px] sm:size-[430px] rounded-full border border-slate-300/90 bg-[#F4F1EA] p-3 shadow-inner flex items-center justify-center">
              {/* Subtle wafer notch at top */}
              <div className="absolute top-0.5 size-2 rounded-full bg-slate-300" aria-hidden />

              {/* Grid of Micro-dies */}
              <div
                className="grid gap-[2px] size-full items-center justify-center p-2"
                style={{
                  gridTemplateColumns: 'repeat(38, minmax(0, 1fr))',
                  gridTemplateRows: 'repeat(38, minmax(0, 1fr))',
                }}
              >
                {dies.map((die) => (
                  <div
                    key={`${die.r}-${die.c}`}
                    onMouseEnter={() => setHoveredDie(die)}
                    onMouseLeave={() => setHoveredDie(null)}
                    style={{
                      gridRowStart: die.r + 1,
                      gridColumnStart: die.c + 1,
                    }}
                    className={`size-[5.5px] sm:size-[7.5px] rounded-[1px] transition-colors duration-150 cursor-crosshair ${
                      die.failed ? 'bg-[#C54A3B] hover:bg-[#a33a2d]' : 'bg-[#D2E4DA] hover:bg-[#b0d1be]'
                    }`}
                  />
                ))}
              </div>

              {/* Hover Tooltip Overlay */}
              {hoveredDie && (
                <div className="pointer-events-none absolute bottom-4 rounded-lg border border-slate-900 bg-slate-950 px-3 py-1 text-[11px] font-mono text-white shadow-lg">
                  {hoveredDie.sector} · {hoveredDie.failed ? 'CRITICAL DEFICIT (ALERT)' : 'STABLE ECOSYSTEM'}
                </div>
              )}
            </div>

            {/* Bottom Monospace Annotation */}
            <div className="mt-4 text-[11px] font-mono font-medium tracking-wide text-slate-400">
              L-4471 · 64×64 PLANETARY MATRIX · WM-811K EDGE-RING
            </div>
          </div>

          {/* Right Column: Editorial Data Story & Hook */}
          <div className="flex flex-col items-start">
            <span className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase">
              FINAL PLANETARY YIELD
            </span>

            {/* Massive Rust/Crimson Red Percentage */}
            <div className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight text-[#C54A3B] leading-none mt-2">
              61%
            </div>

            {/* Metric context */}
            <p className="font-mono text-sm sm:text-base font-semibold text-slate-700 mt-3">
              <span className="text-[#C54A3B] font-bold">123 of 3,229</span> planetary biomes failed
            </p>

            {/* Massive Question Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#0F172A] tracking-tight leading-none mt-5">
              Why?
            </h1>

            {/* Story Prompt */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Every climate crisis has raw data behind it. From deforestation rings to ocean acidification anomalies,
              investigate the science, test your diagnostic reasoning, and solve real environmental challenges.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartChallenge}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-950 bg-slate-950 px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_0_#0f172a] transition hover:bg-slate-800 active:translate-y-1 active:shadow-none"
              >
                Investigate & Solve <ArrowRight className="size-4" />
              </button>

              {onDemoClick && (
                <button
                  type="button"
                  onClick={onDemoClick}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-900 hover:text-ink"
                >
                  🎓 Demo Learner Mode
                </button>
              )}
            </div>

            <p className="mt-4 text-xs font-mono text-slate-400">
              BASED ON IPCC AR6 & PLANETARY BOUNDARY METRICS · FREE & OFFLINE READY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
