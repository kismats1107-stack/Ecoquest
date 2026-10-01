import type { ExperienceMode, GameId } from '@/types';

export interface GameDefinition {
  id: GameId;
  mode: ExperienceMode;
  name: string;
  tagline: string;
  emoji: string;
  /** Tailwind colour family for cards. */
  tone: 'emerald' | 'sky' | 'amber' | 'orange' | 'teal' | 'violet' | 'lime' | 'rose';
  durationSec: number;
  /** Score needed to succeed. */
  target: number;
  /** Score that earns the maximum reward. */
  perfectScore: number;
  scoreLabel: string;
  howTo: string[];
  controls: string;
  /** What the game teaches — shown on the result screen. */
  learning: string;
}

export const GAME_DURATION_SEC = 10;

export const gameDefinitions: GameDefinition[] = [
  {
    id: 'recycle-sort',
    mode: 'kids',
    name: 'Recycle Sort',
    tagline: 'Sort the trash into the right bin!',
    emoji: '♻️',
    tone: 'emerald',
    durationSec: GAME_DURATION_SEC,
    target: 4,
    perfectScore: 8,
    scoreLabel: 'items sorted',
    howTo: ['An item pops up.', 'Drag it — or tap a bin — to sort it.', 'Recyclable ♻️, Organic 🍂 or E-Waste 🔋?'],
    controls: 'Drag, tap a bin, or press 1 · 2 · 3',
    learning: 'Sorting waste correctly means more gets recycled or composted — and less ends up in landfills.',
  },
  {
    id: 'memory-match',
    mode: 'kids',
    name: 'Memory Match',
    tagline: 'Find the matching nature cards!',
    emoji: '🧠',
    tone: 'violet',
    durationSec: GAME_DURATION_SEC,
    target: 4,
    perfectScore: 4,
    scoreLabel: 'pairs found',
    howTo: ['Peek at the cards during the countdown.', 'Then flip two cards at a time.', 'Match all 4 pairs before time runs out!'],
    controls: 'Tap or press Enter on a card',
    learning: 'Every card is part of our planet’s story — remembering them helps you remember how to protect them.',
  },
  {
    id: 'clean-ocean',
    mode: 'kids',
    name: 'Clean the Ocean',
    tagline: 'Scoop up litter — but don’t touch the sea friends!',
    emoji: '🌊',
    tone: 'sky',
    durationSec: GAME_DURATION_SEC,
    target: 6,
    perfectScore: 12,
    scoreLabel: 'pieces of litter',
    howTo: ['Litter floats across the ocean.', 'Tap each piece of trash to remove it.', 'Don’t tap the turtles and fish!'],
    controls: 'Tap or click the litter',
    learning: 'Millions of tonnes of plastic reach the ocean every year. Less litter on land means a cleaner sea.',
  },
  {
    id: 'carbon-footprint',
    mode: 'plus',
    name: 'Carbon Footprint Challenge',
    tagline: 'Make rapid low-carbon choices before the meter fills.',
    emoji: '👣',
    tone: 'teal',
    durationSec: GAME_DURATION_SEC,
    target: 4,
    perfectScore: 7,
    scoreLabel: 'low-carbon choices',
    howTo: ['Two everyday options appear.', 'Pick the one with the lower carbon footprint.', 'Every choice moves the footprint meter.'],
    controls: 'Click an option, or press ← / →',
    learning: 'Travel, food and home energy choices dominate personal footprints — the gaps between options can be 10× or more.',
  },
  {
    id: 'food-web',
    mode: 'plus',
    name: 'Food-Web Puzzle',
    tagline: 'Rebuild the food chain from producer to top predator.',
    emoji: '🕸️',
    tone: 'lime',
    durationSec: GAME_DURATION_SEC,
    target: 4,
    perfectScore: 10,
    scoreLabel: 'links connected',
    howTo: ['Organisms from one ecosystem appear.', 'Tap them in order: producer → primary → secondary → tertiary consumer.', 'Complete a chain to unlock the next ecosystem.'],
    controls: 'Click or press 1 – 4',
    learning: 'Energy flows from producers up the food chain. Remove one link and the whole web is affected.',
  },
  {
    id: 'eco-decisions',
    mode: 'plus',
    name: 'Eco Decisions',
    tagline: 'You run the city. Choose fast — see the consequences.',
    emoji: '🏙️',
    tone: 'violet',
    durationSec: GAME_DURATION_SEC,
    target: 3,
    perfectScore: 6,
    scoreLabel: 'sustainable decisions',
    howTo: ['A city problem appears.', 'Pick the more sustainable policy.', 'Watch the consequence, then decide again.'],
    controls: 'Click an option, or press ← / →',
    learning: 'Sustainable policies often cost a little more up front but avoid much bigger costs later.',
  },
];

export function getGame(id: GameId): GameDefinition {
  const game = gameDefinitions.find((g) => g.id === id);
  if (!game) throw new Error(`Unknown game ${id}`);
  return game;
}

export function getGamesForMode(mode: ExperienceMode): GameDefinition[] {
  return gameDefinitions.filter((g) => g.mode === mode);
}

export function isGameId(value: string | undefined): value is GameId {
  return gameDefinitions.some((g) => g.id === value);
}
