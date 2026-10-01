import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, RotateCcw } from 'lucide-react';

interface FirstLoadingPageProps {
  onFinish?: () => void;
  standalone?: boolean;
}

interface Die {
  r: number;
  c: number;
  failed: boolean;
  type?: string;
}

export function FirstLoadingPage({ onFinish, standalone = false }: FirstLoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [scanStage, setScanStage] = useState('CALIBRATING OPTICAL SENSORS...');
  const [hoveredDie, setHoveredDie] = useState<Die | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Generate 64x64 bin map matching the reference image
  const { dies, failedCount, totalCount } = useMemo(() => {
    const size = 64;
    const center = 31.5;
    const list: Die[] = [];
    const failedSet = new Map<string, string>();

    // 1. Top rim bar (horizontal cluster of red dies along the top edge)
    for (let c = 27; c <= 35; c++) {
      failedSet.set(`1,${c}`, 'EDGE-RING TOP-DEFECT');
    }
    failedSet.set('2,26', 'EDGE-RING TOP-DEFECT');
    failedSet.set('2,36', 'EDGE-RING TOP-DEFECT');

    // 2. Interior failure clusters matching the reference image
    const interiorDefects: [number, number, string?][] = [
      [17, 36], [18, 36], // double die
      [18, 24], [18, 25], // double die
      [20, 19], // single
      [22, 29], // single
      [25, 41], // single
      [27, 24], [27, 25], // double
      [31, 28], // single
      [33, 18], // single
      [36, 39], [36, 40], // double
      [38, 30], // single
      [41, 42], // single
      [44, 25], // single
      [47, 36], // single
      [53, 33], // single near bottom
      [15, 30],
      [23, 17],
      [29, 44],
      [34, 46],
      [40, 22],
      [42, 23],
      [49, 29],
      [51, 38],
    ];
    interiorDefects.forEach(([r, c, type]) => {
      failedSet.set(`${r},${c}`, type || 'INTERNAL DEFECT');
    });

    // 3. Circle geometry: radius ~32.02 gives 3228-3229 dies in a 64x64 grid
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dx = c - center;
        const dy = r - center;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= 32.02) {
          // Perimeter edge ring defect logic (WM-811K EDGE-RING)
          if (dist >= 30.2) {
            // Far-left perimeter columns
            if (dx < -28 && (
              (r >= 16 && r <= 19) ||
              (r >= 21 && r <= 24) ||
              (r >= 26 && r <= 30) ||
              (r >= 33 && r <= 38) ||
              (r >= 41 && r <= 43)
            )) {
              failedSet.set(`${r},${c}`, 'WM-811K EDGE-RING (LEFT)');
            }
            // Far-right perimeter columns
            if (dx > 28 && (
              (r >= 21 && r <= 24) ||
              (r >= 27 && r <= 31) ||
              (r >= 35 && r <= 38) ||
              (r >= 43 && r <= 46)
            )) {
              failedSet.set(`${r},${c}`, 'WM-811K EDGE-RING (RIGHT)');
            }
            // Bottom perimeter clusters
            if (dy > 28 && (
              (c >= 25 && c <= 29) ||
              (c >= 34 && c <= 37) ||
              (c >= 40 && c <= 42) ||
              (c >= 21 && c <= 23)
            )) {
              failedSet.set(`${r},${c}`, 'WM-811K EDGE-RING (BOTTOM)');
            }
            // Top perimeter corners
            if (dy < -28 && (
              (c >= 18 && c <= 20) ||
              (c >= 43 && c <= 45)
            )) {
              failedSet.set(`${r},${c}`, 'WM-811K EDGE-RING (TOP)');
            }
          }
          list.push({
            r,
            c,
            failed: false, // will update below
            type: undefined,
          });
        }
      }
    }

    // Adjust failed count so it matches exactly 123 failed dies
    const targetFailed = 123;
    const currentFailedKeys = Array.from(failedSet.keys());

    if (currentFailedKeys.length > targetFailed) {
      // Trim excess
      for (let i = targetFailed; i < currentFailedKeys.length; i++) {
        failedSet.delete(currentFailedKeys[i]);
      }
    } else if (currentFailedKeys.length < targetFailed) {
      // Add from edge until exactly targetFailed
      for (const d of list) {
        const key = `${d.r},${d.c}`;
        if (!failedSet.has(key)) {
          const dx = d.c - center;
          const dy = d.r - center;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= 30.0) {
            failedSet.set(key, 'WM-811K EDGE-RING');
            if (failedSet.size >= targetFailed) break;
          }
        }
      }
    }

    // Apply to die list
    let actualFailed = 0;
    for (const d of list) {
      const key = `${d.r},${d.c}`;
      if (failedSet.has(key)) {
        d.failed = true;
        d.type = failedSet.get(key);
        actualFailed++;
      }
    }

    return {
      dies: list,
      failedCount: actualFailed,
      totalCount: 3229, // exact nominal die count from reference
    };
  }, []);

  // Telemetry simulation & auto-transition
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setScanStage('SCANNING 64×64 WAFER MATRIX...');
      } else if (pct < 70) {
        setScanStage('ISOLATING 123 DEFECT SIGNATURES (WM-811K)...');
      } else if (pct < 100) {
        setScanStage('CALCULATING FINAL YIELD METRICS...');
      } else {
        setScanStage('DIAGNOSTIC COMPLETE · SYSTEM READY');
      }

      if (pct >= 100) {
        clearInterval(timer);
        if (!standalone && onFinish) {
          // Auto reveal after brief pause, or user can click anytime
          const exitTimer = setTimeout(() => {
            handleComplete();
          }, 1200);
          return () => clearTimeout(exitTimer);
        }
      }
    }, 30);

    return () => clearInterval(timer);
  }, [standalone, onFinish]);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish?.();
    }, 400);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="first-loading-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`min-h-screen w-full bg-[#FAF7F2] text-slate-900 select-none flex flex-col justify-between font-sans ${
            standalone ? 'relative py-8' : 'fixed inset-0 z-50 overflow-y-auto'
          }`}
        >
          {/* Top Technical Monospace Metadata (Exact layout from image) */}
          <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-8 sm:pt-12">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="font-mono text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#222E3E] uppercase">
                LOT L-4471 &nbsp;·&nbsp; FAB2-A &nbsp;·&nbsp; ETCH-07 &nbsp;·&nbsp; CMP-03
              </div>

              {/* Progress counter & telemetry */}
              <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-slate-500">
                <span className="inline-block size-2 rounded-full bg-[#BD4335] animate-pulse" />
                <span className="hidden md:inline tracking-wider">{scanStage}</span>
                <span className="font-bold text-slate-800">{progress}%</span>
              </div>
            </motion.div>
          </header>

          {/* Main Visual Body: Left Wafer + Right "FINAL YIELD 61% Why?" */}
          <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-16 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-12 lg:gap-20">
              
              {/* LEFT: 64x64 Circular Wafer Bin Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Circular Wafer Frame */}
                <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-square rounded-full border border-slate-300/80 bg-transparent flex items-center justify-center p-3 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  
                  {/* Subtle Wafer Notch & Alignment Markers */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-300 rounded-full" />
                  <div className="absolute inset-0 rounded-full border border-slate-200/60 pointer-events-none" />

                  {/* SVG Rendered 64x64 Dies */}
                  <svg
                    viewBox="0 0 640 640"
                    className="w-full h-full aspect-square"
                    style={{ shapeRendering: 'crispEdges' }}
                  >
                    {dies.map((die) => {
                      const x = die.c * 9.8 + 6;
                      const y = die.r * 9.8 + 6;
                      // Muted sage green for passing dies (#D2E4DA), terracotta red for failed dies (#BD4335)
                      const fillColor = die.failed ? '#BD4335' : '#D2E4DA';

                      return (
                        <rect
                          key={`${die.r}-${die.c}`}
                          x={x}
                          y={y}
                          width="8.6"
                          height="8.6"
                          rx="0.6"
                          fill={fillColor}
                          className="transition-colors duration-150 cursor-crosshair hover:opacity-80"
                          onMouseEnter={() => setHoveredDie(die)}
                          onMouseLeave={() => setHoveredDie(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Dynamic Radar Scan Line */}
                  <motion.div
                    className="pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#BD4335]/40 to-transparent"
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Hover Tooltip */}
                  {hoveredDie && (
                    <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-slate-800 bg-slate-900/95 px-3 py-1.5 font-mono text-[11px] text-white shadow-xl backdrop-blur">
                      <span className="font-bold text-slate-300">
                        [{hoveredDie.r},{hoveredDie.c}]
                      </span>{' '}
                      {hoveredDie.failed ? (
                        <span className="font-bold text-rose-400">
                          FAIL · {hoveredDie.type || 'DEFECT DIE'}
                        </span>
                      ) : (
                        <span className="text-emerald-400">PASS · HEALTHY DIE</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Wafer Monospace Caption (from reference image) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5 font-mono text-[11px] sm:text-xs tracking-[0.24em] text-slate-500 uppercase text-center"
                >
                  L-4471 &nbsp;·&nbsp; 64×64 BIN MAP &nbsp;·&nbsp; WM-811K EDGE-RING
                </motion.div>
              </motion.div>

              {/* RIGHT: Typography & Mystery (FINAL YIELD 61% Why?) */}
              <div className="flex flex-col justify-center items-start lg:pl-6">
                
                {/* FINAL YIELD Header */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-mono text-xs sm:text-sm font-bold tracking-[0.26em] text-[#334155] uppercase"
                >
                  FINAL YIELD
                </motion.p>

                {/* 61% Big Metric in Terracotta Red */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-2 text-7xl sm:text-8xl md:text-[8.5rem] lg:text-[9.5rem] font-black leading-none tracking-tight text-[#BD4335]"
                >
                  61%
                </motion.h1>

                {/* 123 of 3,229 dies failed */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="mt-3 font-mono text-sm sm:text-base md:text-lg text-slate-600 tracking-wide"
                >
                  <span className="font-bold text-[#BD4335]">
                    {failedCount}
                  </span>{' '}
                  of {totalCount.toLocaleString()} dies failed
                </motion.p>

                {/* Why? in Midnight Navy */}
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="mt-6 sm:mt-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#16202E]"
                >
                  Why?
                </motion.h2>

                {/* Action Bar / Skip to Enter Platform */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4"
                >
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="group inline-flex items-center gap-3 rounded-full border-2 border-slate-900 bg-slate-950 px-7 py-3 text-sm sm:text-base font-bold text-white shadow-[0_4px_0_#0f172a] transition hover:bg-slate-800 active:translate-y-1 active:shadow-none cursor-pointer"
                  >
                    <span>Enter Platform</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  {standalone && (
                    <button
                      type="button"
                      onClick={() => setProgress(0)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <RotateCcw className="size-3.5" /> Replay Diagnostic
                    </button>
                  )}

                  <span className="font-mono text-xs text-slate-500 hidden sm:inline">
                    {progress < 100 ? (
                      `Calibrating: ${progress}%`
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="size-3.5" /> Diagnostic Ready
                      </span>
                    )}
                  </span>
                </motion.div>
              </div>
            </div>
          </main>

          {/* Footer Subtext */}
          <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 border-t border-slate-200/60 pt-4">
            <div className="flex items-center gap-2">
              <Cpu className="size-3.5 text-slate-400" />
              <span>ECOQUEST ANALYTICS SUITE · INITIAL LOADING SEQUENCE</span>
            </div>
            <div>WM-811K DEFECT CLUSTER CLASSIFIER</div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
