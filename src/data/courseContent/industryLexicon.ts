import type { CertificateTest, CourseLesson, PaidCourse, PaidPlan } from "../../types";
import { allocateLessonVideos } from "./videoAllocation";
import { stripVideoFields } from "./stripVideoFields";

export type LexiconEntry = { pattern: RegExp; replacement: string };

export function applyLexicon(text: string, lex: LexiconEntry[]): string {
  return lex.reduce((acc, { pattern, replacement }) => acc.replace(pattern, replacement), text);
}

export function applyLexiconToLesson(lesson: CourseLesson, lex: LexiconEntry[]): CourseLesson {
  return {
    ...lesson,
    title: applyLexicon(lesson.title, lex),
    description: applyLexicon(lesson.description, lex),
    outcomes: lesson.outcomes.map((o) => applyLexicon(o, lex)),
    blocks: lesson.blocks.map((b) => ({
      heading: applyLexicon(b.heading, lex),
      body: applyLexicon(b.body, lex),
    })),
    promptTemplate: applyLexicon(lesson.promptTemplate, lex),
    workplaceChecklist: lesson.workplaceChecklist.map((x) => applyLexicon(x, lex)),
    practiceTask: applyLexicon(lesson.practiceTask, lex),
    miniTest: lesson.miniTest?.map((q) => ({
      ...q,
      question: applyLexicon(q.question, lex),
      options: q.options.map((o) => applyLexicon(o, lex)),
      explain: applyLexicon(q.explain, lex),
    })),
  };
}

function applyLexToPlan(plan: PaidPlan, lex: LexiconEntry[]): PaidPlan {
  return {
    ...plan,
    description: applyLexicon(plan.description, lex),
    includes: plan.includes.map((i) => applyLexicon(i, lex)),
  };
}

export function forkPaidCourse(base: PaidCourse, opts: { plansLex: LexiconEntry[]; certificate: CertificateTest; lessonLex: LexiconEntry[] }): PaidCourse {
  const lessons = allocateLessonVideos(
    base.lessons.map(stripVideoFields).map((l) => applyLexiconToLesson(l, opts.lessonLex)),
  );
  return {
    plans: {
      graduate: applyLexToPlan(base.plans.graduate, opts.plansLex),
      masters: applyLexToPlan(base.plans.masters, opts.plansLex),
    },
    certificate: opts.certificate,
    lessons,
  };
}

export const LEX_INSURANCE_PLANS: LexiconEntry[] = [];

export const LEX_CONSTRUCTION_PLANS: LexiconEntry[] = [
  { pattern: /claims intake work/gi, replacement: "construction estimating and trades admin work" },
  { pattern: /claims work/gi, replacement: "construction office work" },
  { pattern: /FNOL notes and customer messages/gi, replacement: "RFIs, submittals, and client emails" },
  { pattern: /claims tasks/gi, replacement: "project admin tasks" },
];

export const LEX_CONSTRUCTION_LESSONS: LexiconEntry[] = [
  { pattern: /insurance claims/gi, replacement: "construction projects" },
  { pattern: /\bFNOL\b/gi, replacement: "site intake" },
  { pattern: /\bclaim(s)?\b/gi, replacement: "project" },
  { pattern: /coverage/gi, replacement: "contract scope (human-confirmed)" },
  { pattern: /adjuster/gi, replacement: "project lead" },
  { pattern: /customer/gi, replacement: "client" },
  { pattern: /peril/gi, replacement: "risk type" },
  { pattern: /CAT-like/gi, replacement: "Peak workload" },
  { pattern: /SIU/gi, replacement: "specialist review" },
];

export const LEX_CLINICAL_PLANS: LexiconEntry[] = [
  { pattern: /claims intake work/gi, replacement: "clinical-adjacent admin workflows" },
  { pattern: /claims work/gi, replacement: "clinical-adjacent admin work" },
  { pattern: /FNOL notes and customer messages/gi, replacement: "scheduling, documentation support, and patient-facing templates" },
];

export const LEX_CLINICAL_LESSONS: LexiconEntry[] = [
  { pattern: /insurance claims/gi, replacement: "clinical-adjacent operations (non-clinical)" },
  { pattern: /\bFNOL\b/gi, replacement: "intake documentation" },
  { pattern: /\bclaim(s)?\b/gi, replacement: "case" },
  { pattern: /coverage/gi, replacement: "policy or billing rules (human-confirmed)" },
  { pattern: /customer/gi, replacement: "patient or family" },
  { pattern: /Claims-specific empathy/gi, replacement: "Empathy without clinical overreach" },
];

export const LEX_ACCOUNTING_PLANS: LexiconEntry[] = [
  { pattern: /claims intake work/gi, replacement: "accounting and bookkeeping practice workflows" },
  { pattern: /claims work/gi, replacement: "client accounting work" },
  { pattern: /FNOL notes and customer messages/gi, replacement: "reconciliations, month-end packs, and client emails" },
];

export const LEX_ACCOUNTING_LESSONS: LexiconEntry[] = [
  { pattern: /insurance claims/gi, replacement: "accounting practice" },
  { pattern: /\bFNOL\b/gi, replacement: "client intake" },
  { pattern: /\bclaim(s)?\b/gi, replacement: "client matter" },
  { pattern: /coverage/gi, replacement: "tax or legal positions (human-confirmed)" },
  { pattern: /customer/gi, replacement: "client" },
];
