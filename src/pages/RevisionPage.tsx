import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTrack } from "../data/tracks";
import { MiniQuiz } from "../components/MiniQuiz";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { MatchGame } from "../components/MatchGame";
import { RevisionIntegrations } from "../components/RevisionIntegrations";
import { getProgress } from "../lib/progress";

const tabs = [
  { id: "quiz", label: "Mini quiz" },
  { id: "flash", label: "Flashcards" },
  { id: "match", label: "Study match" },
  { id: "sync", label: "Study tools" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function RevisionPage() {
  const { slug } = useParams();
  const track = slug ? getTrack(slug) : undefined;
  const [tab, setTab] = useState<TabId>("quiz");

  if (!track) {
    return (
      <div className="text-center pt-20">
        <h1 className="text-2xl font-bold text-slate-900">Track not found</h1>
        <Link to="/courses" className="mt-4 inline-block font-medium text-blue-600 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  const prog = getProgress();
  const best = prog.quizBestScores[track.slug] ?? 0;
  const knownCount = (prog.flashKnown[track.slug] ?? []).length;

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="pt-8 pb-12">
        <Link to={`/courses/${track.slug}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8">
          &larr; {track.shortTitle} syllabus
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Revision lab</h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-600">
          Practise what you learned in <strong className="font-semibold text-slate-900">{track.title}</strong>.
          Your quiz score and flashcard progress are saved in this browser.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Best quiz:</span>
            <span className="text-lg font-bold text-blue-600">{best}%</span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Confident cards:</span>
            <span className="text-lg font-bold text-blue-600">{knownCount} <span className="text-sm text-slate-400 font-medium">/ {track.flashcards.length}</span></span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-12 flex gap-4">
        <div className="text-amber-600 shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">{track.disclaimer}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "quiz" && <MiniQuiz trackSlug={track.slug} questions={track.quizzes} />}
        {tab === "flash" && <FlashcardDeck trackSlug={track.slug} cards={track.flashcards} />}
        {tab === "match" && <MatchGame pairs={track.matchPairs} />}
        {tab === "sync" && <RevisionIntegrations track={track} />}
      </div>
    </div>
  );
}
