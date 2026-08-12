"use client";

export type AnswerFeedback = "correct" | "incorrect";

let feedbackContext: AudioContext | null = null;

function getFeedbackContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  feedbackContext ??= new AudioContextClass();
  return feedbackContext;
}

function note(
  context: AudioContext,
  frequency: number,
  startsAt: number,
  duration: number,
  volume: number,
  type: OscillatorType,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

export function playAnswerFeedback(result: AnswerFeedback) {
  const context = getFeedbackContext();
  if (!context) return;

  if (context.state === "suspended") void context.resume();
  const startsAt = context.currentTime + 0.015;

  if (result === "correct") {
    note(context, 523.25, startsAt, 0.16, 0.16, "sine");
    note(context, 659.25, startsAt + 0.095, 0.2, 0.18, "sine");
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(246.94, startsAt);
  oscillator.frequency.exponentialRampToValueAtTime(185, startsAt + 0.22);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(0.15, startsAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.24);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + 0.26);
}

/** A warm, longer cue reserved for finishing a lesson or module review. */
export function playCompletionSound() {
  const context = getFeedbackContext();
  if (!context) return;

  if (context.state === "suspended") void context.resume();
  const startsAt = context.currentTime + 0.015;

  // An ascending C-major phrase, followed by a soft sustained resolution.
  note(context, 523.25, startsAt, 0.28, 0.15, "sine");
  note(context, 659.25, startsAt + 0.14, 0.3, 0.15, "sine");
  note(context, 783.99, startsAt + 0.29, 0.34, 0.16, "sine");
  note(context, 1046.5, startsAt + 0.46, 0.62, 0.17, "sine");
  note(context, 659.25, startsAt + 0.49, 0.58, 0.055, "triangle");
  note(context, 783.99, startsAt + 0.49, 0.58, 0.05, "triangle");
}
