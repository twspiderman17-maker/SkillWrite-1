import { NotebookWatermark, WorkflowDiagram } from "./decor/SvgDecor";

const signals = [
  "Every workflow includes a human-review checkpoint",
  "No AI output is ever used without professional sign-off",
  "HIPAA-aware guidance for clinical tracks",
  "Courses built with industry practitioners",
] as const;

export function TrustSignalsSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" aria-hidden />
      <NotebookWatermark className="pointer-events-none absolute -left-4 top-8 h-48 w-40 text-slate-300 opacity-60 sm:h-56 sm:w-48" />
      <WorkflowDiagram className="pointer-events-none absolute -right-8 bottom-4 hidden h-32 w-64 text-blue-200 sm:block lg:h-40 lg:w-80" />
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Trust &amp; safety</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Built for workplaces that cannot afford guesswork
        </h2>
        <ul className="mt-8 space-y-5">
          {signals.map((text) => (
            <li key={text} className="flex items-start gap-4 text-slate-700">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-base font-medium leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
