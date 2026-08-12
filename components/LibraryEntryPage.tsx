import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { SpanishAudio } from "@/components/SpanishAudio";
import { getCourseLesson } from "@/content/course-catalog";
import { getLibraryEntry, type LibraryEntry, type LibraryExample } from "@/content/library";

function AudioExamples({ examples }: { examples: LibraryExample[] }) {
  return (
    <div className="library-audio-list">
      {examples.map((example) => (
        <div key={`${example.text}-${example.translation}`}>
          <SpanishAudio text={example.text} translation={example.translation} />
          {example.note ? <p>{example.note}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function LibraryEntryPage({ entry }: { entry: LibraryEntry }) {
  const sources = entry.lessonIds.map((id) => getCourseLesson(id)).filter((source) => source !== undefined);
  const relatedEntries = entry.relatedSlugs.map((slug) => getLibraryEntry(slug)).filter((related) => related !== undefined);

  return (
    <article className="page library-entry-page">
      <Link className="back-link" href="/library"><ArrowLeft aria-hidden="true" /> Library</Link>

      <header className="library-entry-hero">
        <p className="eyebrow">{entry.category}</p>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        <div className="library-entry-meta">
          <span>{entry.readMinutes} minute guide</span>
          <span>{entry.lessonIds.length} source {entry.lessonIds.length === 1 ? "lesson" : "lessons"}</span>
        </div>
      </header>

      <section className="library-short-answer" aria-labelledby="short-answer-title">
        <span>The short answer</span>
        <p id="short-answer-title">{entry.shortAnswer}</p>
      </section>

      <div className="library-entry-body">
        {entry.sections.map((section) => {
          if (section.type === "text") {
            return (
              <section className="library-article-section" key={section.heading}>
                {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
                <h2>{section.heading}</h2>
                <div className="library-article-copy">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.examples ? <AudioExamples examples={section.examples} /> : null}
              </section>
            );
          }

          if (section.type === "steps") {
            return (
              <section className="library-article-section" key={section.heading}>
                {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
                <h2>{section.heading}</h2>
                {section.introduction ? <p className="library-section-intro">{section.introduction}</p> : null}
                <div className="library-steps">
                  {section.steps.map((step) => (
                    <div key={`${step.label}-${step.title}`}>
                      <span>{step.label}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                        {step.examples ? <AudioExamples examples={step.examples} /> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "comparison") {
            return (
              <section className="library-article-section library-article-section--wide" key={section.heading}>
                {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
                <h2>{section.heading}</h2>
                {section.introduction ? <p className="library-section-intro">{section.introduction}</p> : null}
                <div className="library-comparison">
                  {section.sides.map((side) => (
                    <div key={side.label}>
                      <span>{side.label}</span>
                      <h3>{side.question}</h3>
                      <p>{side.description}</p>
                      <AudioExamples examples={side.examples} />
                    </div>
                  ))}
                </div>
                {section.note ? <p className="library-comparison-note">{section.note}</p> : null}
              </section>
            );
          }

          return (
            <section className="library-article-section library-self-check" key={section.heading}>
              {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
              <h2>{section.heading}</h2>
              <p>{section.prompt}</p>
              <details>
                <summary>Reveal the answer <ArrowRight aria-hidden="true" /></summary>
                <div>
                  <strong>{section.answer}</strong>
                  <p>{section.explanation}</p>
                  {section.example ? <AudioExamples examples={[section.example]} /> : null}
                </div>
              </details>
            </section>
          );
        })}
      </div>

      <section className="library-sources" aria-labelledby="library-sources-title">
        <div>
          <BookOpen aria-hidden="true" />
          <p className="eyebrow">Learn it in context</p>
          <h2 id="library-sources-title">Source lessons</h2>
        </div>
        <ol>
          {sources.map(({ lesson, module }) => (
            <li key={lesson.id}>
              <Link href={`/lesson/${lesson.id}`}>
                <span>Lesson {lesson.id}</span>
                <strong>{lesson.title}</strong>
                <small>{module.number === 0 ? "Start Here" : `Module ${module.number}`}</small>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="library-related" aria-labelledby="library-related-title">
        <p className="eyebrow">Keep connecting</p>
        <h2 id="library-related-title">Related guides</h2>
        <div>
          {relatedEntries.map((related) => (
            <Link href={`/library/${related.slug}`} key={related.slug}>
              <span>{related.category}</span>
              <strong>{related.title}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
