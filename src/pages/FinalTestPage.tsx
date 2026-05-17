import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PaywallCard } from "../components/PaywallCard";
import { getTrack } from "../data/tracks";
import { hasFinalTestSubmission, isUnlocked, recordFinalTestSubmission } from "../lib/progress";

export function FinalTestPage() {
  const { slug } = useParams();
  const track = slug ? getTrack(slug) : undefined;
  const [submitted, setSubmitted] = useState(() => (track ? hasFinalTestSubmission(track.slug) : false));

  if (!track || !track.course) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Final test not found</h1>
        <Link to="/courses" className="mt-4 inline-block font-semibold text-blue-600">
          Back to courses
        </Link>
      </div>
    );
  }

  const activeTrack = track;
  const activeCourse = track.course;
  const certificate = activeCourse.certificate;
  const unlocked = isUnlocked(activeTrack.slug, "certificate");

  function submitDemoTest() {
    recordFinalTestSubmission(activeTrack.slug);
    setSubmitted(true);
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-4xl pb-24 pt-10">
        <Link to={`/courses/${activeTrack.slug}`} className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
          &larr; Back to course
        </Link>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Certificate add-on</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">{certificate.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{certificate.description}</p>
        </div>
        <div className="mt-8 max-w-xl">
          <PaywallCard
            trackSlug={activeTrack.slug}
            tier="certificate"
            title="Final test + certificate"
            priceUsd={certificate.priceUsd}
            description="Unlock the practical test and certificate preview."
            includes={["Practical final task", "Checklist-based marking", "Certificate preview after submission"]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-24 pt-8">
      <Link to={`/courses/${activeTrack.slug}`} className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
        &larr; Back to course
      </Link>

      <header className="mt-8 border-b border-slate-200 pb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">$5 certificate add-on</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{certificate.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-slate-600">{certificate.description}</p>
      </header>

      {submitted && (
        <section className="mt-10 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
          <div className="bg-emerald-50 px-8 py-6">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Certificate preview</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">SkillWrite certifies that</p>
            <p className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900">Demo Learner</p>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
              completed the practical final test for <strong>{activeTrack.title}</strong> and demonstrated safe, job-specific AI workflow skills.
            </p>
            <p className="mt-8 text-sm font-semibold text-emerald-700">Submitted in demo mode</p>
          </div>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Final test tasks</h2>
        <p className="mt-3 text-slate-600">
          Complete these tasks using the course workflow. In this frontend MVP, the submit button records a demo submission.
        </p>
        <ol className="mt-6 space-y-4">
          {certificate.tasks.map((task, index) => (
            <li key={task} className="flex gap-4 rounded-2xl bg-slate-50 p-5 text-slate-700">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="leading-7">{task}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Marking checklist</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="pb-4 pr-6 font-bold text-slate-900">Area</th>
                <th className="pb-4 pr-6 font-bold text-slate-900">Pass criteria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {certificate.rubric.map((row) => (
                <tr key={row.label}>
                  <td className="py-4 pr-6 font-semibold text-slate-900">{row.label}</td>
                  <td className="py-4 pr-6">{row.passCriteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Demo submission</h2>
        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">Paste your final answer or notes</span>
          <textarea
            className="mt-2 min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            placeholder="In a real app, this would be saved and graded. For this MVP, the button below shows the completion flow."
          />
        </label>
        <button
          type="button"
          onClick={submitDemoTest}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          {submitted ? "Submitted" : "Submit demo test"}
        </button>
      </section>
    </div>
  );
}
