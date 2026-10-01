import { ArrowLeft, Trophy } from 'lucide-react';
import { useCallback } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { GameShell } from '@/components/games/GameShell';
import { getGame, isGameId } from '@/data/games';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { GameRecord } from '@/types';

/** Standalone 10-second challenge — every round is committed to progress immediately. */
export default function GamePage() {
  const { gameId } = useParams();
  const { mode, progress } = useMode();
  const { completeGame } = useApp();
  const navigate = useNavigate();
  const valid = isGameId(gameId) && getGame(gameId).mode === mode;
  useDocumentTitle(valid ? getGame(gameId).name : 'Challenge');

  const onRound = useCallback((rec: GameRecord) => completeGame(mode, rec), [completeGame, mode]);

  if (!valid) return <Navigate to={paths(mode).games} replace />;
  const best = progress.bestGameScores[gameId];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link to={paths(mode).games} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-black/5 hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </Link>
        {best !== undefined && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-bold text-gold-700 shadow-sm ring-1 ring-black/5">
            <Trophy className="size-4" aria-hidden /> Best: {best}
          </span>
        )}
      </div>
      <GameShell gameId={gameId} context="standalone" onRound={onRound} onExit={() => navigate(paths(mode).games)} />
    </div>
  );
}
