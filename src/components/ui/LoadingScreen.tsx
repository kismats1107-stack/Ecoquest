import { LogoMark } from '../brand/Logo';

export function LoadingScreen() {
  return (
    <div className="grid min-h-[60dvh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <LogoMark className="size-12 animate-bounce" />
        <span className="text-sm font-semibold">Loading EcoQuest…</span>
      </div>
    </div>
  );
}
