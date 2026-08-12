"use client";

import { findSpanishRecording } from "@/content/audio-manifest";

export type SpanishAudioSpeed = "natural" | "slow";
export type SpanishAudioSource = "recorded" | "system";
export type AudioResult = "played" | "unsupported";

export type SpanishVoiceOption = {
  voiceURI: string;
  name: string;
  lang: string;
  localeLabel: string;
  isLatinAmerican: boolean;
  isRecommended: boolean;
};

export type SpanishAudioPreferences = {
  voiceURI: string | null;
  naturalRate: number;
  slowRate: number;
};

type PlaybackCallbacks = {
  onStart?: (source: SpanishAudioSource) => void;
  onEnd?: () => void;
};

type PlaybackOptions = PlaybackCallbacks & {
  audioId?: string;
  speed?: SpanishAudioSpeed;
  voiceURI?: string | null;
};

const AUDIO_PREFERENCES_KEY = "nexo:audio-preferences:v1";
const DEFAULT_PREFERENCES: SpanishAudioPreferences = {
  voiceURI: null,
  naturalRate: 0.97,
  slowRate: 0.65,
};
const LATIN_AMERICAN_REGIONS = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "GT", "HN", "MX",
  "NI", "PA", "PE", "PR", "PY", "SV", "US", "UY", "VE", "419",
]);
const voiceListeners = new Set<() => void>();

let cachedVoices: SpeechSynthesisVoice[] = [];
let voiceLoadingPromise: Promise<SpeechSynthesisVoice[]> | null = null;
let listeningForVoiceChanges = false;
let activeAudio: HTMLAudioElement | null = null;
let playbackGeneration = 0;

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function localeParts(locale: string) {
  const [language = "", region = ""] = locale.replace("_", "-").split("-");
  return { language: language.toLowerCase(), region: region.toUpperCase() };
}

function isLatinAmericanLocale(locale: string) {
  const { language, region } = localeParts(locale);
  return language === "es" && LATIN_AMERICAN_REGIONS.has(region);
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const { language, region } = localeParts(voice.lang);
  if (language !== "es") return -1;

  let score = 100;
  if (region === "MX") score = 1000;
  else if (region === "US") score = 960;
  else if (region === "419") score = 940;
  else if (LATIN_AMERICAN_REGIONS.has(region)) score = 880;
  else if (region === "ES") score = 300;

  if (/paulina|m[oó]nica|ximena|jorge/i.test(voice.name)) score += 140;
  else if (/latin|latino/i.test(voice.name)) score += 40;
  if (voice.default) score += 5;
  return score;
}

function refreshVoiceCache() {
  if (!hasSpeechSynthesis()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    cachedVoices = [...voices];
    voiceListeners.forEach((listener) => listener());
  }
  return cachedVoices;
}

function attachVoiceChangeListener() {
  if (!hasSpeechSynthesis() || listeningForVoiceChanges) return;
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoiceCache);
  listeningForVoiceChanges = true;
}

function rankedSpanishVoices() {
  return cachedVoices
    .filter((voice) => voiceScore(voice) >= 0)
    .sort((left, right) => voiceScore(right) - voiceScore(left) || left.name.localeCompare(right.name));
}

function nexoVoices(voices: SpeechSynthesisVoice[]) {
  const paulina = voices.filter((voice) => /^paulina\b/i.test(voice.name));
  const rocko = voices.filter((voice) => /^rocko\b/i.test(voice.name));
  return [...paulina, ...rocko];
}

function localeLabel(locale: string) {
  const labels: Record<string, string> = {
    "es-419": "Latin American Spanish",
    "es-AR": "Argentina",
    "es-BO": "Bolivia",
    "es-CL": "Chile",
    "es-CO": "Colombia",
    "es-CR": "Costa Rica",
    "es-CU": "Cuba",
    "es-DO": "Dominican Republic",
    "es-EC": "Ecuador",
    "es-GT": "Guatemala",
    "es-HN": "Honduras",
    "es-MX": "Mexico",
    "es-NI": "Nicaragua",
    "es-PA": "Panama",
    "es-PE": "Peru",
    "es-PR": "Puerto Rico",
    "es-PY": "Paraguay",
    "es-SV": "El Salvador",
    "es-US": "United States Spanish",
    "es-UY": "Uruguay",
    "es-VE": "Venezuela",
    "es-ES": "Spain",
  };
  const normalized = locale.replace("_", "-");
  return labels[normalized] ?? normalized;
}

export function getSpanishAudioPreferences(): SpanishAudioPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(AUDIO_PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(stored) as Partial<SpanishAudioPreferences>;
    return {
      voiceURI: typeof parsed.voiceURI === "string" ? parsed.voiceURI : null,
      naturalRate: typeof parsed.naturalRate === "number" ? parsed.naturalRate : DEFAULT_PREFERENCES.naturalRate,
      // Slow replay is authored as a product-level rate rather than a learner setting.
      slowRate: DEFAULT_PREFERENCES.slowRate,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setSpanishAudioPreferences(preferences: Partial<SpanishAudioPreferences>) {
  if (typeof window === "undefined") return;
  const next = { ...getSpanishAudioPreferences(), ...preferences };
  try {
    window.localStorage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(next));
  } catch {
    // Audio still works with defaults when private storage is unavailable.
  }
}

export function subscribeToSpanishVoices(listener: () => void) {
  voiceListeners.add(listener);
  attachVoiceChangeListener();
  return () => voiceListeners.delete(listener);
}

export function getSpanishVoiceOptions(): SpanishVoiceOption[] {
  const voices = nexoVoices(rankedSpanishVoices()).filter((voice) => isLatinAmericanLocale(voice.lang));
  const recommendedURI = voices.find((voice) => /^paulina\b/i.test(voice.name))?.voiceURI;
  return voices.map((voice) => ({
    voiceURI: voice.voiceURI,
    name: voice.name,
    lang: voice.lang,
    localeLabel: localeLabel(voice.lang),
    isLatinAmerican: isLatinAmericanLocale(voice.lang),
    isRecommended: voice.voiceURI === recommendedURI,
  }));
}

export async function prepareSpanishAudio() {
  if (!hasSpeechSynthesis()) return [];
  attachVoiceChangeListener();
  const immediate = refreshVoiceCache();
  if (immediate.length) return immediate;
  if (voiceLoadingPromise) return voiceLoadingPromise;

  voiceLoadingPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(refreshVoiceCache());
    };
    const onVoicesChanged = () => finish();
    const timeout = window.setTimeout(finish, 1500);
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
  }).finally(() => {
    voiceLoadingPromise = null;
  });

  return voiceLoadingPromise;
}

export function normalizeSpanishForSpeech(text: string) {
  return text
    .normalize("NFC")
    .replace(/\bUds\./gi, "ustedes")
    .replace(/\bUd\./gi, "usted")
    .replace(/\bSra\./gi, "señora")
    .replace(/\bSr\./gi, "señor")
    .replace(/\bDra\./gi, "doctora")
    .replace(/\bDr\./gi, "doctor")
    .replace(/[–—]/g, ", ")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSpeechIntoChunks(text: string) {
  const normalized = normalizeSpanishForSpeech(text);
  if (normalized.length <= 180) return [normalized];

  const clauses = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [normalized];
  const chunks: string[] = [];
  let current = "";

  clauses.forEach((clause) => {
    const candidate = `${current} ${clause}`.trim();
    if (candidate.length <= 180) {
      current = candidate;
      return;
    }
    if (current) chunks.push(current);
    if (clause.length <= 180) {
      current = clause.trim();
      return;
    }
    const pieces = clause.split(/(?<=,|;)\s+/);
    current = "";
    pieces.forEach((piece) => {
      const pieceCandidate = `${current} ${piece}`.trim();
      if (pieceCandidate.length > 180 && current) {
        chunks.push(current);
        current = piece.trim();
      } else {
        current = pieceCandidate;
      }
    });
  });
  if (current) chunks.push(current);
  return chunks.filter(Boolean);
}

function endActiveRecording() {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.removeAttribute("src");
  activeAudio.load();
  activeAudio = null;
}

function cancelCurrentPlayback() {
  playbackGeneration += 1;
  endActiveRecording();
  if (hasSpeechSynthesis()) window.speechSynthesis.cancel();
  return playbackGeneration;
}

async function playRecording(
  source: string,
  playbackRate: number,
  generation: number,
  callbacks: PlaybackCallbacks,
) {
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.playbackRate = playbackRate;
  audio.preservesPitch = true;
  activeAudio = audio;

  audio.onended = () => {
    if (generation !== playbackGeneration) return;
    activeAudio = null;
    callbacks.onEnd?.();
  };
  audio.onerror = () => {
    if (generation !== playbackGeneration) return;
    activeAudio = null;
    callbacks.onEnd?.();
  };

  try {
    await audio.play();
    if (generation !== playbackGeneration) return false;
    callbacks.onStart?.("recorded");
    return true;
  } catch {
    if (activeAudio === audio) activeAudio = null;
    return false;
  }
}

function speakWithSystemVoice(
  text: string,
  speed: SpanishAudioSpeed,
  requestedVoiceURI: string | null | undefined,
  generation: number,
  callbacks: PlaybackCallbacks,
): AudioResult {
  if (!hasSpeechSynthesis()) {
    callbacks.onEnd?.();
    return "unsupported";
  }

  const preferences = getSpanishAudioPreferences();
  const rankedVoices = rankedSpanishVoices();
  const voices = nexoVoices(rankedVoices);
  const voiceURI = requestedVoiceURI === undefined ? preferences.voiceURI : requestedVoiceURI;
  const voice = voices.find((candidate) => candidate.voiceURI === voiceURI) ?? voices[0] ?? rankedVoices[0] ?? null;
  const chunks = splitSpeechIntoChunks(text);
  const rate = speed === "slow" ? preferences.slowRate : preferences.naturalRate;
  let index = 0;
  let started = false;

  const finish = () => {
    if (generation !== playbackGeneration) return;
    callbacks.onEnd?.();
  };

  const speakNext = () => {
    if (generation !== playbackGeneration) return;
    const chunk = chunks[index];
    if (!chunk) {
      finish();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.voice = voice;
    utterance.lang = voice?.lang ?? "es-MX";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onstart = () => {
      if (started || generation !== playbackGeneration) return;
      started = true;
      callbacks.onStart?.("system");
    };
    utterance.onend = () => {
      index += 1;
      speakNext();
    };
    utterance.onerror = () => finish();
    window.speechSynthesis.speak(utterance);
  };

  speakNext();
  return "played";
}

export async function playSpanishAudio(text: string, options: PlaybackOptions = {}): Promise<AudioResult> {
  const speed = options.speed ?? "natural";
  const generation = cancelCurrentPlayback();
  const recording = findSpanishRecording(options.audioId, text);

  if (recording) {
    const source = speed === "slow" ? recording.slow ?? recording.natural : recording.natural;
    const playbackRate = speed === "slow" && !recording.slow ? getSpanishAudioPreferences().slowRate : 1;
    const played = await playRecording(source, playbackRate, generation, options);
    if (played) return "played";
  }

  await prepareSpanishAudio();
  if (generation !== playbackGeneration) return "played";
  return speakWithSystemVoice(text, speed, options.voiceURI, generation, options);
}

export function stopSpanishAudio() {
  cancelCurrentPlayback();
}
