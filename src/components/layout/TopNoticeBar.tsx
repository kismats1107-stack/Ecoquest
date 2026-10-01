import { Cookie, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ecoquest_hide_notice';

/** Top announcement / cookie & local data notice bar inspired by Image 1 */
export function TopNoticeBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      const isHidden = localStorage.getItem(STORAGE_KEY) === 'true';
      setHidden(isHidden);
    } catch {
      setHidden(false);
    }
  }, []);

  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (hidden) return null;

  return (
    <aside aria-label="Privacy & local storage notice" className="relative z-40 border-b border-amber-200/80 bg-[#FFF7ED] px-4 py-2 text-xs text-amber-950 sm:text-[13px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 font-medium">
        <p className="flex items-center gap-2">
          <Cookie className="size-4 shrink-0 text-amber-700" aria-hidden />
          <span>
            To make EcoQuest work smoothly offline, progress and quiz history are saved locally on your device.{' '}
            <span className="hidden sm:inline">By learning with EcoQuest you agree to our local privacy pledge.</span>
          </span>
        </p>
        <button
          type="button"
          onClick={hide}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-amber-900 transition hover:bg-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <span>Hide this</span>
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
    </aside>
  );
}
