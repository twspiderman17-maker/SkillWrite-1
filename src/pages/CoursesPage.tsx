import { Link } from "react-router-dom";
import { TRACKS } from "../data/tracks";

export function CoursesPage() {
  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="pt-12 pb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Courses</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Choose a job area, learn the basics of AI, then practise using AI on tasks that match that type of work. Keep a
          free chat assistant open in another tab while you study — for example Gemini, ChatGPT, Copilot, Claude, or
          Grok — and follow each lesson’s prompt templates with redacted sample data.
        </p>
      </div>

      <div className="space-y-6">
        {TRACKS.map((t) => (
          <article
            key={t.slug}
            className="flex flex-col sm:flex-row gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex-grow">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">{t.shortTitle}</p>
              <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{t.tagline}</p>
              <p className="mt-4 text-sm font-medium text-slate-500">
                <span className="text-slate-900 font-bold">For:</span> {t.audience}
              </p>
            </div>
            <div className="flex shrink-0 flex-col justify-center gap-3 sm:w-48">
              <Link
                to={`/courses/${t.slug}`}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                View Syllabus
              </Link>
              <Link
                to={`/courses/${t.slug}/revise`}
                className="flex w-full items-center justify-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
              >
                Revision Lab
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
