import { ArrowLeftRight, Cloud, HardDrive, Pencil, RotateCcw } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { avatars } from '@/data/avatars';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { modeName, paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';
import { LogoutButton } from '../layout/AccountMenu';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

/** Avatar, name and level with inline editing. */
export function ProfileHeader({ mode }: { mode: ExperienceMode }) {
  const s = useStrings();
  const { profile, state, updateProfile } = useApp();
  const kids = mode === 'kids';
  const [editing, setEditing] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [draft, setDraft] = useState(profile?.name ?? '');
  if (!profile) return null;
  const level = levelFromXp(state.progress[mode].xp);
  const rank = rankFor(mode, level.level);
  const valid = draft.trim().length >= 2 && draft.trim().length <= 20;

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    updateProfile({ name: draft });
    setEditing(false);
  };

  return (
    <Card className={cn('flex flex-col items-center gap-5 p-6 sm:flex-row', kids && 'border-2 border-emerald-100')}>
      <div className="relative">
        <Avatar avatarId={profile.avatarId} size="xl" className="ring-4" />
        <button
          type="button"
          onClick={() => setAvatarOpen(true)}
          className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-black/5 hover:text-ink"
          aria-label={s.profile.changeAvatar}
        >
          <Pencil className="size-4" />
        </button>
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        {editing ? (
          <form onSubmit={save} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="edit-name" className="sr-only">
              Name
            </label>
            <input
              id="edit-name"
              autoFocus
              value={draft}
              maxLength={24}
              onChange={(e) => setDraft(e.target.value)}
              className="h-11 flex-1 rounded-xl border-2 border-slate-200 px-3 text-lg font-bold outline-none focus:border-[var(--accent)]"
              aria-invalid={!valid}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!valid}>
                {s.common.save}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                {s.common.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h1 className={cn('truncate font-extrabold text-ink', kids ? 'font-fun text-3xl font-semibold' : 'text-2xl')}>{profile.name}</h1>
            <button
              type="button"
              onClick={() => {
                setDraft(profile.name);
                setEditing(true);
              }}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink"
              aria-label={s.profile.editName}
            >
              <Pencil className="size-4" />
            </button>
          </div>
        )}
        <p className="mt-1 text-slate-600">
          {rank.emoji} {rank.name} · Level {level.level} · {modeName(mode)}
          {profile.isDemo && <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">Demo profile</span>}
        </p>
        <p className="mt-0.5 text-sm text-slate-500">Member since {new Date(profile.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
      </div>

      <LogoutButton className="w-full sm:w-auto sm:self-start" />

      <Modal open={avatarOpen} onClose={() => setAvatarOpen(false)} title={s.profile.changeAvatar}>
        <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-4 gap-3">
          {avatars.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={profile.avatarId === a.id}
              aria-label={a.label}
              onClick={() => {
                updateProfile({ avatarId: a.id });
                setAvatarOpen(false);
              }}
              className={cn('grid aspect-square place-items-center rounded-2xl bg-gradient-to-br text-4xl transition hover:scale-105', a.bg, profile.avatarId === a.id ? 'ring-4 ring-[var(--accent)]' : 'ring-1 ring-slate-200')}
            >
              <span aria-hidden>{a.emoji}</span>
            </button>
          ))}
        </div>
      </Modal>
    </Card>
  );
}

/** Switch between Kids and 15+ without touching either progress record. */
export function ExperienceSwitcher({ mode }: { mode: ExperienceMode }) {
  const s = useStrings();
  const { switchMode, state } = useApp();
  const navigate = useNavigate();
  const other: ExperienceMode = mode === 'kids' ? 'plus' : 'kids';
  const otherXp = state.progress[other].xp;
  return (
    <Card className={cn('p-5', mode === 'kids' && 'border-2 border-emerald-100')}>
      <h2 className="flex items-center gap-2 font-extrabold text-ink">
        <ArrowLeftRight className="size-5 text-[var(--accent)]" aria-hidden /> {s.profile.experience}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{s.profile.switchNote}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(['kids', 'plus'] as ExperienceMode[]).map((m) => (
          <div key={m} className={cn('rounded-xl border-2 p-3', m === mode ? 'border-[var(--accent)] bg-accent-soft/50' : 'border-line')}>
            <p className="text-sm font-bold text-ink">{modeName(m)}</p>
            <p className="text-xs text-slate-500">{state.progress[m].xp.toLocaleString('en')} XP</p>
            {m === mode && <p className="mt-1 text-xs font-bold text-accent-ink">Current</p>}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        full
        className="mt-4"
        onClick={() => {
          switchMode(other);
          navigate(paths(other).home);
        }}
      >
        {s.profile.switchTo(modeName(other))}
        {otherXp > 0 && <span className="text-xs font-semibold text-slate-500">({otherXp.toLocaleString('en')} XP saved)</span>}
      </Button>
    </Card>
  );
}

/** Where data lives, and a reset for demos. */
export function DataSettings({ mode }: { mode: ExperienceMode }) {
  const s = useStrings();
  const { syncStatus, resetAll } = useApp();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const cloud = syncStatus !== 'off';
  return (
    <Card className={cn('p-5', mode === 'kids' && 'border-2 border-emerald-100')}>
      <h2 className="flex items-center gap-2 font-extrabold text-ink">
        {cloud ? <Cloud className="size-5 text-sky-600" aria-hidden /> : <HardDrive className="size-5 text-slate-500" aria-hidden />} {s.profile.dataMode}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{cloud ? `${s.profile.firebaseMode} (${syncStatus})` : s.profile.localMode}</p>
      <Button variant="ghost" className="mt-3 text-rose-600 hover:bg-rose-50" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => setConfirm(true)}>
        {s.profile.reset}
      </Button>
      <Modal open={confirm} onClose={() => setConfirm(false)} title={s.profile.reset}>
        <p className="text-slate-600">{s.profile.resetConfirm}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setConfirm(false)} data-autofocus>
            {s.common.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetAll();
              navigate('/', { replace: true });
            }}
          >
            Erase everything
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
