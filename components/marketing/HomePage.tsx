import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { NexoMark } from "@/components/NexoMark";
import { ProgressiveBlur } from "@/components/marketing/ProgressiveBlur";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { SpanishFlagLoop } from "@/components/marketing/SpanishFlagLoop";

const stages = [
  {
    number: "I",
    name: "Build Spanish",
    modules: "Modules 1–4",
    outcome: "Construct clear descriptions and statements from the ground up.",
  },
  {
    number: "II",
    name: "Use Spanish",
    modules: "Modules 5–9",
    outcome: "Ask questions, talk about everyday life, and explain your plans.",
  },
  {
    number: "III",
    name: "Connect Spanish",
    modules: "Modules 10–14",
    outcome: "Link people, actions, preferences, opinions, and reasons.",
  },
  {
    number: "IV",
    name: "Tell stories",
    modules: "Modules 15–16",
    outcome: "Set a scene, narrate what happened, and connect it into a story.",
  },
];

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-nav-shell">
        <ScrollProgress />
        <ProgressiveBlur className="home-nav-blur" height="110px" />
        <nav className="home-nav" aria-label="Nexo homepage navigation">
          <NexoMark className="home-wordmark" />
          <div className="home-nav__links">
            <Link href="/dashboard">Nexo</Link>
            <Link href="/library">Library</Link>
            <Link href="/course">Course</Link>
            <Link href="/open-source">Open source</Link>
            <Link href="/about">About</Link>
          </div>
          <Link className="home-nav__cta" href="/auth/sign-in?next=/dashboard">
            Sign in <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__glow" aria-hidden="true" />
          <div className="home-hero__copy">
            <p className="home-kicker">A complete Spanish course for serious beginners</p>
            <h1 id="home-title">
              Spanish that
              <span>finally connects.</span>
            </h1>
            <p className="home-hero__lede">
              Learn Spanish grammar in the right order, understand how it works, and practice until you can use it yourself.
            </p>
            <div className="home-hero__actions">
              <Link className="home-button home-button--primary" href="/start">
                Start learning <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="home-button home-button--quiet" href="/course">
                See the complete course
              </Link>
            </div>
            <ul className="home-trust-strip" aria-label="Nexo commitments">
              <li><Check aria-hidden="true" /> Complete 16-module path</li>
              <li><Check aria-hidden="true" /> Free with no paid tier</li>
              <li><Check aria-hidden="true" /> No ads or analytics trackers</li>
            </ul>
          </div>

        </section>

        <section className="home-flags" aria-labelledby="home-flags-title">
          <div className="home-flags__heading">
            <p className="home-kicker">The Spanish-speaking world</p>
            <p id="home-flags-title">One language. Many homes.</p>
          </div>
          <SpanishFlagLoop />
        </section>

        <section className="home-section home-course" id="course">
          <div className="home-course__heading">
            <div>
              <p className="home-kicker">The complete path</p>
              <h2>From your first sounds to your first story.</h2>
            </div>
            <p>
              Every stage has an outcome. Every module earns its place by preparing you for the next one.
            </p>
          </div>

          <div className="home-course__start">
            <span>Start here</span>
            <strong>How Spanish works</strong>
            <p>Sounds, stress, spelling, and your first conversation.</p>
          </div>

          <div className="home-stage-list">
            {stages.map((stage) => (
              <div className="home-stage" key={stage.number}>
                <span className="home-stage__number">{stage.number}</span>
                <div>
                  <p>{stage.modules}</p>
                  <h3>{stage.name}</h3>
                </div>
                <p>{stage.outcome}</p>
              </div>
            ))}
          </div>

          <div className="home-course__finish">
            <span><Check aria-hidden="true" /></span>
            <div><p>Finish line</p><strong>One integrated final assessment</strong></div>
            <p>Understand, recall, write, speak, and tell a connected story.</p>
          </div>
        </section>

        <section className="home-accreditation" id="about" aria-labelledby="accreditation-title">
          <div className="home-accreditation__intro">
            <p className="home-kicker">Built independently by an Auburn student</p>
            <h2 id="accreditation-title">Built from lived Spanish.</h2>
          </div>
          <div className="home-accreditation__story">
            <div className="home-accreditation__copy">
              <p>
                Nexo grew from a pattern Angel González kept seeing at Auburn University: <strong>students felt a need to speak Spanish</strong>. Some were preparing to study abroad, while others wanted to participate more fully in the Hispanic community and build genuine relationships across cultures.
              </p>
              <p>
                Through guiding these students, Angel learned which explanations made Spanish easier to understand, and what helped students use the language with confidence. Nexo brings those lessons together into one clear and intentional learning experience—an effective way to learn Spanish.
              </p>
              <p>
                For students pursuing careers in healthcare, business, engineering, education, public service, and beyond, Spanish can become both a practical <strong>professional advantage</strong> and a meaningful <strong>bridge to the people</strong> they will serve.
              </p>
              <p className="home-accreditation__disclosure">Nexo is an independent open-source project. It is not an Auburn University program and is not endorsed by the university.</p>
            </div>
            <blockquote className="home-accreditation__quote">
              <p>
                “What stayed with me was seeing how many people wanted to become part of the Spanish-speaking community at my local church—to join the conversations and build meaningful relationships—but language stood in the way. I realized they needed more than another way to study Spanish; they needed a clear, welcoming path into the relationships and experiences the language could open up. I wanted to build that path, and that became the heart behind Nexo.”
              </p>
              <cite>Angel González · Creator of Nexo</cite>
            </blockquote>
          </div>
        </section>

        <section className="home-section home-for-you" id="for-you">
          <div className="home-section__intro">
            <p className="home-kicker">Made for your starting point</p>
            <h2>Serious does not have to mean overwhelming.</h2>
          </div>
          <div className="home-audiences">
            <div>
              <span>01</span>
              <h3>You’re starting from zero.</h3>
              <p>No assumed grammar knowledge. Nexo begins with how Spanish sounds and builds each idea in dependency order.</p>
            </div>
            <div>
              <span>02</span>
              <h3>You’re starting again.</h3>
              <p>Turn the disconnected words and rules you remember into a system that finally makes sense.</p>
            </div>
            <div>
              <span>03</span>
              <h3>You’re learning with intent.</h3>
              <p>You want useful Spanish, real explanations, deliberate practice, and progress you can actually see.</p>
            </div>
          </div>
        </section>

        <section className="home-section home-for-you" aria-labelledby="home-open-source-title">
          <div className="home-section__intro">
            <p className="home-kicker">Free and open source</p>
            <h2 id="home-open-source-title">A shared grammar source, built to outlast a paywall.</h2>
          </div>
          <div className="home-audiences">
            <div>
              <span>01</span>
              <h3>The complete course is free.</h3>
              <p>Every lesson, checkpoint, review set, and future course improvement is available without a purchase.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Your account serves the learning.</h3>
              <p>It preserves your place, first attempts, mastery evidence, and review history across the full course.</p>
            </div>
            <div>
              <span>03</span>
              <h3>The source is open.</h3>
              <p>Inspect the application, improve explanations, and help make one rigorous Spanish grammar path useful to more people.</p>
            </div>
          </div>
          <div className="home-hero__actions">
            <Link className="home-button home-button--quiet" href="/open-source">Read the open-source promise</Link>
          </div>
        </section>

        <section className="home-section home-trust" aria-labelledby="home-trust-title">
          <div className="home-section__intro">
            <p className="home-kicker">Trust through restraint</p>
            <h2 id="home-trust-title">Your learning is not the product.</h2>
          </div>
          <div className="home-audiences">
            <div>
              <span>01</span>
              <h3>Human-authored learning.</h3>
              <p>Lessons and feedback are typed, reviewable course content. Nexo does not send your answers to an AI service or use them to train a model.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Only the data the course needs.</h3>
              <p>A free account stores your email, completed lessons, original attempts, concept evidence, and review history so your course path survives across devices.</p>
            </div>
            <div>
              <span>03</span>
              <h3>No advertising profile.</h3>
              <p>Nexo does not run advertising pixels, sell learner data, or install Google Analytics. Read the plain-language privacy notice before creating an account.</p>
            </div>
          </div>
        </section>

        <section className="home-section home-faq" id="faq" aria-labelledby="home-faq-title">
          <div className="home-section__intro">
            <p className="home-kicker">Common questions</p>
            <h2 id="home-faq-title">The clear answers.</h2>
          </div>
          <div className="home-faq__list">
            <details>
              <summary>Is Nexo really free?</summary>
              <p>Yes. Start Here, all sixteen modules, checkpoints, Review, and future course improvements are free. There is no subscription or paid lesson tier.</p>
            </details>
            <details>
              <summary>Which Spanish does Nexo teach?</summary>
              <p>Nexo teaches general Latin American Spanish for production, including tú, usted, and ustedes. Vosotros appears only for recognition in Foundations.</p>
            </details>
            <details>
              <summary>Why does Nexo require an account after Start Here?</summary>
              <p>The course depends on ordered progress, preserved first attempts, concept evidence, and delayed review. An account keeps that record coherent across devices.</p>
            </details>
            <details>
              <summary>Does Nexo use AI on my answers?</summary>
              <p>No. Feedback is authored and rule-based. Learner responses are not sent to an AI API, used for automated high-impact decisions, or used to train an AI model.</p>
            </details>
            <details>
              <summary>Can I inspect or reuse the course?</summary>
              <p>Yes. The application code is MIT licensed, and authored course content is available under CC BY-SA 4.0 with attribution and share-alike requirements.</p>
            </details>
            <Link className="home-faq__more" href="/faq">Read every answer <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="home-final">
          <p className="home-kicker">Spanish, understood.</p>
          <h2>The goal is not to keep you in an app.</h2>
          <p>The goal is to help you use Spanish without it.</p>
          <div className="home-hero__actions">
            <Link className="home-button home-button--primary" href="/start">
              Start Module 0 <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="home-button home-button--quiet" href="/course">
              Explore the prototype
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <NexoMark className="home-wordmark" />
          <p>Spanish, understood.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p>© 2026 Nexo</p>
      </footer>

      <Link className="home-mobile-cta" href="/start">
        Start learning <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
