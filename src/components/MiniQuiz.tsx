import { useRef, useState } from "react";
import type { QuizQuestion } from "../types";
import { recordQuizBest } from "../lib/progress";

type Props = {
  trackSlug: string;
  questions: QuizQuestion[];
};

export function MiniQuiz({ trackSlug, questions }: Props) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [done, setDone] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const q = questions[idx];
  const isLast = idx >= questions.length - 1;

  function pick(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowExplain(true);
    if (optionIndex === q.correctIndex) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
  }

  function next() {
    if (isLast) {
      recordQuizBest(trackSlug, scoreRef.current, questions.length);
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setShowExplain(false);
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    scoreRef.current = 0;
    setScore(0);
    setDone(false);
    setShowExplain(false);
  }

  if (done) {
    const final = scoreRef.current;
    const percentage = Math.round((final / questions.length) * 100);
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl mb-6">
          🎉
        </div>
        <h3 className="text-3xl font-bold text-slate-900">Round complete</h3>
        <p className="mt-4 text-lg text-slate-600">
          You scored <span className="font-bold text-blue-600">{final}</span> out of {questions.length} ({percentage}%).
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Your best score is saved automatically.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          Retry quiz
        </button>
      </div>
    );
  }

  const correct = selected !== null && selected === q.correctIndex;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-slate-900">Mini quiz</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">
            Question {idx + 1} of {questions.length}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            Score: {score}
          </span>
        </div>
      </div>
      
      <p className="text-xl font-semibold leading-relaxed text-slate-900">{q.question}</p>
      
      <ul className="mt-8 space-y-3">
        {q.options.map((opt, i) => {
          let cls =
            "w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all duration-200 ";
          
          if (selected === null) {
            cls += "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 cursor-pointer";
          } else {
            if (i === q.correctIndex) {
              cls += "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (i === selected) {
              cls += "border-rose-300 bg-rose-50 text-rose-900";
            } else {
              cls += "border-slate-100 bg-white text-slate-400 opacity-50";
            }
          }
          
          return (
            <li key={i}>
              <button type="button" disabled={selected !== null} className={cls} onClick={() => pick(i)}>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>

      {showExplain && (
        <div
          className={`mt-8 rounded-2xl p-6 ${
            correct ? "bg-emerald-50" : "bg-rose-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 shrink-0 ${correct ? "text-emerald-600" : "text-rose-600"}`}>
              {correct ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
              )}
            </div>
            <div>
              <p className={`font-bold ${correct ? "text-emerald-900" : "text-rose-900"}`}>
                {correct ? "Correct!" : "Not quite."}
              </p>
              <p className={`mt-1 text-sm leading-relaxed ${correct ? "text-emerald-800" : "text-rose-800"}`}>
                {q.explain}
              </p>
            </div>
          </div>
        </div>
      )}

      {selected !== null && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={next}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            {isLast ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
