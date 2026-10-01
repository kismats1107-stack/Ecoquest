import {
  Award,
  BookOpen,
  Cookie,
  Globe2,
  House,
  Landmark,
  Leaf,
  ListChecks,
  MessageCircle,
  Palette,
  Search,
  Star,
  User,
  HelpCircle,
  Dumbbell,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useSearchParams, useNavigate } from 'react-router';
import { BubblyLogo } from '../brand/BubblyLogo';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/context';
import { Avatar } from '../ui/Avatar';
import { AccountMenu } from './AccountMenu';
import { CelebrationLayer } from './CelebrationLayer';
import { ModeGuard } from './ModeGuard';

// Categories matching Image 1 sub-navigation bar
export const KIDS_CATEGORIES = [
  { id: 'start', label: 'Start', icon: House, iconColor: 'text-rose-500' },
  { id: 'art-literature', label: 'Art & Literature', icon: Palette, iconColor: 'text-amber-500' },
  { id: 'entertainment', label: 'Entertainment', icon: Star, iconColor: 'text-yellow-500' },
  { id: 'geography', label: 'Geography', icon: Globe2, iconColor: 'text-emerald-500' },
  { id: 'history', label: 'History', icon: Landmark, iconColor: 'text-amber-700' },
  { id: 'languages', label: 'Languages', icon: MessageCircle, iconColor: 'text-sky-500' },
  { id: 'science-nature', label: 'Science & Nature', icon: Leaf, iconColor: 'text-green-600' },
  { id: 'sports', label: 'Sports', icon: Dumbbell, iconColor: 'text-orange-500' },
  { id: 'trivia', label: 'Trivia', icon: HelpCircle, iconColor: 'text-purple-500' },
];

// Mobile Bottom Dock items
const MOBILE_DOCK = [
  { to: '/kids', label: 'Home', icon: House, end: true, color: 'text-emerald-600' },
  { to: '/kids/learn', label: 'Learn', icon: BookOpen, end: false, color: 'text-sky-600' },
  { to: '/kids/play', label: 'Quizzes', icon: ListChecks, end: false, color: 'text-orange-500' },
  { to: '/kids/rewards', label: 'Badges', icon: Award, end: false, color: 'text-amber-500' },
  { to: '/kids/profile', label: 'Profile', icon: User, end: false, color: 'text-violet-600' },
];

function KidsShell() {
  const s = useStrings();
  const { profile } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'start';

  const [cookieDismissed, setCookieDismissed] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim()) {
      navigate(`/kids/play?pin=${encodeURIComponent(pinCode.trim())}`);
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'start') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: catId });
    }
  };

  return (
    <div data-mode="kids" className="bg-[#FAF7F2] min-h-dvh text-slate-900 font-sans selection:bg-[#FFE66D] selection:text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        {s.nav.skipToContent}
      </a>

      {/* 1. TOP NOTICE / COOKIE BANNER MATCHING IMAGE 1 */}
      {!cookieDismissed && (
        <aside
          aria-label="Cookie and data policy"
          className="bg-[#EFE9DF] border-b border-[#E2D9CC] py-1.5 px-4 text-center text-xs sm:text-[13px] font-medium text-slate-800 transition-all flex items-center justify-center gap-2 flex-wrap"
        >
          <span>
            To make EcoQuest work, we log user data. By using EcoQuest you agree to our{' '}
            <a href="#privacy" className="underline font-bold hover:text-black">
              Privacy Policy
            </a>
            , including cookie policy.
          </span>
          <button
            type="button"
            onClick={() => setCookieDismissed(true)}
            className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-black hover:underline cursor-pointer ml-1"
          >
            <Cookie className="size-3.5 text-amber-700" />
            <span>Hide this</span>
          </button>
        </aside>
      )}

      {/* 2. MAIN HEADER MATCHING IMAGE 1 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: Playful Bubbly Logo */}
          <div className="shrink-0">
            <BubblyLogo to="/kids" />
          </div>

          {/* Center: Salmon / Pink Rounded Container for PIN Join */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-4">
            <form
              onSubmit={handlePinSubmit}
              className="flex items-center gap-3 bg-[#FFA599] rounded-2xl px-5 py-2 border-2 border-slate-900 shadow-[0_3px_0_#0f172a]"
            >
              <label htmlFor="quiz-pin-input" className="text-sm sm:text-base font-black text-slate-900 shrink-0">
                Join Game? Enter PIN:
              </label>
              <div className="relative">
                <input
                  id="quiz-pin-input"
                  type="text"
                  maxLength={8}
                  placeholder="123 456"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-32 sm:w-36 h-9 rounded-full border-2 border-slate-900 bg-white px-3 text-center font-mono text-sm font-black tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white hover:bg-slate-800 transition active:scale-95"
              >
                Go
              </button>
            </form>
          </div>

          {/* Right: Search Circle Button + Lime Green "Sign in" / Profile Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Icon Button with black border */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search quizzes and topics"
              className="size-10 rounded-full border-2 border-slate-900 bg-slate-100 flex items-center justify-center text-slate-800 shadow-[0_2px_0_#0f172a] hover:bg-slate-200 active:translate-y-0.5 active:shadow-none transition"
            >
              <Search className="size-4.5 stroke-[2.5]" />
            </button>

            {/* Lime Green Sign In / Profile Pill Button */}
            {profile ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/kids/profile"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-[#A6F076] px-4 py-2 font-black text-xs sm:text-sm text-slate-900 shadow-[0_3px_0_#0f172a] hover:bg-[#92E65E] transition active:translate-y-0.5 active:shadow-none"
                  aria-label="View user profile"
                >
                  <div className="size-5 rounded-full overflow-hidden ring-1 ring-slate-900">
                    <Avatar avatarId={profile.avatarId} size="xs" />
                  </div>
                  <span>{profile.name.split(' ')[0]}</span>
                </Link>
                <AccountMenu />
              </div>
            ) : (
              <Link
                to="/start"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-[#A6F076] px-5 py-2 font-black text-sm text-slate-900 shadow-[0_3px_0_#0f172a] hover:bg-[#92E65E] transition active:translate-y-0.5 active:shadow-none"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile PIN Form for smaller screens */}
        <div className="flex md:hidden px-4 pb-2.5">
          <form
            onSubmit={handlePinSubmit}
            className="flex items-center justify-between w-full gap-2 bg-[#FFA599] rounded-xl px-3 py-1.5 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
          >
            <span className="text-xs font-black text-slate-900">Join Game PIN:</span>
            <input
              type="text"
              placeholder="123 456"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-24 h-7 rounded-full border-2 border-slate-900 bg-white px-2 text-center font-mono text-xs font-black"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white"
            >
              Go
            </button>
          </form>
        </div>

        {/* 3. SUB-NAVIGATION CATEGORY BAR MATCHING IMAGE 1 */}
        <div className="border-t border-slate-200/80 bg-white/90 backdrop-blur-xs overflow-x-auto scrollbar-none">
          <nav aria-label="Quiz categories" className="mx-auto flex max-w-7xl items-center px-4 sm:px-6">
            <ul className="flex items-center gap-1 sm:gap-2 min-w-max py-1.5">
              {KIDS_CATEGORIES.map(({ id, label, icon: Icon, iconColor }) => {
                const isActive = activeCategory === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(id)}
                      className={cn(
                        'relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer',
                        isActive
                          ? 'text-slate-900 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                      )}
                    >
                      <Icon className={cn('size-4 sm:size-4.5', iconColor)} />
                      <span>{label}</span>

                      {/* Black Underline for Active Category Item */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-2 h-[3px] rounded-full bg-slate-900" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-28 lg:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Dock Bar */}
      <nav
        aria-label="Mobile Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-slate-900/10 bg-white pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden shadow-lg"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {MOBILE_DOCK.map(({ to, label, icon: Icon, end, color }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex h-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-black transition',
                    isActive ? 'text-slate-900' : 'text-slate-400',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'grid h-7 w-12 place-items-center rounded-xl transition',
                        isActive && 'bg-[#A6F076] border-2 border-slate-900 shadow-xs',
                      )}
                    >
                      <Icon className={cn('size-4', isActive ? 'text-slate-900' : color)} aria-hidden />
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search Modal */}
      {showSearchModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[0_8px_0_#0f172a]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-fun text-xl font-black text-slate-900">Search EcoQuizzes</h3>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="size-8 rounded-full border-2 border-slate-900 bg-slate-100 flex items-center justify-center font-black hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="relative">
              <input
                type="search"
                autoFocus
                placeholder="Search wildlife, oceans, recycling, climate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setShowSearchModal(false);
                    navigate(`/kids/play?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider py-1">Popular:</span>
              {['Ocean Life', 'Solar Energy', 'Rainforests', 'Zero Waste'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate(`/kids/play?q=${encodeURIComponent(tag)}`);
                  }}
                  className="rounded-full border border-slate-900/30 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-[#FFE66D] hover:border-slate-900"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CelebrationLayer />
    </div>
  );
}

export function KidsLayout() {
  return (
    <ModeGuard mode="kids">
      <KidsShell />
    </ModeGuard>
  );
}
