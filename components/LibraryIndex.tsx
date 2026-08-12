"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { libraryCategories, libraryEntries, type LibraryCategory } from "@/content/library";
import { usePrototypeState } from "@/lib/prototype-store";

type CategoryFilter = "All" | LibraryCategory;

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function LibraryIndex() {
  const state = usePrototypeState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const recommended = (() => {
    for (let index = state.completedLessons.length - 1; index >= 0; index -= 1) {
      const match = libraryEntries.find((entry) => entry.lessonIds.includes(state.completedLessons[index]));
      if (match) return { entry: match, learned: true };
    }
    return { entry: libraryEntries[0], learned: false };
  })();

  const results = (() => {
    const normalizedQuery = normalizeSearch(query);
    return libraryEntries.filter((entry) => {
      if (category !== "All" && entry.category !== category) return false;
      if (!normalizedQuery) return true;
      const haystack = normalizeSearch([
        entry.title,
        entry.summary,
        entry.category,
        ...entry.lessonIds,
        ...entry.searchTerms,
      ].join(" "));
      return haystack.includes(normalizedQuery);
    });
  })();

  return (
    <div className="page library-page">
      <section className="library-search-section library-search-section--lead" aria-labelledby="library-search-heading">
        <div className="library-search-heading">
          <div>
            <p className="eyebrow">Library · Complete course</p>
            <h1 id="library-search-heading">Find an answer.</h1>
            <p>Search the forms, patterns, and meaning contrasts taught from Start Here through Module 16.</p>
          </div>
          <span>{libraryEntries.length} guides available</span>
        </div>
        <div className="library-search">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="library-search-input">Search the Nexo Library</label>
          <input
            id="library-search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “preterite vs imperfect,” GUSTAR, or question words"
            type="search"
            value={query}
          />
          {query ? <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><X aria-hidden="true" /></button> : null}
        </div>

        <div className="library-filters" aria-label="Filter library guides">
          {(["All", ...libraryCategories] as CategoryFilter[]).map((item) => (
            <button aria-pressed={category === item} key={item} onClick={() => setCategory(item)} type="button">
              {item}
              <span>{item === "All" ? libraryEntries.length : libraryEntries.filter((entry) => entry.category === item).length}</span>
            </button>
          ))}
        </div>
      </section>

      {!query && category === "All" ? (
        <section className="library-feature" aria-labelledby="library-feature-title">
          <div>
            <p className="eyebrow">{recommended.learned ? "Recently learned" : "A good place to begin"}</p>
            <h2 id="library-feature-title">{recommended.entry.title}</h2>
            <p>{recommended.entry.summary}</p>
          </div>
          <Link href={`/library/${recommended.entry.slug}`}>Open guide <ArrowRight aria-hidden="true" /></Link>
        </section>
      ) : null}

      <section className="library-results" aria-labelledby="library-results-heading">
        <div className="library-results__heading">
          <h2 id="library-results-heading">{query ? "Search results" : category === "All" ? "All guides" : category}</h2>
          <span aria-live="polite">{results.length} {results.length === 1 ? "guide" : "guides"}</span>
        </div>
        {results.length ? (
          <ol>
            {results.map((entry, index) => (
              <li key={entry.slug}>
                <Link href={`/library/${entry.slug}`}>
                  <span className="library-result__number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{entry.category} · {entry.readMinutes} min</p>
                    <h3>{entry.title}</h3>
                    <span>{entry.summary}</span>
                  </div>
                  <span className="library-result__module">{entry.moduleNumbers[0] === 0 ? "Start Here" : `Module ${entry.moduleNumbers.join(" + ")}`}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="library-empty">
            <h3>No guide matches that yet.</h3>
            <p>Try a broader idea such as “vowels,” “gender,” “agreement,” “ser,” or “location.”</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} type="button">Show every guide</button>
          </div>
        )}
      </section>

      <footer className="library-roadmap">
        <span>Course reference</span>
        <p>Every course stage now has a guide here. Source-lesson links take you back to the full explanation and practice whenever a quick answer is not enough.</p>
      </footer>
    </div>
  );
}
