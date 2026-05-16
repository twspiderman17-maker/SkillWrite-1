import type { ReactNode } from "react";
import { DocumentWatermark, NotebookWatermark, WorkflowDiagram } from "./decor/SvgDecor";

type DecorVariant = "hero" | "cards" | "steps" | "none";

type Props = {
  children: ReactNode;
  variant?: DecorVariant;
  className?: string;
};

export function SectionBackdrop({ children, variant = "none", className = "" }: Props) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {variant === "hero" && (
        <>
          <DocumentWatermark className="pointer-events-none absolute -right-4 top-4 h-56 w-44 rotate-6 text-slate-300 opacity-50 sm:-right-8 sm:top-8 sm:h-72 sm:w-56" />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[80%] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl"
            aria-hidden
          />
        </>
      )}
      {variant === "cards" && (
        <WorkflowDiagram className="pointer-events-none absolute right-0 top-1/2 hidden h-28 w-56 -translate-y-1/2 text-slate-200 md:block" />
      )}
      {variant === "steps" && (
        <NotebookWatermark className="pointer-events-none absolute -right-6 bottom-0 h-40 w-32 text-slate-200 opacity-40" />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}

/** Full-bleed wrapper for content inside max-width main */
export function FullBleed({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] ${className}`}>
      {children}
    </div>
  );
}
