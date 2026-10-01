import { ArrowRight, Gamepad2, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Modal } from '@/components/ui/Modal';
import { getTopics } from '@/data';
import { useMode } from '@/hooks/useMode';
import { useStartQuiz } from '@/hooks/useStartQuiz';
import { generateQuiz } from '@/services/quiz';
import { useApp } from '@/store/context';
import type { Difficulty } from '@/types';

interface PresetRoom {
  pin: string;
  title: string;
  topicId: string;
  difficulty: Difficulty;
  players: number;
}

const PRESET_ROOMS: PresetRoom[] = [
  { pin: '482910', title: 'Climate Crisis & Solutions', topicId: 'climate-change', difficulty: 'medium', players: 42 },
  { pin: '771204', title: 'Ocean Plastics & Marine Life', topicId: 'oceans-water', difficulty: 'easy', players: 28 },
  { pin: '903411', title: 'Renewable Power & Tech', topicId: 'renewable-energy', difficulty: 'hard', players: 35 },
];

export function QuickPinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useMode();
  const { profile } = useApp();
  const navigate = useNavigate();
  const startQuiz = useStartQuiz(mode);

  const handleJoin = async (pinCode: string) => {
    const cleaned = pinCode.replace(/\s+/g, '');
    if (cleaned.length < 4) {
      setError('Please enter at least 4 digits');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // If not logged in, take them to start with return
      if (!profile) {
        onClose();
        navigate(`/start?pin=${cleaned}`);
        return;
      }

      // Check if matches preset room
      const preset = PRESET_ROOMS.find((r) => r.pin === cleaned);
      const topics = getTopics(mode);
      const chosenTopic = preset
        ? topics.find((t) => t.id === preset.topicId) ?? topics[0]
        : topics[parseInt(cleaned, 10) % topics.length];

      const difficulty: Difficulty = preset?.difficulty ?? (parseInt(cleaned.slice(-1), 10) % 2 === 0 ? 'medium' : 'easy');

      const quiz = await generateQuiz(
        {
          topicId: chosenTopic.id,
          topicName: chosenTopic.name,
          topicSummary: chosenTopic.summary,
          difficulty,
          questionCount: 10,
          timePerQuestion: 30,
          experienceMode: mode,
        },
        { preferAI: false },
      );

      onClose();
      startQuiz(quiz);
    } catch {
      setError('Could not connect to game PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleJoin(pin);
  };

  return (
    <Modal open={open} onClose={onClose} title="Join Game with PIN" className="max-w-md">
      <div className="space-y-5">
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/80 p-4 text-center">
          <p className="inline-flex items-center gap-1.5 font-bold text-rose-800 text-sm">
            <Gamepad2 className="size-4" aria-hidden /> Live Classroom or Challenge PIN
          </p>
          <p className="mt-1 text-xs text-rose-900/80">Enter the 6-digit game code provided by your teacher or friend.</p>

          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2.5">
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                placeholder="123 456"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(null);
                }}
                className="w-full rounded-2xl border-2 border-slate-900 bg-white py-3 text-center font-mono text-2xl font-black tracking-widest text-ink shadow-[0_4px_0_#0f172a] focus:border-teal-600 focus:outline-none"
              />
            </div>
            {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#22c55e] py-3 text-base font-extrabold text-slate-950 shadow-[0_4px_0_#0f172a] transition hover:bg-[#16a34a] active:translate-y-1 active:shadow-none disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Join Game'} <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wide uppercase text-slate-500">Popular Live Rooms</p>
          <div className="mt-2 space-y-2">
            {PRESET_ROOMS.map((room) => (
              <button
                key={room.pin}
                type="button"
                onClick={() => {
                  setPin(room.pin);
                  handleJoin(room.pin);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-teal-400 hover:bg-teal-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md">
                      #{room.pin}
                    </span>
                    <span className="font-bold text-sm text-ink">{room.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 capitalize">{room.difficulty} mode</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Users className="size-3.5" />
                  <span>{room.players} joined</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
