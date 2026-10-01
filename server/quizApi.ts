import Anthropic from '@anthropic-ai/sdk';
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  DIFFICULTIES,
  EXPERIENCE_MODES,
  XP_BY_DIFFICULTY,
  hintRevealsAnswer,
  normalizeText,
  validateQuiz,
  type Difficulty,
  type ExperienceMode,
  type Quiz,
  type QuizQuestion,
  type QuizRequest,
} from '../shared/quizContract.ts';
import { QUIZ_SCHEMA, SYSTEM_PROMPT, buildUserPrompt, type QuestionDraft } from './quizPrompt.ts';

/**
 * EcoQuest quiz API — runs inside the Vite dev/preview server and the production server.
 *
 *   GET  /api/health          → { ok, ai: { enabled, provider, model } }
 *   POST /api/quiz/generate   → { quiz }      (503 when AI isn't configured)
 *
 * The API key is read from server-side environment variables only and never sent to the browser.
 */

type Env = Record<string, string | undefined>;
type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface AIConfig {
  enabled: boolean;
  provider: 'anthropic' | null;
  model: string;
  effort: Effort;
  apiKey?: string;
}

const EFFORTS: Effort[] = ['low', 'medium', 'high', 'xhigh', 'max'];

export function readAIConfig(env: Env): AIConfig {
  const provider = (env.AI_PROVIDER ?? 'anthropic').trim().toLowerCase();
  const apiKey = env.AI_API_KEY?.trim() || env.ANTHROPIC_API_KEY?.trim() || undefined;
  const effort = (env.AI_EFFORT?.trim().toLowerCase() ?? 'low') as Effort;
  const enabled = provider === 'anthropic' && Boolean(apiKey);
  return {
    enabled,
    provider: enabled ? 'anthropic' : null,
    model: env.AI_MODEL?.trim() || 'claude-opus-5-5',
    effort: EFFORTS.includes(effort) ? effort : 'low',
    apiKey,
  };
}

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage, limit = 32_000): Promise<unknown> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw new HttpError(413, 'too_large', 'Request body too large');
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'bad_json', 'Request body must be JSON');
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : null);

/** Validates and normalises the incoming request — never trust the client either. */
export function parseRequest(body: unknown): QuizRequest {
  const b = (body ?? {}) as Record<string, unknown>;
  const topicId = str(b.topicId, 60);
  const topicName = str(b.topicName, 80);
  const topicSummary = str(b.topicSummary, 600);
  const difficulty = b.difficulty as Difficulty;
  const experienceMode = b.experienceMode as ExperienceMode;
  const questionCount = Number(b.questionCount);
  const timePerQuestion = Number(b.timePerQuestion);
  if (!topicId || !topicName || !topicSummary) throw new HttpError(400, 'bad_topic', 'Topic is required');
  if (!DIFFICULTIES.includes(difficulty)) throw new HttpError(400, 'bad_difficulty', 'Invalid difficulty');
  if (!EXPERIENCE_MODES.includes(experienceMode)) throw new HttpError(400, 'bad_mode', 'Invalid experience mode');
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 15) throw new HttpError(400, 'bad_count', 'questionCount must be 1–15');
  const avoid = Array.isArray(b.avoidQuestions)
    ? b.avoidQuestions.filter((q): q is string => typeof q === 'string').map((q) => q.slice(0, 200)).slice(0, 30)
    : [];
  return {
    topicId,
    topicName,
    topicSummary,
    difficulty,
    experienceMode,
    questionCount,
    timePerQuestion: Number.isFinite(timePerQuestion) ? Math.min(60, Math.max(5, timePerQuestion)) : 20,
    avoidQuestions: avoid,
  };
}

function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Converts model drafts into EcoQuest questions: dedupes, shuffles options while tracking the answer. */
export function draftsToQuiz(drafts: QuestionDraft[], req: QuizRequest): Quiz {
  const quizId = `ai_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const avoid = new Set((req.avoidQuestions ?? []).map(normalizeText));
  const seen = new Set<string>();
  const questions: QuizQuestion[] = [];

  for (const d of drafts) {
    const text = d.question?.trim() ?? '';
    const key = normalizeText(text);
    if (!text || seen.has(key) || avoid.has(key)) continue;
    seen.add(key);
    const options = (d.options ?? []).map((o) => String(o).trim());
    const correctText = options[d.correctIndex];
    const shuffled = options.length === 4 && correctText !== undefined ? shuffle(options) : options;
    const difficulty: Difficulty = DIFFICULTIES.includes(d.difficulty) ? d.difficulty : req.difficulty;
    const hint = d.hint?.trim() ?? '';
    questions.push({
      id: `${quizId}_${questions.length + 1}`,
      topicId: req.topicId,
      type: d.type === 'scenario' || d.type === 'rapid' ? d.type : 'mcq',
      difficulty,
      question: text,
      context: d.context?.trim() || undefined,
      options: shuffled,
      correctAnswer: correctText === undefined ? -1 : shuffled.indexOf(correctText),
      explanation: d.explanation?.trim() ?? '',
      hint: correctText && hintRevealsAnswer(hint, correctText) ? `Think carefully about the key ideas of ${req.topicName}.` : hint,
      xp: XP_BY_DIFFICULTY[difficulty],
    });
  }

  return {
    id: quizId,
    topicId: req.topicId,
    topicName: req.topicName,
    difficulty: req.difficulty,
    experienceMode: req.experienceMode,
    questionCount: req.questionCount,
    timePerQuestion: req.timePerQuestion,
    source: 'ai',
    createdAt: Date.now(),
    questions: shuffle(questions).slice(0, req.questionCount),
  };
}

let cachedClient: { key: string; client: Anthropic } | null = null;
function clientFor(cfg: AIConfig): Anthropic {
  if (!cachedClient || cachedClient.key !== cfg.apiKey) {
    cachedClient = { key: cfg.apiKey!, client: new Anthropic({ apiKey: cfg.apiKey, timeout: 60_000, maxRetries: 1 }) };
  }
  return cachedClient.client;
}

/** Generates and validates a quiz; retries once with the validation errors, then gives up. */
export async function generateQuizWithAI(cfg: AIConfig, req: QuizRequest): Promise<Quiz> {
  const client = clientFor(cfg);
  let lastErrors: string[] = [];

  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await client.beta.messages.create({
      model: cfg.model,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: cfg.effort, format: { type: 'json_schema', schema: QUIZ_SCHEMA } },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(req, attempt > 1 ? lastErrors : undefined) }],
    });

    if (response.stop_reason === 'refusal') throw new HttpError(502, 'ai_refused', 'The AI declined to generate this quiz');
    if (response.stop_reason === 'max_tokens') {
      lastErrors = ['The response was cut off — keep explanations short.'];
      continue;
    }

    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');
    let drafts: QuestionDraft[];
    try {
      drafts = (JSON.parse(text) as { questions: QuestionDraft[] }).questions ?? [];
    } catch {
      lastErrors = ['Output was not valid JSON.'];
      continue;
    }

    const quiz = draftsToQuiz(drafts, req);
    const result = validateQuiz(quiz, { topicId: req.topicId, questionCount: req.questionCount, requireFourOptions: true });
    if (result.ok) return result.quiz;
    lastErrors = result.errors;
  }
  throw new HttpError(502, 'ai_invalid', `AI output failed validation: ${lastErrors.slice(0, 3).join('; ')}`);
}

/** Tiny per-IP rate limit so a public demo can't burn through the API key. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 20, windowMs = 5 * 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

export function createApiMiddleware(env: Env): Middleware {
  return (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return next();

    void (async () => {
      const cfg = readAIConfig({ ...env, ...process.env });
      try {
        if (url.pathname === '/api/health' && req.method === 'GET') {
          return sendJson(res, 200, { ok: true, ai: { enabled: cfg.enabled, provider: cfg.provider, model: cfg.enabled ? cfg.model : null } });
        }
        if (url.pathname === '/api/quiz/generate' && req.method === 'POST') {
          if (!cfg.enabled) throw new HttpError(503, 'ai_disabled', 'AI quiz generation is not configured');
          if (rateLimited(req.socket.remoteAddress ?? 'unknown')) throw new HttpError(429, 'rate_limited', 'Too many quiz requests — try again shortly');
          const quizRequest = parseRequest(await readJson(req));
          const quiz = await generateQuizWithAI(cfg, quizRequest);
          return sendJson(res, 200, { quiz });
        }
        throw new HttpError(404, 'not_found', 'Unknown API route');
      } catch (err) {
        if (err instanceof HttpError) return sendJson(res, err.status, { error: err.code, message: err.message });
        if (err instanceof Anthropic.AuthenticationError) return sendJson(res, 502, { error: 'ai_auth', message: 'The AI API key was rejected' });
        if (err instanceof Anthropic.RateLimitError) return sendJson(res, 429, { error: 'ai_rate_limited', message: 'The AI provider is rate limiting requests' });
        if (err instanceof Anthropic.APIError) return sendJson(res, 502, { error: 'ai_error', message: `AI provider error ${err.status ?? ''}`.trim() });
        console.error('[EcoQuest API]', err);
        return sendJson(res, 500, { error: 'server_error', message: 'Unexpected server error' });
      }
    })();
  };
}
