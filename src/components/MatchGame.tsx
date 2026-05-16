import { useCallback, useMemo, useState } from "react";
import type { MatchPair } from "../types";

type Card = { key: string; text: string; pairId: string; kind: "term" | "def" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Props = {
  pairs: MatchPair[];
};

export function MatchGame({ pairs }: Props) {
  const [round, setRound] = useState(0);

  const deck = useMemo(() => {
    const cards: Card[] = [];
    pairs.forEach((p) => {
      cards.push({ key: `${p.id}-t-${round}`, text: p.term, pairId: p.id, kind: "term" });
      cards.push({ key: `${p.id}-d-${round}`, text: p.definition, pairId: p.id, kind: "def" });
    });
    return shuffle(cards);
  }, [pairs, round]);

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  const onPick = useCallback(
    (key: string, pairId: string) => {
      if (lock || matched.has(pairId)) return;
      if (open.includes(key)) return;
      if (open.length === 0) {
        setOpen([key]);
        return;
      }
      if (open.length === 1) {
        const firstKey = open[0];
        const first = deck.find((c) => c.key === firstKey);
        const second = deck.find((c) => c.key === key);
        if (!first || !second) return;
        setMoves((m) => m + 1);
        if (first.pairId === second.pairId && first.kind !== second.kind) {
          setMatched((s) => new Set(s).add(pairId));
          setOpen([]);
          return;
        }
        setOpen([firstKey, key]);
        setLock(true);
        window.setTimeout(() => {
          setOpen([]);
          setLock(false);
        }, 700);
      }
    },
    [deck, lock, matched, open],
  );

  const won = matched.size === pairs.length;

  function shuffleNewRound() {
    setMatched(new Set());
    setOpen([]);
    setMoves(0);
    setLock(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h3 className="text-xl font-bold text-slate-900">Study match</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Moves: {moves}</span>
      </div>
      <p className="text-sm text-slate-500 mb-8">Match each term with its meaning. Pairs clear when correct.</p>

      {won ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl mb-4">
            🏆
          </div>
          <p className="text-xl font-bold text-emerald-900">All pairs matched!</p>
          <p className="mt-2 text-emerald-700">Try again and aim for fewer moves.</p>
          <button 
            type="button" 
            onClick={shuffleNewRound} 
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all"
          >
            Shuffle new round
          </button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {deck.map((c) => {
            const isOpen = open.includes(c.key) || matched.has(c.pairId);
            const dim = matched.has(c.pairId);
            return (
              <li key={c.key}>
                <button
                  type="button"
                  disabled={dim || lock}
                  onClick={() => onPick(c.key, c.pairId)}
                  className={`flex min-h-[100px] w-full items-center justify-center rounded-2xl border-2 px-4 py-3 text-center text-sm font-medium transition-all duration-200 ${
                    dim
                      ? "border-transparent bg-slate-50 text-transparent pointer-events-none"
                      : isOpen
                        ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm"
                        : "border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 shadow-sm"
                  }`}
                >
                  <span>{isOpen ? c.text : "?"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
