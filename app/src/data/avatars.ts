export interface Avatar {
  id: string;
  emoji: string;
  label: string;
  /** Background gradient classes for the avatar bubble. */
  bg: string;
}

export const avatars: Avatar[] = [
  { id: 'fox', emoji: '🦊', label: 'Fox', bg: 'from-orange-200 to-amber-100' },
  { id: 'panda', emoji: '🐼', label: 'Panda', bg: 'from-slate-200 to-white' },
  { id: 'turtle', emoji: '🐢', label: 'Turtle', bg: 'from-emerald-200 to-lime-100' },
  { id: 'owl', emoji: '🦉', label: 'Owl', bg: 'from-amber-200 to-orange-100' },
  { id: 'bee', emoji: '🐝', label: 'Bee', bg: 'from-yellow-200 to-amber-100' },
  { id: 'dolphin', emoji: '🐬', label: 'Dolphin', bg: 'from-sky-200 to-cyan-100' },
  { id: 'tiger', emoji: '🐯', label: 'Tiger', bg: 'from-orange-200 to-yellow-100' },
  { id: 'elephant', emoji: '🐘', label: 'Elephant', bg: 'from-slate-200 to-sky-100' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin', bg: 'from-sky-200 to-slate-100' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly', bg: 'from-violet-200 to-sky-100' },
  { id: 'frog', emoji: '🐸', label: 'Frog', bg: 'from-lime-200 to-emerald-100' },
  { id: 'koala', emoji: '🐨', label: 'Koala', bg: 'from-stone-200 to-slate-100' },
];

export function getAvatar(id: string): Avatar {
  return avatars.find((a) => a.id === id) ?? avatars[0];
}
