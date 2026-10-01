import type { ExperienceMode } from '@/types';

/**
 * DEMO leaderboard players. In local/offline mode there is only one real learner, so these
 * seeded players make the leaderboard meaningful. They are always labelled "Demo" in the UI.
 * With Firebase configured, real learners are merged in alongside them.
 */
export interface DemoPlayer {
  id: string;
  name: string;
  avatarId: string;
  baseXp: number;
  /** Typical XP per week — varied deterministically week to week. */
  weeklyBase: number;
  streak: number;
  isFriend: boolean;
  city?: string;
}

export const demoPlayers: Record<ExperienceMode, DemoPlayer[]> = {
  kids: [
    { id: 'dk-1', name: 'Aanya', avatarId: 'butterfly', baseXp: 2650, weeklyBase: 520, streak: 12, isFriend: true },
    { id: 'dk-2', name: 'Kabir', avatarId: 'tiger', baseXp: 2310, weeklyBase: 470, streak: 9, isFriend: false },
    { id: 'dk-3', name: 'Meera', avatarId: 'owl', baseXp: 1980, weeklyBase: 430, streak: 7, isFriend: true },
    { id: 'dk-4', name: 'Rohan', avatarId: 'frog', baseXp: 1720, weeklyBase: 300, streak: 4, isFriend: false },
    { id: 'dk-5', name: 'Zoya', avatarId: 'dolphin', baseXp: 1490, weeklyBase: 390, streak: 6, isFriend: true },
    { id: 'dk-6', name: 'Vihaan', avatarId: 'elephant', baseXp: 1210, weeklyBase: 260, streak: 3, isFriend: false },
    { id: 'dk-7', name: 'Ishita', avatarId: 'bee', baseXp: 980, weeklyBase: 340, streak: 5, isFriend: true },
    { id: 'dk-8', name: 'Arjun', avatarId: 'penguin', baseXp: 760, weeklyBase: 210, streak: 2, isFriend: false },
    { id: 'dk-9', name: 'Sara', avatarId: 'koala', baseXp: 540, weeklyBase: 180, streak: 2, isFriend: false },
    { id: 'dk-10', name: 'Dev', avatarId: 'turtle', baseXp: 330, weeklyBase: 150, streak: 1, isFriend: true },
    { id: 'dk-11', name: 'Tara', avatarId: 'panda', baseXp: 180, weeklyBase: 120, streak: 1, isFriend: false },
  ],
  plus: [
    { id: 'dp-1', name: 'Priya Sharma', avatarId: 'owl', baseXp: 6120, weeklyBase: 980, streak: 28, isFriend: false, city: 'Pune' },
    { id: 'dp-2', name: 'Arjun Mehta', avatarId: 'tiger', baseXp: 5480, weeklyBase: 860, streak: 19, isFriend: true, city: 'Mumbai' },
    { id: 'dp-3', name: 'Sneha Iyer', avatarId: 'dolphin', baseXp: 4870, weeklyBase: 740, streak: 15, isFriend: false, city: 'Bengaluru' },
    { id: 'dp-4', name: 'Fatima Khan', avatarId: 'butterfly', baseXp: 4310, weeklyBase: 910, streak: 22, isFriend: true, city: 'New Delhi' },
    { id: 'dp-5', name: 'Rahul Verma', avatarId: 'fox', baseXp: 3790, weeklyBase: 520, streak: 8, isFriend: false, city: 'Jaipur' },
    { id: 'dp-6', name: 'Emily Chen', avatarId: 'panda', baseXp: 3350, weeklyBase: 610, streak: 11, isFriend: false, city: 'Singapore' },
    { id: 'dp-7', name: 'Karan Singh', avatarId: 'elephant', baseXp: 2940, weeklyBase: 450, streak: 6, isFriend: true, city: 'Chandigarh' },
    { id: 'dp-8', name: 'Ananya Das', avatarId: 'bee', baseXp: 2560, weeklyBase: 690, streak: 13, isFriend: false, city: 'Kolkata' },
    { id: 'dp-9', name: 'Lucas Silva', avatarId: 'turtle', baseXp: 2210, weeklyBase: 380, streak: 4, isFriend: false, city: 'São Paulo' },
    { id: 'dp-10', name: 'Meera Pillai', avatarId: 'frog', baseXp: 1890, weeklyBase: 560, streak: 9, isFriend: true, city: 'Kozhikode' },
    { id: 'dp-11', name: 'Aisha Bello', avatarId: 'koala', baseXp: 1570, weeklyBase: 340, streak: 5, isFriend: false, city: 'Lagos' },
    { id: 'dp-12', name: 'Ishaan Gupta', avatarId: 'penguin', baseXp: 1240, weeklyBase: 410, streak: 7, isFriend: true, city: 'New Delhi' },
    { id: 'dp-13', name: 'Noah Fischer', avatarId: 'owl', baseXp: 960, weeklyBase: 250, streak: 3, isFriend: false, city: 'Munich' },
    { id: 'dp-14', name: 'Rohan Nair', avatarId: 'fox', baseXp: 690, weeklyBase: 300, streak: 4, isFriend: false, city: 'Bengaluru' },
    { id: 'dp-15', name: 'Daniel Kim', avatarId: 'panda', baseXp: 420, weeklyBase: 190, streak: 2, isFriend: false, city: 'Seoul' },
    { id: 'dp-16', name: 'Tanvi Joshi', avatarId: 'butterfly', baseXp: 210, weeklyBase: 140, streak: 1, isFriend: true, city: 'Pune' },
  ],
};
