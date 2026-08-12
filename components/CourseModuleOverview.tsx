"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Play } from "lucide-react";
import type { CourseCatalogModule } from "@/content/course-catalog";
import { usePrototypeState } from "@/lib/prototype-store";
import { lessonAccessFor } from "@/lib/course-access";

export function CourseModuleOverview({ authenticated, entitled, module }: { authenticated: boolean; entitled: boolean; module: CourseCatalogModule }) {
  const state = usePrototypeState();
  const completeCount = module.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  const progress = module.available ? Math.round((completeCount / module.lessons.length) * 100) : 0;
  const totalMinutes = module.lessons.reduce((total, lesson) => total + (lesson.durationMinutes ?? 0), 0);
  const nextLessonIndex = module.lessons.findIndex((lesson) => !state.completedLessons.includes(lesson.id));
  const displayNumber = module.number === 0 ? "Start Here" : `Module ${String(module.number).padStart(2, "0")}`;
  const checkpointStageByModule: Partial<Record<number, number>> = { 9: 2, 14: 3, 16: 4 };
  const checkpointStage = checkpointStageByModule[module.number];
  const checkpointReady = completeCount === module.lessons.length;

  return (
    <div className="page module-page">
      <Link className="back-link" href="/course"><ArrowLeft aria-hidden="true" /> Complete course</Link>
      <header className="module-hero">
        <div className="module-hero__copy">
          <p className="eyebrow">{module.stageLabel} · {displayNumber}</p>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
          <div className="module-hero__stats">
            {totalMinutes ? <span><Clock3 aria-hidden="true" /> About {totalMinutes} min</span> : <span>Curriculum mapped</span>}
            <span>{module.available ? `${completeCount} of ${module.lessons.length} lessons complete` : `${module.lessons.length} planned lessons`}</span>
          </div>
        </div>
        <div className="module-hero__progress">
          <strong>{module.available ? `${progress}%` : "—"}</strong>
          <span>{module.available ? "complete" : "planned"}</span>
          <div className="module-progress" aria-label={module.available ? `${progress}% of ${displayNumber} complete` : `${displayNumber} is planned`}><span style={{ width: `${progress}%` }} /></div>
          <p>{module.available ? "Progress is saved on this device." : "The exact class sequence is set; lesson experiences will be authored in a later stage."}</p>
        </div>
      </header>

      <section className="module-objective">
        <span className="module-objective__label">By the end</span>
        <p>{module.objective}</p>
      </section>

      <section className="lesson-list-section">
        <div className="section-heading"><div><p className="eyebrow">The exact path</p><h2>{module.lessons.length} connected classes</h2></div></div>
        <div className="lesson-list">
          {module.lessons.map((lesson, index) => {
            const completed = state.completedLessons.includes(lesson.id);
            const access = lessonAccessFor({ authenticated, completedLessons: state.completedLessons, entitled, lessonId: lesson.id });
            const available = module.available && access.status === "available";
            const isNext = module.available && index === nextLessonIndex;
            return (
              <article className={`lesson-row ${isNext ? "is-next" : ""}`} id={`lesson-${lesson.id}`} key={lesson.id}>
                <div className={`lesson-row__status ${completed ? "is-complete" : ""}`}>
                  {completed ? <Check aria-hidden="true" /> : available ? <Play aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
                </div>
                <div className="lesson-row__copy"><div><h3>{lesson.id} · {lesson.title}</h3></div><p>{module.available ? `A full written lesson in ${module.title.toLocaleLowerCase()}.` : "This class is placed in the curriculum and ready for its future full lesson experience."}</p></div>
                <div className="lesson-row__action">
                  {lesson.durationMinutes ? <span><Clock3 aria-hidden="true" /> {lesson.durationMinutes} min</span> : <span>Planned</span>}
                  {available ? <Link className="round-link" href={`/lesson/${lesson.id}`} aria-label={`${completed ? "Revisit" : "Open"} ${lesson.title}`}><ArrowRight aria-hidden="true" /></Link> : <Link className="locked-label" href={`/lesson/${lesson.id}`}>{access.status === "account-required" ? "Create an account" : access.status === "purchase-required" ? "Get course access" : access.status === "checkpoint-required" ? `Complete ${access.checkpointTitle}` : access.status === "prerequisite-required" ? `Complete ${access.prerequisiteId}` : "Planned"}</Link>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {module.checkpointAfter ? (
        <section className="checkpoint-card" id="checkpoint">
          <div><p className="eyebrow">After {displayNumber}</p><h2>{module.checkpointAfter}</h2><p>Integrate the stage through comprehension, control, recall, and original Spanish.</p></div>
          {checkpointReady && checkpointStage ? (
            <Link className="button button--dark" href={`/checkpoint/stage-${checkpointStage}`}>Begin checkpoint <ArrowRight aria-hidden="true" /></Link>
          ) : (
            <div className="checkpoint-card__lock"><LockKeyhole aria-hidden="true" /><span>Complete this module to begin</span></div>
          )}
        </section>
      ) : null}
    </div>
  );
}
