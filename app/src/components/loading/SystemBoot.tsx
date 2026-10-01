import { useEffect, useState } from 'react';

interface SystemBootProps {
  onComplete?: () => void;
}

export function SystemBoot({ onComplete }: SystemBootProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Lock body scroll while loader is active, restore when fading out or unmounting
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  // Keyboard shortcut to skip if pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.style.overflow = '';
        setIsFadingOut(true);
        setTimeout(() => onComplete?.(), 250);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  // Smooth progress animation from 0% to 100% over ~2.8 seconds
  useEffect(() => {
    const totalDuration = 2800; // 2.8s smooth duration
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawPct = Math.min(100, (elapsed / totalDuration) * 100);
      const currentPct = Math.floor(rawPct);

      setProgress(currentPct);

      if (rawPct < 100) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setIsReady(true);

        // Show SYSTEM READY for 350ms, then smoothly fade out
        const readyTimer = setTimeout(() => {
          document.body.style.overflow = '';
          setIsFadingOut(true);

          // After fade-out transition (350ms), reveal website completely
          const exitTimer = setTimeout(() => {
            onComplete?.();
          }, 350);

          return () => clearTimeout(exitTimer);
        }, 350);

        return () => clearTimeout(readyTimer);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  // Terminal progress bar 1 (thin track line with progress fill)
  const lineTotal = 24;
  const lineFilled = Math.min(lineTotal, Math.round((progress / 100) * lineTotal));
  const lineEmpty = lineTotal - lineFilled;
  const lineProgress = '━'.repeat(lineFilled) + '░'.repeat(lineEmpty);

  // Terminal progress bar 2 (block fill bar)
  const blockTotal = 18;
  const blockFilled = Math.min(blockTotal, Math.round((progress / 100) * blockTotal));
  const blockEmpty = blockTotal - blockFilled;
  const blockBar = `[${'█'.repeat(blockFilled)}${'░'.repeat(blockEmpty)}]`;

  // Dynamic system status values based on progress percentage
  let coreStatus = 'CHECKING';
  let networkStatus = 'WAITING';
  let diagStatus = 'INITIALIZING';

  if (progress >= 100) {
    coreStatus = 'OK';
    networkStatus = 'OK';
    diagStatus = 'OK';
  } else if (progress >= 75) {
    coreStatus = 'OK';
    networkStatus = 'OK';
    diagStatus = 'RUNNING';
  } else if (progress >= 50) {
    coreStatus = 'OK';
    networkStatus = 'OK';
    diagStatus = 'CHECKING';
  } else if (progress >= 30) {
    coreStatus = 'OK';
    networkStatus = 'CHECKING';
    diagStatus = 'INITIALIZING';
  }

  const monoFontFamily =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="System Boot Sequence"
      style={{
        fontFamily: monoFontFamily,
        backgroundColor: '#171717',
        color: '#F2F0EA',
      }}
      className={`fixed inset-0 z-[99999] flex h-screen w-screen flex-col justify-between items-center select-none overflow-hidden px-6 py-10 sm:py-16 transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Header */}
      <div className="w-full text-center">
        <p className="text-xs sm:text-sm tracking-[0.28em] text-[#F2F0EA] uppercase font-normal">
          SYSTEM BOOT
        </p>
      </div>

      {/* Main Terminal Center Block */}
      <div className="flex flex-col items-center justify-center w-full max-w-[340px] sm:max-w-[400px] my-auto">
        {/* Dynamic Percentage */}
        <div className="text-6xl sm:text-7xl font-light tracking-tight text-[#F2F0EA] tabular-nums text-center mb-6">
          {progress}%
        </div>

        {/* Progress Bar 1: Thin line with filled & empty segments */}
        <div
          className="text-sm sm:text-base tracking-wider text-[#F2F0EA] text-center mb-3 select-none"
          aria-hidden="true"
        >
          {lineProgress}
        </div>

        {/* Progress Bar 2: Bracketed block bar [████░░░] */}
        <div
          className="text-xs sm:text-sm tracking-widest text-[#F2F0EA] text-center mb-8 select-none"
          aria-hidden="true"
        >
          {blockBar}
        </div>

        {/* System Diagnostics Status */}
        <div className="w-full space-y-2 text-xs sm:text-sm text-[#F2F0EA]">
          <div className="flex justify-between items-baseline">
            <span className="text-[#8E8D88] tracking-widest">CORE</span>
            <span className="flex-1 mx-2 border-b border-dotted border-[#3E3E3E]" />
            <span className={coreStatus === 'OK' ? 'text-[#F2F0EA]' : 'text-[#8E8D88]'}>
              {coreStatus}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#8E8D88] tracking-widest">NETWORK</span>
            <span className="flex-1 mx-2 border-b border-dotted border-[#3E3E3E]" />
            <span className={networkStatus === 'OK' ? 'text-[#F2F0EA]' : 'text-[#8E8D88]'}>
              {networkStatus}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[#8E8D88] tracking-widest">DIAGNOSTICS</span>
            <span className="flex-1 mx-2 border-b border-dotted border-[#3E3E3E]" />
            <span className={diagStatus === 'OK' ? 'text-[#F2F0EA]' : 'text-[#8E8D88]'}>
              {diagStatus}
            </span>
          </div>
        </div>

        {/* SYSTEM READY message at 100% */}
        <div className="h-8 mt-6 flex items-center justify-center">
          {isReady && (
            <p className="text-xs sm:text-sm tracking-[0.24em] text-[#F2F0EA] uppercase font-bold animate-pulse">
              SYSTEM READY _
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-center">
        <p className="text-[11px] sm:text-xs tracking-[0.28em] text-[#8E8D88] uppercase font-normal">
          SYSTEM INITIALIZATION
        </p>
      </div>
    </div>
  );
}
