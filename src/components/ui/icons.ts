import {
  BookOpen,
  Brain,
  CalendarCheck,
  Crown,
  Droplets,
  Earth,
  Gamepad2,
  Mountain,
  Recycle,
  Bird,
  Sprout,
  Sun,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** Maps icon keys used in content data to Lucide components. */
export const iconRegistry: Record<string, LucideIcon> = {
  sprout: Sprout,
  book: BookOpen,
  gamepad: Gamepad2,
  zap: Zap,
  recycle: Recycle,
  earth: Earth,
  droplets: Droplets,
  bird: Bird,
  target: Target,
  mountain: Mountain,
  sun: Sun,
  calendar: CalendarCheck,
  brain: Brain,
  crown: Crown,
};

export function iconFor(key: string): LucideIcon {
  return iconRegistry[key] ?? Sprout;
}
