import type { ReactNode } from "react";

type StatItem = {
  icon: ReactNode;
  bold: string;
  rest: string;
};

function BriefcaseIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stats: StatItem[] = [
  { icon: <BriefcaseIcon />, bold: "Job-shaped scenarios", rest: "not generic AI theory" },
  { icon: <BookIcon />, bold: "4 industry tracks", rest: "available" },
  { icon: <ShieldIcon />, bold: "Human-review", rest: "at every step" },
  { icon: <RibbonIcon />, bold: "Verified certificates", rest: "included" },
];

function Stat({ item }: { item: StatItem }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600">
      {item.icon}
      <span>
        <strong className="font-bold text-slate-900">{item.bold}</strong> {item.rest}
      </span>
    </div>
  );
}

export function SocialProofBanner() {
  return (
    <div className="border-y border-slate-200 bg-white" role="region" aria-label="Platform highlights">
      <div className="mx-auto flex w-full max-w-[90rem] justify-center px-4 py-3.5 sm:px-6 lg:px-10">
        <ul className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-0">
          {stats.map((item, index) => (
            <li key={item.bold} className="flex items-center">
              {index > 0 && (
                <span className="mx-4 hidden text-slate-300 sm:inline" aria-hidden>
                  |
                </span>
              )}
              <Stat item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
