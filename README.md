# Nexo

**Spanish, understood.**

Nexo is a written-first, interactive Spanish course for serious beginners. It combines a complete curriculum, active reading, sentence audio, deliberate practice, original production, and concept-level review.

## Prototype scope

This repository currently implements the complete Foundations curriculum and its first account boundary:

- learner dashboard that begins at Start Here and preserves Review-first behavior when review is due
- a complete 16-module, 88-class course index with linked module and class entries
- Start Here (0.1–0.5) and Modules 1–16 as full written lesson experiences
- individual overviews for all 16 modules
- Module 4 overview
- five full Module 4 lessons, with Lesson 4.3 as the authored benchmark
- Stage I checkpoint with comprehension, control, recall, production, and a soft-gate result
- interactive sentence audio with natural and slow playback, versioned Nexo recordings, and a ranked browser-voice fallback
- choice, sorting, sentence-building, typed recall, reading, and writing interactions
- first-attempt and concept-evidence persistence in `localStorage`
- a module-first Review library that reuses the recall exercises authored inside each available lesson
- Supabase email/password accounts, with Module 0 public and Modules 1–16, Dashboard, Review, Settings, and checkpoints account-gated

Module progress unlocks lessons in sequence while completed lessons remain available to revisit. Module 0 can be completed without an account; Lesson 0.5 hands the learner into account creation before Module 1.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production: [https://nexo.formawebsite.com](https://nexo.formawebsite.com)

## Validate

```bash
npm run check
```

## Architecture

- `app/` — routes and pages
- `components/` — shared shell and interactive product experiences
- `content/` — typed authored curriculum and lesson content
- `lib/` — learner state, review logic, and the recording-first audio abstraction
- `docs/` — product, curriculum, and implementation handoff

The audio workflow is documented in [`docs/AUDIO_PIPELINE.md`](docs/AUDIO_PIPELINE.md). Audio preferences remain local to the learner's device and no speech API or API key is required.

The reusable lesson sequence established by Lesson 4.3 and used throughout Start Here and Modules 1–3 is documented in [`docs/LESSON_PATTERN.md`](docs/LESSON_PATTERN.md).

Supabase currently handles account authentication and session cookies. Learner progress still uses the existing local persistence adapter while account-linked progress sync is designed separately. The prototype does not yet include payments, generated AI feedback, a speech API, or a production audio CDN.
