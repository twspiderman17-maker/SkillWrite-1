import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { getCertificatesEventName, hasCertificateEarned } from "../lib/certificates";
import { getEntitlementsEventName } from "../lib/entitlements";
import { PaywallCard } from "../components/PaywallCard";
import { getTrack } from "../data/tracks";
import { getDemoLesson, getDemoLessonPath, isDemoLesson } from "../lib/demoLessons";
import { isUnlocked } from "../lib/progress";
import { isSupabaseConfigured } from "../lib/supabase";
import type { CourseLesson, Program, Track } from "../types";
import { guidedLessonMinutes } from "../lib/lessonTime";
import { compareCourseLessons } from "../lib/lessonNav";
import { AiPracticeCallout } from "../components/AiPracticeCallout";

function WeekList({ weeks }: { weeks: { week: number; title: string; bullets: string[] }[] }) {
  return (
    <div className="space-y-4">
      {weeks.map((w) => (
        <div key={w.week} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row gap-6">
          <div className="shrink-0 sm:w-24">
            <div className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
              Week {w.week}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{w.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {w.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonList({
  track,
  lessons,
  programUnlocked,
}: {
  track: Track;
  lessons: CourseLesson[];
  programUnlocked: boolean;
}) {
  return (
    <div className="space-y-3">
      {lessons.map((lesson) => {
        const demo = isDemoLesson(track, lesson);
        const badge = demo ? "Free preview" : programUnlocked ? "Unlocked" : "Locked";
        const badgeClass = demo || programUnlocked ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500";

        return (
        <Link
          key={lesson.id}
          to={`/courses/${track.slug}/lessons/${lesson.id}`}
          className={`flex items-start justify-between gap-5 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
            demo ? "border-emerald-200 hover:border-emerald-300" : "border-slate-200 hover:border-blue-200"
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
                Week {lesson.week}
              </span>
              <span className="text-xs font-semibold text-slate-400">{guidedLessonMinutes(lesson)} min guided</span>
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">{lesson.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
        </Link>
        );
      })}
    </div>
  );
}

export function CourseDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const track = slug ? getTrack(slug) : undefined;
  const [, setEntitlementVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setEntitlementVersion((v) => v + 1);
    window.addEventListener(getEntitlementsEventName(), refresh);
    window.addEventListener(getCertificatesEventName(), refresh);
    return () => {
      window.removeEventListener(getEntitlementsEventName(), refresh);
      window.removeEventListener(getCertificatesEventName(), refresh);
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, slug]);

  if (!track) {
    return (
      <div className="text-center pt-20">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block font-medium text-blue-600 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  const course = track.course;
  const graduateUnlocked = isUnlocked(track.slug, "graduate");
  const mastersUnlocked = isUnlocked(track.slug, "masters");
  const certificateUnlocked = isUnlocked(track.slug, "certificate");
  const certificateEarned = hasCertificateEarned(track.slug);
  const certificateHref = certificateEarned
    ? `/courses/${track.slug}/certificate`
    : certificateUnlocked
      ? `/courses/${track.slug}/final-test`
      : `/checkout/${track.slug}/certificate`;
  const certificateLabel = certificateEarned
    ? "View your certificate"
    : certificateUnlocked
      ? "Take final test"
      : "Unlock certificate";
  const lessonsByProgram = (program: Program) =>
    [...(course?.lessons.filter((lesson) => lesson.program === program) ?? [])].sort(compareCourseLessons);
  const demoLesson = getDemoLesson(track);
  const demoLessonHref = getDemoLessonPath(track);

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="pt-8 pb-12">
        <Link to="/courses" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          &larr; All courses
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {track.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-600">{track.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {demoLessonHref ? (
            <Link
              to={demoLessonHref}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              Try free lesson
            </Link>
          ) : null}
          <Link
            to={`/courses/${track.slug}/revise`}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            Revision Lab
          </Link>
          <Link
            to="/certification"
            className="rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition-all"
          >
            Certificate Pathway
          </Link>
        </div>
        {demoLesson ? (
          <p className="mt-4 text-sm text-slate-600">
            Preview <span className="font-semibold text-slate-800">{demoLesson.title}</span> before you buy — full video,
            exercises, and mini quiz included.
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-16 flex gap-4">
        <div className="text-amber-600 shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-amber-900">Important safety note</h3>
          <p className="mt-1 text-sm text-amber-800 leading-relaxed">{track.disclaimer}</p>
        </div>
      </div>

      <div className="mb-16">
        <AiPracticeCallout />
      </div>

      {course ? (
        <div className="space-y-16">
          <section>
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Choose access</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Unlock the course</h2>
              <p className="mt-3 text-slate-600">
                {isSupabaseConfigured
                  ? "One-time purchase via Stripe. Access is tied to your SkillWrite account."
                  : "Demo paywall: purchases unlock in this browser only for testing."}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <PaywallCard
                trackSlug={track.slug}
                tier="graduate"
                title={`${course.plans.graduate.name} / ${course.plans.graduate.durationLabel}`}
                priceUsd={course.plans.graduate.priceUsd}
                description={course.plans.graduate.description}
                includes={course.plans.graduate.includes}
                unlocked={graduateUnlocked}
              />
              <PaywallCard
                trackSlug={track.slug}
                tier="masters"
                title={`${course.plans.masters.name} / ${course.plans.masters.durationLabel}`}
                priceUsd={course.plans.masters.priceUsd}
                description={course.plans.masters.description}
                includes={course.plans.masters.includes}
                unlocked={mastersUnlocked}
              />
              <PaywallCard
                trackSlug={track.slug}
                tier="certificate"
                title="Final test + certificate"
                priceUsd={course.certificate.priceUsd}
                description={course.certificate.description}
                includes={["Auto-marked final exam", "Scenario-based questions", "Printable certificate when you pass"]}
                unlocked={certificateUnlocked}
                ctaLabel={`Add certificate for $${course.certificate.priceUsd}`}
              />
            </div>
          </section>

          <section>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Graduate lessons</h2>
                <p className="mt-2 text-slate-600">Three lessons per week across the 4-week Graduate course.</p>
              </div>
              {graduateUnlocked ? (
                <Link to={`/courses/${track.slug}/lessons/${lessonsByProgram("graduate")[0]?.id}`} className="text-sm font-bold text-blue-600">
                  Start Graduate &rarr;
                </Link>
              ) : demoLessonHref ? (
                <Link to={demoLessonHref} className="text-sm font-bold text-emerald-700">
                  Try free lesson &rarr;
                </Link>
              ) : null}
            </div>
            <LessonList track={track} lessons={lessonsByProgram("graduate")} programUnlocked={graduateUnlocked} />
          </section>

          <section>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Masters lessons</h2>
                <p className="mt-2 text-slate-600">Three lessons per week across the 12-week Masters course.</p>
              </div>
              {mastersUnlocked && (
                <Link to={`/courses/${track.slug}/lessons/${lessonsByProgram("masters")[0]?.id}`} className="text-sm font-bold text-blue-600">
                  Start Masters &rarr;
                </Link>
              )}
            </div>
            <LessonList track={track} lessons={lessonsByProgram("masters")} programUnlocked={mastersUnlocked} />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">$5 add-on</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{course.certificate.title}</h2>
                <p className="mt-2 max-w-2xl text-slate-600">{course.certificate.description}</p>
              </div>
              <Link
                to={certificateHref}
                className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                {certificateLabel}
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-20">
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Graduate</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-blue-600">{track.graduate.durationWeeks} weeks</p>
            <p className="mt-4 text-lg text-slate-600">{track.graduate.summary}</p>
            <div className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
              <span className="font-bold text-slate-900">Final task:</span> {track.graduate.capstone}
            </div>
          </div>
          <WeekList weeks={track.graduate.weeks} />
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Masters</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-blue-600">{track.masters.durationWeeks} weeks</p>
            <p className="mt-4 text-lg text-slate-600">{track.masters.summary}</p>
            <div className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
              <span className="font-bold text-slate-900">Final task:</span> {track.masters.capstone}
            </div>
          </div>
          <WeekList weeks={track.masters.weeks} />
        </section>
        </div>
      )}
    </div>
  );
}
