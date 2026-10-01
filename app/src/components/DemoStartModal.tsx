import { useNavigate } from 'react-router';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';
import { Modal } from './ui/Modal';

/** "Continue as Demo Student": picks an experience and opens EcoQuest with sample progress already in place. */
export function DemoStartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { startDemo } = useApp();
  const navigate = useNavigate();
  const go = (mode: ExperienceMode) => {
    startDemo(mode);
    onClose();
    navigate(paths(mode).home);
  };
  return (
    <Modal open={open} onClose={onClose} title="Continue as Demo Student" className="max-w-lg">
      <p className="mb-4 text-sm text-slate-600">Choose an experience. The demo profile includes a few days of sample activity so every dashboard has something to show — you can reset it anytime from your profile.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => go('kids')}
          className="group rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-lime-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg"
          data-autofocus
        >
          <span className="text-4xl" aria-hidden>
            🌱
          </span>
          <span className="mt-2 block font-fun text-xl font-semibold text-ink">EcoQuest Kids</span>
          <span className="block text-sm text-slate-600">Learn through Play.</span>
        </button>
        <button
          type="button"
          onClick={() => go('plus')}
          className="group rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 text-left transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🌍
          </span>
          <span className="mt-2 block text-xl font-extrabold text-ink">EcoQuest 15+</span>
          <span className="block text-sm text-slate-600">Learn through Challenge.</span>
        </button>
      </div>
    </Modal>
  );
}
