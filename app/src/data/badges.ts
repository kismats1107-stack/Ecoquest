import type { ModeStats, TopicGroup } from '@/types';

export type BadgeMetric =
  | { kind: 'stat'; stat: keyof ModeStats }
  | { kind: 'bestStreak' }
  | { kind: 'groupCorrect'; groups: TopicGroup[] }
  | { kind: 'level' };

export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  /** Key into the UI icon registry. */
  icon: string;
  description: string;
  kidsDescription: string;
  requirement: string;
  target: number;
  metric: BadgeMetric;
  tier: 'bronze' | 'silver' | 'gold';
}

/** Badges are evaluated separately for Kids and 15+ progress. */
export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'eco-starter',
    name: 'Eco Starter',
    emoji: '🌱',
    icon: 'sprout',
    description: 'Complete your first quiz.',
    kidsDescription: 'You finished your very first quiz!',
    requirement: 'Complete 1 quiz',
    target: 1,
    metric: { kind: 'stat', stat: 'quizzesCompleted' },
    tier: 'bronze',
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    emoji: '📚',
    icon: 'book',
    description: 'Finish lessons to build your knowledge base.',
    kidsDescription: 'Read 4 lesson cards from start to finish.',
    requirement: 'Complete 4 lessons',
    target: 4,
    metric: { kind: 'stat', stat: 'lessonsCompleted' },
    tier: 'bronze',
  },
  {
    id: 'game-champ',
    name: 'Challenge Champ',
    emoji: '🎮',
    icon: 'gamepad',
    description: 'Win 10-second challenges.',
    kidsDescription: 'Win 5 super-quick games!',
    requirement: 'Win 5 ten-second challenges',
    target: 5,
    metric: { kind: 'stat', stat: 'gamesWon' },
    tier: 'bronze',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    emoji: '⚡',
    icon: 'zap',
    description: 'Answer correctly in the first third of the timer, without hints.',
    kidsDescription: 'Answer 10 questions right super fast!',
    requirement: '10 lightning-fast correct answers',
    target: 10,
    metric: { kind: 'stat', stat: 'fastAnswers' },
    tier: 'silver',
  },
  {
    id: 'recycling-hero',
    name: 'Recycling Hero',
    emoji: '♻️',
    icon: 'recycle',
    description: 'Master waste, recycling and circular-economy questions.',
    kidsDescription: 'Get 15 recycling questions right.',
    requirement: '15 correct answers on waste topics',
    target: 15,
    metric: { kind: 'groupCorrect', groups: ['waste'] },
    tier: 'silver',
  },
  {
    id: 'climate-champion',
    name: 'Climate Champion',
    emoji: '🌍',
    icon: 'earth',
    description: 'Master climate, carbon, energy and air questions.',
    kidsDescription: 'Get 15 planet, energy or clean-air questions right.',
    requirement: '15 correct answers on climate & energy topics',
    target: 15,
    metric: { kind: 'groupCorrect', groups: ['climate', 'planet', 'air', 'energy'] },
    tier: 'silver',
  },
  {
    id: 'water-guardian',
    name: 'Water Guardian',
    emoji: '💧',
    icon: 'droplets',
    description: 'Master water conservation and water security questions.',
    kidsDescription: 'Get 15 water questions right.',
    requirement: '15 correct answers on water topics',
    target: 15,
    metric: { kind: 'groupCorrect', groups: ['water'] },
    tier: 'silver',
  },
  {
    id: 'biodiversity-protector',
    name: 'Biodiversity Protector',
    emoji: '🦋',
    icon: 'bird',
    description: 'Master biodiversity, forest and wildlife questions.',
    kidsDescription: 'Get 15 animal or forest questions right.',
    requirement: '15 correct answers on nature topics',
    target: 15,
    metric: { kind: 'groupCorrect', groups: ['biodiversity', 'forests'] },
    tier: 'silver',
  },
  {
    id: 'perfect-run',
    name: 'Perfect Run',
    emoji: '🎯',
    icon: 'target',
    description: 'Score 100% on a quiz of 5 or more questions.',
    kidsDescription: 'Get every answer right in a quiz!',
    requirement: 'One perfect quiz (5+ questions)',
    target: 1,
    metric: { kind: 'stat', stat: 'perfectQuizzes' },
    tier: 'silver',
  },
  {
    id: 'summit-seeker',
    name: 'Summit Seeker',
    emoji: '🏔️',
    icon: 'mountain',
    description: 'Score 80% or more on a Hard quiz.',
    kidsDescription: 'Score 80% or more on a Hard quiz.',
    requirement: '80%+ on a Hard quiz',
    target: 1,
    metric: { kind: 'stat', stat: 'hardQuizzesAced' },
    tier: 'gold',
  },
  {
    id: 'daily-hero',
    name: 'Daily Hero',
    emoji: '☀️',
    icon: 'sun',
    description: 'Complete Today’s Eco Challenge three times.',
    kidsDescription: 'Finish 3 of Today’s Missions.',
    requirement: 'Complete 3 daily challenges',
    target: 3,
    metric: { kind: 'stat', stat: 'dailyCompleted' },
    tier: 'gold',
  },
  {
    id: 'seven-day-learner',
    name: '7-Day Learner',
    emoji: '📅',
    icon: 'calendar',
    description: 'Learn on 7 days in a row.',
    kidsDescription: 'Play and learn 7 days in a row!',
    requirement: 'Reach a 7-day streak',
    target: 7,
    metric: { kind: 'bestStreak' },
    tier: 'gold',
  },
  {
    id: 'knowledge-master',
    name: 'Knowledge Master',
    emoji: '🧠',
    icon: 'brain',
    description: 'Answer 100 questions correctly.',
    kidsDescription: 'Get 100 answers right!',
    requirement: '100 correct answers',
    target: 100,
    metric: { kind: 'stat', stat: 'correctAnswers' },
    tier: 'gold',
  },
  {
    id: 'ecoquest-legend',
    name: 'EcoQuest Legend',
    emoji: '👑',
    icon: 'crown',
    description: 'Reach level 10.',
    kidsDescription: 'Become an Earth Hero at level 10!',
    requirement: 'Reach level 10',
    target: 10,
    metric: { kind: 'level' },
    tier: 'gold',
  },
];

export function getBadge(id: string): BadgeDefinition | undefined {
  return badgeDefinitions.find((b) => b.id === id);
}
