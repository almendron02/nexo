"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { SpanishAudio } from "@/components/SpanishAudio";
import { SpanishTypingHelp } from "@/components/SpanishTypingHelp";
import { moduleReviewSets, type ModuleReviewItem, type ModuleReviewSet } from "@/content/review-catalog";
import { isAcceptedAnswer } from "@/lib/prototype-state";
import { playAnswerFeedback, playCompletionSound } from "@/lib/answer-feedback-audio";
import { recordAttempt, usePrototypeState } from "@/lib/prototype-store";

function reviewHeading(item: ModuleReviewItem) {
  if (item.kind === "builder") return "Build the complete message.";
  if (item.kind === "reading") return "Read for evidence.";
  if (item.kind === "sort") return "Place the idea.";
  if (item.kind === "choice") return "Choose the precise meaning.";
  return "Complete the message.";
}

function ReviewPractice({ review, onExit }: { review: ModuleReviewSet; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const item = review.items[index];
  const complete = index >= review.items.length;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!item || !answer.trim()) return;
    const correct = "accepted" in item
      ? isAcceptedAnswer(answer, item.accepted)
      : answer === item.correctOptionId;
    recordAttempt({ interactionId: item.id, answer, correct, kind: "review", conceptIds: item.conceptIds, independent: true });
    playAnswerFeedback(correct ? "correct" : "incorrect");
    setFeedback({
      correct,
      message: correct ? item.explanation : item.incorrectExplanation,
    });
  };

  const next = () => {
    if (index + 1 === review.items.length) playCompletionSound();
    setIndex((current) => current + 1);
    setAnswer("");
    setFeedback(null);
  };

  if (complete) {
    return (
      <div className="review-page review-complete">
        <div className="completion-mark"><Check aria-hidden="true" /></div>
        <p className="eyebrow">Module review complete</p>
        <h1>You retrieved {review.items.length} ideas from {review.title.toLocaleLowerCase()}.</h1>
        <p>The practice came directly from the authored lessons, but without the surrounding explanation visible.</p>
        <div className="completion-actions">
          <button className="button button--dark" onClick={onExit} type="button">Choose another module <ArrowRight aria-hidden="true" /></button>
          <Link className="button button--ghost" href={`/module/${review.moduleNumber}`}>View module</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <header className="review-header">
        <button className="back-link review-back-button" onClick={onExit} type="button"><ArrowLeft aria-hidden="true" /> All modules</button>
        <div className="review-header__center"><RotateCcw aria-hidden="true" /><span>{review.moduleNumber === 0 ? "Start Here" : `Module ${review.moduleNumber}`}</span></div>
        <span>{index + 1} / {review.items.length}</span>
      </header>
      <div className="review-progress"><span style={{ width: `${((index + (feedback?.correct ? 1 : 0)) / review.items.length) * 100}%` }} /></div>

      <main className="review-stage">
        <p className="eyebrow">Lesson {item.lessonId} · {item.lessonTitle}</p>
        <h1>{reviewHeading(item)}</h1>
        <section className="review-problem" aria-labelledby="review-problem-title">
          <span>What you need to solve</span>
          <p id="review-problem-title">{item.question}</p>
          <small>{item.instruction}</small>
        </section>
        <form onSubmit={submit} className="review-form">
          {"accepted" in item ? (
            <>
              <div className={item.kind === "builder" ? "fill-sentence fill-sentence--review review-builder-answer" : "fill-sentence fill-sentence--review"}>
                <span lang="es">{item.before}</span>
                <input aria-label={item.kind === "builder" ? "Complete Spanish sentence" : "Spanish answer"} autoCapitalize="none" autoComplete="off" autoFocus disabled={feedback?.correct} onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }} value={answer} />
                <span lang="es">{item.after}</span>
              </div>
              <SpanishTypingHelp disabled={feedback?.correct} onCharacter={(character) => { setAnswer((current) => `${current}${character}`); setFeedback(null); }} />
            </>
          ) : (
            <div className="review-choice-options" role="group" aria-label="Answer choices">
              {item.options.map((option) => {
                const selected = answer === option.id;
                const resultClass = selected && feedback ? feedback.correct ? " is-correct" : " is-wrong" : "";
                return (
                  <button
                    aria-pressed={selected}
                    className={`${selected ? "is-selected" : ""}${resultClass}`}
                    disabled={feedback?.correct}
                    key={option.id}
                    onClick={() => { setAnswer(option.id); setFeedback(null); }}
                    type="button"
                  >
                    <span>{option.label}</span>
                    {selected ? <Check aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          )}
          {feedback ? (
            <div className={feedback.correct ? "inline-feedback is-correct" : "inline-feedback is-wrong"} role="status">
              <span>{feedback.correct ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}</span>
              <div><p>{feedback.message}</p>{feedback.correct && item.audioText ? <SpanishAudio text={item.audioText} compact /> : null}</div>
            </div>
          ) : null}
          {feedback?.correct ? <button className="button button--dark" type="button" onClick={next}>{index + 1 === review.items.length ? "Finish review" : "Next idea"} <ArrowRight aria-hidden="true" /></button> : <button className="button button--dark" disabled={!answer.trim()} type="submit">Check answer</button>}
        </form>
      </main>
    </div>
  );
}

export function ReviewSession() {
  const state = usePrototypeState();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const review = selectedModule === null ? undefined : moduleReviewSets.find((set) => set.moduleNumber === selectedModule);

  if (review) return <ReviewPractice key={review.moduleNumber} review={review} onExit={() => setSelectedModule(null)} />;

  return (
    <div className="page review-index-page">
      <header className="review-index-header">
        <Link className="back-link" href="/dashboard"><ArrowLeft aria-hidden="true" /> Dashboard</Link>
        <p className="eyebrow">Practice by module</p>
        <h1>Choose what you want to bring back.</h1>
        <p>Review is organized by the complete course path. Each set reuses fill-ins, choices, sentence building, sorting, and reading checks from its lessons, so practice reinforces the exact system you learned.</p>
      </header>

      <section className="review-module-list" aria-label="Available module review sets">
        {moduleReviewSets.map((set) => {
          const lessonIds = new Set(set.items.map((item) => item.lessonId));
          const completedLessons = [...lessonIds].filter((id) => state.completedLessons.includes(id)).length;
          const available = completedLessons > 0;
          return (
            <article className="review-module-row" key={set.moduleNumber}>
              <button disabled={!available} onClick={() => setSelectedModule(set.moduleNumber)} type="button">
                <span className="review-module-row__number">{set.moduleNumber === 0 ? "Start" : String(set.moduleNumber).padStart(2, "0")}</span>
                <div>
                  <p>{set.stageLabel}</p>
                  <h2>{set.title}</h2>
                  <small>{available ? `${set.items.length} mixed exercises · ${completedLessons}/${lessonIds.size} lessons complete` : "Complete a lesson in this module first"}</small>
                </div>
                <span className="review-module-row__action">{available ? "Practice" : "Locked"} <ArrowRight aria-hidden="true" /></span>
              </button>
            </article>
          );
        })}
      </section>
      <p className="review-index-note">Attempts add concept evidence to your local progress. They never erase the first attempt you made in a lesson.</p>
    </div>
  );
}
