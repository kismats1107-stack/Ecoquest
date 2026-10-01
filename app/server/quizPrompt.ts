import type { QuizRequest } from '../shared/quizContract.ts';

/**
 * Controlled prompt for AI quiz generation. The model only writes question content —
 * ids, XP, topic ids and option shuffling are added and verified by the server.
 */

export const SYSTEM_PROMPT = `You are the quiz author for EcoQuest, a gamified environmental learning platform used by students.
You write accurate, unambiguous multiple-choice questions grounded in well-established environmental science and widely cited sources (IPCC, UNEP, FAO, IUCN, IEA, WHO and national agencies).
When a question needs a figure, use rounded, widely accepted values and say "about" — or give the numbers in the question's context so the learner reasons from them.
You only produce content that is safe and appropriate for school students. Respond with JSON that matches the provided schema and nothing else.`;

const AUDIENCE = {
  kids: `Audience: EcoQuest Kids — children aged about 6 to 12.
- Use short, simple sentences (ideally under 15 words) and everyday words.
- Use concrete examples from home, school, gardens, animals and nature.
- Keep the tone friendly and encouraging; nothing frightening or graphic.
- No calculations beyond simple counting; no jargon unless it is the term being taught.`,
  plus: `Audience: EcoQuest 15+ — teenagers and adults.
- Mix conceptual questions, real-world scenarios and decisions, data interpretation and cause-and-effect reasoning.
- For scenario or data questions, put the setup and any numbers the learner needs in "context".
- Roughly a third of questions should be scenarios with a context; a few can be short "rapid" recall questions.
- Indian and global examples are both welcome.`,
} as const;

const DIFFICULTY = {
  easy: 'Easy: core facts, definitions and everyday examples.',
  medium: 'Medium: applying ideas, explaining causes, comparing options.',
  hard: 'Hard: multi-step reasoning, interpreting given data, trade-offs and common misconceptions.',
} as const;

export function buildUserPrompt(req: QuizRequest, previousErrors?: string[]): string {
  const avoid = (req.avoidQuestions ?? []).slice(0, 25);
  const lines = [
    `Write a quiz for EcoQuest.`,
    ``,
    `Experience: ${req.experienceMode === 'kids' ? 'Kids' : '15+'}`,
    `Topic: ${req.topicName}`,
    `Topic scope: ${req.topicSummary}`,
    `Difficulty: ${req.difficulty[0].toUpperCase()}${req.difficulty.slice(1)}`,
    `Number of questions: ${req.questionCount}`,
    ``,
    AUDIENCE[req.experienceMode],
    DIFFICULTY[req.difficulty],
    ``,
    `Requirements:`,
    `- Generate exactly ${req.questionCount} questions.`,
    `- Every question has exactly 4 options and exactly one correct option; "correctIndex" is its 0-based position.`,
    `- Distractors must be plausible but clearly wrong to an informed learner. No "all of the above" or "none of the above". No repeated options.`,
    `- Stay strictly within the topic and its scope. Do not repeat or rephrase questions.`,
    `- Match the selected experience and difficulty. Set each question's "difficulty" to the level it actually is.`,
    `- "explanation": 1–2 sentences explaining why the answer is correct.`,
    `- "hint": a nudge towards the reasoning that does NOT contain or paraphrase the correct option.`,
    `- "type": "mcq" for standard questions, "scenario" when a context sets up a situation, "rapid" for very short recall questions.`,
    `- "context": the scenario/data setup, or an empty string if not needed.`,
    `- Avoid ambiguous, opinion-based, unsafe or inappropriate content.`,
  ];
  if (avoid.length) {
    lines.push('', 'The learner has recently seen these questions — do not repeat them:', ...avoid.map((q) => `- ${q}`));
  }
  if (previousErrors?.length) {
    lines.push('', 'Your previous attempt was rejected for these reasons — fix them:', ...previousErrors.slice(0, 8).map((e) => `- ${e}`));
  }
  return lines.join('\n');
}

/** JSON schema enforced through structured outputs. */
export const QUIZ_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['mcq', 'scenario', 'rapid'] },
          context: { type: 'string' },
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correctIndex: { type: 'integer', enum: [0, 1, 2, 3] },
          explanation: { type: 'string' },
          hint: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
        },
        required: ['type', 'context', 'question', 'options', 'correctIndex', 'explanation', 'hint', 'difficulty'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
} as const;

export interface QuestionDraft {
  type: 'mcq' | 'scenario' | 'rapid';
  context: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
