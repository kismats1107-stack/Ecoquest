import { Outlet } from 'react-router';
import { cn } from '@/lib/cn';
import type { ExperienceMode } from '@/types';
import { CelebrationLayer } from './CelebrationLayer';
import { ModeGuard } from './ModeGuard';

/** Distraction-free layout for quizzes and 10-second challenges (no navigation chrome). */
export function FocusLayout({ mode }: { mode: ExperienceMode }) {
  return (
    <ModeGuard mode={mode}>
      <div data-mode={mode} className={cn('min-h-dvh', mode === 'kids' ? 'bg-kids-sky' : 'bg-page')}>
        <main id="main" className="mx-auto max-w-3xl px-4 pt-4 pb-16 sm:pt-6">
          <Outlet />
        </main>
        <CelebrationLayer />
      </div>
    </ModeGuard>
  );
}
