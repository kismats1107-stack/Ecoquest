import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CircleCheck, Trash } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLogout } from '@/hooks/useLogout';
import { useStrings } from '@/i18n';
import { modeName, paths } from '@/lib/paths';
import type { SavedAccount } from '@/services/storage/accountStore';
import { useApp } from '@/store/context';
import { Avatar } from '../ui/Avatar';
import { Button, buttonClasses } from '../ui/Button';
import { Modal } from '../ui/Modal';

/**
 * Top of the start screen: confirms a logout, lets a signed-in learner continue or log out,
 * and lists learners saved on this device so they can sign back in with one tap.
 */
export function SignInPanel({ next }: { next: string | null }) {
  const s = useStrings();
  const { profile, savedAccounts, signIn, forgetAccount, loggedOutName } = useApp();
  const navigate = useNavigate();
  const logout = useLogout();
  const [forget, setForget] = useState<SavedAccount | null>(null);

  const enter = (account: SavedAccount) => {
    const mode = signIn(account.id);
    if (!mode) return;
    const base = mode === 'kids' ? '/kids' : '/plus';
    navigate(next && next.startsWith(base) ? next : paths(mode).home, { replace: true });
  };

  return (
    <div className="mb-6 space-y-4">
      <AnimatePresence>
        {loggedOutName && !profile && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100"
          >
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            {s.account.loggedOut(loggedOutName)}
          </motion.p>
        )}
      </AnimatePresence>

      {profile && (
        <section aria-label="Signed in" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar avatarId={profile.avatarId} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-ink">{s.account.alreadySignedIn(profile.name)}</p>
              <p className="text-sm text-slate-600">{s.account.alreadySignedInBody}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link to={paths(profile.activeMode).home} className={buttonClasses({ full: true })}>
              {s.account.continueAs(profile.name)} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Button variant="outline" onClick={logout} className="text-rose-600 hover:border-rose-300 hover:text-rose-700">
              {s.account.logout}
            </Button>
          </div>
        </section>
      )}

      {savedAccounts.length > 0 && (
        <section aria-labelledby="saved-title" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 id="saved-title" className="text-xl font-extrabold text-ink">
            {s.account.welcomeBack}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{s.account.welcomeBackBody}</p>
          <ul className="mt-4 space-y-2">
            {savedAccounts.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => enter(a)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-3 py-2.5 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50"
                  aria-label={s.account.signInAs(a.name)}
                >
                  <Avatar avatarId={a.avatarId} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-bold text-ink">{a.name}</span>
                      {a.isDemo && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase">Demo</span>}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {modeName(a.activeMode)} · Level {a.level[a.activeMode]} · {a.xp[a.activeMode].toLocaleString('en')} XP
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-emerald-700" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setForget(a)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`${s.account.forget}: ${a.name}`}
                  title={s.account.forget}
                >
                  <Trash className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Modal open={forget !== null} onClose={() => setForget(null)} title={forget ? s.account.forgetTitle(forget.name) : ''}>
        <p className="text-slate-600">{s.account.forgetBody}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setForget(null)} data-autofocus>
            {s.common.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (forget) forgetAccount(forget.id);
              setForget(null);
            }}
          >
            {s.account.forgetConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
