"use client";

import { useRef, type PointerEventHandler } from "react";
import {
  AR,
  BO,
  CL,
  CO,
  CR,
  CU,
  DO,
  EC,
  ES,
  GQ,
  GT,
  HN,
  MX,
  NI,
  PA,
  PE,
  PR,
  PY,
  SV,
  UY,
  VE,
} from "country-flag-icons/react/3x2";

const spanishSpeakingPlaces = [
  { Flag: MX, name: "Mexico" },
  { Flag: GT, name: "Guatemala" },
  { Flag: SV, name: "El Salvador" },
  { Flag: HN, name: "Honduras" },
  { Flag: NI, name: "Nicaragua" },
  { Flag: CR, name: "Costa Rica" },
  { Flag: PA, name: "Panama" },
  { Flag: CU, name: "Cuba" },
  { Flag: DO, name: "Dominican Republic" },
  { Flag: PR, name: "Puerto Rico" },
  { Flag: CO, name: "Colombia" },
  { Flag: VE, name: "Venezuela" },
  { Flag: EC, name: "Ecuador" },
  { Flag: PE, name: "Peru" },
  { Flag: BO, name: "Bolivia" },
  { Flag: PY, name: "Paraguay" },
  { Flag: CL, name: "Chile" },
  { Flag: AR, name: "Argentina" },
  { Flag: UY, name: "Uruguay" },
  { Flag: ES, name: "Spain" },
  { Flag: GQ, name: "Equatorial Guinea" },
] as const;

type FlagListProps = {
  duplicate?: boolean;
  onFlagEnter: PointerEventHandler<HTMLLIElement>;
  onFlagLeave: PointerEventHandler<HTMLLIElement>;
};

function FlagList({ duplicate = false, onFlagEnter, onFlagLeave }: FlagListProps) {
  return (
    <ul className="flag-loop__list" aria-hidden={duplicate || undefined} role="list">
      {spanishSpeakingPlaces.map((place) => (
        <li
          className="flag-loop__item"
          key={place.name}
          onPointerEnter={onFlagEnter}
          onPointerLeave={onFlagLeave}
        >
          <place.Flag aria-hidden="true" className="flag-loop__flag" />
          <span>{place.name}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpanishFlagLoop() {
  const trackRef = useRef<HTMLDivElement>(null);

  function setLoopSpeed(playbackRate: number) {
    trackRef.current?.getAnimations().forEach((animation) => {
      animation.updatePlaybackRate(playbackRate);
    });
  }

  return (
    <div className="flag-loop" role="region" aria-label="Flags of the Spanish-speaking world">
      <div className="flag-loop__track" ref={trackRef}>
        <FlagList onFlagEnter={() => setLoopSpeed(0.5)} onFlagLeave={() => setLoopSpeed(1)} />
        <FlagList duplicate onFlagEnter={() => setLoopSpeed(0.5)} onFlagLeave={() => setLoopSpeed(1)} />
      </div>
    </div>
  );
}
