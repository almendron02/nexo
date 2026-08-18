import Image from "next/image";

const spanishSpeakingPlaces = [
  { code: "MX", name: "Mexico" },
  { code: "GT", name: "Guatemala" },
  { code: "SV", name: "El Salvador" },
  { code: "HN", name: "Honduras" },
  { code: "NI", name: "Nicaragua" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "CU", name: "Cuba" },
  { code: "DO", name: "Dominican Republic" },
  { code: "PR", name: "Puerto Rico" },
  { code: "CO", name: "Colombia" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "PE", name: "Peru" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "CL", name: "Chile" },
  { code: "AR", name: "Argentina" },
  { code: "UY", name: "Uruguay" },
  { code: "ES", name: "Spain" },
  { code: "GQ", name: "Equatorial Guinea" },
] as const;

function FlagList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="flag-loop__list" aria-hidden={duplicate || undefined} role="list">
      {spanishSpeakingPlaces.map((place) => (
        <li className="flag-loop__item" key={place.name}>
          <Image
            alt=""
            aria-hidden="true"
            className="flag-loop__flag"
            height={44}
            loading="lazy"
            src={`/flags/${place.code}.svg`}
            unoptimized
            width={66}
          />
          <span>{place.name}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpanishFlagLoop() {
  return (
    <div className="flag-loop" role="region" aria-label="Flags of the Spanish-speaking world">
      <div className="flag-loop__track">
        <FlagList />
        <FlagList duplicate />
      </div>
    </div>
  );
}
