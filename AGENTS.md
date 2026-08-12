# Nexo implementation rules

## Product contract

- Nexo is a complete, structured Spanish course with a beginning, a defined path, and a finish.
- The learning medium is written-first and interactive. Do not add tutorial-video dependence.
- Teach through `Understand -> Observe -> Practice -> Produce -> Review`, but let the lesson feel like one continuous train of thought.
- Teach general Latin American Spanish for production. Teach `tú`, `usted`, and `ustedes`; treat `vosotros` as recognition-level in Foundations.
- Lesson content lives as typed source files in Git. Learner state is accessed behind a persistence boundary.
- During the prototype, persist locally. Do not add Supabase, authentication, payments, analytics vendors, or AI APIs without a new explicit decision.
- Preserve first attempts. Corrections add evidence; they never overwrite the original attempt.
- Track evidence by concept, not only by lesson.
- Prototype mastery may reach `Learning`, `Developing`, or `Solid`. Never award `Retained` without delayed retrieval.
- When review is due, Review is the dashboard’s primary recommendation. Otherwise Continue is primary.

## Experience rules

- Important Spanish sentences are interactive: tap/click to hear them.
- Put feedback beside the interaction that caused it.
- Explain why an answer works; avoid bare right/wrong responses.
- Support should gradually disappear until the learner recalls and produces without choices.
- Never use the “permanent vs. temporary” shortcut as the main explanation for `ser` and `estar`.
- Do not use streaks, coins, leaderboards, confetti, or cartoonish gamification.
- Motion should preserve continuity, not entertain.
- Maintain accessible focus states, keyboard operation, reduced-motion support, and mobile tap targets.

## Visual direction

- Calm, editorial, premium, and modern.
- Warm ivory background, near-black text, cobalt accent, restrained surfaces, strong typography, minimal iconography.
- Lessons use a narrow reading column and generous whitespace.
- Do not add stock photography.

## Engineering

- TypeScript strict mode.
- Prefer semantic HTML and small composable components.
- Keep authored content separate from learner state.
- Keep browser-only APIs behind client components and feature checks.
- Run `npm run check` before handoff.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
