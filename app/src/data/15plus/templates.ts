import type { BankQuestion, QuestionTemplate } from '@/types';
import { pick } from '@/engine/random';
import { formatNumber, numericOptions } from '../numericOptions';

const COMMUTE_MODES = [
  { name: 'petrol car (driving alone)', factor: 0.17 },
  { name: 'motorbike', factor: 0.11 },
  { name: 'diesel bus (per passenger)', factor: 0.1 },
];

export const plusTemplates: QuestionTemplate[] = [
  {
    id: 'p-carbon-commute',
    topicId: 'p-carbon',
    difficulty: 'medium',
    generate: (rng): BankQuestion => {
      const km = pick([5, 8, 10, 15, 20], rng);
      const days = pick([5, 6], rng);
      const mode = pick(COMMUTE_MODES, rng);
      const weekly = km * 2 * days * mode.factor;
      const { correct, wrong } = numericOptions(weekly, [km * days * mode.factor, km * 2 * mode.factor, weekly * 4], 'kg CO₂');
      return {
        id: `p-carbon-gen-commute-${km}-${days}-${mode.factor}`,
        topicId: 'p-carbon',
        difficulty: 'medium',
        type: 'scenario',
        context: `A student commutes ${km} km each way, ${days} days a week, by ${mode.name}. Assume ${mode.factor} kg CO₂ per km.`,
        question: 'Approximately how much CO₂ does this commute emit per week?',
        correct,
        wrong,
        explanation: `${km} km × 2 trips × ${days} days = ${km * 2 * days} km; × ${mode.factor} kg/km ≈ ${formatNumber(weekly)} kg CO₂ per week.`,
        hint: 'Count both directions, then multiply by the emission factor.',
      };
    },
  },
  {
    id: 'p-carbon-electricity',
    topicId: 'p-carbon',
    difficulty: 'easy',
    generate: (rng): BankQuestion => {
      const kwh = pick([150, 200, 300, 400], rng);
      const factor = pick([0.7, 0.8], rng);
      const monthly = kwh * factor;
      const { correct, wrong } = numericOptions(monthly, [kwh / factor, kwh * factor * 12, kwh + factor * 100], 'kg CO₂');
      return {
        id: `p-carbon-gen-electricity-${kwh}-${factor}`,
        topicId: 'p-carbon',
        difficulty: 'easy',
        type: 'scenario',
        context: `A household uses ${kwh} kWh of electricity a month. The grid emits about ${factor} kg CO₂ per kWh.`,
        question: 'What are its approximate monthly electricity emissions?',
        correct,
        wrong,
        explanation: `${kwh} kWh × ${factor} kg/kWh = ${formatNumber(monthly)} kg CO₂ per month.`,
        hint: 'Emissions = energy used × emission factor.',
      };
    },
  },
  {
    id: 'p-renewables-solar',
    topicId: 'p-renewables',
    difficulty: 'medium',
    generate: (rng): BankQuestion => {
      const kw = pick([2, 4, 5], rng);
      const yieldPerKw = pick([3.5, 4, 4.5, 5], rng);
      const monthly = kw * yieldPerKw * 30;
      const { correct, wrong } = numericOptions(monthly, [kw * yieldPerKw, kw * 30, monthly * 12], 'kWh');
      return {
        id: `p-renewables-gen-solar-${kw}-${yieldPerKw}`,
        topicId: 'p-renewables',
        difficulty: 'medium',
        type: 'scenario',
        context: `A ${kw} kW rooftop solar system generates about ${yieldPerKw} kWh per kW each day.`,
        question: 'Roughly how much electricity does it produce in a 30-day month?',
        correct,
        wrong,
        explanation: `${kw} kW × ${yieldPerKw} kWh/kW per day = ${formatNumber(kw * yieldPerKw)} kWh per day; × 30 = ${formatNumber(monthly)} kWh per month.`,
        hint: 'Find the daily output first.',
      };
    },
  },
  {
    id: 'p-renewables-avoided',
    topicId: 'p-renewables',
    difficulty: 'hard',
    generate: (rng): BankQuestion => {
      const monthlyKwh = pick([240, 300, 360, 450], rng);
      const factor = 0.7;
      const yearly = (monthlyKwh * 12 * factor) / 1000;
      const { correct, wrong } = numericOptions(yearly, [(monthlyKwh * factor) / 1000, yearly * 10, (monthlyKwh * 12) / 1000], 'tonnes CO₂');
      return {
        id: `p-renewables-gen-avoided-${monthlyKwh}`,
        topicId: 'p-renewables',
        difficulty: 'hard',
        type: 'scenario',
        context: `Rooftop solar on a school produces ${monthlyKwh} kWh a month, replacing grid power that emits about ${factor} kg CO₂ per kWh.`,
        question: 'Approximately how much CO₂ does it avoid in a year?',
        correct,
        wrong,
        explanation: `${monthlyKwh} × 12 = ${monthlyKwh * 12} kWh a year; × ${factor} kg = ${formatNumber(monthlyKwh * 12 * factor)} kg ≈ ${formatNumber(yearly)} tonnes CO₂.`,
        hint: 'Convert to a yearly figure, then kilograms to tonnes.',
      };
    },
  },
  {
    id: 'p-water-shower',
    topicId: 'p-water',
    difficulty: 'medium',
    generate: (rng): BankQuestion => {
      let minutes = pick([8, 10, 12, 15], rng);
      const standard = pick([10, 12, 15], rng);
      const lowFlow = pick([6, 7], rng);
      if (minutes === 10 && standard === 12 && lowFlow === 6) minutes = 8; // avoid duplicating the bank question
      const saved = minutes * (standard - lowFlow);
      const weekly = saved * 7;
      const { correct, wrong } = numericOptions(weekly, [saved, minutes * standard * 7, (standard - lowFlow) * 7], 'litres');
      return {
        id: `p-water-gen-shower-${minutes}-${standard}-${lowFlow}`,
        topicId: 'p-water',
        difficulty: 'medium',
        type: 'scenario',
        context: `A ${minutes}-minute shower with a standard head uses ${standard} L per minute. A low-flow head uses ${lowFlow} L per minute.`,
        question: 'With one shower a day, how much water does the low-flow head save in a week?',
        correct,
        wrong,
        explanation: `${minutes} × ${standard} = ${minutes * standard} L vs ${minutes} × ${lowFlow} = ${minutes * lowFlow} L — ${saved} L saved per shower, or ${weekly} L over 7 days.`,
        hint: 'Find the saving for one shower first, then scale it up.',
      };
    },
  },
];
