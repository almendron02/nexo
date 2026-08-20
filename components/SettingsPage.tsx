"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Gauge, Volume2 } from "lucide-react";
import { erasePrototypeData, exportPrototypeData } from "@/lib/prototype-store";
import { contactEmail } from "@/lib/site";
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
  const [resetStatus, setResetStatus] = useState<{ type: "complete" | "error"; message: string } | null>(null);
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

  const resetCourse = async () => {
    const result = await erasePrototypeData();
    setConfirmingReset(false);
    setResetStatus(result.error
      ? { type: "error", message: result.error }
      : { type: "complete", message: "Course records were erased from this browser and your synced account copy." });
  };

  const downloadCourseData = () => {
    const blob = new Blob([exportPrototypeData()], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `nexo-course-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
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
          <h2 id="profile-settings-title">Account and privacy</h2>
          <p>What Nexo keeps and what it does not.</p>
        </div>
        <dl className="settings-list">
          <div><dt>Course</dt><dd>Spanish Foundations</dd></div>
          <div><dt>Storage</dt><dd>Browser copy + account sync</dd></div>
          <div><dt>Analytics</dt><dd>No GA4 or ad trackers</dd></div>
          <div><dt>AI use</dt><dd>Answers are not sent to AI</dd></div>
        </dl>
      </section>

      <section className="settings-section settings-section--data" aria-labelledby="data-settings-title">
        <div className="settings-section__heading">
          <h2 id="data-settings-title">Your course data</h2>
          <p>Export or erase lessons, attempts, concept evidence, and review progress.</p>
        </div>
        <div className="settings-data-action">
          <div className="settings-data-buttons">
            <button className="settings-button" type="button" onClick={downloadCourseData}><Download aria-hidden="true" /> Download course data</button>
            {!confirmingReset ? (
              <button className="settings-button" type="button" onClick={() => { setConfirmingReset(true); setResetStatus(null); }}>
                Erase course data
              </button>
            ) : null}
          </div>
          {confirmingReset ? (
            <div className="settings-confirm" role="group" aria-label="Confirm prototype reset">
              <p>This cannot be undone. Erase the browser copy and all account-linked lesson progress, original attempts, and concept evidence?</p>
              <div>
                <button className="settings-button" type="button" onClick={() => setConfirmingReset(false)}>Cancel</button>
                <button className="settings-button settings-button--danger" type="button" onClick={() => void resetCourse()}>Erase now</button>
              </div>
            </div>
          ) : null}
          {resetStatus ? <p className={resetStatus.type === "error" ? "settings-status is-error" : "settings-status"} role="status">{resetStatus.message}</p> : null}
          <p className="settings-data-note">Erasing course data does not delete the sign-in account. To delete the account and email identifier, send a request to <a href={`mailto:${contactEmail}?subject=Nexo%20account%20deletion`}>{contactEmail}</a>. See the <Link href="/privacy">Privacy Notice</Link>.</p>
        </div>
      </section>
    </div>
  );
}
