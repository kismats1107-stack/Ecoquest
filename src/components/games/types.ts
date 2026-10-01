export type GameStatus = 'countdown' | 'playing' | 'over';

/** Contract every 10-second game implements. The GameShell owns timing and rewards. */
export interface GameComponentProps {
  status: GameStatus;
  topicId?: string;
  /** Changes every round so each replay is different. */
  seed: number;
  /** Report the current score whenever it changes. */
  onScore: (score: number) => void;
  /** Call when the game ends early (e.g. every pair matched). */
  onFinish: () => void;
}
