# Nexo Library plan

## Purpose

The Library is Nexo's reference layer: a place to look something up, hear it again, compare nearby ideas, and return to the course with clarity. It should support the structured course rather than becoming a second course, a disconnected vocabulary game, or a wall of lesson cards.

The first release should answer three common learner questions:

1. **How did that rule work?** Open a concise concept guide.
2. **How do I say this kind of thing?** Open a useful phrase pattern with audio.
3. **What have I learned so far?** Browse material connected to completed and upcoming lessons.

## Initial scope: Start Here through Module 4

The first Library release should be built entirely from the authored course content that already exists. Every entry should link back to its source lesson and use the same terminology and explanations.

### Pronunciation and spelling

- The five Spanish vowels
- High-impact consonants for English speakers
- Predictable word stress
- Written accent marks
- First greetings and conversation chunks

### Building noun phrases

- Noun gender without guessing
- Definite and indefinite articles
- Singular and plural noun phrases
- Adjective agreement
- Common adjective placement

### People and identity

- Subject pronouns: `yo`, `tú`, `usted`, and `ustedes`
- The present forms of `ser`
- Identity and description with `ser`
- Origin with `ser + de`
- Professions, nationalities, and relationships

### States, places, and existence

- The present forms of `estar`
- States and locations with `estar`
- Choosing between `ser` and `estar` by meaning
- Adjectives whose meaning changes with `ser` or `estar`
- Existence with `hay` versus identifying location with `estar`

### Useful phrase collections

- Greeting someone and responding
- Introducing yourself
- Saying where someone is from
- Describing a person or thing
- Saying how someone feels
- Locating people and things
- Saying what exists in a place

Phrase collections must use complete, meaningful sentences with audio and short pattern notes. Avoid isolated thematic vocabulary lists.

## Information architecture

The Library landing page should stay plain and editorial. It should begin with search, then expose a small number of understandable paths:

1. **Continue exploring** — learner-aware links based on recently completed lessons.
2. **Concept guides** — the grammar and pronunciation reference.
3. **Useful Spanish** — phrase collections organized by communicative purpose.
4. **Verb reference** — only verbs and forms already introduced in the course.
5. **Browse by module** — a secondary index back to the course sequence.

Search results should identify the content type, show one useful example, and name the lesson where the idea is taught. Everything should remain browsable without requiring course completion.

## Entry pattern

Each concept guide should contain:

- a direct answer in one or two sentences
- the question or meaning that controls the choice
- two to four playable Spanish examples with translations
- a comparison when learners commonly confuse two ideas
- one brief self-check
- links to the source lesson and related guides

Each phrase collection should contain:

- the real situation it supports
- a small set of complete playable phrases
- a visible reusable pattern, not only a translation
- formality or regional notes only when they change the learner's choice
- links to the concepts behind the phrase

## Content and route model

Keep Library content as typed source files in Git, separate from learner state.

Suggested routes:

```text
/library
/library/concepts/[slug]
/library/phrases/[slug]
/library/verbs/[slug]
```

Suggested entry fields:

```ts
type LibraryEntry = {
  slug: string;
  kind: "concept" | "phrase-collection" | "verb";
  title: string;
  summary: string;
  moduleNumbers: number[];
  lessonIds: string[];
  conceptIds: string[];
  searchTerms: string[];
  sections: LibrarySection[];
  relatedSlugs: string[];
};
```

The Library may read completed lesson IDs through the existing persistence boundary to order recommendations, but completion must never hide reference material.

## Build sequence

### Phase 1 — Foundation

- Define the typed Library schema and content registry.
- Build the landing page, search, category navigation, and entry template.
- Author five benchmark entries: Spanish vowels, noun gender, adjective agreement, `ser` versus `estar`, and `hay` versus `estar`.
- Connect every entry to its source lessons and related entries.

### Phase 2 — Complete the current course range

- Author the remaining Start Here–Module 4 concept guides.
- Add the seven useful phrase collections above.
- Add focused references for `ser` and `estar`.
- Audit every Spanish example for audio behavior and consistency with lesson wording.

### Phase 3 — Learner-aware organization

- Add “Recently learned” and “Useful next” ordering from local progress.
- Add lightweight search synonyms in English and Spanish.
- Add a compact “Save for later” feature only if user testing shows a real need.

## Acceptance criteria for the first release

- A learner can find `ser vs estar`, accent marks, noun gender, or a greeting within two actions.
- Every entry gives an immediate answer before details.
- Every important Spanish sentence is playable.
- Every entry names and links to the lesson that teaches it fully.
- Search works for English questions, Spanish terms, and common learner wording.
- Mobile layout remains calm, readable, and free of dense card grids.
- The Library introduces no concept earlier than the course dependency map allows without clearly marking it as a usable phrase.
