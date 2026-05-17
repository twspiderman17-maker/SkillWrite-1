import { Link } from "react-router-dom";
import { TRACKS } from "../data/tracks";
import { getDemoLessonPath } from "../lib/demoLessons";
import { SocialProofBanner } from "../components/SocialProofBanner";
import { TrustSignalsSection } from "../components/TrustSignalsSection";
import { ForOrganizationsSection } from "../components/ForOrganizationsSection";
import { FullBleed, SectionBackdrop } from "../components/SectionBackdrop";
import { IndustryIcon } from "../components/decor/SvgDecor";
import { HomeHero } from "../components/HomeHero";

export function HomePage() {
  return (
    <div className="space-y-16 pb-20 sm:space-y-20">
      <HomeHero />

      <FullBleed>
        <SocialProofBanner />
      </FullBleed>

      <SectionBackdrop variant="cards">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Two paths. One clear skill.</h2>
          <p className="mt-4 text-lg text-slate-600">Choose the depth that matches your career goals.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-900 opacity-[0.06] select-none">
              4
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Graduate</h3>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-blue-600">4 Weeks</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Learn the basics of AI, then practise using it in two job tasks. Finish with a simple final project.
            </p>
            <ul className="mt-8 space-y-3 text-sm font-medium text-slate-700">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Mini quizzes after lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Flashcards and study game
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Final task for a certificate
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-900 opacity-[0.06] select-none">
              12
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Masters</h3>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-blue-600">12 Weeks</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Go deeper. Build better prompts, create reusable workflows, learn review habits, and complete more advanced
              projects.
            </p>
            <ul className="mt-8 space-y-3 text-sm font-medium text-slate-700">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> More practice tasks
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> Team workflow and safety lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> Harder certificate test
              </li>
            </ul>
          </div>
        </div>
      </SectionBackdrop>

      <TrustSignalsSection />

      <SectionBackdrop variant="steps" className="border-t border-slate-200 pt-16 sm:pt-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How learning works</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1", "Learn AI basics", "Simple prompts, safe use, and checking answers."],
            [
              "2",
              "Apply to your job",
              "Use AI on tasks from your chosen industry — with a free assistant open beside the lesson.",
            ],
            ["3", "Revise", "Use quizzes, flashcards, and a study game."],
            ["4", "Get assessed", "Complete a final practical task for a certificate."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">
                {step}
              </div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </SectionBackdrop>

      <section className="border-t border-slate-200 pt-16 sm:pt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Courses by job area</h2>
            <p className="mt-2 text-slate-600">
              Each track teaches AI habits first, then adapts them to real workplace tasks.
            </p>
          </div>
          <Link to="/courses" className="shrink-0 text-sm font-bold text-blue-600 hover:text-blue-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <div
              key={t.slug}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <IndustryIcon industry={t.slug} />
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-600">{t.shortTitle}</p>
              <h3 className="text-2xl font-bold text-slate-900">{t.title}</h3>
              <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-600">{t.tagline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {getDemoLessonPath(t) ? (
                  <Link
                    to={getDemoLessonPath(t)!}
                    className="text-sm font-bold text-emerald-700 transition-colors hover:text-emerald-800"
                  >
                    Free preview
                  </Link>
                ) : null}
                <Link
                  to={`/courses/${t.slug}`}
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
                >
                  Syllabus
                </Link>
                <span className="hidden text-slate-300 sm:inline">|</span>
                <Link
                  to={`/courses/${t.slug}/revise`}
                  className="text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
                >
                  Revision Lab
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ForOrganizationsSection />
    </div>
  );
}
