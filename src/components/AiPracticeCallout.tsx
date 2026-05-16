import { AI_PRACTICE_SHORT, AI_PRACTICE_TOOLS_LINE, AI_PRACTICE_WORKFLOW_STEPS } from "../content/aiPractice";

type Props = {
  variant?: "compact" | "full";
  showSteps?: boolean;
};

export function AiPracticeCallout({ variant = "full", showSteps = true }: Props) {
  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-900">Study with AI open</p>
        <p className="mt-2">{AI_PRACTICE_SHORT}</p>
        <p className="mt-2 text-slate-600">{AI_PRACTICE_TOOLS_LINE}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Hands-on learning</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">Keep an AI assistant open while you work</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{AI_PRACTICE_SHORT}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{AI_PRACTICE_TOOLS_LINE}</p>
      {showSteps ? (
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {AI_PRACTICE_WORKFLOW_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
