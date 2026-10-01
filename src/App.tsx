import { MotionConfig } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { FocusLayout } from './components/layout/FocusLayout';
import { KidsLayout } from './components/layout/KidsLayout';
import { PlusLayout } from './components/layout/PlusLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { SystemBoot } from './components/loading/SystemBoot';
import { Landing } from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { Onboarding } from './pages/Onboarding';
import { AppProvider } from './store/AppProvider';

const KidsHome = lazy(() => import('./pages/kids/KidsHome'));
const KidsLearn = lazy(() => import('./pages/kids/KidsLearn'));
const KidsPlay = lazy(() => import('./pages/kids/KidsPlay'));
const KidsRewards = lazy(() => import('./pages/kids/KidsRewards'));
const KidsLeaderboard = lazy(() => import('./pages/kids/KidsLeaderboard'));
const KidsProfile = lazy(() => import('./pages/kids/KidsProfile'));
const PlusDashboard = lazy(() => import('./pages/plus/PlusDashboard'));
const PlusLearn = lazy(() => import('./pages/plus/PlusLearn'));
const PlusQuizzes = lazy(() => import('./pages/plus/PlusQuizzes'));
const PlusChallenges = lazy(() => import('./pages/plus/PlusChallenges'));
const PlusLeaderboard = lazy(() => import('./pages/plus/PlusLeaderboard'));
const PlusBadges = lazy(() => import('./pages/plus/PlusBadges'));
const PlusProgress = lazy(() => import('./pages/plus/PlusProgress'));
const PlusProfile = lazy(() => import('./pages/plus/PlusProfile'));
const LessonPage = lazy(() => import('./pages/shared/LessonPage'));
const QuizPage = lazy(() => import('./pages/shared/QuizPage'));
const ResultsPage = lazy(() => import('./pages/shared/ResultsPage'));
const GamePage = lazy(() => import('./pages/shared/GamePage'));

/** Scrolls to top on navigation (or to the #hash target when present). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export function App() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        {!bootComplete && <SystemBoot onComplete={() => setBootComplete(true)} />}
        <BrowserRouter>
          <ScrollManager />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/start" element={<Onboarding />} />

                    <Route path="/kids" element={<KidsLayout />}>
                      <Route index element={<KidsHome />} />
                      <Route path="learn" element={<KidsLearn />} />
                      <Route path="learn/:topicId" element={<LessonPage />} />
                      <Route path="play" element={<KidsPlay />} />
                      <Route path="quizzes" element={<KidsPlay />} />
                      <Route path="rewards" element={<KidsRewards />} />
                      <Route path="badges" element={<KidsRewards />} />
                      <Route path="leaderboard" element={<KidsLeaderboard />} />
                      <Route path="profile" element={<KidsProfile />} />
                      <Route path="results/:attemptId" element={<ResultsPage />} />
                    </Route>
                    <Route path="/kids" element={<FocusLayout mode="kids" />}>
                      <Route path="quiz" element={<QuizPage />} />
                      <Route path="game/:gameId" element={<GamePage />} />
                    </Route>

                    <Route path="/plus" element={<PlusLayout />}>
                      <Route index element={<PlusDashboard />} />
                      <Route path="learn" element={<PlusLearn />} />
                      <Route path="learn/:topicId" element={<LessonPage />} />
                      <Route path="quizzes" element={<PlusQuizzes />} />
                      <Route path="challenges" element={<PlusChallenges />} />
                      <Route path="leaderboard" element={<PlusLeaderboard />} />
                      <Route path="badges" element={<PlusBadges />} />
                      <Route path="progress" element={<PlusProgress />} />
                      <Route path="profile" element={<PlusProfile />} />
                      <Route path="results/:attemptId" element={<ResultsPage />} />
                    </Route>
                    <Route path="/plus" element={<FocusLayout mode="plus" />}>
                      <Route path="quiz" element={<QuizPage />} />
                      <Route path="game/:gameId" element={<GamePage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </AppProvider>
  );
}
