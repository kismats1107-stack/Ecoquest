import { Droplets, Globe, Home, Leaf, Recycle, Sparkles, SunMedium, Trees } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMode } from '@/hooks/useMode';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

const CATEGORIES = [
  { id: 'start', label: 'Start', icon: Home, topicId: null },
  { id: 'climate', label: 'Climate & Air', icon: Leaf, topicId: 'climate-change' },
  { id: 'oceans', label: 'Oceans & Marine', icon: Droplets, topicId: 'oceans-water' },
  { id: 'forests', label: 'Forests & Nature', icon: Trees, topicId: 'biodiversity-ecosystems' },
  { id: 'energy', label: 'Clean Energy', icon: SunMedium, topicId: 'renewable-energy' },
  { id: 'waste', label: 'Waste & Circular', icon: Recycle, topicId: 'waste-recycling' },
  { id: 'earth', label: 'Earth & Systems', icon: Globe, topicId: 'ecosystems' },
  { id: 'trivia', label: 'Eco Trivia', icon: Sparkles, topicId: 'habits-footprint' },
];

export function CategoryPillsBar({ activeId = 'start', onSelect }: { activeId?: string; onSelect?: (id: string) => void }) {
  const { mode } = useMode();
  const { profile } = useApp();
  const navigate = useNavigate();

  const handleClick = (item: (typeof CATEGORIES)[number]) => {
    if (onSelect) {
      onSelect(item.id);
      return;
    }
    if (item.id === 'start') {
      if (profile) navigate(paths(mode).home);
      else navigate('/');
      return;
    }
    if (profile) {
      navigate(`${paths(mode).generator}?topic=${item.topicId ?? ''}`);
    } else {
      navigate(`/start?topic=${item.topicId ?? ''}`);
    }
  };

  return (
    <div className="border-b border-slate-100 bg-[#FBF8F2] px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleClick(cat)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition sm:text-sm ${
                isActive
                  ? 'border-2 border-slate-900 bg-white text-slate-950 shadow-[0_2px_0_#0f172a]'
                  : 'text-slate-600 hover:bg-white/80 hover:text-ink'
              }`}
            >
              <Icon className={`size-4 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
