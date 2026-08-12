"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gauge, Volume2 } from "lucide-react";
import { resetPrototype } from "@/lib/prototype-store";
import {
  getSpanishAudioPreferences,
  getSpanishVoiceOptions,
  playSpanishAudio,
  prepareSpanishAudio,
  setSpanishAudioPreferences,
  stopSpanishAudio,
  subscribeToSpanishVoices,
  type SpanishAudioSpeed,
  type SpanishVoiceOption,
} from "@/lib/spanish-audio";

const VOICE_PREVIEW = "Hola. Escucha el ritmo natural de esta frase en español.";

export function SettingsPage() {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [voices, setVoices] = useState<SpanishVoiceOption[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<SpanishAudioSpeed | null>(null);

  const latinAmericanVoices = voices.filter((voice) => voice.isLatinAmerican);
  const automaticVoiceURI = latinAmericanVoices.find((voice) => voice.isRecommended)?.voiceURI ?? latinAmericanVoices[0]?.voiceURI ?? null;

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (!active) return;
      const nextVoices = getSpanishVoiceOptions();
      const storedVoiceURI = getSpanishAudioPreferences().voiceURI;
      const validStoredVoice = nextVoices.some((voice) => voice.voiceURI === storedVoiceURI);
      setVoices(nextVoices);
      setSelectedVoiceURI(validStoredVoice ? storedVoiceURI : null);
      if (storedVoiceURI && !validStoredVoice) setSpanishAudioPreferences({ voiceURI: null });
    };

    const unsubscribe = subscribeToSpanishVoices(refresh);
    void prepareSpanishAudio().then(() => {
      if (!active) return;
      refresh();
      setVoicesLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
      stopSpanishAudio();
    };
  }, []);

  const resetCourse = () => {
    resetPrototype();
    setConfirmingReset(false);
    setResetComplete(true);
  };

  const chooseVoice = (voiceURI: string | null) => {
    setSelectedVoiceURI(voiceURI);
    setSpanishAudioPreferences({ voiceURI });
  };

  const previewVoice = async (speed: SpanishAudioSpeed, voiceURI = selectedVoiceURI) => {
    if (previewing === speed) {
      stopSpanishAudio();
      setPreviewing(null);
      return;
    }
    const result = await playSpanishAudio(VOICE_PREVIEW, {
      speed,
      voiceURI,
      onStart: () => setPreviewing(speed),
      onEnd: () => setPreviewing(null),
    });
    if (result === "unsupported") setPreviewing(null);
  };

  return (
    <div className="page settings-page">
      <Link className="back-link" href="/dashboard"><ArrowLeft aria-hidden="true" /> Dashboard</Link>

      <header className="settings-header">
        <p className="eyebrow">Settings</p>
        <h1>Your Nexo.</h1>
        <p>Course choices and prototype data, kept in one quiet place.</p>
      </header>

      <section className="settings-section" aria-labelledby="course-settings-title">
        <div className="settings-section__heading">
          <h2 id="course-settings-title">Course preferences</h2>
          <p>These choices define the Foundations course.</p>
        </div>
        <dl className="settings-list">
          <div><dt>Spanish variety</dt><dd>General Latin American Spanish</dd></div>
          <div><dt>Lesson format</dt><dd>Written-first and interactive</dd></div>
          <div><dt>Sentence audio</dt><dd>Nexo recordings with system fallback</dd></div>
          <div><dt>Motion</dt><dd>Follow device accessibility settings</dd></div>
        </dl>
      </section>

      <section className="settings-section settings-section--audio" aria-labelledby="audio-settings-title">
        <div className="settings-section__heading">
          <h2 id="audio-settings-title">Spanish audio</h2>
          <p>Nexo recordings play first. Until a sentence is recorded, choose a Latin American voice installed on this device.</p>
        </div>
        <div className="audio-settings">
          <div className="audio-preview" aria-label="Preview Spanish audio speed">
            <div>
              <span>Preview sentence</span>
              <p lang="es">{VOICE_PREVIEW}</p>
            </div>
            <div className="audio-preview__actions">
              <button data-interface-sound="none" type="button" onClick={() => void previewVoice("natural")} className={previewing === "natural" ? "is-playing" : ""}>
                <Volume2 aria-hidden="true" /> {previewing === "natural" ? "Stop" : "Natural"}
              </button>
              <button data-interface-sound="none" type="button" onClick={() => void previewVoice("slow")} className={previewing === "slow" ? "is-playing" : ""}>
                <Gauge aria-hidden="true" /> {previewing === "slow" ? "Stop" : "Slow replay"}
              </button>
            </div>
          </div>

          <fieldset className="voice-picker">
            <legend>Voice on this device</legend>
            {voicesLoading ? <p className="voice-picker__status" role="status">Looking for installed Spanish voices…</p> : null}
            {!voicesLoading && !latinAmericanVoices.length ? (
              <p className="voice-picker__status" role="status">Paulina and Rocko are not installed. Nexo will ask the browser for its closest Spanish fallback.</p>
            ) : null}
            {latinAmericanVoices.map((voice) => (
              <div className="voice-option" key={voice.voiceURI}>
                <label className="voice-option__control">
                  <input
                    checked={(selectedVoiceURI ?? automaticVoiceURI) === voice.voiceURI}
                    name="spanish-voice"
                    onChange={() => chooseVoice(voice.voiceURI === automaticVoiceURI ? null : voice.voiceURI)}
                    type="radio"
                  />
                  <span>
                    <strong>{voice.name}{voice.voiceURI === automaticVoiceURI ? <i>Automatic</i> : null}</strong>
                    <small>{voice.localeLabel} · {voice.lang}</small>
                  </span>
                </label>
                <button data-interface-sound="none" type="button" onClick={() => void previewVoice("natural", voice.voiceURI)}>Preview</button>
              </div>
            ))}
          </fieldset>
          <p className="audio-settings__note">Your choice stays on this device. Reviewed Nexo recordings always take priority over the system voice.</p>
        </div>
      </section>

      <section className="settings-section" aria-labelledby="profile-settings-title">
        <div className="settings-section__heading">
          <h2 id="profile-settings-title">Profile</h2>
          <p>Your local prototype identity.</p>
        </div>
        <dl className="settings-list">
          <div><dt>Name</dt><dd>Angel</dd></div>
          <div><dt>Course</dt><dd>Spanish Foundations</dd></div>
          <div><dt>Storage</dt><dd>This device only</dd></div>
        </dl>
      </section>

      <section className="settings-section settings-section--data" aria-labelledby="data-settings-title">
        <div className="settings-section__heading">
          <h2 id="data-settings-title">Prototype data</h2>
          <p>Reset lesson attempts, concept evidence, and review progress.</p>
        </div>
        <div className="settings-data-action">
          {confirmingReset ? (
            <div className="settings-confirm" role="group" aria-label="Confirm prototype reset">
              <p>This cannot be undone. Reset the local course data?</p>
              <div>
                <button className="settings-button" type="button" onClick={() => setConfirmingReset(false)}>Cancel</button>
                <button className="settings-button settings-button--danger" type="button" onClick={resetCourse}>Reset now</button>
              </div>
            </div>
          ) : (
            <button className="settings-button" type="button" onClick={() => { setConfirmingReset(true); setResetComplete(false); }}>
              Reset course data
            </button>
          )}
          {resetComplete ? <p className="settings-status" role="status">Course data reset.</p> : null}
        </div>
      </section>
    </div>
  );
}
