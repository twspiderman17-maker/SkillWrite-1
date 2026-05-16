import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, updated, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl pb-24">
      <Link to="/" className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
        &larr; Home
      </Link>
      <header className="mt-8 border-b border-slate-200 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Legal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>
      </header>
      <div className="prose-skillwrite mt-10 space-y-6 text-base leading-relaxed text-slate-600">{children}</div>
    </article>
  );
}
