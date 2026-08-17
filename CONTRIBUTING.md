# Contributing to Nexo

Nexo aims to be a complete, structured Spanish course and a trustworthy shared grammar source. Contributions should make that single path clearer, more accurate, or more accessible.

## Before contributing

- Read `AGENTS.md` for the product and learning contracts.
- Read `docs/LESSON_PATTERN.md` before changing a lesson experience.
- Keep authored course content in typed source files under `content/`.
- Keep learner state behind the persistence boundary in `lib/`.
- Preserve first attempts. Corrections add evidence; they never replace the learner's original response.
- Teach general Latin American Spanish for production. Keep `vosotros` at recognition level in Foundations.

## Course corrections

For a grammar correction, include:

1. the exact lesson, block, and sentence affected;
2. a concise explanation of the issue;
3. a reliable reference or linguistic rationale; and
4. whether the correction changes any accepted answer, feedback, concept mapping, or dependent lesson.

Avoid isolated rule changes. Follow the concept through explanation, examples, practice, production, review, and any later lesson that depends on it.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Before opening a pull request, run:

```bash
npm run check
```

## Licensing contributions

By contributing application code or general project documentation, you agree to license it under MIT. By contributing authored curriculum under `content/`, you agree to license it under CC BY-SA 4.0.
