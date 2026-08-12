"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Play } from "lucide-react";
import { module04 } from "@/content/spanish-foundations/module-04";
import { builtCourseModules } from "@/content/course-catalog";
import { usePrototypeState } from "@/lib/prototype-store";
import { lessonAccessFor } from "@/lib/course-access";

export function ModuleOverview({ authenticated, entitled }: { authenticated: boolean; entitled: boolean }) {
  const state = usePrototypeState();
  const completeCount = module04.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  const progress = Math.round((completeCount / module04.lessons.length) * 100);
  const totalMinutes = module04.lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0);
  const nextLessonIndex = module04.lessons.findIndex((lesson) => !state.completedLessons.includes(lesson.id));
  const stagePathComplete = builtCourseModules.every((module) => module.lessons.every((lesson) => state.completedLessons.includes(lesson.id)));
  const checkpointComplete = state.completedLessons.includes(module04.checkpoint.id);

  return (
    <div className="page module-page">
      <Link className="back-link" href="/course"><ArrowLeft aria-hidden="true" /> Complete course</Link>
      <header className="module-hero">
        <div className="module-hero__copy">
          <p className="eyebrow">{module04.stage} · Module 04</p>
          <h1>{module04.title}</h1>
          <p>{module04.description}</p>
          <div className="module-hero__stats">
            <span><Clock3 aria-hidden="true" /> About {totalMinutes} min</span>
            <span>{completeCount} of {module04.lessons.length} lessons complete</span>
          </div>
        </div>
        <div className="module-hero__progress">
          <strong>{progress}%</strong>
          <span>complete</span>
          <div className="module-progress" aria-label={`${progress}% of Module 4 complete`}><span style={{ width: `${progress}%` }} /></div>
          <p>Stage I checkpoint follows this module.</p>
        </div>
      </header>

      <section className="module-objective">
        <span className="module-objective__label">By the end</span>
        <p>Choose between <strong>ser</strong>, <strong>estar</strong>, and <strong>hay</strong> from the meaning of the sentence—not from a memorized shortcut.</p>
      </section>

      <section className="lesson-list-section">
        <div className="section-heading">
          <div><p className="eyebrow">Your path</p><h2>Five connected lessons</h2></div>
        </div>
        <div className="lesson-list">
          {module04.lessons.map((lesson, index) => {
            const completed = state.completedLessons.includes(lesson.id);
            const access = lessonAccessFor({ authenticated, completedLessons: state.completedLessons, entitled, lessonId: lesson.id });
            const available = access.status === "available";
            const isNext = index === nextLessonIndex;
            return (
              <article className={`lesson-row ${isNext ? "is-next" : ""}`} key={lesson.id}>
                <div className={`lesson-row__status ${completed ? "is-complete" : ""}`}>
                  {completed ? <Check aria-hidden="true" /> : available ? <Play aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
                </div>
                <div className="lesson-row__copy">
                  <div><h3>{lesson.id} · {lesson.title}</h3></div>
                  <p>{lesson.description}</p>
                </div>
                <div className="lesson-row__action">
                  <span><Clock3 aria-hidden="true" /> {lesson.durationMinutes} min</span>
                  {available ? <Link className="round-link" href={`/lesson/${lesson.id}`} aria-label={`${completed ? "Revisit" : "Open"} ${lesson.title}`}><ArrowRight aria-hidden="true" /></Link> : <Link className="locked-label" href={`/lesson/${lesson.id}`}>{access.status === "account-required" ? "Create an account" : access.status === "purchase-required" ? "Get course access" : access.status === "prerequisite-required" ? `Complete ${access.prerequisiteId}` : "Complete checkpoint"}</Link>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`checkpoint-card ${stagePathComplete ? "is-available" : ""}`} id="stage-1-checkpoint">
        <div><p className="eyebrow">After Module 4</p><h2>Stage I Checkpoint</h2><p>After the complete path from Start Here, bring Modules 1–4 together through reading, listening, control, recall, and original Spanish.</p></div>
        {stagePathComplete ? (
          <Link className="button button--dark" href="/checkpoint/stage-1">{checkpointComplete ? "Revisit checkpoint" : "Begin checkpoint"} <ArrowRight aria-hidden="true" /></Link>
        ) : <div className="checkpoint-card__lock"><LockKeyhole aria-hidden="true" /><span>Complete Start Here and Modules 1–4 to unlock</span></div>}
      </section>
    </div>
  );
}
