import { Link } from "react-router-dom";
import { TRACKS } from "../data/tracks";

export function CertificationPage() {
  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="pt-12 pb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Certificate assessment</h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-600">
          Students earn a certificate by completing lessons, revision, and a practical final task.
          The test checks that they can use AI safely in a real work situation.
        </p>
      </div>

      <div className="space-y-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">What the final test checks</h2>
          <ul className="mt-6 space-y-4 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>The student can write a clear AI prompt.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>The student can check the answer before using it.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>The student does not let AI make things up.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>The student protects private or sensitive information.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>The student knows when a human expert must review the work.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Simple marking guide</h2>
          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="pb-4 pr-6 font-bold text-slate-900">Area</th>
                  <th className="pb-4 pr-6 font-bold text-slate-900">What a pass looks like</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-4 pr-6 font-semibold text-slate-900">Clear prompt</td>
                  <td className="py-4 pr-6">The prompt explains the task, context, and output format.</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-slate-900">Safe answer</td>
                  <td className="py-4 pr-6">The answer does not guess missing facts or make unsafe claims.</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-slate-900">Review habit</td>
                  <td className="py-4 pr-6">The student checks the output and fixes mistakes.</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-slate-900">Job fit</td>
                  <td className="py-4 pr-6">The final work is useful for the chosen job area.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Practice by course</h2>
          <p className="mt-2 text-slate-600">Use the revision labs to prepare for the final task.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <Link
                key={t.slug}
                to={`/courses/${t.slug}/revise`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{t.shortTitle}</span>
                <span className="text-blue-600 font-bold">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
