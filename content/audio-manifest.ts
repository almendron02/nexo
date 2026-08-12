export type SpanishRecording = {
  /** Reviewed, normal-speed course audio served from /public. */
  natural: string;
  /** Optional reviewed slow take. Natural audio is slowed without changing pitch when omitted. */
  slow?: string;
};

/**
 * Nexo-owned audio lives under /public/audio/es-419/<version>/.
 *
 * Entries may use a stable authored id (`id:lesson-4.3-opening`) or a normalized
 * text key (`text:ana está en casa.`). Stable ids are preferred when the same
 * sentence needs a different performance in two contexts.
 */
export const spanishAudioManifest: Readonly<Record<string, SpanishRecording>> = {};

export function normalizeSpanishAudioKey(text: string) {
  return text
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es");
}

export function findSpanishRecording(audioId: string | undefined, text: string) {
  if (audioId) {
    const byId = spanishAudioManifest[`id:${audioId}`];
    if (byId) return byId;
  }

  return spanishAudioManifest[`text:${normalizeSpanishAudioKey(text)}`] ?? null;
}
