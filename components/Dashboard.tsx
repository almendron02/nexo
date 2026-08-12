"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import type { ConceptId } from "@/content/schemas";
import { builtCourseModules } from "@/content/course-catalog";
import { module04 } from "@/content/spanish-foundations/module-04";
import { masteryFor } from "@/lib/prototype-state";
import { usePrototypeState } from "@/lib/prototype-store";

const conceptLabels: Partial<Record<ConceptId, string>> = {
  learning_cycle: "Turning support into independent recall",
  spanish_vowels: "Hearing the five stable Spanish vowels",
  spanish_consonants: "Reading Spanish consonants on Spanish terms",
  stress_rules: "Predicting word stress from spelling",
  accent_marks: "Preserving meaningful written accents",
  greeting_chunks: "Carrying a first conversation",
  noun_gender: "Reading grammatical gender from the noun phrase",
  gender_patterns: "Using noun-ending patterns with boundaries",
  articles_indefinite: "Introducing a new noun with un or una",
  articles_definite: "Identifying nouns with el, la, los, or las",
  noun_number: "Coordinating singular and plural noun phrases",
  noun_phrase: "Building the complete noun phrase as one unit",
  adjective_function: "Connecting a description to its noun",
  adjective_gender: "Making adjectives agree in gender",
  adjective_number: "Making adjectives agree in number",
  adjective_position: "Using neutral Spanish adjective order",
  subject_pronouns: "Finding the person behind the verb form",
  ser_forms: "Retrieving soy, eres, es, somos, and son",
  ser_identity: "Using ser for identity",
  ser_classification: "Using ser to classify people and things",
  ser_origin: "Expressing origin with ser + de",
  profession_article: "Using bare professions after ser",
  nationality_agreement: "Making nationality agree",
  relationships: "Expressing social relationships",
  estar_forms: "Retrieving the forms of estar",
  estar_state: "Describing states with estar",
  estar_location: "Locating identified people and things",
  ser_vs_estar_selection: "Choosing ser or estar from meaning",
  ser_estar_meaning_change: "Reading meaning changes with ser and estar",
  hay_existence: "Introducing existence with hay",
  hay_vs_estar: "Distinguishing existence from location",
  question_structure: "Turning complete ideas into natural questions",
  question_words_identity: "Requesting things, people, and choices precisely",
  question_words_context: "Asking for place, time, and manner",
  question_reason_quantity: "Requesting reasons and quantities",
  numbers_basic: "Using practical numbers through thirty",
  numbers_large: "Building quantities through the thousands",
  dates_calendar: "Stating days and calendar dates",
  clock_time: "Telling and scheduling clock time",
  time_expressions: "Organizing routines in time",
  infinitive_structure: "Seeing stems and verb families",
  present_ar: "Conjugating regular AR actions",
  present_er: "Conjugating regular ER actions",
  present_ir: "Conjugating regular IR actions",
  present_negation: "Negating present actions",
  present_sentence: "Coordinating complete present messages",
  stem_change: "Controlling stressed present stem changes",
  querer_poder: "Expressing desire and ability",
  tener_expressions: "Using tener for possession, age, and needs",
  hacer_poner: "Doing, making, and placing",
  venir_salir_oir: "Coming, leaving, and hearing",
  saber_conocer: "Separating information from familiarity",
  ir_forms: "Expressing movement with ir",
  near_future: "Planning with ir a plus infinitive",
  tener_que: "Expressing personal obligation",
  verb_patterns: "Combining high-value verb patterns",
  para_infinitive: "Explaining purpose with para",
  hace_time: "Connecting durations to the present",
  direct_objects: "Finding what receives an action",
  personal_a: "Marking specific human objects",
  direct_object_pronouns: "Replacing known direct objects",
  object_pronoun_position: "Placing object pronouns around verb units",
  indirect_objects: "Identifying recipients and beneficiaries",
  indirect_object_pronouns: "Keeping recipients inside the sentence",
  gustar_structure: "Understanding the experiencer model behind gustar",
  gusta_gustan: "Matching gustar to what is pleasing",
  gustar_verbs: "Extending the gustar reaction pattern",
  reflexive_pronouns: "Returning an action to its subject",
  daily_routine: "Connecting reflexive routine actions",
  reflexive_position: "Placing reflexive pronouns around verb units",
  reflexive_change: "Describing feelings and changes of state",
  reciprocal_reflexive: "Expressing actions between people",
  negative_words: "Choosing precise negative meanings",
  double_negation: "Building Spanish negative agreement",
  core_prepositions: "Encoding source, destination, cause, and purpose",
  sequence_prepositions: "Connecting before, after, and alternatives",
  clause_connectors: "Making relationships between thoughts explicit",
  subjunctive_purpose: "Recognizing stance across two clauses",
  subjunctive_forms: "Forming the present subjunctive",
  subjunctive_influence: "Expressing wants and influence",
  subjunctive_reactions: "Framing emotion, doubt, and evaluation",
  subjunctive_connectors: "Using high-value subjunctive connectors",
  preterite_function: "Viewing past events as bounded wholes",
  preterite_ar: "Forming regular AR preterites",
  preterite_er_ir: "Forming regular ER and IR preterites",
  preterite_irregular: "Retrieving essential irregular preterites",
  preterite_spelling: "Preserving sound and stem changes in the past",
  preterite_narration: "Connecting a completed event line",
  imperfect_function: "Building open past background",
  imperfect_forms: "Forming regular and irregular imperfects",
  imperfect_description: "Describing a past world",
  imperfect_habit: "Expressing past habits and ongoing actions",
  preterite_imperfect: "Choosing past viewpoint intentionally",
  combined_pronouns: "Coordinating recipient and object pronouns",
  past_narration: "Building a complete meaningful story",
};

export function Dashboard() {
  const state = usePrototypeState();
  const reviewCount = state.reviewQueue.length;
  const checkpointMilestones = [
    { after: 4, id: module04.checkpoint.id, title: "Build Spanish", href: "/checkpoint/stage-1" },
    { after: 9, id: "stage-02-checkpoint", title: "Use Spanish", href: "/checkpoint/stage-2" },
    { after: 14, id: "stage-03-checkpoint", title: "Connect Spanish", href: "/checkpoint/stage-3" },
    { after: 16, id: "stage-04-checkpoint", title: "Tell Stories", href: "/checkpoint/stage-4" },
  ];
  const nextLessonModule = builtCourseModules.find((module) => module.lessons.some((lesson) => !state.completedLessons.includes(lesson.id)));
  const nextLesson = nextLessonModule?.lessons.find((lesson) => !state.completedLessons.includes(lesson.id));
  const pendingCheckpoint = checkpointMilestones.find((checkpoint) => {
    const prerequisiteLessons = builtCourseModules
      .filter((module) => module.number <= checkpoint.after)
      .flatMap((module) => module.lessons);
    return prerequisiteLessons.every((lesson) => state.completedLessons.includes(lesson.id))
      && !state.completedLessons.includes(checkpoint.id);
  });
  const nextCheckpoint = pendingCheckpoint
    && (!nextLessonModule || pendingCheckpoint.after < nextLessonModule.number)
    ? pendingCheckpoint
    : undefined;
  const currentModule = nextCheckpoint
    ? builtCourseModules.find((module) => module.number === nextCheckpoint.after) ?? builtCourseModules[builtCourseModules.length - 1]
    : nextLessonModule ?? builtCourseModules[builtCourseModules.length - 1];
  const moduleLessonsComplete = currentModule.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  const moduleComplete = Math.round((moduleLessonsComplete / currentModule.lessons.length) * 100);
  const allLessons = builtCourseModules.flatMap((module) => module.lessons);
  const totalLessonsComplete = allLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  const courseComplete = Math.round((totalLessonsComplete / allLessons.length) * 100);
  const allLessonsComplete = builtCourseModules.every((module) => module.lessons.every((lesson) => state.completedLessons.includes(lesson.id)));
  const allCheckpointsComplete = checkpointMilestones.every((checkpoint) => state.completedLessons.includes(checkpoint.id));
  const learningTitle = nextCheckpoint
    ? `Checkpoint: ${nextCheckpoint.title}.`
    : nextLesson ? `Start: ${nextLesson.title}.` : "The complete path is yours.";
  const learningDescription = nextCheckpoint
    ? `Bring the stage together through comprehension, recall, construction, and original Spanish before continuing.`
    : nextLesson ? `Lesson ${nextLesson.id} begins the next step in ${currentModule.title.toLocaleLowerCase()}.`
      : "Every lesson and checkpoint is complete. Revisit any module or practice its recall set from Review.";
  const learningHref = nextCheckpoint?.href ?? (nextLesson ? `/lesson/${nextLesson.id}` : "/course");
  const reviewIsPrimary = reviewCount > 0;
  const moduleLabel = currentModule.number === 0 ? "Start Here" : `Module ${String(currentModule.number).padStart(2, "0")}`;
  const visibleConcepts = currentModule.concepts.slice(0, 3);

  return (
    <div className="page dashboard-page">
      <Link className="dashboard-home-link" href="/"><Home aria-hidden="true" /> Nexo home</Link>

      <header className="dashboard-welcome">
        <p className="eyebrow">Your learning space</p>
        <h1>Dashboard.</h1>
        <p>Welcome back, Angel. {reviewIsPrimary ? "Start with what is ready, then continue the course." : allLessonsComplete && allCheckpointsComplete ? "The complete course is open for review." : nextCheckpoint ? "Your next checkpoint is ready." : "Your next class is ready."}</p>
      </header>

      <section className="dashboard-overview" aria-label="Course overview">
        <div><span>Course progress</span><strong>{courseComplete}%</strong></div>
        <div className="dashboard-progress" aria-label={`${courseComplete} percent of the course complete`}><span style={{ width: `${courseComplete}%` }} /></div>
        <p>{totalLessonsComplete} of {allLessons.length} lessons completed</p>
        <Link href="/course">Open course map <ArrowRight aria-hidden="true" /></Link>
      </section>

      <section className="dashboard-priority" aria-labelledby="dashboard-priority-title">
        <div className="dashboard-priority__main">
          <p className="eyebrow">Next action</p>
          <h2 id="dashboard-priority-title">{reviewIsPrimary ? "Bring back what you know." : learningTitle}</h2>
          <p>{reviewIsPrimary ? `${reviewCount} ideas are due. Choose their module in Review, then retrieve them without the lesson open.` : learningDescription}</p>
          <Link className="button button--dark" href={reviewIsPrimary ? "/review" : learningHref}>
            {reviewIsPrimary ? "Choose a review module" : nextCheckpoint ? "Begin checkpoint" : nextLesson ? "Start lesson" : "View course"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <aside className="dashboard-course-progress" aria-label="Current course progress">
          <div className="dashboard-course-progress__topline"><span>Current module</span><strong>{moduleLessonsComplete} / {currentModule.lessons.length}</strong></div>
          <p>{moduleLabel}</p>
          <h3>{currentModule.title}</h3>
          <div className="dashboard-progress" aria-label={`${moduleComplete} percent of ${moduleLabel} complete`}><span style={{ width: `${moduleComplete}%` }} /></div>
          <div className="dashboard-course-progress__footer"><span>{moduleComplete}% complete</span><Link href={`/module/${currentModule.number}`}>View module <ArrowRight aria-hidden="true" /></Link></div>
        </aside>
      </section>

      <section className="dashboard-tools" aria-label="Practice and course tools">
        <Link href="/review">
          <div><span>01</span><p className="eyebrow">Review</p><h2>{reviewCount > 0 ? `${reviewCount} ideas are ready.` : "Practice by module."}</h2></div>
          <p>Retrieve lesson exercises from any of the 16 modules without reopening the explanation.</p>
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/library">
          <div><span>02</span><p className="eyebrow">Library</p><h2>Find an answer.</h2></div>
          <p>Search concise reference guides whenever a form, pattern, or contrast needs another look.</p>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="dashboard-learning" aria-labelledby="dashboard-learning-title">
        <div className="dashboard-learning__heading">
          <div><p className="eyebrow">Learning now</p><h2 id="dashboard-learning-title">The ideas taking shape.</h2></div>
          <Link href="/course">Complete course <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="dashboard-concepts">
          {visibleConcepts.map((concept) => {
            const level = masteryFor(state, concept);
            const dashboardLevel = level === "Developing" ? "Learning" : level;
            return <div className="dashboard-concept" key={concept}><span>{conceptLabels[concept] ?? concept.replaceAll("_", " ")}</span><strong className={`mastery mastery--${dashboardLevel.toLowerCase()}`}>{dashboardLevel}</strong></div>;
          })}
        </div>
        <p className="dashboard-learning__note">Retained becomes available only after a concept survives delayed review.</p>
      </section>
    </div>
  );
}
