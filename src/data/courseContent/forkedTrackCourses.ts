import type { PaidCourse } from "../../types";
import {
  forkPaidCourse,
  LEX_ACCOUNTING_LESSONS,
  LEX_ACCOUNTING_PLANS,
  LEX_CLINICAL_LESSONS,
  LEX_CLINICAL_PLANS,
  LEX_CONSTRUCTION_LESSONS,
  LEX_CONSTRUCTION_PLANS,
} from "./industryLexicon";

export const CONSTRUCTION_CERTIFICATE: PaidCourse["certificate"] = {
  priceUsd: 5,
  title: "Construction & Trades Practical Certificate",
  description:
    "A practical final test where you use AI to organise sample project notes, draft a safe client update, and show your review process.",
  tasks: [
    "Create a clear project admin summary from messy notes.",
    "List missing scope or document details without guessing quantities.",
    "Draft a professional client update that avoids contractual promises.",
    "Explain which parts need estimator, engineer, or legal review before use.",
  ],
  rubric: [
    { label: "Clear prompt", passCriteria: "The prompt gives context, task, limits, and output format." },
    { label: "Safe output", passCriteria: "The answer uses only supplied facts and flags missing details." },
    { label: "Human review", passCriteria: "The submission includes checks before client or site use." },
    { label: "Job fit", passCriteria: "The result would be useful to a project coordinator or estimator." },
  ],
};

export const CLINICAL_CERTIFICATE: PaidCourse["certificate"] = {
  priceUsd: 5,
  title: "Clinical Admin Practical Certificate (Non-diagnostic)",
  description:
    "A practical final test where you use AI to support admin workflows, draft a safe patient-facing template, and document privacy review steps.",
  tasks: [
    "Summarise non-clinical admin notes without adding medical advice.",
    "List missing information and escalation points without diagnosing.",
    "Draft a patient communication that follows approved tone and limits.",
    "Explain what a clinician or supervisor must verify before use.",
  ],
  rubric: [
    { label: "Clear prompt", passCriteria: "The prompt gives context, task, limits, and output format." },
    { label: "Safe output", passCriteria: "No diagnosis, treatment, or triage; unknowns are visible." },
    { label: "Human review", passCriteria: "The submission includes checks aligned to clinic policy." },
    { label: "Job fit", passCriteria: "The result would be useful to clinic admin or operations staff." },
  ],
};

export const ACCOUNTING_CERTIFICATE: PaidCourse["certificate"] = {
  priceUsd: 5,
  title: "Accounting Practice Practical Certificate",
  description:
    "A practical final test where you use AI to organise client requests, draft a cautious email, and show how you verified numbers against source files.",
  tasks: [
    "Create a client-ready checklist from provided notes without inventing figures.",
    "List open questions for the accountant or reviewer.",
    "Draft a polite client email that avoids tax or legal conclusions.",
    "Explain what must be reviewed before anything is sent or filed.",
  ],
  rubric: [
    { label: "Clear prompt", passCriteria: "The prompt gives context, task, limits, and output format." },
    { label: "Safe output", passCriteria: "Numbers and claims match supplied material; uncertainty is visible." },
    { label: "Human review", passCriteria: "The submission includes checks before client or filing use." },
    { label: "Job fit", passCriteria: "The result would be useful in a bookkeeping or small-practice workflow." },
  ],
};

export function buildForkedPaidCourses(base: PaidCourse) {
  return {
    construction: forkPaidCourse(base, {
      plansLex: LEX_CONSTRUCTION_PLANS,
      lessonLex: LEX_CONSTRUCTION_LESSONS,
      certificate: CONSTRUCTION_CERTIFICATE,
    }),
    clinical: forkPaidCourse(base, {
      plansLex: LEX_CLINICAL_PLANS,
      lessonLex: LEX_CLINICAL_LESSONS,
      certificate: CLINICAL_CERTIFICATE,
    }),
    accounting: forkPaidCourse(base, {
      plansLex: LEX_ACCOUNTING_PLANS,
      lessonLex: LEX_ACCOUNTING_LESSONS,
      certificate: ACCOUNTING_CERTIFICATE,
    }),
  };
}
