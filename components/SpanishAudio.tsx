"use client";

import { useEffect, useState } from "react";
import { Gauge, Volume2, VolumeX } from "lucide-react";
import {
  playSpanishAudio,
  prepareSpanishAudio,
  stopSpanishAudio,
  type SpanishAudioSource,
  type SpanishAudioSpeed,
} from "@/lib/spanish-audio";

type SpanishAudioProps = {
  text: string;
  translation?: string;
  audioId?: string;
  compact?: boolean;
  className?: string;
};

export function SpanishAudio({ text, translation, audioId, compact = false, className = "" }: SpanishAudioProps) {
  const [playing, setPlaying] = useState<SpanishAudioSpeed | null>(null);
  const [source, setSource] = useState<SpanishAudioSource | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    void prepareSpanishAudio();
    return () => stopSpanishAudio();
  }, []);

  const play = async (speed: SpanishAudioSpeed) => {
    if (playing === speed) {
      stopSpanishAudio();
      setPlaying(null);
      setSource(null);
      return;
    }

    setUnsupported(false);
    const result = await playSpanishAudio(text, {
      audioId,
      speed,
      onStart: (nextSource) => {
        setSource(nextSource);
        setPlaying(speed);
      },
      onEnd: () => {
        setPlaying(null);
        setSource(null);
      },
    });
    if (result === "unsupported") setUnsupported(true);
  };

  return (
    <div
      className={`spanish-audio ${compact ? "spanish-audio--compact" : ""} ${playing ? "is-playing" : ""} ${className}`}
      data-audio-source={source ?? undefined}
      data-interface-sound="none"
    >
      <button
        type="button"
        className="spanish-audio__main"
        onClick={() => void play("natural")}
        aria-label={`${playing === "natural" ? "Stop" : "Hear"}: ${text}`}
        title={translation ? `${translation} · Play at natural speed` : "Play at natural speed"}
      >
        <span>
          <strong lang="es">{text}</strong>
          {translation && !compact ? <small>{translation}</small> : null}
        </span>
        {unsupported ? <VolumeX aria-hidden="true" /> : <Volume2 className={playing === "natural" ? "is-playing" : ""} aria-hidden="true" />}
      </button>
      <button
        type="button"
        className="spanish-audio__slow"
        onClick={() => void play("slow")}
        aria-label={`${playing === "slow" ? "Stop slow replay" : "Hear slowly"}: ${text}`}
        title="Learner replay at a slower speed"
      >
        <Gauge aria-hidden="true" />
        <span>Slow</span>
      </button>
    </div>
  );
}
