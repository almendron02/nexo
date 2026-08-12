"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Lightbulb,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import type {
  BuilderBlock,
  ChoiceBlock,
  ComparisonBlock,
  FillBlock,
  FreeWriteBlock,
  LessonBlock,
  LessonDefinition,
  ProseBlock,
  ReadingBlock,
  SortBlock,
  SummaryBlock,
} from "@/content/schemas";
import { SpanishAudio } from "@/components/SpanishAudio";
import { SpanishTypingHelp } from "@/components/SpanishTypingHelp";
import { playAnswerFeedback, playCompletionSound } from "@/lib/answer-feedback-audio";
import { completeLesson, recordAttempt, usePrototypeState } from "@/lib/prototype-store";

type CompleteHandler = (blockId: string) => void;

const interactiveTypes = new Set(["choice", "sort", "builder", "reading", "fill", "free-write"]);

function BlockFrame({ children, id, className = "" }: { children: React.ReactNode; id: string; className?: string }) {
  return <section className={`lesson-block ${className}`} id={id}>{children}</section>;
}

function BlockHeading({ eyebrow, heading }: { eyebrow?: string; heading: string }) {
  return <div className="lesson-block__heading">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2>{heading}</h2></div>;
}

function ProseSection({ block }: { block: ProseBlock }) {
  return (
    <BlockFrame id={block.id}>
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="lesson-prose">{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {block.points ? (
        <div className="lesson-points">
          {block.points.map((point) => (
            <div key={point.label}>
              <span>{point.label}</span>
              <div><strong>{point.title}</strong><p>{point.description}</p></div>
            </div>
          ))}
        </div>
      ) : null}
      {block.spanish ? <div className="spanish-stack">{block.spanish.map((item) => <SpanishAudio key={item.text} text={item.text} translation={item.translation} />)}</div> : null}
    </BlockFrame>
  );
}

function ComparisonSection({ block }: { block: ComparisonBlock }) {
  return (
    <BlockFrame id={block.id} className="lesson-block--wide">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="comparison-grid">
        {block.sides.map((side) => (
          <article className="comparison-card" key={side.label}>
            <div className="comparison-card__top"><span>{side.label}</span><strong>{side.question}</strong></div>
            <p>{side.description}</p>
            <div className="comparison-card__examples">
              {side.examples.map((example) => <SpanishAudio compact key={example.text} text={example.text} translation={example.translation} />)}
            </div>
          </article>
        ))}
      </div>
      {block.note ? <div className="lesson-note"><Lightbulb aria-hidden="true" /><p>{block.note}</p></div> : null}
    </BlockFrame>
  );
}

function ChoiceSection({ block, onComplete }: { block: ChoiceBlock; onComplete: CompleteHandler }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const choose = (optionId: string) => {
    if (correct) return;
    const isCorrect = optionId === block.correctOptionId;
    setSelected(optionId);
    setCorrect(isCorrect);
    recordAttempt({
      interactionId: block.id,
      answer: optionId,
      correct: isCorrect,
      kind: "choice",
      conceptIds: block.conceptIds,
    });
    playAnswerFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) onComplete(block.id);
  };

  const selectedLabel = block.options.find((option) => option.id === selected)?.label ?? "___";

  return (
    <BlockFrame id={block.id} className="lesson-block--interaction">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      {block.context ? <p className="interaction-context">{block.context}</p> : null}
      {block.sentence ? (
        <div className="choice-sentence" lang="es">
          <span>{block.sentence.before}</span>
          <strong className={selected ? (correct ? "is-correct" : "is-wrong") : ""}>{selectedLabel}</strong>
          <span>{block.sentence.after}</span>
        </div>
      ) : null}
      <p className="interaction-prompt">{block.prompt}</p>
      <div className="choice-options">
        {block.options.map((option) => (
          <button
            className={`choice-option ${selected === option.id ? "is-selected" : ""} ${correct && option.id === block.correctOptionId ? "is-correct" : ""}`}
            disabled={correct}
            key={option.id}
            onClick={() => choose(option.id)}
            type="button"
          >
            {option.label}
            {correct && option.id === block.correctOptionId ? <Check aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={correct ? "inline-feedback is-correct" : "inline-feedback is-wrong"} role="status">
          <span>{correct ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}</span>
          <div><strong>{correct ? "That works." : "Look at the meaning."}</strong><p>{correct ? block.correctFeedback : block.incorrectFeedback}</p></div>
        </div>
      ) : null}
    </BlockFrame>
  );
}

function SortSection({ block, onComplete }: { block: SortBlock; onComplete: CompleteHandler }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const place = (bucketId: string) => {
    if (!selected) {
      setMessage("Choose a meaning first, then choose the question it answers.");
      return;
    }
    const item = block.items.find((candidate) => candidate.id === selected);
    if (!item) return;
    const correct = item.answer === bucketId;
    recordAttempt({
      interactionId: `${block.id}:${item.id}`,
      answer: bucketId,
      correct,
      kind: "sort",
      conceptIds: block.conceptIds,
    });
    playAnswerFeedback(correct ? "correct" : "incorrect");
    if (!correct) {
      setMessage(`“${item.label}” does not answer that question. Try the other meaning.`);
      return;
    }
    const next = { ...placed, [item.id]: bucketId };
    setPlaced(next);
    setSelected(null);
    setMessage(null);
    if (Object.keys(next).length === block.items.length) onComplete(block.id);
  };

  return (
    <BlockFrame id={block.id} className="lesson-block--wide lesson-block--interaction">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p className="interaction-prompt">{block.prompt}</p>
      <div className="sort-items" aria-label="Meanings to sort">
        {block.items.filter((item) => !placed[item.id]).map((item) => (
          <button className={selected === item.id ? "sort-chip is-selected" : "sort-chip"} key={item.id} onClick={() => { setSelected(item.id); setMessage(null); }} type="button">
            {item.label}
          </button>
        ))}
        {Object.keys(placed).length === block.items.length ? <span className="sort-finished"><Check aria-hidden="true" /> All meanings placed</span> : null}
      </div>
      <div className="sort-buckets">
        {block.buckets.map((bucket) => (
          <button className="sort-bucket" key={bucket.id} onClick={() => place(bucket.id)} type="button">
            <span>{bucket.label}</span>
            <strong>{bucket.hint}</strong>
            <div>{block.items.filter((item) => placed[item.id] === bucket.id).map((item) => <i key={item.id}>{item.label}</i>)}</div>
          </button>
        ))}
      </div>
      {message ? <div className="inline-feedback is-wrong" role="status"><span><RotateCcw aria-hidden="true" /></span><p>{message}</p></div> : null}
    </BlockFrame>
  );
}

function BuilderSection({ block, onComplete }: { block: BuilderBlock; onComplete: CompleteHandler }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const available = block.tokens.filter((token) => !selected.includes(token));

  const check = () => {
    const correct = selected.join("|") === block.correctOrder.join("|");
    recordAttempt({
      interactionId: block.id,
      answer: selected.join(" "),
      correct,
      kind: "builder",
      conceptIds: block.conceptIds,
    });
    playAnswerFeedback(correct ? "correct" : "incorrect");
    setFeedback({ correct, text: correct ? block.feedback : "The pieces are all useful, but the sentence order is not settled yet. Start with the verb form." });
    if (correct) onComplete(block.id);
  };

  return (
    <BlockFrame id={block.id} className="lesson-block--interaction">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p className="interaction-prompt">{block.prompt}</p>
      <div className="builder-answer" aria-label="Built sentence">
        {selected.length ? selected.map((token, index) => <button key={token} type="button" onClick={() => { setSelected(selected.filter((_, itemIndex) => itemIndex !== index)); setFeedback(null); }}>{token}</button>) : <span>Build the Spanish here</span>}
      </div>
      <div className="builder-tokens">{available.map((token) => <button key={token} type="button" onClick={() => { setSelected([...selected, token]); setFeedback(null); }}>{token}</button>)}</div>
      <div className="interaction-actions">
        <button className="button button--dark button--small" disabled={selected.length !== block.tokens.length || feedback?.correct} onClick={check} type="button">Check sentence</button>
        <button className="button-quiet" onClick={() => { setSelected([]); setFeedback(null); }} type="button">Reset</button>
      </div>
      {feedback ? <div className={feedback.correct ? "inline-feedback is-correct" : "inline-feedback is-wrong"} role="status"><span>{feedback.correct ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}</span><div>{feedback.correct ? <SpanishAudio compact text={block.answer} /> : null}<p>{feedback.text}</p></div></div> : null}
    </BlockFrame>
  );
}

function ReadingSection({ block, onComplete }: { block: ReadingBlock; onComplete: CompleteHandler }) {
  const [translationOpen, setTranslationOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { selected: string; correct: boolean }>>({});

  const answer = (questionId: string, optionId: string) => {
    if (answers[questionId]?.correct) return;
    const question = block.questions.find((candidate) => candidate.id === questionId);
    if (!question) return;
    const correct = question.correctOptionId === optionId;
    const next = { ...answers, [questionId]: { selected: optionId, correct } };
    setAnswers(next);
    recordAttempt({
      interactionId: `${block.id}:${questionId}`,
      answer: optionId,
      correct,
      kind: "reading",
      conceptIds: question.conceptIds,
    });
    playAnswerFeedback(correct ? "correct" : "incorrect");
    if (correct && block.questions.every((item) => item.id === questionId || next[item.id]?.correct)) onComplete(block.id);
  };

  return (
    <BlockFrame id={block.id} className="lesson-block--wide reading-block">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p className="interaction-prompt">{block.instructions}</p>
      <article className="reading-passage">
        {block.sentences.map((sentence) => <SpanishAudio compact key={sentence.id} text={sentence.text} translation={sentence.translation} />)}
        <button aria-expanded={translationOpen} className="translation-toggle" type="button" onClick={() => setTranslationOpen(!translationOpen)}>{translationOpen ? "Hide translation" : "Show translation"} <ChevronDown className={translationOpen ? "is-open" : ""} aria-hidden="true" /></button>
        {translationOpen ? <div className="reading-translation">{block.sentences.map((sentence) => <p key={sentence.id}>{sentence.translation}</p>)}</div> : null}
      </article>
      <div className="reading-questions">
        {block.questions.map((question, index) => {
          const result = answers[question.id];
          return (
            <article className="reading-question" key={question.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{question.prompt}</h3>
                <div className="choice-options choice-options--small">
                  {question.options.map((option) => <button className={`${result?.selected === option.id ? "is-selected" : ""} ${result?.correct && question.correctOptionId === option.id ? "is-correct" : ""}`} disabled={result?.correct} key={option.id} onClick={() => answer(question.id, option.id)} type="button">{option.label}</button>)}
                </div>
                {result ? <div className={result.correct ? "micro-feedback is-correct" : "micro-feedback is-wrong"}>{result.correct ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}<span>{result.correct ? question.feedback : "Read the exact sentence again and try once more."}</span></div> : null}
              </div>
            </article>
          );
        })}
      </div>
    </BlockFrame>
  );
}

function FillSection({ block, onComplete }: { block: FillBlock; onComplete: CompleteHandler }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [activeItemId, setActiveItemId] = useState(block.items[0]?.id ?? "");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = { ...results };
    const attemptedResults: boolean[] = [];
    block.items.forEach((item) => {
      if (results[item.id]) return;
      const value = (values[item.id] ?? "").trim();
      if (!value) return;
      const normalized = value.toLocaleLowerCase("es");
      const correct = item.accepted.some((accepted) => accepted.toLocaleLowerCase("es") === normalized);
      next[item.id] = correct;
      attemptedResults.push(correct);
      recordAttempt({
        interactionId: `${block.id}:${item.id}`,
        answer: value,
        correct,
        kind: "fill",
        conceptIds: item.conceptIds,
        independent: true,
      });
    });
    if (attemptedResults.length) playAnswerFeedback(attemptedResults.every(Boolean) ? "correct" : "incorrect");
    setResults(next);
    if (block.items.every((item) => next[item.id])) onComplete(block.id);
  };

  return (
    <BlockFrame id={block.id} className="lesson-block--interaction">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p className="interaction-prompt">{block.prompt}</p>
      <form className="fill-list" onSubmit={submit}>
        {block.items.map((item) => (
          <div className="fill-item" key={item.id}>
            <div className="fill-sentence">
              <span lang="es">{item.before}</span>
              <input
                aria-label={`Complete: ${item.before} blank ${item.after}`}
                autoCapitalize="none"
                autoComplete="off"
                className={results[item.id] === true ? "is-correct" : results[item.id] === false ? "is-wrong" : ""}
                disabled={results[item.id] === true}
                onChange={(event) => { setValues({ ...values, [item.id]: event.target.value }); setResults({ ...results, [item.id]: undefined as unknown as boolean }); }}
                onFocus={() => setActiveItemId(item.id)}
                value={values[item.id] ?? ""}
              />
              <span lang="es">{item.after}</span>
              {results[item.id] === true ? <Check aria-hidden="true" /> : null}
            </div>
            {results[item.id] !== undefined ? <p className={results[item.id] ? "fill-feedback is-correct" : "fill-feedback is-wrong"}>{results[item.id] ? item.feedback : "Think about what the sentence means, then try again."}</p> : null}
          </div>
        ))}
        <SpanishTypingHelp
          disabled={!activeItemId || results[activeItemId] === true}
          onCharacter={(character) => {
            if (!activeItemId) return;
            setValues((current) => ({ ...current, [activeItemId]: `${current[activeItemId] ?? ""}${character}` }));
            setResults((current) => ({ ...current, [activeItemId]: undefined as unknown as boolean }));
          }}
        />
        <button className="button button--dark" type="submit">Check my answers</button>
      </form>
    </BlockFrame>
  );
}

function FreeWriteSection({ block, onComplete }: { block: FreeWriteBlock; onComplete: CompleteHandler }) {
  const [value, setValue] = useState("");
  const [exampleOpen, setExampleOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; messages: string[] } | null>(null);

  const analyze = () => {
    const normalized = value.toLocaleLowerCase("es");
    const includesTerm = (term: string) => {
      const escaped = term.toLocaleLowerCase("es").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^\\p{L}])${escaped}($|[^\\p{L}])`, "u").test(normalized);
    };
    const evaluation = block.evaluation ?? {
      minimumIdeas: 2,
      requiredGroups: [
        { accepted: ["soy", "eres", "es", "somos", "son"], missingFeedback: "Add a form of ser to identify or classify the person." },
        { accepted: ["estoy", "estás", "estas", "está", "esta", "estamos", "están", "estan"], missingFeedback: "Add a form of estar to say how or where the person is." },
      ],
      successFeedback: "Both jobs are present: ser identifies or classifies, and estar describes a state or location.",
    };
    const missingGroups = evaluation.requiredGroups.filter((group) => !group.accepted.some(includesTerm));
    const completeIdeas = value.split(/[.!?\n]+/).filter((part) => part.trim().length > 3).length >= evaluation.minimumIdeas;
    const longEnough = value.trim().length >= block.minimumCharacters;
    const correct = missingGroups.length === 0 && completeIdeas && longEnough;
    const messages: string[] = [];
    messages.push(...missingGroups.map((group) => group.missingFeedback));
    if (!completeIdeas) messages.push(`Separate the response into ${evaluation.minimumIdeas} complete ideas.`);
    if (!longEnough) messages.push("Give each idea enough context to be understandable.");
    if (correct) messages.push(evaluation.successFeedback);
    setFeedback({ correct, messages });
    recordAttempt({
      interactionId: block.id,
      answer: value,
      correct,
      kind: "writing",
      conceptIds: block.conceptIds,
      independent: true,
    });
    playAnswerFeedback(correct ? "correct" : "incorrect");
    if (correct) onComplete(block.id);
  };

  return (
    <BlockFrame id={block.id} className="lesson-block--interaction free-write-block">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p className="interaction-prompt">{block.prompt}</p>
      <ul className="requirement-list">{block.requirements.map((requirement) => <li key={requirement}><Check aria-hidden="true" />{requirement}</li>)}</ul>
      <button className="example-toggle" type="button" onClick={() => setExampleOpen(!exampleOpen)}><CircleHelp aria-hidden="true" /> Need an example?</button>
      {exampleOpen ? <div className="example-panel"><SpanishAudio compact text={block.example} /></div> : null}
      <textarea aria-label="Write your response in Spanish" onChange={(event) => { setValue(event.target.value); setFeedback(null); }} placeholder="Write your Spanish here…" rows={5} value={value} />
      <div className="write-footer"><span>{value.trim().length} characters</span><button className="button button--dark" disabled={!value.trim()} onClick={analyze} type="button">Analyze my Spanish</button></div>
      {feedback ? <div className={feedback.correct ? "writing-feedback is-correct" : "writing-feedback is-wrong"} role="status"><div>{feedback.correct ? <Sparkles aria-hidden="true" /> : <Lightbulb aria-hidden="true" />}<strong>{feedback.correct ? "Your Spanish is working." : "Revise the message, not just one ending."}</strong></div>{feedback.messages.map((message) => <p key={message}>{message}</p>)}</div> : null}
    </BlockFrame>
  );
}

function SummarySection({ block }: { block: SummaryBlock }) {
  return (
    <BlockFrame id={block.id} className="lesson-block--wide summary-block">
      <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
      <p>{block.message}</p>
      <div className="summary-ideas">{block.ideas.map((idea) => <article key={idea.label}><span>{idea.label}</span><h3>{idea.question}</h3><div>{idea.uses.map((use) => <i key={use}>{use}</i>)}</div></article>)}</div>
    </BlockFrame>
  );
}

function RenderBlock({ block, onComplete }: { block: LessonBlock; onComplete: CompleteHandler }) {
  switch (block.type) {
    case "prose": return <ProseSection block={block} />;
    case "comparison": return <ComparisonSection block={block} />;
    case "choice": return <ChoiceSection block={block} onComplete={onComplete} />;
    case "sort": return <SortSection block={block} onComplete={onComplete} />;
    case "builder": return <BuilderSection block={block} onComplete={onComplete} />;
    case "reading": return <ReadingSection block={block} onComplete={onComplete} />;
    case "fill": return <FillSection block={block} onComplete={onComplete} />;
    case "free-write": return <FreeWriteSection block={block} onComplete={onComplete} />;
    case "summary": return <SummarySection block={block} />;
  }
}

export function LessonExperience({ lesson }: { lesson: LessonDefinition }) {
  const state = usePrototypeState();
  const [started, setStarted] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(state.completedLessons.includes(lesson.id));
  const interactiveCount = lesson.blocks.filter((block) => interactiveTypes.has(block.type)).length;
  const progress = started ? Math.max(4, Math.round((completedBlocks.size / interactiveCount) * 100)) : 0;
  const lessonAttempts = state.attempts.filter((attempt) => lesson.blocks.some((block) => attempt.interactionId.startsWith(block.id)));
  const firstAttempts = useMemo(() => lessonAttempts.filter((attempt) => attempt.attemptNumber === 1 && attempt.kind !== "writing"), [lessonAttempts]);
  const firstCorrect = firstAttempts.filter((attempt) => attempt.correct).length;
  const independentCorrect = new Set(state.evidence.filter((item) => item.correct && item.independent && lesson.blocks.some((block) => item.interactionId.startsWith(block.id))).map((item) => item.interactionId)).size;
  const writingComplete = lessonAttempts.some((attempt) => attempt.kind === "writing" && attempt.correct);
  const [moduleNumber = "4", lessonNumber = "3"] = lesson.id.split(".");
  const experience = lesson.experience;
  const isCheckpoint = experience?.kind === "checkpoint";
  const moduleHref = experience?.returnHref ?? `/module/${moduleNumber}`;
  const returnLabel = experience?.returnLabel ?? `Module ${moduleNumber}`;
  const contextLabel = experience?.contextLabel ?? `Module ${moduleNumber} · Lesson ${lessonNumber}`;
  const openingMarker = experience?.openingMarker ?? `${moduleNumber.padStart(2, "0")} / ${lessonNumber.padStart(2, "0")}`;
  const firstAttemptAccuracy = firstAttempts.length ? firstCorrect / firstAttempts.length : 0;
  const checkpointReady = firstAttemptAccuracy >= 0.75 && independentCorrect >= 3 && writingComplete;
  const completesFreeIntroduction = lesson.id === "0.5";

  const markComplete: CompleteHandler = (blockId) => {
    setCompletedBlocks((current) => {
      if (current.has(blockId)) return current;
      const next = new Set(current);
      next.add(blockId);
      return next;
    });
  };

  const finish = () => {
    completeLesson(lesson.id);
    playCompletionSound();
    setFinished(true);
  };

  if (!started && !finished) {
    return (
      <div className="lesson-opening">
        <header className="lesson-topbar"><Link href={moduleHref}><ArrowLeft aria-hidden="true" /> {returnLabel}</Link><span>{isCheckpoint ? `${contextLabel} · ${lesson.title}` : `${lesson.id} · ${lesson.title}`}</span><Link aria-label={`Close ${isCheckpoint ? "checkpoint" : "lesson"}`} href={moduleHref}><X aria-hidden="true" /></Link></header>
        <main className="lesson-opening__content">
          <div className="lesson-opening__number">{openingMarker}</div>
          <p className="eyebrow">{contextLabel}</p>
          <h1>{lesson.displayTitle}</h1>
          <h2>{lesson.dek}</h2>
          <p>{lesson.goal}</p>
          <div className="lesson-opening__meta"><span>≈ {lesson.durationMinutes} min</span><span>{isCheckpoint ? "Integrated checkpoint" : "Written lesson"}</span><span>Audio + practice</span></div>
          <button className="button button--dark button--large" onClick={() => setStarted(true)} type="button">Begin {isCheckpoint ? "checkpoint" : "lesson"} <ArrowRight aria-hidden="true" /></button>
        </main>
        <div className="lesson-opening__hint"><span>Scroll through one continuous lesson</span><ChevronDown aria-hidden="true" /></div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <header className="lesson-topbar lesson-topbar--sticky">
        <Link href={moduleHref}><ArrowLeft aria-hidden="true" /> <span>{returnLabel}</span></Link>
        <div><strong>{isCheckpoint ? experience?.openingMarker.split(" /")[0] ?? "CP" : lesson.id}</strong><span>{lesson.title}</span></div>
        <span className="lesson-percent">{finished ? 100 : progress}%</span>
      </header>
      <div className="lesson-progress"><span style={{ width: `${finished ? 100 : progress}%` }} /></div>

      <main className="lesson-content">
        <header className="lesson-content__intro">
          <p className="eyebrow">{isCheckpoint ? contextLabel : `Lesson ${lesson.id}`}</p>
          <h1>{lesson.displayTitle}</h1>
          <p>{lesson.dek}</p>
        </header>

        {lesson.blocks.map((block) => <RenderBlock block={block} key={block.id} onComplete={markComplete} />)}

        <section className="lesson-completion">
          {finished ? (
            <>
              <div className="completion-mark"><Check aria-hidden="true" /></div>
              <p className="eyebrow">{isCheckpoint ? "Checkpoint complete" : "Lesson complete"}</p>
              <h2>{isCheckpoint && !checkpointReady ? lesson.completion.reviewTitle : lesson.completion.title}</h2>
              <p>{isCheckpoint && !checkpointReady ? lesson.completion.reviewMessage : lesson.completion.message}</p>
              <div className="result-grid">
                <article><span>First attempts</span><strong>{firstCorrect} / {Math.max(firstAttempts.length, 1)}</strong><small>correct before retry</small></article>
                <article><span>Independent recall</span><strong>{independentCorrect}</strong><small>ideas retrieved</small></article>
                <article><span>Original Spanish</span><strong>{writingComplete ? "Done" : "Revisit"}</strong><small>production evidence</small></article>
              </div>
              {isCheckpoint ? (
                <div className="completion-actions">
                  {!checkpointReady ? <Link className="button button--dark" href="/review">Review these ideas <ArrowRight aria-hidden="true" /></Link> : null}
                  <Link className={checkpointReady ? "button button--dark" : "button button--ghost"} href="/dashboard">{checkpointReady ? "Continue from dashboard" : "Continue anyway"}</Link>
                </div>
              ) : completesFreeIntroduction ? (
                <div className="completion-account-step">
                  <p>You finished the free introduction. Create an account to begin Module 1 and continue through the complete course.</p>
                  <div className="completion-actions"><Link className="button button--dark" href="/auth/sign-up?next=/module/1">Create account and continue <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href="/course">View the course map</Link></div>
                </div>
              ) : <div className="completion-actions"><Link className="button button--dark" href={moduleHref}>Return to {returnLabel} <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href="/dashboard">Done for today</Link></div>}
            </>
          ) : (
            <>
              <p className="eyebrow">End of {isCheckpoint ? "checkpoint" : "lesson"}</p>
              <h2>{isCheckpoint ? `Submit your ${lesson.title} evidence.` : "Make the evidence count."}</h2>
              <p>{completedBlocks.size >= interactiveCount ? `You completed every interaction. Save the ${isCheckpoint ? "checkpoint" : "lesson"} to your course progress.` : `Complete ${interactiveCount - completedBlocks.size} more interaction${interactiveCount - completedBlocks.size === 1 ? "" : "s"} before finishing.`}</p>
              <button className="button button--dark button--large" disabled={completedBlocks.size < interactiveCount} onClick={finish} type="button">Complete {isCheckpoint ? "checkpoint" : "lesson"} <Check aria-hidden="true" /></button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
