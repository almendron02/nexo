# Nexo prototype implementation handoff

## Goal

Build a real, testable Foundations path from Start Here through the Stage I checkpoint, with Lesson 4.3 as the interaction and visual benchmark.

The reusable instructional sequence and authoring bar are defined in [`LESSON_PATTERN.md`](LESSON_PATTERN.md).

## Primary journey

```text
Public home
  -> complete 16-module course index
  -> public Start Here module
  -> free account creation before Module 1
  -> Dashboard
  -> Modules 1–4
  -> next incomplete lesson
  -> concept explanation
  -> guided practice
  -> unsupported recall
  -> original production
  -> lesson completion
  -> next lesson
  -> Stage I checkpoint
  -> checkpoint result and review recommendation
  -> updated dashboard
```

The supporting path is `Dashboard -> Review -> choose a module -> retrieve authored lesson exercises -> Continue course`.

## Real in this prototype

- responsive navigation and layout
- lesson reading and progression
- exact 16-module / 88-class curriculum index with linked future module maps
- full Start Here lessons 0.1–0.5
- full Module 1 lessons 1.1–1.4
- full Module 2 lessons 2.1–2.4
- full Module 3 lessons 3.1–3.5
- full Lessons 4.1–4.5 and sequential module navigation
- tappable Spanish with immediate audio response
- predictions and inline teaching feedback
- sorting, sentence building, reading, and typed recall
- original writing with a believable rule-based correction path
- first-attempt attempt history
- concept-level evidence
- lesson completion and dashboard progress
- module-first Review sets derived from the lessons’ authored recall blocks
- Stage I checkpoint with a soft-gate result
- local persistence
- Supabase email/password authentication and refreshed cookie sessions
- account-backed lesson progress, attempt history, concept evidence, and last-visited position
- public Module 0 with an account gate before Module 1
- free access to the complete course with no payment or entitlement gate

## Simulated or temporary

- reviewed Nexo recordings are supported; browser speech remains the fallback while the versioned recording library is produced
- writing analysis is narrow and rule-based
- review timing is seeded rather than calendar-driven
- mastery thresholds are prototype heuristics
- speaking recording and analytics are not implemented

## Acceptance criteria

- A new visitor can identify the next action within a few seconds.
- When review is due, Review is visibly primary.
- Lesson 4.3 teaches `ser` as identity/classification/origin and `estar` as state/location without relying on permanence.
- Important Spanish responds to pointer, touch, and keyboard activation.
- Wrong answers preserve the original response and provide a reasoned retry path.
- Final recall removes choices.
- Completing the lesson changes local progress and the next recommendation.
- The UI remains usable around 390 px and at a typical laptop width.
- `npm run check` passes.

## Next expansion after validation

1. Run end-to-end beginner usability sessions from Start Here through all 23 available lessons and the checkpoint.
2. Produce and approve the first versioned human recording pack using `docs/AUDIO_PIPELINE.md`.
3. Refine content and interaction pacing from observed learner evidence.
4. Validate account sync, reconnect behavior, and local Start Here migration with real learners across devices.
