import type { BankQuestion, QuestionTemplate } from '@/types';
import { pick, shuffle } from '@/engine/random';
import { numericOptions } from '../numericOptions';
import { habitatNames, habitats, sortItems, type BinId } from './games';

const BIN_LABEL: Record<BinId, string> = {
  recyclable: 'Recycling bin',
  organic: 'Organic (compost) bin',
  ewaste: 'E-waste box',
};

const BIN_HINT: Record<BinId, string> = {
  recyclable: 'Can it be made into something new?',
  organic: 'Did it come from a plant or an animal?',
  ewaste: 'Does it use electricity or batteries?',
};

// The hand-written bank already asks about these items.
const BANK_SORT_ITEMS = new Set(['banana', 'battery', 'can']);
const BANK_HABITAT_ANIMALS = new Set(['polar bear', 'camel']);

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

export const kidsTemplates: QuestionTemplate[] = [
  {
    id: 'k-recycling-bin',
    topicId: 'k-recycling',
    difficulty: 'easy',
    generate: (rng): BankQuestion => {
      const item = pick(sortItems.filter((i) => !BANK_SORT_ITEMS.has(i.id)), rng);
      const wrongBins = (Object.keys(BIN_LABEL) as BinId[]).filter((b) => b !== item.bin).map((b) => BIN_LABEL[b]);
      return {
        id: `k-recycling-gen-bin-${item.id}`,
        topicId: 'k-recycling',
        difficulty: 'easy',
        type: 'visual',
        visual: item.emoji,
        question: item.plural ? `Where should ${item.label.toLowerCase()} go?` : `Where should ${article(item.label)} ${item.label.toLowerCase()} go?`,
        correct: BIN_LABEL[item.bin],
        wrong: [...wrongBins, 'Drop it on the ground'],
        explanation: `${item.label} ${item.plural ? 'go' : 'goes'} in the ${BIN_LABEL[item.bin].toLowerCase()}. ${item.tip}`,
        hint: BIN_HINT[item.bin],
      };
    },
  },
  {
    id: 'k-animals-habitat',
    topicId: 'k-animals',
    difficulty: 'easy',
    generate: (rng): BankQuestion => {
      const animal = pick(habitats.filter((h) => !BANK_HABITAT_ANIMALS.has(h.animal)), rng);
      const wrong = shuffle(
        habitatNames.filter((h) => h !== animal.habitat),
        rng,
      ).slice(0, 3);
      return {
        id: `k-animals-gen-habitat-${animal.animal.replace(/\s+/g, '-')}`,
        topicId: 'k-animals',
        difficulty: 'easy',
        type: 'visual',
        visual: animal.emoji,
        question: `Where does ${article(animal.animal)} ${animal.animal} live in the wild?`,
        correct: animal.habitat,
        wrong,
        explanation: animal.fact,
        hint: 'Think about what keeps this animal comfortable — cold, hot, wet or dry?',
      };
    },
  },
  {
    id: 'k-water-brushing',
    topicId: 'k-water',
    difficulty: 'medium',
    generate: (rng): BankQuestion => {
      const minutes = pick([2, 3, 4], rng);
      const perMinute = pick([5, 6], rng);
      const saved = minutes * perMinute;
      const { correct, wrong } = numericOptions(saved, [minutes + perMinute, perMinute, saved * 2], 'litres');
      return {
        id: `k-water-gen-brush-${minutes}-${perMinute}`,
        topicId: 'k-water',
        difficulty: 'medium',
        type: 'scenario',
        context: `A running tap pours about ${perMinute} litres of water every minute. Meera brushes her teeth for ${minutes} minutes.`,
        question: 'How much water does Meera save if she turns the tap off while brushing?',
        correct,
        wrong,
        explanation: `${minutes} minutes × ${perMinute} litres = ${saved} litres saved, every time she brushes!`,
        hint: 'Multiply the minutes by the litres per minute.',
      };
    },
  },
];
