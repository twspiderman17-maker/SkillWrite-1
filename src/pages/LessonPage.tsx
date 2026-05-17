import { Link, useLocation, useParams } from "react-router-dom";
import { useLayoutEffect } from "react";
import { PaywallCard } from "../components/PaywallCard";
import { getTrack } from "../data/tracks";
import { resolveLessonVideo, youtubeLessonEmbedSrc, youtubeWatchUrl } from "../data/lessonVideos";
import { hasCertificateEarned } from "../lib/certificates";
import { DemoLessonBanner } from "../components/DemoLessonBanner";
import { canAccessLesson, getDemoLessonPath, isDemoLesson } from "../lib/demoLessons";
import { hasLessonAccess, isUnlocked } from "../lib/progress";
import { guidedLessonMinutes } from "../lib/lessonTime";
import { adjacentLessons, isLastLessonInProgram } from "../lib/lessonNav";
import { MiniQuiz } from "../components/MiniQuiz";
import { AiPracticeCallout } from "../components/AiPracticeCallout";
import { lessonSupportsHandsOnAi } from "../content/aiPractice";
import type { CourseLesson, QuizQuestion } from "../types";

function defaultMiniTest(lesson: CourseLesson): QuizQuestion[] {
  return [
    {
      id: `${lesson.id}-check-1`,
      question: "What should you do before using an AI output in real claims work?",
      options: [
        "Use it immediately",
        "Check it against the source notes",
        "Ask AI to make it sound more confident",
        "Remove all review steps",
      ],
      correctIndex: 1,
      explain: "AI output should be checked against the source notes before being used in a workplace task.",
    },
    {
      id: `${lesson.id}-check-2`,
      question: "What should AI do when important information is missing?",
      options: [
        "Guess the most likely answer",
        "Leave it out silently",
        "Mark it as unknown or needing follow-up",
        "Copy details from another case",
      ],
      correctIndex: 2,
      explain: "Safe workflows make uncertainty visible instead of hiding it or inventing facts.",
    },
    {
      id: `${lesson.id}-check-3`,
      question: "Which habit makes an AI workflow safer for a team?",
      options: [
        "A clear review checklist",
        "Longer prompts with no structure",
        "Sending drafts automatically",
        "Removing human approval",
      ],
      correctIndex: 0,
      explain: "A review checklist creates a repeatable human check before outputs are used.",
    },
  ];
}

function extendedReading(lesson: CourseLesson): { heading: string; paragraphs: string[] }[] {
  const t = lesson.title;
  return [
    {
      heading: "Industry context: FNOL and claims intake",
      paragraphs: [
        `First notice of loss (FNOL) is where errors are expensive: wrong dates, wrong parties, missing photos, or unclear loss descriptions can ripple into reserving, fraud triage, vendor assignment, and customer experience. This lesson — ${t} — is designed so you can use AI where it helps (structure, drafting, checklists) while keeping professional judgement where it belongs.`,
        "High-performing teams treat AI-assisted drafts as internal working material until a human confirms facts against the source record. That habit is what makes the workflow defensible if a file is audited later: you can show what was checked, by whom, and what was still unknown at the time.",
        "Regulators and internal risk teams increasingly care about transparency and proportionate use of customer data. That is why redaction, minimisation, and clear limits in prompts are not ‘extra steps’ — they are part of the same quality bar as spelling and grammar.",
      ],
    },
    {
      heading: "How to study this lesson like a paid professional course",
      paragraphs: [
        "Budget at least one uninterrupted block for the video, then a second block for the written exercises. Skipping the video may save time today, but it weakens your mental model of what the model is doing when it paraphrases, omits unknowns, or sounds confident while wrong.",
        "Do the practice task twice: a fast first draft, then a corrected version after you run the checklist. The gap between version one and version two is where most learning happens — and it is the same gap supervisors notice in real teams.",
        "Keep a simple log for one week: date, task type, prompt version, reviewer, and one line on what you changed after review. That log becomes your portfolio evidence and makes team rollout conversations much easier.",
      ],
    },
  ];
}

function selfAssessmentRubric(lesson: CourseLesson): { label: string; detail: string }[] {
  return [
    {
      label: "Source fidelity",
      detail: "Output does not add facts; unknowns are visible; anything unclear is flagged for follow-up.",
    },
    {
      label: "Role boundaries",
      detail: "No coverage decisions, no payment promises, no legal conclusions unless your role explicitly allows them.",
    },
    {
      label: "Operational usefulness",
      detail: `Someone picking up the file could act on the output for: ${lesson.title.toLowerCase()} — without re-reading everything.`,
    },
    {
      label: "Reviewability",
      detail: "A teammate could re-check your work in under two minutes using your checklist notes.",
    },
  ];
}

function getStudyPlan(lesson: CourseLesson) {
  return [
    {
      title: "1. Watch with a claims-work lens",
      body: `As you watch the video, do not just think about AI in general. Keep asking how the idea applies to ${lesson.title.toLowerCase()}. Write down any technique that could make claim notes clearer, make missing information easier to spot, or make customer communication safer.`,
    },
    {
      title: "2. Try it in a free AI assistant",
      body: `Open a chat tool in another tab (for example Gemini, ChatGPT, Copilot, Claude, or Grok). Paste the lesson prompt template, add redacted sample notes, and run it once before you write up your answer for ${lesson.title.toLowerCase()}.`,
    },
    {
      title: "3. Build a tiny example",
      body: `Create a small workplace example: messy source notes, your prompt, the AI output, and the review checks a human must complete before using the result.`,
    },
    {
      title: "4. Improve the workflow",
      body: "Run a second pass where you improve the prompt. Add stronger limits, a clearer output format, and a line that tells the tool what to do when information is missing. The second version should be safer and easier to check than the first.",
    },
    {
      title: "5. Reflect and log",
      body: "Write five bullets: what you would do differently next week, what you would teach a new hire, and what you would escalate to a supervisor. This reflection is part of the guided time and supports certificate-style submissions later.",
    },
  ];
}

function getWorkedExample(lesson: CourseLesson) {
  return {
    source:
      "Caller reports water damage after a pipe leak. Damage noticed yesterday evening. Kitchen floor affected. Photos mentioned but not attached. Policy number not available in the note. Caller wants to know what happens next.",
    prompt: `Use only the source note. Help with this lesson focus: ${lesson.title}. Create a short claims-work output with confirmed facts, unknowns, follow-up questions, and a human review note. Do not decide coverage or promise a claim outcome.`,
    review:
      "A strong answer should separate confirmed facts from unknowns, avoid coverage language, ask for the missing policy number and photos, and remind the handler to check the source note before sending or saving anything.",
  };
}

export function LessonPage() {
  const { slug, lessonId } = useParams();
  const location = useLocation();
  const track = slug ? getTrack(slug) : undefined;
  const lesson = track?.course?.lessons.find((item) => item.id === lessonId);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, slug, lessonId]);

  if (!track || !track.course || !lesson) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Lesson not found</h1>
        <Link to="/courses" className="mt-4 inline-block font-semibold text-blue-600">
          Back to courses
        </Link>
      </div>
    );
  }

  const lessonTrack = track;
  const lessonCourse = track.course;
  const purchased = hasLessonAccess(lessonTrack.slug, lesson.program);
  const unlocked = canAccessLesson(lessonTrack, lesson);
  const previewOnly = unlocked && !purchased && isDemoLesson(lessonTrack, lesson);
  const plan = lessonCourse.plans[lesson.program];
  const miniTest = lesson.miniTest ?? defaultMiniTest(lesson);
  const guidedMinutes = guidedLessonMinutes(lesson);
  const studyPlan = getStudyPlan(lesson);
  const workedExample = getWorkedExample(lesson);
  const video = resolveLessonVideo(lesson);
  const reading = extendedReading(lesson);
  const rubric = selfAssessmentRubric(lesson);
  const { prev, next } = adjacentLessons(lessonTrack, lesson.id);
  const certUnlocked = isUnlocked(lessonTrack.slug, "certificate");
  const certEarned = hasCertificateEarned(lessonTrack.slug);
  const lastInProgram = isLastLessonInProgram(lessonTrack, lesson);
  const handsOnAi = lessonSupportsHandsOnAi(lesson);

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-4xl pb-24 pt-10">
        <Link
          to={`/courses/${lessonTrack.slug}`}
          className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          &larr; Back to course
        </Link>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Locked lesson</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">{lesson.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{lesson.description}</p>
          {getDemoLessonPath(lessonTrack) ? (
            <Link
              to={getDemoLessonPath(lessonTrack)!}
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Try the free preview lesson first
            </Link>
          ) : null}
        </div>
        <div className="mt-8">
          <AiPracticeCallout variant="compact" showSteps={false} />
        </div>
        <div className="mt-8 max-w-xl">
          <PaywallCard
            trackSlug={lessonTrack.slug}
            tier={lesson.program}
            title={`${plan.name} / ${plan.durationLabel}`}
            priceUsd={plan.priceUsd}
            description={`Unlock this lesson and the rest of the ${plan.name} course.`}
            includes={plan.includes}
          />
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl pb-24 pt-8">
      <Link
        to={`/courses/${lessonTrack.slug}`}
        className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
      >
        &larr; {lessonTrack.shortTitle} course
      </Link>

      <header className="mt-8 border-b border-slate-200 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
            {plan.name} · Week {lesson.week}
          </span>
          {previewOnly ? (
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
              Free preview
            </span>
          ) : null}
          <span className="text-sm font-medium text-slate-500">{guidedMinutes} min guided lesson</span>
          <span className="text-sm font-medium text-slate-500">Video, deep reading, exercises, mini test</span>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{lesson.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-slate-600">{lesson.description}</p>
      </header>

      {previewOnly ? <DemoLessonBanner track={lessonTrack} program={lesson.program} /> : null}

      <div className="mt-8">
        <AiPracticeCallout variant="compact" showSteps={false} />
      </div>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">What you will be able to do</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lesson.outcomes.map((outcome) => (
            <li key={outcome} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 space-y-8">
        {lesson.blocks.map((block) => (
          <section key={block.heading} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{block.heading}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{block.body}</p>
          </section>
        ))}
      </div>

      {reading.map((section) => (
        <section key={section.heading} className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
          <div className="mt-6 space-y-5">
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-8 text-slate-600">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Watch</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Expert video (embedded)</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {video.title}
            <span className="font-normal text-slate-500"> — {video.channel}</span>
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            This is a real public YouTube recording mapped to your lesson theme. Follow the segment shown below (the
            embedded player starts at the assigned timestamp when your browser supports it). If embedding is blocked on
            your network, use “Open on YouTube”.
          </p>
          {lesson.videoSegmentLabel?.trim() ? (
            <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
              <span className="font-bold text-slate-900">Segment focus: </span>
              {lesson.videoSegmentLabel}
            </p>
          ) : null}
        </div>
        <div className="aspect-video w-full bg-slate-950">
          <iframe
            className="h-full w-full"
            src={youtubeLessonEmbedSrc(lesson)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <span>Tip: pause and replay the segment if a concept lands faster when you see it twice.</span>
          <a
            href={youtubeWatchUrl(video.youtubeId, lesson.youtubeStartSeconds)}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Open on YouTube
          </a>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Guided study plan</h2>
        <div className="mt-6 grid gap-5">
          {studyPlan.map((step) => (
            <div key={step.title} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Worked example</h2>
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Source note</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{workedExample.source}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Prompt to practise</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{workedExample.prompt}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700">What good looks like</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{workedExample.review}</p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Self-assessment rubric</h2>
        <p className="mt-3 text-slate-600">
          Score yourself 1–5 on each row before moving on. If any row is below 4, revise your deliverable — that is normal
          for professional-grade work.
        </p>
        <ul className="mt-6 space-y-4">
          {rubric.map((row) => (
            <li key={row.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="font-bold text-slate-900">{row.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{row.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Prompt template</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Copy this into your AI assistant, replace the bracketed parts, and run it on redacted or fake notes before you
          submit anything for real work.
        </p>
        <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
          {lesson.promptTemplate}
        </pre>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Workplace checklist</h2>
          <ul className="mt-5 space-y-3">
            {lesson.workplaceChecklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Applied practice</h2>
          <p className="mt-5 text-sm leading-6 text-slate-700">{lesson.practiceTask}</p>
          {handsOnAi ? (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-sm leading-6 text-slate-700">
              <p className="font-bold text-slate-900">Try it in your AI tool now</p>
              <p className="mt-2">
                Open Gemini, ChatGPT, Copilot, Claude, Grok, or another assistant your workplace allows. Copy the prompt
                template from this lesson, use redacted or fake notes only, then complete the practice task above using
                what you learned from the output.
              </p>
            </div>
          ) : null}
          <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            Budget 18–25 minutes: produce a first draft, wait five minutes, then revise with the checklist. Keep your
            source notes visible side-by-side with the model output so fact-checking is fast and honest.
          </div>
          <Link
            to={`/courses/${lessonTrack.slug}/revise`}
            className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50"
          >
            Open revision lab
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <MiniQuiz trackSlug={`${lessonTrack.slug}-${lesson.id}`} questions={miniTest} />
      </section>

      <nav className="mt-14 flex flex-col gap-4 border-t border-slate-200 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {prev && canAccessLesson(lessonTrack, prev) ? (
            <Link
              to={`/courses/${lessonTrack.slug}/lessons/${prev.id}`}
              className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50"
            >
              ← Previous lesson
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-dashed border-slate-200 px-5 py-3 text-sm font-medium text-slate-400">
              First lesson
            </span>
          )}
          {next && canAccessLesson(lessonTrack, next) ? (
            <Link
              to={`/courses/${lessonTrack.slug}/lessons/${next.id}`}
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Next lesson →
            </Link>
          ) : next ? (
            <Link
              to={`/checkout/${lessonTrack.slug}/${lesson.program}`}
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Unlock full course →
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-dashed border-slate-200 px-5 py-3 text-sm font-medium text-slate-400">
              Last in course order
            </span>
          )}
        </div>
        {lastInProgram ? (
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-sm font-semibold text-slate-600">End of {plan.name}</p>
            <Link
              to={
                certEarned
                  ? `/courses/${lessonTrack.slug}/certificate`
                  : certUnlocked
                    ? `/courses/${lessonTrack.slug}/final-test`
                    : `/checkout/${lessonTrack.slug}/certificate`
              }
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              {certEarned
                ? "View your certificate"
                : certUnlocked
                  ? "Take final exam for certificate"
                  : "Unlock certificate add-on ($5)"}
            </Link>
            <Link to={`/courses/${lessonTrack.slug}`} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
              Back to course home
            </Link>
          </div>
        ) : (
          <Link to={`/courses/${lessonTrack.slug}`} className="text-sm font-semibold text-slate-500 hover:text-slate-800 sm:text-right">
            Course home
          </Link>
        )}
      </nav>
    </article>
  );
}
