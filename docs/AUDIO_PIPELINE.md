# Nexo Spanish audio pipeline

Nexo has no runtime speech API dependency. Playback follows one rule:

1. Use a reviewed Nexo recording from `public/audio/es-419/<version>/` when the phrase exists in the manifest.
2. Otherwise use the learner's selected Latin American system voice.
3. If that voice is unavailable, use the best Spanish voice exposed by the browser.

The fallback keeps every authored sentence audible while the owned recording library grows lesson by lesson.

## Runtime structure

- `components/SpanishAudio.tsx` renders natural and slow playback controls.
- `lib/spanish-audio.ts` owns playback, voice discovery, locale ranking, preferences, text cleanup, sentence chunking, and fallback behavior.
- `content/audio-manifest.ts` maps authored ids or normalized Spanish text to versioned files.
- `public/audio/es-419/v1/` contains browser-ready delivery files.

Recorded audio always wins. The slow control uses a dedicated slow take when one is listed; otherwise it slows the approved natural recording while preserving pitch.

## Add a human recording

1. Record a single consistent native Latin American Spanish narrator in a quiet room.
2. Keep the unprocessed WAV master in the chosen controlled source archive. A practical capture target is mono, 48 kHz, 24-bit WAV.
3. Edit breaths and noise conservatively. Do not remove the natural pauses learners need to hear.
4. Export a browser-ready file into a versioned folder, for example:

   `public/audio/es-419/v1/lesson-4-3/soy-estudiante.mp3`

5. Register it in `content/audio-manifest.ts` by stable id when context matters:

   ```ts
   "id:lesson-4.3-soy-estudiante": {
     natural: "/audio/es-419/v1/lesson-4-3/soy-estudiante.mp3",
     slow: "/audio/es-419/v1/lesson-4-3/soy-estudiante-slow.mp3",
   },
   ```

   Then pass `audioId="lesson-4.3-soy-estudiante"` to `SpanishAudio`.

   For a phrase that should always use the same performance, a text entry is enough:

   ```ts
   "text:soy estudiante.": {
     natural: "/audio/es-419/v1/lesson-4-3/soy-estudiante.mp3",
   },
   ```

6. Listen at natural and slow speed on desktop and mobile before approving the entry.

Never replace a file in an already released version with a different performance. Add a new version and update the manifest so playback changes are reviewable and reversible.

## Narration direction

- Target general Latin American Spanish rather than a Spain-specific pronunciation.
- Speak naturally to an adult beginner; do not make the main take artificially slow.
- Preserve ordinary connected speech and rhythm.
- Record a dedicated slower take only when articulation changes are pedagogically useful.
- Keep names, regional terms, and punctuation decisions in a session pronunciation sheet.

## Local generated draft audio

Piper can be used locally to make private draft clips without adding a runtime service. Use an `es_MX` model, generate WAV files offline, and treat every output as unapproved until a native speaker reviews it. Approved files enter the same versioned manifest as human recordings.

Piper itself is GPL-3.0 and each downloaded voice model can have its own license. Review both before distributing generated assets. Training a new Nexo voice is intentionally out of scope until there is a clean, consented, consistently recorded dataset and a real quality advantage over direct narration.

## QA checklist

- The phrase matches the authored Spanish exactly.
- Stress, vowels, names, and sentence-final intonation are correct.
- Natural playback sounds conversational, not slowed for a learner.
- Slow playback remains intelligible without chipmunking or dropped endings.
- Starting another phrase stops the previous phrase immediately.
- Keyboard focus and both playback buttons work.
- A missing or broken recording falls back to system speech.
- The selected system voice persists after a reload.
