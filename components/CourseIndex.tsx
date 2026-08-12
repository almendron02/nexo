"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock3, LockKeyhole } from "lucide-react";
import { courseModules, courseStages } from "@/content/course-catalog";
import { usePrototypeState } from "@/lib/prototype-store";

export function CourseIndex({ authenticated }: { authenticated: boolean }) {
  const state = usePrototypeState();
  const builtLessons = courseModules.filter((module) => module.available).flatMap((module) => module.lessons);
  const totalLessons = courseModules.reduce((total, module) => total + module.lessons.length, 0);
  const completed = builtLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  const checkpointStageByModule: Partial<Record<number, number>> = { 4: 1, 9: 2, 14: 3, 16: 4 };
  const checkpointReady = (moduleNumber: number) => courseModules
    .filter((module) => module.number <= moduleNumber)
    .flatMap((module) => module.lessons)
    .every((lesson) => state.completedLessons.includes(lesson.id));

  return (
    <div className="page course-index-page">
      <header className="course-index-hero">
        <p className="eyebrow">Spanish Foundations · Complete curriculum</p>
        <h1>One course. Sixteen connected modules.</h1>
        <p>Begin with the sound system, build accurate sentences, connect complex ideas, and finish by narrating in the past. Every class has a specific place in that progression.</p>
        <div className="course-index-stats" aria-label="Course scope">
          <span><strong>16</strong> modules</span>
          <span><strong>{totalLessons}</strong> exact classes</span>
          <span><strong>{completed}/{builtLessons.length}</strong> available classes complete</span>
        </div>
        <p className="course-access-note"><strong>Start free.</strong> Module 0 needs no account. Create one when you are ready for Module 1 and the complete path.</p>
      </header>

      <nav className="course-stage-nav" aria-label="Course stages">
        {courseStages.map((stage, index) => (
          <span className="course-stage-nav__step" key={stage.id}>
            <a href={`#${stage.id}`}>{stage.title}</a>
            {index < courseStages.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
          </span>
        ))}
      </nav>

      <div className="course-stages">
        {courseStages.map((stage) => {
          const modules = courseModules.filter((module) => stage.moduleNumbers.includes(module.number));
          return (
            <section className="course-stage" id={stage.id} key={stage.id}>
              <header className="course-stage__header">
                <div><p className="eyebrow">{stage.label}</p><h2>{stage.title}</h2></div>
                <p>{stage.description}</p>
              </header>

              <div className="course-module-index">
                {modules.map((module) => {
                  const completeCount = module.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
                  const moduleLabel = module.number === 0 ? "Start" : String(module.number).padStart(2, "0");
                  const accountRequired = module.number > 0 && !authenticated;
                  return (
                    <article className="course-module-row" key={module.number}>
                      <Link className="course-module-row__heading" href={`/module/${module.number}`}>
                        <span>{moduleLabel}</span>
                        <div>
                          <p>
                            {module.number === 0 ? "Orientation · Free — no account needed" : `Module ${module.number}`}
                            {module.number > 0 ? accountRequired ? " · Account required" : " · Available" : ""}
                          </p>
                          <h3>{module.title}</h3>
                          <small>{module.description}</small>
                        </div>
                        {accountRequired ? <LockKeyhole aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                      </Link>
                      <ol className="course-class-list">
                        {module.lessons.map((lesson) => {
                          const done = state.completedLessons.includes(lesson.id);
                          const href = module.available ? `/lesson/${lesson.id}` : `/module/${module.number}#lesson-${lesson.id}`;
                          return (
                            <li className={done ? "is-complete" : ""} key={lesson.id}>
                              <Link href={href}>
                                <span>{done ? <Check aria-hidden="true" /> : lesson.id}</span>
                                <strong>{lesson.title}</strong>
                                {accountRequired ? <small><LockKeyhole aria-hidden="true" /> Account</small> : lesson.durationMinutes ? <small><Clock3 aria-hidden="true" /> {lesson.durationMinutes} min</small> : <small>Planned</small>}
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                      {module.available ? <p className="course-module-row__progress">{completeCount} of {module.lessons.length} classes complete</p> : null}
                      {module.checkpointAfter ? (
                        <Link
                          className="course-checkpoint-link"
                          href={checkpointReady(module.number)
                            ? `/checkpoint/stage-${checkpointStageByModule[module.number]}`
                            : module.number === 4 ? "/module/4#stage-1-checkpoint" : `/module/${module.number}#checkpoint`}
                        >
                          {module.checkpointAfter}<ArrowRight aria-hidden="true" />
                        </Link>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
