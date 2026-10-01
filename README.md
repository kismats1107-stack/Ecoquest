# 🌱 EcoQuest — *Learn. Play. Protect.*

**EcoQuest** is a gamified environmental learning platform with two age-appropriate experiences built on one shared engine:

| | EcoQuest Kids | EcoQuest 15+ |
|---|---|---|
| Motto | *Learn through Play.* | *Learn through Challenge.* |
| Feel | Playful, visual, rounded, big touch targets, mascot | Clean, analytical, data-driven dashboard |
| Navigation | Home · Learn · Play · Rewards · Profile | Dashboard · Learn · Quizzes · Challenges · Leaderboard · Badges · Progress · Profile |
| Questions | Short sentences, picture questions, true/false | Scenarios, data interpretation, calculations, rapid rounds |
| 10-second games | Recycle Sort · Memory Match · Clean the Ocean | Carbon Footprint · Food-Web Puzzle · Eco Decisions |
| Progression | Eco Stars · Seedling → Sprout → Explorer → Guardian → Earth Hero | XP · levels & titles · analytics |
| Social | Friendly "Eco Heroes" board | Global / Weekly / Friends leaderboards |

Both experiences are light-themed and share the same brand.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — app + quiz API in one process
```

No configuration is needed. With no AI key and no Firebase project, EcoQuest runs **fully offline in local demo mode**, and progress is saved in the browser.

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with the `/api` quiz endpoints mounted |
| `npm run build` | Type-check (`tsc -b`) and production build to `dist/` |
| `npm start` | Production server: serves `dist/` + `/api` (run `npm run build` first) |
| `npm run preview` | Vite preview of the build (also mounts `/api`) |
| `npm test` | Unit tests for the engine, content and AI output handling (Vitest) |

Requires Node.js 22.22+ (the server runs TypeScript directly via Node's type stripping).

---

## Demo walkthrough (≈ 5 minutes)

1. Open EcoQuest → **Continue as Demo Student** → choose **15+**. The demo profile comes with five days of real history, so dashboards, charts, streaks and badges all show data.
2. **Quizzes → Create Your Challenge**: pick *Climate Change*, *Medium*, *10 questions* → **Generate Quiz** → *"Your challenge is ready!"* → **Start Quiz**.
3. Answer questions. Spend **25 coins on a hint**, and let one timer run out (*"Time's up!"*).
4. After Q3 and Q6 a **10-second challenge** appears (Carbon Footprint, then Eco Decisions).
5. **Results**: score, accuracy, XP and coins breakdown, level-ups and badges, plus a **personalised next step** (e.g. *"Try Renewable Energy — Medium"*). Generate another quiz from there.
6. Visit **Leaderboard**, **Badges**, **Progress** and **Profile**. Refresh the page: everything persists.
7. **Profile → Switch to EcoQuest Kids**: a completely different experience with its own separate progress. Try **Today's Mission**, the **Eco Journey** map and the Kids games.

---

## Architecture

```
                         ECOQUEST
                            │
               ┌────────────┴────────────┐
          ECOQUEST KIDS              ECOQUEST 15+
     src/data/kids/*            src/data/15plus/*
     KidsLayout + pages/kids    PlusLayout + pages/plus
               └────────────┬────────────┘
                      SHARED ENGINE  (src/engine — pure, unit-tested)
          ┌─────────────────┼──────────────────┐
     Quiz engine        Game engine        Gamification
     session state      10-s rewards,      XP, levels, coins,
     machine, scoring,  topic → game       badges, streaks,
     generation, recs   mapping            daily challenge
                            │
                    SERVICES  (src/services)
     QuizGeneratorService ── AIQuizGenerator ─▶ /api/quiz/generate (server)
                         └── LocalQuizGenerator (offline bank + templates)
     Storage: localStorage (primary) ── optional Firebase sync
     Auth: local demo identity ── optional Firebase anonymous auth
     Leaderboard: demo players + (optional) Firestore rows
```

### Key directories

```
shared/quizContract.ts     Quiz types + validateQuiz() — shared by browser and server
server/                    Quiz API (Anthropic SDK), prompt + JSON schema, production server
src/engine/                Pure business logic (no React): quiz session, scoring, plan,
                           local generation, recommendations, levels, badges, streaks
src/data/kids|15plus/      Topics, lessons, question banks, game content, question templates
src/data/*.ts              Badges, avatars, demo players, game definitions, content registry
src/services/              Quiz generators, storage, Firebase, auth, leaderboard, demo seeding
src/store/                 AppProvider — the only place state is mutated and persisted
src/components/            UI kit, layouts, quiz player, games, charts, rewards
src/pages/                 Landing, onboarding, kids/*, plus/*, shared (quiz, results, lesson, game)
src/i18n/                  UI strings (English), ready for more locales
```

### The learning loop

`LEARN → QUIZ → 10-SECOND CHALLENGE → REWARD → CONTINUE`

- **QuizEngine** (`src/engine/quiz/session.ts`) is a pure state machine: `question → feedback → (game) → … → complete`. Every action carries the question index, so a late timer tick can never score the wrong question or score one twice.
- **Game breaks**: 5 questions → after Q3, 10 → after Q3 and Q6, 15 → after Q4, Q8 and Q12. Each break uses a game that reinforces the topic (e.g. Waste → Recycle Sort, Biodiversity → Food-Web).
- **Timers** use wall-clock time (`useCountdown`), so they don't drift. A quiz in progress is saved after every step, and a refresh resumes at the current question.

### Dynamic quiz generation

`generateQuiz()` (`src/services/quiz/index.ts`) is the single entry point:

1. If the server reports AI is configured (`GET /api/health`), it calls `POST /api/quiz/generate`.
2. The server builds a controlled prompt (`server/quizPrompt.ts`) and asks Claude for **structured JSON** that matches a strict schema. It then shuffles options while tracking the correct answer, removes duplicates and recently seen questions, cleans up hints that give the answer away, and **validates** the result. If validation fails it **retries once**, passing the errors back to the model.
3. The browser **validates again**. On any failure (no key, network error, timeout, rate limit, invalid output) it falls back to the **LocalQuizGenerator**: it filters the offline bank by topic, prefers the chosen difficulty and questions the learner hasn't seen recently, adds freshly calculated template questions, and randomises question and option order. The learner is shown a short notice.

The QuizEngine sees the same `Quiz` structure either way.

**Smart difficulty**: ≥ 85 % → suggest the next level up; 60–84 % → stay; < 60 % → step down and revise. This is only a pre-selection; learners can always choose.

---

## Configuration

Copy `.env.example` to `.env`. Everything is optional.

### AI quiz generation (server-side only)

```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...          # ANTHROPIC_API_KEY also works
AI_MODEL=claude-opus-5-5
AI_EFFORT=low                  # low | medium | high — low keeps generation fast
```

The key is read only by the Node server (Vite middleware in dev, `server/index.ts` in production) and is **never** included in the browser bundle. Requests use the Anthropic SDK with structured outputs and server-side refusal fallbacks (`fallbacks: "default"`). A simple per-IP rate limit protects the key in public demos.

### Firebase (optional cloud sync and real leaderboard)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

When set, learners sign in anonymously. Progress syncs to `users/{uid}` and leaderboard rows are written to `leaderboard/{uid}_{mode}`. The Firebase SDK is lazy-loaded, so it is never downloaded in local mode. Enable **Anonymous Auth** and use rules like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
    match /leaderboard/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && id.matches(request.auth.uid + '_.*');
    }
  }
}
```

The leaderboard query (`where mode == … orderBy xp desc`) needs a composite index, which Firestore links to automatically on the first run.

### Other

`VITE_DISABLE_AI=true` forces the offline bank. `VITE_API_BASE` points the browser at an API hosted elsewhere. `PORT` sets the port for `npm start`.

---

## Signing in, logging out and shared devices

- **Log out** is available everywhere once someone is signed in:
  - the avatar menu in the Kids header and the 15+ mobile header (with My profile and Switch experience)
  - the 15+ sidebar and the mobile **More** sheet
  - both Profile pages
  - the landing page header
- Logging out **keeps progress**. The learner is saved on the device (`src/services/storage/accountStore.ts`) and appears on the sign-in screen (`/start`) under **"Welcome back! Who's learning?"**. One tap signs them back in exactly where they left off.
- Several learners can share one device, which suits classrooms and demos. Creating a new profile while someone is signed in saves that learner first, so nothing is overwritten. Any in-progress quiz is cleared on logout so the next learner starts fresh.
- Saved learners can be removed from the device with the trash icon on the sign-in screen (with a confirmation). There is only ever one saved Demo Student.
- With Firebase configured, logout also ends the Firebase session, so the next learner gets their own anonymous identity.

---

## Gamification rules (`src/config/gamification.ts`)

| Action | Reward |
|---|---|
| Correct answer | +10 / +15 / +20 XP (easy / medium / hard), +2 / +3 / +5 coins |
| Fast answer (first 35 % of the timer, no hint) | +5 XP |
| Rapid question | +5 XP |
| Answer streak of 3+ in a quiz | +5 XP per answer |
| 10-second challenge | +10 to +50 XP, up to +20 coins |
| ≥ 80 % accuracy / perfect run | +20 XP / +50 XP and +20 coins |
| Today's Eco Challenge (≥ 75 % for Kids, ≥ 80 % for 15+, with a game played) | +150 XP, +50 coins (once per day) |
| Lesson completed | +10 XP, +5 coins (once per lesson) |
| Hint | costs 25 coins |

Levels need 50·L·(L−1) total XP (Level 2 at 100 XP, Level 5 at 1,000, Level 10 at 4,500). There are **14 badges**: Eco Starter, Curious Mind, Challenge Champ, Speed Demon, Recycling Hero, Climate Champion, Water Guardian, Biodiversity Protector, Perfect Run, Summit Seeker, Daily Hero, 7-Day Learner, Knowledge Master and EcoQuest Legend. Each shows its requirement, progress and locked/unlocked state. Kids and 15+ progress are tracked separately; switching never erases either.

---

## Content

- **Kids**: 8 topics × 15 hand-written questions (120), 8 picture-card lessons, plus generated picture questions (which bin? which habitat?) and simple calculations.
- **15+**: 9 topics × 15 hand-written questions (135), 9 lessons with key data, key terms and myth vs fact, plus generated calculation questions (commute emissions, electricity footprint, solar yield, CO₂ avoided, water savings).
- Figures are rounded, widely cited estimates (IPCC, UNEP, FAO, IUCN, WWF, IEA, BEE and others). Data-interpretation questions include the numbers they test. The **leaderboard players are clearly labelled demo learners**.

### Adding a language

UI strings live in `src/i18n/en.ts`. Add `hi.ts` with the same `Strings` shape and register it in `src/i18n/index.ts`. Educational content is kept in `src/data/<experience>/`; add a parallel content set per locale and select it in `src/data/index.ts`. The AI prompt can also be asked to write in the learner's language.

---

## Quality

- `npm test`: 36 unit tests covering every bank question's structure, generation of every topic × difficulty × size, answer tracking through shuffles, the session state machine (timeouts, stale events, game breaks), scoring, daily-reward rules, levels, streaks, badges, recommendations, demo seeding, quiz validation and the server's handling of AI output.
- End-to-end checks (Microsoft Edge, desktop and mobile) cover onboarding, lessons, Kids and 15+ quizzes, all six games, hints, timeouts, refresh mid-quiz, persistence, switching experience, every page, the AI-failure fallback and horizontal overflow at 390 px, with zero console errors.
- Accessibility: semantic landmarks, skip link, keyboard play (1–4 / A–D to answer; game keys), visible focus rings, radio groups and tabs with arrow-key support, accessible dialogs, `aria-live` feedback, screen-reader tables behind every chart, and `prefers-reduced-motion` support.
