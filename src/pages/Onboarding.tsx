import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { DemoStartModal } from '@/components/DemoStartModal';
import { SignInPanel } from '@/components/account/SignInPanel';
import { Logo } from '@/components/brand/Logo';
import { Mascot } from '@/components/brand/Mascot';
import { Button } from '@/components/ui/Button';
import { avatars } from '@/data/avatars';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';

const STEPS = ['Your name', 'Your avatar', 'Your experience'];

export function Onboarding() {
  const s = useStrings();
  const { createProfile, savedAccounts } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preMode = params.get('mode');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState('fox');
  const [mode, setMode] = useState<ExperienceMode | null>(preMode === 'kids' || preMode === 'plus' ? preMode : null);
  const [touched, setTouched] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  useDocumentTitle('Start your journey');

  const trimmed = name.trim();
  const nameError = trimmed.length < 2 ? 'Please enter at least 2 characters.' : trimmed.length > 20 ? 'Please keep it under 20 characters.' : null;

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    if (step === 0) {
      setTouched(true);
      if (nameError) return;
    }
    if (step < 2) setStep(step + 1);
  };

  const finish = () => {
    if (!mode || nameError) return;
    createProfile({ name: trimmed, avatarId, mode });
    const nextPath = params.get('next');
    navigate(nextPath && nextPath.startsWith(mode === 'kids' ? '/kids' : '/plus') ? nextPath : paths(mode).home, { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[radial-gradient(900px_500px_at_80%_0%,#d1fae5_0%,transparent_60%),radial-gradient(700px_400px_at_0%_100%,#e0f2fe_0%,transparent_60%)] bg-white">
      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link to="/" aria-label="EcoQuest home">
          <Logo />
        </Link>
        <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-ink">
          Back to home
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 pt-4 pb-16">
        <SignInPanel next={params.get('next')} />
        {savedAccounts.length > 0 && <h2 className="mb-3 text-lg font-extrabold text-ink">{s.account.newLearner}</h2>}
        <button
          type="button"
          onClick={() => setDemoOpen(true)}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/70 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
            <GraduationCap className="size-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold text-ink">Continue as Demo Student</span>
            <span className="block text-sm text-slate-600">Skip setup — jump in with sample progress, badges and history.</span>
          </span>
          <ArrowRight className="size-5 text-emerald-700" aria-hidden />
        </button>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
          <ol className="mb-6 flex items-center gap-2" aria-label="Setup steps">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn('grid size-7 shrink-0 place-items-center rounded-full text-xs font-black', i < step ? 'bg-emerald-600 text-white' : i === step ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500' : 'bg-slate-100 text-slate-400')}
                  aria-current={i === step ? 'step' : undefined}
                >
                  {i < step ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className={cn('hidden text-xs font-bold sm:block', i === step ? 'text-ink' : 'text-slate-400')}>{label}</span>
                {i < 2 && <span className="h-0.5 flex-1 rounded bg-slate-100" aria-hidden />}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form key="name" onSubmit={next} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} noValidate>
                <div className="mb-4 flex items-center gap-3">
                  <Mascot className="size-16" />
                  <h1 className="text-2xl font-extrabold text-ink">Hi there! What should we call you?</h1>
                </div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-slate-700">
                  Your name
                </label>
                <input
                  id="name"
                  autoFocus
                  value={name}
                  maxLength={24}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="e.g. Aarav"
                  aria-invalid={touched && !!nameError}
                  aria-describedby="name-help"
                  className={cn(
                    'h-13 w-full rounded-xl border-2 px-4 text-lg font-semibold text-ink outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15',
                    touched && nameError ? 'border-rose-400' : 'border-slate-200',
                  )}
                />
                <p id="name-help" className={cn('mt-1.5 text-sm', touched && nameError ? 'font-semibold text-rose-600' : 'text-slate-500')}>
                  {touched && nameError ? nameError : 'This is how you’ll appear on leaderboards.'}
                </p>
                <Button type="submit" size="lg" full className="mt-6" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  Continue
                </Button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.div key="avatar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-extrabold text-ink">Choose your avatar, {trimmed}</h1>
                <p className="mt-1 text-slate-600">Pick an animal friend to join your quest.</p>
                <div role="radiogroup" aria-label="Avatar" className="mt-5 grid grid-cols-4 gap-3">
                  {avatars.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={avatarId === a.id}
                      aria-label={a.label}
                      onClick={() => setAvatarId(a.id)}
                      className={cn(
                        'grid aspect-square place-items-center rounded-2xl bg-gradient-to-br text-4xl transition sm:text-5xl',
                        a.bg,
                        avatarId === a.id ? 'scale-105 ring-4 ring-emerald-500' : 'ring-1 ring-slate-200 hover:scale-105',
                      )}
                    >
                      <span aria-hidden>{a.emoji}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(0)} icon={<ArrowLeft className="size-5" aria-hidden />}>
                    Back
                  </Button>
                  <Button size="lg" full onClick={() => next()} iconRight={<ArrowRight className="size-5" aria-hidden />}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="mode" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-extrabold text-ink">Choose your experience</h1>
                <p className="mt-1 text-slate-600">You can switch anytime — your progress in each is kept separately.</p>
                <div role="radiogroup" aria-label="Experience" className="mt-5 grid gap-3">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'kids'}
                    onClick={() => setMode('kids')}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition',
                      mode === 'kids' ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-lime-50 ring-4 ring-amber-200' : 'border-slate-200 hover:border-amber-300',
                    )}
                  >
                    <span className="text-5xl" aria-hidden>
                      🌱
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-fun text-xl font-semibold text-ink">EcoQuest Kids</span>
                      <span className="block text-sm font-semibold text-amber-800">Learn through Play.</span>
                      <span className="mt-1 block text-sm text-slate-600">Picture questions, playful games, Eco Stars and an adventure map.</span>
                    </span>
                    {mode === 'kids' && <Check className="size-6 text-amber-600" aria-hidden />}
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'plus'}
                    onClick={() => setMode('plus')}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition',
                      mode === 'plus' ? 'border-teal-600 bg-teal-50/60 ring-4 ring-teal-100' : 'border-slate-200 hover:border-teal-300',
                    )}
                  >
                    <span className="text-5xl" aria-hidden>
                      🌍
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-extrabold text-ink">EcoQuest 15+</span>
                      <span className="block text-sm font-semibold text-teal-700">Learn through Challenge.</span>
                      <span className="mt-1 block text-sm text-slate-600">Scenarios, data questions, timed challenges, leaderboards and analytics.</span>
                    </span>
                    {mode === 'plus' && <Check className="size-6 text-teal-700" aria-hidden />}
                  </button>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} icon={<ArrowLeft className="size-5" aria-hidden />}>
                    Back
                  </Button>
                  <Button size="lg" full onClick={finish} disabled={!mode} iconRight={<ArrowRight className="size-5" aria-hidden />}>
                    Enter EcoQuest
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <DemoStartModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
