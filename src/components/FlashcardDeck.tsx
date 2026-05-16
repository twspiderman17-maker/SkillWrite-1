import { useMemo, useState } from "react";
import type { Flashcard as FlashcardT } from "../types";
import { getProgress, isFlashKnown, toggleFlashKnown } from "../lib/progress";

type Props = {
  trackSlug: string;
  cards: FlashcardT[];
};

function shuffleIds(ids: string[]): string[] {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardDeck({ trackSlug, cards }: Props) {
  const [order, setOrder] = useState(() => [...cards.map((c) => c.id)]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [, tick] = useState(0);

  const card = useMemo(() => {
    const id = order[pos];
    return cards.find((c) => c.id === id) ?? cards[0];
  }, [cards, order, pos]);

  const known = isFlashKnown(trackSlug, card.id);

  function shuffle() {
    const knownIds = new Set(getProgress().flashKnown[trackSlug] ?? []);
    const unknown = cards.filter((c) => !knownIds.has(c.id)).map((c) => c.id);
    const known = cards.filter((c) => knownIds.has(c.id)).map((c) => c.id);
    const sh = [...shuffleIds(unknown), ...shuffleIds(known)];
    setOrder(sh.length ? sh : [...cards.map((c) => c.id)]);
    setPos(0);
    setFlipped(false);
  }

  function prev() {
    setPos((p) => (p - 1 + order.length) % order.length);
    setFlipped(false);
  }

  function next() {
    setPos((p) => (p + 1) % order.length);
    setFlipped(false);
  }

  function toggleKnown() {
    toggleFlashKnown(trackSlug, card.id);
    tick((x) => x + 1);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-slate-900">Flashcards</h3>
        <button
          type="button"
          onClick={shuffle}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          Shuffle (weak cards first)
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">
          Card {pos + 1} of {order.length}
        </p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Tap card to flip
        </p>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="relative flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50 p-8 text-center transition-all hover:border-blue-200 hover:bg-blue-50 group"
      >
        <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">
          {flipped ? "Back" : "Front"}
        </span>
        <p className="text-2xl sm:text-3xl font-semibold leading-tight text-slate-900">
          {flipped ? card.back : card.front}
        </p>
      </button>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto gap-2">
          <button type="button" onClick={prev} className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            Previous
          </button>
          <button type="button" onClick={next} className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            Next
          </button>
        </div>
        <button
          type="button"
          onClick={toggleKnown}
          className={`w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all ${
            known 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          {known ? "✓ Marked as confident" : "Mark as confident"}
        </button>
      </div>
    </div>
  );
}
