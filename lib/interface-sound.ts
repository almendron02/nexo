"use client";

let interfaceContext: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getInterfaceContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (interfaceContext?.state === "closed") {
    interfaceContext = null;
    noiseBuffer = null;
  }
  interfaceContext ??= new AudioContextClass();
  return interfaceContext;
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer;

  const length = Math.ceil(context.sampleRate * 0.052);
  noiseBuffer = context.createBuffer(1, length, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    const position = index / length;
    const decay = (1 - position) ** 4;
    data[index] = (Math.random() * 2 - 1) * decay;
  }
  return noiseBuffer;
}

function scheduleInterfaceSound(context: AudioContext) {
  const startsAt = context.currentTime + 0.004;

  // A dry consonant-like burst supplies the short "t" edge.
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  noise.buffer = getNoiseBuffer(context);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1050, startsAt);
  filter.Q.setValueAtTime(0.8, startsAt);
  noiseGain.gain.setValueAtTime(0.0001, startsAt);
  noiseGain.gain.exponentialRampToValueAtTime(0.075, startsAt + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.05);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(context.destination);
  noise.start(startsAt);
  noise.stop(startsAt + 0.054);

  // A tiny low-mid body keeps the click tactile rather than sharp or glossy.
  const body = context.createOscillator();
  const bodyGain = context.createGain();
  body.type = "triangle";
  body.frequency.setValueAtTime(155, startsAt);
  body.frequency.exponentialRampToValueAtTime(108, startsAt + 0.043);
  bodyGain.gain.setValueAtTime(0.0001, startsAt);
  bodyGain.gain.exponentialRampToValueAtTime(0.036, startsAt + 0.002);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.045);
  body.connect(bodyGain);
  bodyGain.connect(context.destination);
  body.start(startsAt);
  body.stop(startsAt + 0.05);
}

export function playInterfaceSound() {
  const context = getInterfaceContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume().then(() => scheduleInterfaceSound(context)).catch(() => undefined);
    return;
  }

  scheduleInterfaceSound(context);
}
