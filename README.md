# Nexo

**Spanish, understood.**

Nexo is a written-first, interactive Spanish course for serious beginners. It combines a complete curriculum, active reading, sentence audio, deliberate practice, original production, and concept-level review.

The complete course is free. Nexo is also open source: the application code uses the MIT License, while the authored curriculum in `content/` uses CC BY-SA 4.0 so it can become a shared, continuously improving Spanish grammar source.

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
- Supabase email/password accounts, with Module 0 public and Modules 1–16, Dashboard, Review, Settings, and checkpoints gated only by a free account
- account-linked sync for completed lessons, original attempts, concept evidence, and the learner's last visited lesson

Module progress unlocks lessons in sequence while completed lessons remain available to revisit. Module 0 can be completed without an account; Lesson 0.5 hands the learner into free account creation before Module 1. There are no payments, subscriptions, premium lessons, or course entitlements.

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

Supabase handles account authentication, session cookies, and account-linked progress persistence behind the learner-data boundary. The browser keeps a local copy for responsive interaction and migrates completed Start Here work into the learner's account after sign-up. The prototype does not include payments, generated AI feedback, a speech API, or a production audio CDN.

## Open-source licenses

- Application code and general project documentation: [MIT](LICENSE)
- Authored curriculum and grammar content under [`content/`](content/LICENSE.md): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- The Nexo name and logo are not granted for reuse by those licenses.

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a course correction or new lesson.
