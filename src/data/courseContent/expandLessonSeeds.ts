import type { CourseLesson, Program } from "../../types";

export type LessonSeed = {
  id: string;
  program: Program;
  week: number;
  title: string;
  focus: string;
  scenario: string;
  deliverable: string;
};

export type ExpandDomain = {
  courseLabel: string;
  workflowNoun: string;
  safetyRules: string;
  reviewerRole: string;
  escalationCue: string;
};

export const DOMAIN_INSURANCE: ExpandDomain = {
  courseLabel: "insurance claims and FNOL work",
  workflowNoun: "an insurance claims intake workflow",
  safetyRules:
    "Do not decide coverage, do not promise outcomes, do not invent missing facts, and mark unknown information clearly.",
  reviewerRole: "a senior claims handler",
  escalationCue: "possible fraud indicators or coverage complexity (without deciding either)",
};

export const DOMAIN_CONSTRUCTION: ExpandDomain = {
  courseLabel: "construction estimating, trades admin, and project correspondence",
  workflowNoun: "construction office workflows (estimating, RFIs, submittals, and client updates)",
  safetyRules:
    "Do not invent measurements, quantities, code compliance, or contractual commitments. Mark unknowns clearly and keep engineering sign-off with qualified staff.",
  reviewerRole: "a project lead or estimator",
  escalationCue: "possible scope gaps, safety issues, or contract risk (without making engineering or legal conclusions)",
};

export const DOMAIN_CLINICAL: ExpandDomain = {
  courseLabel: "clinical-adjacent admin (scheduling, documentation, coordination — not diagnosis)",
  workflowNoun: "clinical-adjacent admin workflows (documentation support, patient communications templates, coordination notes)",
  safetyRules:
    "Do not diagnose, treat, triage clinically, or give medical advice. Do not invent patient facts. Mark unknowns clearly and follow privacy rules (PHI/PII minimisation).",
  reviewerRole: "a clinician or compliance reviewer per local policy",
  escalationCue: "possible safety or compliance concerns (without diagnosing or deciding care)",
};

export const DOMAIN_ACCOUNTING: ExpandDomain = {
  courseLabel: "accounting and bookkeeping practice support (not tax/legal advice)",
  workflowNoun: "accounting practice workflows (client requests, reconciliations, month-end checklists, draft communications)",
  safetyRules:
    "Do not provide tax, legal, or audit opinions. Do not invent numbers or transactions. Mark unknowns clearly and keep professional judgement with qualified accountants.",
  reviewerRole: "a qualified accountant or reviewer per firm policy",
  escalationCue: "possible control weaknesses, fraud indicators, or regulatory sensitivity (without concluding)",
};

/** Shared expanded lesson seeds (39) — text is specialised via `ExpandDomain`. */
export const SHARED_EXPAND_SEEDS: LessonSeed[] = [
  {
    id: "g1-prompt-anatomy",
    program: "graduate",
    week: 1,
    title: "Prompt anatomy for operational work",
    focus: "turning vague requests into specific instructions",
    scenario: "a new team member needs a repeatable way to ask for summaries without adding facts",
    deliverable: "a four-part prompt with role, task, limits, and output format",
  },
  {
    id: "g1-fact-vs-assumption",
    program: "graduate",
    week: 1,
    title: "Facts, assumptions, and unknowns",
    focus: "separating what is confirmed from what needs follow-up",
    scenario: "notes mention key dates and parties, but several details are unclear or incomplete",
    deliverable: "a confirmed facts table and unknowns list",
  },
  {
    id: "g2-note-redaction",
    program: "graduate",
    week: 2,
    title: "Redacting notes before using tools",
    focus: "removing unnecessary sensitive data before prompting",
    scenario: "a teammate wants to clean up a working note that includes identifiers that should not leave approved systems",
    deliverable: "a redacted working note and safety checklist",
  },
  {
    id: "g2-follow-up-questions",
    program: "graduate",
    week: 2,
    title: "Better follow-up questions",
    focus: "turning missing information into clear questions",
    scenario: "the working note is too vague for the next person to act on quickly",
    deliverable: "a prioritised follow-up question list",
  },
  {
    id: "g3-safe-customer-update",
    program: "graduate",
    week: 3,
    title: "Safe external update drafts",
    focus: "writing helpful messages without promising outcomes you cannot control",
    scenario: "a client or customer asks what happens next after submitting information",
    deliverable: "a short external update with safe wording",
  },
  {
    id: "g3-internal-handover",
    program: "graduate",
    week: 3,
    title: "Internal handover notes",
    focus: "creating short, useful notes for the next team member",
    scenario: "front-line staff need to hand work to a specialist or owner with minimal rework",
    deliverable: "a concise internal handover note",
  },
  {
    id: "g4-review-checklist",
    program: "graduate",
    week: 4,
    title: "Review checklist before use",
    focus: "checking AI output before it enters the workflow",
    scenario: "an AI-generated summary looks polished but may contain unsupported details",
    deliverable: "a review checklist with corrections",
  },
  {
    id: "g4-practical-submission",
    program: "graduate",
    week: 4,
    title: "Graduate practical submission",
    focus: "combining summaries, follow-up questions, external drafts, and review",
    scenario: "a complete sample case needs to be prepared for handover",
    deliverable: "a complete workflow support pack",
  },
  {
    id: "m1-output-control",
    program: "masters",
    week: 1,
    title: "Output control and formatting",
    focus: "making AI produce consistent tables, bullets, and handover formats",
    scenario: "a team wants every summary to look the same for faster QA",
    deliverable: "a reusable output format guide",
  },
  {
    id: "m1-example-based-prompts",
    program: "masters",
    week: 1,
    title: "Example-based prompting",
    focus: "using approved examples to improve consistency",
    scenario: "the team has one excellent exemplar and wants future drafts to match it",
    deliverable: "an example-led prompt template",
  },
  {
    id: "m2-error-taxonomy",
    program: "masters",
    week: 2,
    title: "Common error taxonomy",
    focus: "spotting repeated AI mistakes and naming them clearly",
    scenario: "reviews keep finding guessed dates, overconfident tone, and missing unknowns",
    deliverable: "a team error taxonomy",
  },
  {
    id: "m2-correction-loops",
    program: "masters",
    week: 2,
    title: "Correction loops",
    focus: "turning review comments into better future prompts",
    scenario: "a manager wants each QA review to improve the next draft",
    deliverable: "a correction loop template",
  },
  {
    id: "m3-data-minimisation",
    program: "masters",
    week: 3,
    title: "Data minimisation for workflows",
    focus: "using the least sensitive data needed for the task",
    scenario: "a task can be completed without full identifiers if you structure the prompt well",
    deliverable: "a minimum-data prompt workflow",
  },
  {
    id: "m3-approved-tool-rules",
    program: "masters",
    week: 3,
    title: "Approved tool rules",
    focus: "deciding which tasks can use which tools",
    scenario: "staff use different tools and need clear rules for sensitive information",
    deliverable: "a tool-use decision checklist",
  },
  {
    id: "m4-template-governance",
    program: "masters",
    week: 4,
    title: "Template governance",
    focus: "keeping shared prompts accurate and up to date",
    scenario: "a prompt library becomes confusing after several people edit it",
    deliverable: "a template ownership and versioning plan",
  },
  {
    id: "m4-template-testing",
    program: "masters",
    week: 4,
    title: "Template testing",
    focus: "testing prompts against realistic cases before team rollout",
    scenario: "a new prompt needs to be checked against easy and difficult real notes",
    deliverable: "a prompt test plan",
  },
  {
    id: "m5-quality-sampling",
    program: "masters",
    week: 5,
    title: "Quality sampling",
    focus: "reviewing a sample of AI-assisted outputs without slowing the whole team",
    scenario: "a manager needs weekly visibility into output quality",
    deliverable: "a weekly QA sampling plan",
  },
  {
    id: "m5-coaching-feedback",
    program: "masters",
    week: 5,
    title: "Coaching feedback",
    focus: "giving feedback that improves prompt and review behaviour",
    scenario: "staff need guidance when their AI drafts keep making similar mistakes",
    deliverable: "a coaching feedback note",
  },
  {
    id: "m6-tone-variants",
    program: "masters",
    week: 6,
    title: "Tone variants for external messages",
    focus: "creating safe message versions for different situations",
    scenario: "recipients may be anxious, frustrated, or simply asking for next steps",
    deliverable: "three safe tone variants",
  },
  {
    id: "m6-policy-safe-language",
    program: "masters",
    week: 6,
    title: "Policy-safe language habits",
    focus: "removing wording that implies commitments your organisation cannot support",
    scenario: "a draft message is friendly but accidentally overpromises",
    deliverable: "a safer rewritten message",
  },
  {
    id: "m7-human-review-gates",
    program: "masters",
    week: 7,
    title: "Human review gates",
    focus: "placing approval points in the workflow",
    scenario: "a workflow drafts summaries and messages but must not send anything automatically",
    deliverable: "a review-gate map",
  },
  {
    id: "m7-escalation-triggers",
    program: "masters",
    week: 7,
    title: "Escalation triggers",
    focus: "identifying when work should move to a specialist or manager",
    scenario: "some notes contain unusual facts, missing evidence, or elevated stakeholder emotion",
    deliverable: "an escalation trigger checklist",
  },
  {
    id: "m8-workflow-documentation",
    program: "masters",
    week: 8,
    title: "Workflow documentation",
    focus: "documenting an AI-assisted process clearly enough for a teammate",
    scenario: "a team needs a written process for repeatable support packs",
    deliverable: "a one-page workflow SOP",
  },
  {
    id: "m8-scenario-testing",
    program: "masters",
    week: 8,
    title: "Scenario testing",
    focus: "checking workflow performance on simple, messy, and edge-case notes",
    scenario: "a prompt works on clean notes but fails on messy calls",
    deliverable: "a scenario testing table",
  },
  {
    id: "m9-queue-prioritisation",
    program: "masters",
    week: 9,
    title: "Queue prioritisation support",
    focus: "using safe labels to help teams review work faster",
    scenario: "many notes arrive at once and need simple human-readable labels",
    deliverable: "a safe priority label set",
  },
  {
    id: "m9-volume-metrics",
    program: "masters",
    week: 9,
    title: "Volume metrics",
    focus: "measuring speed and quality without encouraging unsafe shortcuts",
    scenario: "a manager wants to show whether AI-assisted workflows are helping",
    deliverable: "a lightweight KPI dashboard outline",
  },
  {
    id: "m10-neutral-language",
    program: "masters",
    week: 10,
    title: "Neutral risk language",
    focus: "flagging concerns without accusations",
    scenario: "an internal note contains wording that sounds judgemental",
    deliverable: "a neutral rewritten escalation note",
  },
  {
    id: "m10-evidence-linked-notes",
    program: "masters",
    week: 10,
    title: "Evidence-linked notes",
    focus: "linking internal observations to source notes",
    scenario: "a reviewer needs to see why an issue was flagged",
    deliverable: "an evidence-linked review note",
  },
  {
    id: "m11-rollout-training",
    program: "masters",
    week: 11,
    title: "Rollout training plan",
    focus: "training staff to use a workflow consistently",
    scenario: "a team lead wants to introduce one AI-assisted workflow across the team",
    deliverable: "a short staff training plan",
  },
  {
    id: "m11-change-management",
    program: "masters",
    week: 11,
    title: "Change management for teams",
    focus: "introducing AI workflows without confusing or overwhelming staff",
    scenario: "some team members are excited while others are worried about mistakes",
    deliverable: "a rollout communication plan",
  },
  {
    id: "m12-final-rubric-review",
    program: "masters",
    week: 12,
    title: "Final rubric review",
    focus: "checking a submission against certificate criteria",
    scenario: "a learner has a complete workflow but needs to confirm it meets the rubric",
    deliverable: "a final rubric self-check",
  },
  {
    id: "m12-portfolio-polish",
    program: "masters",
    week: 12,
    title: "Portfolio polish",
    focus: "presenting the final workflow clearly as proof of practical skill",
    scenario: "a learner wants their final project to look credible to a manager",
    deliverable: "a polished final workflow summary",
  },
];

export function expandLessonSeeds(seeds: LessonSeed[], domain: ExpandDomain): CourseLesson[] {
  return seeds.map((seed) => ({
    id: seed.id,
    program: seed.program,
    week: seed.week,
    title: seed.title,
    description: `A practical lesson on ${seed.focus} for ${domain.courseLabel}.`,
    durationMinutes: seed.program === "graduate" ? 62 : 78,
    outcomes: [
      `Explain why ${seed.focus} matters in ${domain.courseLabel} and how it affects downstream teams.`,
      `Apply a safe AI workflow to ${seed.scenario} with explicit human review gates.`,
      `Produce ${seed.deliverable} that can be checked by ${domain.reviewerRole} in under five minutes.`,
      `Document one risk you avoided (for example guessing, over-promising, or data oversharing) and how your prompt prevented it.`,
    ],
    blocks: [
      {
        heading: "Why this matters",
        body: `This lesson focuses on ${seed.focus}. In ${domain.courseLabel}, speed only helps if the result is accurate, reviewable, and safe to use. The goal is not to make AI sound impressive; the goal is to make work clearer, faster to review, and less likely to hide uncertainty. Poor handoffs create rework, frustrate customers or clients, and increase the chance that important facts are discovered too late.`,
      },
      {
        heading: "Workplace scenario",
        body: `Scenario: ${seed.scenario}. You will practise turning this situation into a structured workflow with a clear prompt, safe limits, and a review step. The output should make the next human action easier, not replace the person responsible for the decision. Assume your organisation may log prompts and outputs for quality assurance, so write prompts you would be comfortable defending in a coaching conversation.`,
      },
      {
        heading: "Common mistakes",
        body: "The biggest mistakes are asking for too much at once, letting the tool guess missing facts, and skipping the review step because the draft looks polished. A better approach is to use a narrow prompt, mark unknowns clearly, and check names, dates, amounts, commitments, tone, and next actions before anything is used. Another common failure is mixing internal and external language — always generate them as separate outputs when both are needed.",
      },
      {
        heading: "Operational handrails you should standardise",
        body: `Strong teams standardise a few non-negotiables: what must never appear in external drafts, what must always be labelled unknown, what must be verified against the authoritative record, and what must be escalated. AI does not create these rules — it follows them when you encode them in the prompt and checklist. If your workplace already has phrasing guidance, treat it as a constraint in the prompt.`,
      },
      {
        heading: "Professional nuance: tone, precision, and neutrality",
        body: `Work communication often sits between empathy and neutrality. You want clarity without sounding cold, and you want progress updates without implying a decision has been made. When using AI, explicitly request neutral, factual phrasing for internal notes and a separate tone target for external drafts. Always include a final human pass for regulated wording and local policy.`,
      },
      {
        heading: "Stretch goal: make it repeatable for the team",
        body: "After you complete the practice task, write a one-page mini SOP: inputs, prompt skeleton, output format, review checklist, and escalation triggers. Even a rough version is valuable — it is the difference between a personal trick and a team capability.",
      },
    ],
    promptTemplate: `You are supporting ${domain.workflowNoun}. Use only the information provided. Task: help with ${seed.focus}. Scenario: ${seed.scenario}. Output: ${seed.deliverable}. Safety rules: ${domain.safetyRules}`,
    workplaceChecklist: [
      "The task is narrow and clearly described.",
      "The prompt encodes the safety rules in plain language.",
      "The output separates confirmed details from unknowns.",
      "A human review step is included before use.",
      "The final deliverable is short, practical, and useful for the next worker.",
    ],
    practiceTask: `Part A — Create ${seed.deliverable} for this scenario: ${seed.scenario}. Part B — List five specific review checks ${domain.reviewerRole} would perform. Part C — Write one escalation sentence you would add if the facts suggest ${domain.escalationCue}. Part D — Open a free AI assistant (for example Gemini, ChatGPT, Copilot, Claude, or Grok) in another tab, paste the lesson prompt template with redacted sample notes, run it once, and note what you would change before using anything in real work.`,
  }));
}
