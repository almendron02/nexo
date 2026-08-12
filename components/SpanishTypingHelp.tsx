"use client";

const spanishCharacters = ["ñ", "á", "é", "í", "ó", "ú"];

export function SpanishTypingHelp({
  disabled = false,
  onCharacter,
}: {
  disabled?: boolean;
  onCharacter: (character: string) => void;
}) {
  return (
    <aside className="spanish-typing-help" aria-label="Spanish keyboard help">
      <p><strong>Typing Spanish:</strong> On a phone or Mac, press and hold the base letter. On Windows, use a Spanish or US-International keyboard—or tap a character below.</p>
      <div aria-label="Spanish special characters">
        {spanishCharacters.map((character) => (
          <button aria-label={`Insert ${character}`} disabled={disabled} key={character} onClick={() => onCharacter(character)} type="button">{character}</button>
        ))}
      </div>
    </aside>
  );
}
