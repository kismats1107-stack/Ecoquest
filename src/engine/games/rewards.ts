import { GAMIFICATION } from '@/config/gamification';
import type { GameDefinition } from '@/data/games';
import type { GameId, GameRecord } from '@/types';

/** Mini-game rewards: 10–50 XP scaled by performance; winning pays more XP and coins. */
export function computeGameReward(def: Pick<GameDefinition, 'target' | 'perfectScore'>, score: number) {
  const g = GAMIFICATION.game;
  const ratio = Math.max(0, Math.min(1, score / def.perfectScore));
  const success = score >= def.target;
  const xp = success ? Math.round(g.winBaseXp + (g.maxXp - g.winBaseXp) * ratio) : Math.round(g.minXp + 10 * ratio);
  const coins = success ? Math.round(g.winMinCoins + (g.winMaxCoins - g.winMinCoins) * ratio) : g.lossCoins;
  return { success, xp: Math.min(g.maxXp, Math.max(g.minXp, xp)), coins };
}

export function makeGameRecord(
  def: Pick<GameDefinition, 'id' | 'target' | 'perfectScore'>,
  score: number,
  context: GameRecord['context'],
  now: number,
  topicId?: string,
): GameRecord {
  const reward = computeGameReward(def, score);
  return {
    gameId: def.id as GameId,
    score,
    target: def.target,
    success: reward.success,
    skipped: false,
    xp: reward.xp,
    coins: reward.coins,
    playedAt: now,
    topicId,
    context,
  };
}

export function skippedGameRecord(gameId: GameId, target: number, now: number, topicId?: string): GameRecord {
  return { gameId, score: 0, target, success: false, skipped: true, xp: 0, coins: 0, playedAt: now, topicId, context: 'quiz' };
}
