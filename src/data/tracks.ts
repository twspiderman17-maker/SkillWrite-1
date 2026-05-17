import type { CourseLesson, PaidCourse, Track } from "../types";
import { DOMAIN_INSURANCE, expandLessonSeeds, SHARED_EXPAND_SEEDS } from "./courseContent/expandLessonSeeds";
import { allocateLessonVideos } from "./courseContent/videoAllocation";
import { stripVideoFields } from "./courseContent/stripVideoFields";
import { buildForkedPaidCourses } from "./courseContent/forkedTrackCourses";

const sharedBasicsWeek1: Track["graduate"]["weeks"][0] = {
  week: 1,
  title: "AI basics for work",
  bullets: [
    "What AI can and cannot do",
    "How to write a clear prompt",
    "How to check answers before using them at work",
    "How to protect private or sensitive information",
  ],
};

function buildExpandedInsuranceLessons(): CourseLesson[] {
  return expandLessonSeeds(SHARED_EXPAND_SEEDS, DOMAIN_INSURANCE);
}

const INSURANCE_COURSE: PaidCourse = {
  plans: {
    graduate: {
      program: "graduate",
      name: "Graduate",
      priceUsd: 15,
      durationLabel: "1 month",
      description: "A focused course for learning the basics and applying them to claims intake work.",
      includes: [
        "4 weeks of practical lessons",
        "Prompt templates for FNOL notes and customer messages",
        "Mini practice tasks and review checklists",
        "Revision lab with quiz, flashcards, and study game",
      ],
    },
    masters: {
      program: "masters",
      name: "Masters",
      priceUsd: 45,
      durationLabel: "3 months",
      description: "A deeper course for building reusable workflows and safer team habits.",
      includes: [
        "12 weeks of lessons and projects",
        "Advanced prompts for summaries, handovers, and reviews",
        "Team templates, quality checks, and privacy workflows",
        "All Graduate lessons included",
      ],
    },
  },
  certificate: {
    priceUsd: 5,
    title: "Insurance Claims Practical Certificate",
    description:
      "A practical final test where you use AI to organise a sample claim intake and show your review process.",
    tasks: [
      "Create a clear FNOL summary from messy notes.",
      "List missing information without guessing facts.",
      "Draft a safe customer update.",
      "Explain which parts need human review before use.",
    ],
    rubric: [
      { label: "Clear prompt", passCriteria: "The prompt gives context, task, limits, and output format." },
      { label: "Safe output", passCriteria: "The answer uses only supplied facts and flags missing details." },
      { label: "Human review", passCriteria: "The submission includes checks before customer or claim use." },
      { label: "Job fit", passCriteria: "The result would be useful to a claims handler or FNOL team." },
    ],
  },
  lessons: allocateLessonVideos(([
    {
      id: "g1-ai-basics-for-claims",
      program: "graduate",
      week: 1,
      title: "AI basics for claims work",
      description: "Learn what AI can help with, where it can fail, and how to write safe instructions.",
      youtubeVideoId: "zjkBMFhNj_g",
      youtubeVideoTitle: "[1hr Talk] Intro to Large Language Models",
      youtubeChannel: "Andrej Karpathy",
      durationMinutes: 58,
      outcomes: [
        "Explain three useful ways AI can support claims work.",
        "Write a clear prompt with context, task, limits, and output format.",
        "Spot when AI is guessing or adding unsupported facts.",
        "Describe one failure mode you would watch for in a live FNOL queue.",
      ],
      blocks: [
        {
          heading: "What AI is useful for",
          body:
            "In claims work, AI is best used as a drafting and organising assistant. It can turn rough notes into clearer summaries, create follow-up checklists, and help draft polite messages. It should not decide coverage, approve payments, or invent missing information.",
        },
        {
          heading: "The safe prompt structure",
          body:
            "Use a simple structure: role, context, task, limits, and format. The limits matter most. Tell the tool not to guess, not to add legal or coverage decisions, and to mark unknown information clearly.",
        },
        {
          heading: "Claims reality: why ‘almost right’ is still wrong",
          body:
            "A summary that is 90% correct can still be unusable if the 10% error is a date, a party name, or a loss location. That is why professional workflows treat AI output as provisional text until a human verifies critical fields against the authoritative record. Your job is to make verification fast, not to skip it because the draft reads well.",
        },
        {
          heading: "Where teams get value in the first 30 days",
          body:
            "Teams usually see the fastest wins in three places: turning messy call notes into structured summaries, generating consistent follow-up questions, and producing first drafts of internal handovers. Customer-facing drafts can come later, once review habits exist. Build skill in the safer surfaces first.",
        },
      ],
      promptTemplate:
        "You are helping with claims intake admin. Use only the notes below. Do not guess missing facts or decide coverage. Task: [describe what you need]. Output as [summary/checklist/email]. Notes: [paste redacted notes].",
      workplaceChecklist: [
        "Remove or redact sensitive details unless your tool is approved for them.",
        "Tell the tool not to guess.",
        "Check every date, name, amount, and claim detail before use.",
        "Keep decisions with the human claims handler or adjuster.",
      ],
      practiceTask:
        "Write a safe prompt that asks AI to summarise a short claim call note and list missing information.",
    },
    {
      id: "g2-clean-claim-notes",
      program: "graduate",
      week: 2,
      title: "Clean up claim notes",
      description: "Turn messy claim notes into a readable summary and follow-up list.",
      youtubeVideoId: "MIcTnpyGQ5Q",
      youtubeVideoTitle: "Generative AI with Vertex AI: Prompt Design",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 62,
      outcomes: [
        "Convert rough notes into a structured claim summary.",
        "Separate confirmed facts from missing or unclear information.",
        "Create a follow-up checklist for the next person.",
        "Design a prompt that forces consistent section headings across handlers.",
      ],
      blocks: [
        {
          heading: "Separate facts from assumptions",
          body:
            "A good AI-assisted summary does not make the claim stronger or weaker. It simply organises what is already known. Use sections like confirmed facts, unclear details, missing information, and recommended follow-up.",
        },
        {
          heading: "Use a predictable format",
          body:
            "Claims teams need fast handovers. Ask for the same format each time so another person can scan the output quickly. Tables are useful for missing information because they make follow-up ownership clear.",
        },
        {
          heading: "Formatting discipline beats clever wording",
          body:
            "Most intake problems are not ‘writing problems’ — they are information architecture problems. When every handler uses a different structure, supervisors cannot spot missing fields quickly. Prompt for stable headings, stable tables, and stable labels for unknowns so QA can scan files consistently.",
        },
        {
          heading: "Pair the summary with a ‘next action owner’ table",
          body:
            "Follow-up questions are more useful when each item has an owner: customer, FNOL agent, field adjuster, vendor, or unknown. Ask the model to propose owners as suggestions only, and require your team to confirm owners before sending tasks out. This reduces dropped handoffs during busy periods.",
        },
      ],
      promptTemplate:
        "Turn these claim intake notes into: 1) short summary, 2) confirmed facts, 3) unclear or missing details, 4) follow-up questions. Use only the notes. If a detail is missing, write 'Unknown'. Notes: [notes].",
      workplaceChecklist: [
        "No new facts were added.",
        "Unknown information is labelled clearly.",
        "The summary is short enough for a handover.",
        "The follow-up questions are specific and useful.",
      ],
      practiceTask:
        "Use the template on a sample FNOL note and produce a summary plus five follow-up questions.",
    },
    {
      id: "g3-customer-and-team-messages",
      program: "graduate",
      week: 3,
      title: "Customer and team messages",
      description: "Draft polite customer updates and internal handovers without making promises.",
      youtubeVideoId: "BB7oznnz3lQ",
      youtubeVideoTitle: "Plain Language — Writing for the Web",
      youtubeChannel: "DigitalGov (US government)",
      durationMinutes: 64,
      outcomes: [
        "Draft a customer update that is clear and calm.",
        "Avoid wording that promises coverage or outcomes.",
        "Create a short internal handover note for the claims team.",
        "Apply plain-language techniques so customers can act on the message the first time they read it.",
      ],
      blocks: [
        {
          heading: "Customer messages need careful wording",
          body:
            "AI can help make messages clearer and more empathetic, but it must not promise an outcome. Keep language practical: what has been received, what happens next, and what information is still needed.",
        },
        {
          heading: "Internal handovers are different",
          body:
            "Internal notes can be more direct. They should highlight risk, missing details, and next actions. Keep opinions separate from facts so the next person knows what is confirmed.",
        },
        {
          heading: "Plain language is a risk control, not ‘dumbing down’",
          body:
            "Plain language reduces misunderstandings that create repeat contacts, complaints, and rework. Ask AI to remove jargon, shorten sentences, and put the next step near the top — but you must still verify that any numbers, dates, and names match the source record.",
        },
        {
          heading: "Two-draft rule for customer-facing text",
          body:
            "First draft: clarity and structure. Second draft: policy-safe phrasing and removal of implied promises. Never send the first customer draft straight from the model. Even strong outputs benefit from a human pass focused on obligations, timelines, and anything that could be read as a decision.",
        },
      ],
      promptTemplate:
        "Draft a polite customer update based only on these notes. Do not promise coverage, payment, or outcome. Include: what we received, what happens next, and what information is needed. Notes: [notes].",
      workplaceChecklist: [
        "No settlement, coverage, or liability promise is included.",
        "The customer knows the next step.",
        "The tone is calm and respectful.",
        "Internal notes are not accidentally included in the customer message.",
      ],
      practiceTask:
        "Create one customer email and one internal handover note from the same claim scenario.",
    },
    {
      id: "g4-final-project-prep",
      program: "graduate",
      week: 4,
      title: "Final project preparation",
      description: "Combine the full workflow: prompt, summary, follow-up list, message, and review.",
      youtubeVideoId: "ZFKvTIADp0k",
      youtubeVideoTitle: "Tuning Your AI Model to Reduce Hallucinations",
      youtubeChannel: "IBM Technology",
      durationMinutes: 68,
      outcomes: [
        "Build a simple end-to-end AI workflow for claim intake.",
        "Use a review checklist before relying on the output.",
        "Prepare for the certificate final test.",
        "Iterate prompts using repeated error patterns from your own sample outputs.",
      ],
      blocks: [
        {
          heading: "The complete workflow",
          body:
            "The Graduate workflow has five parts: prepare safe notes, write a prompt, create a structured summary, draft a message, then review everything before use. The review step is not optional.",
        },
        {
          heading: "What good looks like",
          body:
            "A good submission is useful, short, and honest about uncertainty. It does not sound impressive by adding detail. It is strong because it makes the claims handler's next step easier.",
        },
        {
          heading: "End-to-end rehearsal: timebox each step",
          body:
            "In a real queue, you will not have unlimited time. Rehearse the workflow with timers: redaction and prompt setup, model draft, verification pass, customer draft, internal note. If a step consistently runs long, simplify the output format before you try to ‘prompt harder’.",
        },
        {
          heading: "Create a ‘known failure’ list for your team",
          body:
            "Before the certificate, collect five failure patterns you personally saw (for example invented timestamps, softened unknowns, or accidental promises). Turn each pattern into a single prompt rule and a single checklist item. That list is often worth more than a longer prompt.",
        },
      ],
      promptTemplate:
        "Create a complete claim intake support pack from these redacted notes. Include: summary, confirmed facts, missing information, follow-up questions, customer update draft, and review checklist. Use only the notes.",
      workplaceChecklist: [
        "All outputs are based on supplied notes.",
        "Missing details are clearly marked.",
        "Customer wording is safe.",
        "The review checklist is completed before use.",
      ],
      practiceTask:
        "Complete a full claim intake support pack from a sample scenario and compare it to the checklist.",
    },
    {
      id: "m1-better-claim-prompts",
      program: "masters",
      week: 1,
      title: "Better prompts for claim workflows",
      description: "Move from one-off prompts to reliable prompt patterns for repeated claims tasks.",
      youtubeVideoId: "Mw8JDKV0Wxg",
      youtubeVideoTitle: "Google AI Studio in 22 Minutes",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 66,
      outcomes: [
        "Create reusable prompt blocks for role, limits, and output format.",
        "Use examples to improve consistency.",
        "Control tone and structure without overcomplicating prompts.",
        "Explain how you would version a template when regulatory wording changes.",
      ],
      blocks: [
        {
          heading: "Reusable prompt blocks",
          body:
            "Masters-level use means building repeatable prompts, not starting from scratch every time. Use blocks such as 'do not decide coverage', 'mark unknowns', and 'output in this table' across multiple tasks.",
        },
        {
          heading: "Examples improve consistency",
          body:
            "If your team has an approved style, include a short example. AI follows examples well, especially for handovers, customer updates, and follow-up tables.",
        },
        {
          heading: "Treat prompts like code: small diffs, clear versions",
          body:
            "When a template changes, record what changed and why. Teams fail when ‘the prompt in the chat’ diverges from the prompt in the wiki. Keep a version note at the top: owner, last updated date, and what risk it mitigates.",
        },
        {
          heading: "Measure consistency, not cleverness",
          body:
            "A good template library produces outputs that look like they came from the same team. Pick three scoring dimensions: section completeness, unknown labelling, and safe customer phrasing — then review ten outputs weekly until scores stabilise.",
        },
      ],
      promptTemplate:
        "Use this approved style example: [example]. Now apply the same style to these notes. Keep the same sections and safety limits. Notes: [notes].",
      workplaceChecklist: [
        "Prompt has reusable safety limits.",
        "Output format is specific.",
        "Example is approved and not sensitive.",
        "Result is consistent with team style.",
      ],
      practiceTask:
        "Create a reusable prompt template for your team’s claim summary format.",
    },
    {
      id: "m2-source-and-review-discipline",
      program: "masters",
      week: 2,
      title: "Source and review discipline",
      description: "Learn a strict review method for AI outputs in claims work.",
      youtubeVideoId: "cfqtFvWOfg0",
      youtubeVideoTitle: "Why Large Language Models Hallucinate",
      youtubeChannel: "IBM Technology",
      durationMinutes: 68,
      outcomes: [
        "Create a fact-checking pass for AI summaries.",
        "Identify unsupported statements.",
        "Use review comments to improve the next prompt.",
        "Explain why hallucination risk matters even when the output sounds fluent.",
      ],
      blocks: [
        {
          heading: "Review by category",
          body:
            "Review names, dates, locations, policy references, damage descriptions, and next actions separately. This is faster than rereading the output as one long paragraph.",
        },
        {
          heading: "Turn errors into prompt improvements",
          body:
            "Every recurring error should become a prompt rule. If AI keeps adding unsupported dates, add: 'If no date is provided, write Unknown.'",
        },
        {
          heading: "Add a ‘claim against source’ pass",
          body:
            "For each paragraph of the model output, ask: which sentence maps to which sentence in the notes? If you cannot point to a source line, treat the sentence as suspect. This single habit prevents a large class of silent fabrications.",
        },
        {
          heading: "Coach with patterns, not shame",
          body:
            "Review meetings go wrong when people feel judged. Use neutral language: ‘the model introduced a date’, not ‘you missed a date’. The goal is a system fix: prompt + checklist + example, not a single human scapegoat.",
        },
      ],
      promptTemplate:
        "Review this draft against the source notes. Return a table with: statement, supported by notes yes/no, issue, suggested correction. Draft: [draft]. Notes: [notes].",
      workplaceChecklist: [
        "Every important claim detail is checked.",
        "Unsupported claims are removed or marked unknown.",
        "Prompt rules are updated after repeated errors.",
        "Human reviewer signs off before use.",
      ],
      practiceTask:
        "Review an AI-generated claim summary and produce a correction table.",
    },
    {
      id: "m3-privacy-safe-workflows",
      program: "masters",
      week: 3,
      title: "Privacy-safe workflows",
      description: "Build a safer way to use AI with sensitive claim information.",
      youtubeVideoId: "OwEC-PEbG3o",
      youtubeVideoTitle: "Getting started with GDPR compliance: Introduction to the GDPR",
      youtubeChannel: "OneTrust",
      durationMinutes: 65,
      outcomes: [
        "Decide what information should be removed before prompting.",
        "Create a redaction checklist.",
        "Explain when a tool is not appropriate for sensitive data.",
        "Describe purpose limitation and data minimisation in plain language for a claims team.",
      ],
      blocks: [
        {
          heading: "Minimum necessary information",
          body:
            "Most drafting tasks do not need full customer identity. Use claim type, incident summary, and task context where possible. Keep names, addresses, and contact details out unless your tool is approved for them.",
        },
        {
          heading: "Redaction as a habit",
          body:
            "A privacy-safe workflow starts before the prompt. Create a redacted working note, then use that note for AI. Keep the original record inside approved systems.",
        },
        {
          heading: "Align with your organisation’s lawful basis and retention rules",
          body:
            "Training staff on ‘do not paste secrets’ is necessary but not sufficient. You also need clarity on what processing is allowed in which tool, what logs exist, and how long outputs are retained. If you cannot answer those questions, escalate before scaling usage.",
        },
        {
          heading: "Vendor and model change management",
          body:
            "Providers change models and features frequently. A workflow that was acceptable last quarter may not be equivalent today. Build a lightweight review trigger: new model version, new integration, new data field, or new jurisdiction — any of these should prompt a privacy re-check.",
        },
      ],
      promptTemplate:
        "Using this redacted claim note, create [output]. Do not request or infer personal identifiers. If the task requires private details, write 'Needs approved system review.' Note: [redacted note].",
      workplaceChecklist: [
        "Personal identifiers are removed where possible.",
        "Only approved tools are used for sensitive data.",
        "The original claim record stays in the correct system.",
        "The output does not reveal unnecessary private details.",
      ],
      practiceTask:
        "Redact a sample claim note, then run the AI workflow on the redacted version only.",
    },
    {
      id: "m4-team-template-library",
      program: "masters",
      week: 4,
      title: "Team template library",
      description: "Create shared prompts and review steps for consistent claims work.",
      youtubeVideoId: "FSGkKHbveWA",
      youtubeVideoTitle: "Accelerating generative AI with Vertex AI Studio",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 70,
      outcomes: [
        "Design a small template library for claims tasks.",
        "Version prompts when rules change.",
        "Make templates easy for teammates to use.",
        "Define acceptance tests a template must pass before it is promoted to ‘team standard’.",
      ],
      blocks: [
        {
          heading: "Templates need owners",
          body:
            "A shared prompt library should have clear owners. Someone must update templates when company wording, systems, or review rules change.",
        },
        {
          heading: "Keep templates short",
          body:
            "Long prompts are harder to trust and maintain. Use short, tested templates with clear names: FNOL summary, customer update, missing-info table, internal handover.",
        },
        {
          heading: "Library structure that scales",
          body:
            "Organise templates by trigger (FNOL phone, FNOL web, supplemental info request) and by output artefact. Each entry should link to example inputs, forbidden phrases, and the review checklist. Avoid a single mega-prompt that tries to do everything.",
        },
        {
          heading: "Sunset bad templates aggressively",
          body:
            "Old templates linger and confuse people. If a template is deprecated, mark it clearly and remove it from default menus. Teams trust libraries when they are obviously maintained.",
        },
      ],
      promptTemplate:
        "Template name: [task]. Purpose: [why this exists]. Inputs needed: [inputs]. Safety rules: [rules]. Output format: [format]. Review owner: [role].",
      workplaceChecklist: [
        "Each template has a clear use case.",
        "Each template has safety rules.",
        "Each template has a review owner.",
        "Old versions are not mixed with new versions.",
      ],
      practiceTask:
        "Create a four-template library for a claims intake team.",
    },
    {
      id: "m5-manager-quality-score",
      program: "masters",
      week: 5,
      title: "Manager quality score",
      description: "Create a simple scorecard for reviewing AI-assisted claims work.",
      youtubeVideoId: "cfqtFvWOfg0",
      youtubeVideoTitle: "Why Large Language Models Hallucinate",
      youtubeChannel: "IBM Technology",
      durationMinutes: 63,
      outcomes: [
        "Score outputs for accuracy, clarity, safety, and usefulness.",
        "Give feedback that improves team behaviour.",
        "Track common AI mistakes over time.",
        "Run a weekly sampling plan that does not overwhelm reviewers.",
      ],
      blocks: [
        {
          heading: "Score what matters",
          body:
            "A useful scorecard should be short. Measure: uses only supplied facts, flags missing details, uses safe wording, and helps the next person act.",
        },
        {
          heading: "Feedback should be teachable",
          body:
            "Do not just mark an output wrong. Explain the prompt or review habit that would prevent the same issue next time.",
        },
        {
          heading: "Sampling strategy for managers",
          body:
            "You cannot review 100% of AI-assisted work forever. Start with stratified sampling: new hires, complex peril types, high customer emotion signals, and random spot checks. Publish the sampling rate so the team experiences QA as fair, not punitive.",
        },
        {
          heading: "Turn score trends into template updates",
          body:
            "If scores dip after a model change, freeze the template and run a targeted test batch. Managers add value when they connect metrics to concrete prompt edits — not when they only collect numbers.",
        },
      ],
      promptTemplate:
        "Score this AI-assisted claims output from 1-5 on accuracy, clarity, safety, and usefulness. Explain each score and suggest one prompt improvement. Output: [output]. Source: [notes].",
      workplaceChecklist: [
        "Scorecard is short enough to use weekly.",
        "Feedback includes prompt improvements.",
        "Repeated errors are tracked.",
        "Scores are used for coaching, not blind automation.",
      ],
      practiceTask:
        "Score three sample outputs and write one improvement rule for each.",
    },
    {
      id: "m6-advanced-customer-comms",
      program: "masters",
      week: 6,
      title: "Advanced customer communication",
      description: "Use AI to draft clearer messages while keeping tone and risk under control.",
      youtubeVideoId: "u5ZeUFI5VVY",
      youtubeVideoTitle: "Justice without Jargon: Plain Language Writing",
      youtubeChannel: "Illinois Legal Aid Online",
      durationMinutes: 67,
      outcomes: [
        "Control tone for stressful customer situations.",
        "Remove risky promises from drafts.",
        "Create message variants for different customer needs.",
        "Rewrite jargon-heavy drafts into plain language without losing required disclosures.",
      ],
      blocks: [
        {
          heading: "Tone is part of safety",
          body:
            "Customers may be stressed, angry, or confused. AI can help soften wording, but it must not overpromise. The best messages are calm, specific, and honest about next steps.",
        },
        {
          heading: "Draft variants carefully",
          body:
            "Ask for short, medium, and detailed versions of the same message. Choose the version that fits the customer and company policy.",
        },
        {
          heading: "Claims-specific empathy without legal overreach",
          body:
            "Empathy statements should acknowledge stress without implying fault, coverage, or outcome. Teach the model a safe empathy ‘menu’ your organisation accepts, and ban phrases that historically caused complaints in your channel.",
        },
        {
          heading: "Accessibility and reading level",
          body:
            "Many customers read on a phone, at night, after an incident. Shorter sentences and clearer next steps reduce repeat calls. Use AI to simplify, then verify that required disclosures remain accurate and complete.",
        },
      ],
      promptTemplate:
        "Create three versions of this customer update: short, standard, and detailed. Keep tone calm. Do not promise coverage, payment, timeline, or outcome. Notes: [notes].",
      workplaceChecklist: [
        "No outcome is promised.",
        "The customer knows the next step.",
        "Tone is calm and respectful.",
        "Message matches approved wording.",
      ],
      practiceTask:
        "Create three customer message variants and choose the safest version.",
    },
    {
      id: "m7-workflow-automation-boundaries",
      program: "masters",
      week: 7,
      title: "Workflow automation boundaries",
      description: "Learn what can be automated safely and what must stay manual.",
      youtubeVideoId: "ZFKvTIADp0k",
      youtubeVideoTitle: "Tuning Your AI Model to Reduce Hallucinations",
      youtubeChannel: "IBM Technology",
      durationMinutes: 65,
      outcomes: [
        "Separate drafting support from decision automation.",
        "Create a safe automation boundary list.",
        "Identify tasks that require manual review.",
        "Document stop points where the workflow must pause for a human.",
      ],
      blocks: [
        {
          heading: "Assist, do not decide",
          body:
            "In this MVP, automation means helping prepare drafts, checklists, and summaries. It does not mean approving claims or sending messages without review.",
        },
        {
          heading: "Use stop points",
          body:
            "A stop point is a place where work must pause for a person. Examples: customer-facing message, coverage-sensitive wording, missing evidence, or suspected fraud indicators.",
        },
        {
          heading: "Defence in depth: prompts are not your only control",
          body:
            "Even perfect prompts cannot guarantee safe behaviour across model updates. Boundaries should also live in process: who can send, what systems record approvals, and what gets audited. AI sits inside that process — it does not replace it.",
        },
        {
          heading: "Escalation paths must be obvious",
          body:
            "When automation boundaries are unclear, staff either over-escalate (slow) or under-escalate (risky). Write escalation triggers in plain language and include examples of ‘borderline’ cases from your domain.",
        },
      ],
      promptTemplate:
        "Review this workflow and label each step as safe to draft, needs review, or must stay manual. Explain why. Workflow: [workflow].",
      workplaceChecklist: [
        "Customer-facing outputs have a review gate.",
        "Decision tasks remain manual.",
        "Missing information triggers follow-up.",
        "Risk signals trigger escalation.",
      ],
      practiceTask:
        "Map a claims intake workflow and mark each safe/unsafe automation point.",
    },
    {
      id: "m8-project-claim-intake-system",
      program: "masters",
      week: 8,
      title: "Project: claim intake system",
      description: "Build a complete AI-assisted intake workflow with prompts and review steps.",
      youtubeVideoId: "FSGkKHbveWA",
      youtubeVideoTitle: "Accelerating generative AI with Vertex AI Studio",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 78,
      outcomes: [
        "Combine templates, privacy checks, and quality review.",
        "Create a usable claims intake workflow document.",
        "Prepare for the certificate final test.",
        "Stress-test the workflow on an adversarial messy scenario and capture failure modes.",
      ],
      blocks: [
        {
          heading: "Build the workflow document",
          body:
            "Your workflow should describe the user, input notes, prompts, outputs, review checklist, and escalation points. Keep it simple enough that a teammate could follow it.",
        },
        {
          heading: "Test with a scenario",
          body:
            "A workflow is only useful if it works on a realistic example. Run it on a sample scenario and record what needed editing.",
        },
        {
          heading: "Design for exceptions, not only happy paths",
          body:
            "Most production pain comes from partial information, duplicate reports, third-party involvement, or customers who cannot describe the loss clearly. Add an ‘exception branch’ section to your workflow document with prompts that are even more conservative.",
        },
        {
          heading: "Operational metrics that matter",
          body:
            "Pick two metrics: time-to-first-usable-summary and defect rate on verified fields. Avoid vanity metrics like ‘number of prompts sent’. Good systems get faster while defects go down — or at least stay flat after a model change.",
        },
      ],
      promptTemplate:
        "Using this scenario, run the complete claim intake workflow: redaction check, summary, missing info table, customer draft, internal handover, and review checklist. Scenario: [scenario].",
      workplaceChecklist: [
        "Workflow has clear steps.",
        "Each prompt has safety rules.",
        "Review checklist catches likely mistakes.",
        "Final output is short and usable.",
      ],
      practiceTask:
        "Build and test one full claim intake workflow on a sample scenario.",
    },
    {
      id: "m9-high-volume-intake",
      program: "masters",
      week: 9,
      title: "High-volume intake workflow",
      description: "Design a workflow for busy periods where many claim notes need fast triage.",
      youtubeVideoId: "FSGkKHbveWA",
      youtubeVideoTitle: "Accelerating generative AI with Vertex AI Studio",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 72,
      outcomes: [
        "Prioritise claim notes without letting AI make decisions.",
        "Create triage labels for human review.",
        "Keep high-volume workflows safe and simple.",
        "Explain how triage labels connect to SLA and escalation without implying coverage outcomes.",
      ],
      blocks: [
        {
          heading: "Triage is not decision-making",
          body:
            "AI can help sort work into review buckets, but it should not decide claim outcomes. The goal is to help the team see what needs attention first.",
        },
        {
          heading: "Use simple labels",
          body:
            "Use labels like missing key details, customer update needed, urgent review, or ready for handler review. Avoid labels that imply coverage or liability decisions.",
        },
        {
          heading: "Throughput without a quality cliff",
          body:
            "High volume tempts teams to skip review. Counter that with micro-checks: a 60-second scan checklist for triage outputs, and full review only on high-impact paths. The design goal is predictable safety, not maximum speed.",
        },
        {
          heading: "Capacity planning for peak events",
          body:
            "CAT-like events break workflows that work on a normal Tuesday. Document how triage rules change when volume spikes: which steps batch, which steps still require named reviewers, and how to communicate delays to customers safely.",
        },
      ],
      promptTemplate:
        "Review these redacted intake notes and assign safe triage labels only: missing details, customer update needed, urgent review, ready for handler review. Do not decide coverage or liability. Notes: [notes].",
      workplaceChecklist: [
        "Labels do not decide claim outcomes.",
        "Urgent items are escalated to a person.",
        "Missing information is clearly flagged.",
        "The workflow remains easy for a team to follow.",
      ],
      practiceTask:
        "Create safe triage labels for five short sample claim notes.",
    },
    {
      id: "m10-escalation-and-risk-language",
      program: "masters",
      week: 10,
      title: "Escalation and risk language",
      description: "Write safer internal notes when claim information may need special review.",
      youtubeVideoId: "u5ZeUFI5VVY",
      youtubeVideoTitle: "Justice without Jargon: Plain Language Writing",
      youtubeChannel: "Illinois Legal Aid Online",
      durationMinutes: 74,
      outcomes: [
        "Flag risk without making accusations.",
        "Create clear escalation notes for human review.",
        "Separate observed facts from interpretation.",
        "Use neutral phrasing that helps investigators without prejudging outcomes.",
      ],
      blocks: [
        {
          heading: "Use neutral language",
          body:
            "When something looks unusual, internal notes should stay factual and neutral. AI can help remove emotional wording and focus on the details that need review.",
        },
        {
          heading: "Escalation notes need evidence",
          body:
            "A good escalation note says what was observed, where it appears in the notes, and what should be checked next. It does not accuse the customer or jump to conclusions.",
        },
        {
          heading: "Avoid ‘storytelling’ in internal systems",
          body:
            "Narrative summaries can accidentally embed theories. Prefer bullet facts with timestamps and references to attachments. If you use AI to draft, require it to cite the note line or snippet each fact came from.",
        },
        {
          heading: "Align escalation language with investigation policy",
          body:
            "Different organisations use different thresholds for SIU referral or specialist review. Your note should trigger the next human step without pre-labeling intent. When in doubt, escalate with questions, not conclusions.",
        },
      ],
      promptTemplate:
        "Create a neutral internal escalation note from these claim notes. Separate observed facts from questions for review. Do not accuse anyone or make conclusions. Notes: [notes].",
      workplaceChecklist: [
        "Wording is neutral and factual.",
        "Observed facts are separated from questions.",
        "No accusation or conclusion is made.",
        "Next review step is clear.",
      ],
      practiceTask:
        "Rewrite a risky internal note into neutral escalation language.",
    },
    {
      id: "m11-team-rollout-plan",
      program: "masters",
      week: 11,
      title: "Team rollout plan",
      description: "Plan how a small claims team should introduce AI workflows safely.",
      youtubeVideoId: "Mw8JDKV0Wxg",
      youtubeVideoTitle: "Google AI Studio in 22 Minutes",
      youtubeChannel: "Google Cloud Tech",
      durationMinutes: 75,
      outcomes: [
        "Create a rollout plan for one AI-assisted workflow.",
        "Define who can use each template.",
        "Set review rules and feedback loops.",
        "Anticipate resistance points and design training that addresses them directly.",
      ],
      blocks: [
        {
          heading: "Start with one workflow",
          body:
            "Do not launch AI across every claims task at once. Start with a narrow workflow, such as FNOL summaries, and measure whether it saves time without increasing errors.",
        },
        {
          heading: "Write team rules",
          body:
            "The rollout plan should explain allowed tools, allowed data, review requirements, template ownership, and how to report problems.",
        },
        {
          heading: "Pilot design: who, how long, what success means",
          body:
            "A strong pilot names participants, duration, baseline metrics, and stop conditions. If defects rise beyond an agreed threshold, the pilot pauses until prompts and training are updated — that is responsible change management.",
        },
        {
          heading: "Comms plan for staff and customers",
          body:
            "Staff need clarity on what changed in their job, not hype about AI. Customers need clarity if anything changes in how their data is processed. Keep communications factual and aligned with legal/comms review where required.",
        },
      ],
      promptTemplate:
        "Create a rollout plan for this AI-assisted claims workflow. Include: purpose, allowed users, allowed data, review rules, template owner, success metric, and escalation path. Workflow: [workflow].",
      workplaceChecklist: [
        "Rollout starts with one task.",
        "Allowed tools and data are clear.",
        "Review rules are written down.",
        "Success is measured with a simple metric.",
      ],
      practiceTask:
        "Draft a one-page rollout plan for an FNOL summary workflow.",
    },
    {
      id: "m12-certificate-final-prep",
      program: "masters",
      week: 12,
      title: "Certificate final preparation",
      description: "Prepare your final test workflow and practise explaining your review decisions.",
      youtubeVideoId: "zjkBMFhNj_g",
      youtubeVideoTitle: "[1hr Talk] Intro to Large Language Models",
      youtubeChannel: "Andrej Karpathy",
      durationMinutes: 76,
      outcomes: [
        "Prepare a final workflow submission.",
        "Explain prompt choices and safety checks.",
        "Use the certificate rubric before submitting.",
        "Articulate limitations of LLMs in your own words as they apply to claims intake.",
      ],
      blocks: [
        {
          heading: "Show your thinking",
          body:
            "The final test is not only about the output. It also checks whether you understand why the prompt is safe, what you reviewed, and where a human must make the final decision.",
        },
        {
          heading: "Use the rubric before submitting",
          body:
            "Before the final test, compare your work against the rubric: clear prompt, safe output, human review, and job-specific usefulness.",
        },
        {
          heading: "Prepare your ‘examiner voice’ explanation",
          body:
            "Practice explaining your workflow as if to a regulator or internal auditor in five minutes: inputs, tools, data minimisation, review gates, logging, and known limitations. If you can explain it cleanly, your written submission will be stronger.",
        },
        {
          heading: "Final polish checklist",
          body:
            "Confirm: redaction rules followed, unknowns visible, no customer promises, internal and external drafts separated, escalation triggers present, and a peer could reproduce your steps using your document alone.",
        },
      ],
      promptTemplate:
        "Review my final workflow against this rubric: clear prompt, safe output, human review, job-specific usefulness. Give concise improvement notes before submission. Workflow: [workflow].",
      workplaceChecklist: [
        "Prompt explains task and limits.",
        "Output uses only supplied facts.",
        "Human review points are clear.",
        "Submission matches the claims workflow.",
      ],
      practiceTask:
        "Run a final self-review and improve one weak part before opening the certificate test.",
    },
    ...buildExpandedInsuranceLessons(),
  ] as CourseLesson[]).map(stripVideoFields)),
};

const { construction: CONSTRUCTION_COURSE, clinical: CLINICAL_COURSE, accounting: ACCOUNTING_COURSE } =
  buildForkedPaidCourses(INSURANCE_COURSE);

export const TRACKS: Track[] = [
  {
    slug: "insurance-fnol",
    title: "AI for Insurance Claims & FNOL",
    shortTitle: "Insurance",
    tagline: "Learn how to use AI to organise claim notes, draft first responses, and prepare cleaner handovers.",
    audience: "Claims handlers, FNOL teams, call centre staff, and team leads",
    disclaimer:
      "Training only. Do not use AI to invent facts, make coverage decisions, or replace company policy. A human must check all claim work.",
    course: INSURANCE_COURSE,
    graduate: {
      durationWeeks: 4,
      summary:
        "Start with AI basics, then learn simple ways to use AI in claim intake, customer messages, and team handovers.",
      weeks: [
        sharedBasicsWeek1,
        {
          week: 2,
          title: "Use AI with claim notes",
          bullets: [
            "Turn messy notes into a clear summary",
            "Find missing information that needs follow-up",
            "Create a safe checklist for the next person",
          ],
        },
        {
          week: 3,
          title: "Use AI for customer and team messages",
          bullets: [
            "Draft polite updates for customers",
            "Create short internal handover notes",
            "Check tone, facts, and missing details before sending",
          ],
        },
        {
          week: 4,
          title: "Final project",
          bullets: [
            "Use AI on a sample claim scenario",
            "Submit a claim summary, follow-up list, and safe message draft",
          ],
        },
      ],
      capstone:
        "Complete a sample claim intake task using AI: summary, missing information, customer draft, and human review checklist.",
    },
    masters: {
      durationWeeks: 12,
      summary:
        "Go deeper into quality checks, privacy, team workflows, templates, and practical projects for insurance teams.",
      extraThemes: [
        "How to build reusable prompt templates",
        "How managers can review AI-assisted work",
        "How to use AI safely when information is incomplete",
      ],
      weeks: [
        sharedBasicsWeek1,
        { week: 2, title: "Better prompts for claim work", bullets: ["Use examples", "Ask for tables", "Control tone"] },
        { week: 3, title: "Summaries and handovers", bullets: ["Short summaries", "Missing details", "Next actions"] },
        { week: 4, title: "Customer message practice", bullets: ["Plain language", "Empathy", "Safe wording"] },
        { week: 5, title: "Privacy and data rules", bullets: ["What not to paste", "Redacting details", "Tool settings"] },
        { week: 6, title: "Fact checking", bullets: ["Spot made-up answers", "Use source notes", "Ask for uncertainty"] },
        { week: 7, title: "Team templates", bullets: ["Shared prompts", "Review steps", "Version control"] },
        { week: 8, title: "Speed up repeat tasks", bullets: ["Email drafts", "Checklists", "Simple automations"] },
        { week: 9, title: "Manager review", bullets: ["Quality scoring", "Feedback loops", "Common errors"] },
        { week: 10, title: "Project 1", bullets: ["Claim intake workflow", "Message drafts", "Review notes"] },
        { week: 11, title: "Project 2", bullets: ["Team handover workflow", "Privacy check", "Final edits"] },
        { week: 12, title: "Certificate test", bullets: ["Timed task", "Explain your checks", "Improve weak answers"] },
      ],
      capstone:
        "Build a small AI workflow for an insurance team, including prompts, review steps, and a completed sample task.",
    },
    quizzes: [
      {
        id: "if1",
        question: "What should you do if claim information is missing?",
        options: ["Let AI guess it", "Mark it as missing and ask for follow-up", "Copy a past claim", "Ignore it"],
        correctIndex: 1,
        explain: "AI should not guess facts. Missing information should be clearly flagged.",
      },
      {
        id: "if2",
        question: "What is a good use of AI in FNOL work?",
        options: ["Deciding coverage", "Making up dates", "Summarising provided notes", "Approving payments"],
        correctIndex: 2,
        explain: "AI can help organise and summarise notes, but humans still make decisions.",
      },
      {
        id: "if3",
        question: "Before sending an AI-drafted customer message, you should…",
        options: ["Send it immediately", "Check facts, tone, and company rules", "Remove all context", "Ask AI to guarantee the outcome"],
        correctIndex: 1,
        explain: "AI drafts are starting points. They need human review before use.",
      },
      {
        id: "if4",
        question: "Private customer details should be…",
        options: ["Shared freely", "Protected and only used when allowed", "Posted online", "Stored in random tools"],
        correctIndex: 1,
        explain: "Sensitive data must be handled carefully and according to company rules.",
      },
    ],
    flashcards: [
      { id: "if-f1", front: "FNOL", back: "First Notice of Loss: the first report of a claim." },
      { id: "if-f2", front: "Prompt", back: "The instruction you give to an AI tool." },
      { id: "if-f3", front: "Human review", back: "A person checks the AI output before it is used." },
      { id: "if-f4", front: "Missing information", back: "Facts that must be checked instead of guessed." },
      { id: "if-f5", front: "Safe summary", back: "A summary based only on the information provided." },
      { id: "if-f6", front: "Sensitive data", back: "Private information that must be protected." },
    ],
    matchPairs: [
      { id: "if-m1", term: "Prompt", definition: "Instruction sent to AI" },
      { id: "if-m2", term: "Review", definition: "Check before using output" },
      { id: "if-m3", term: "Summary", definition: "Short version of provided notes" },
      { id: "if-m4", term: "Missing info", definition: "Something to follow up on" },
    ],
  },
  {
    slug: "construction-estimating",
    title: "AI for Construction & Trades",
    shortTitle: "Construction",
    tagline: "Learn how to use AI to speed up admin, draft clearer messages, and organise project information.",
    audience: "Estimators, project coordinators, trade businesses, and site admin teams",
    disclaimer:
      "Training only. AI must not replace site checks, engineering sign-off, pricing judgement, or legal contract review.",
    course: CONSTRUCTION_COURSE,
    graduate: {
      durationWeeks: 4,
      summary:
        "Start with AI basics, then learn how to use AI for job admin, project notes, quote support, and simple checklists.",
      weeks: [
        sharedBasicsWeek1,
        {
          week: 2,
          title: "Use AI for project notes",
          bullets: [
            "Clean up rough notes from calls or site visits",
            "Create action lists and follow-up questions",
            "Summarise documents without changing the meaning",
          ],
        },
        {
          week: 3,
          title: "Use AI for quotes, RFIs, and emails",
          bullets: [
            "Draft professional emails to clients and contractors",
            "Create a checklist before sending a quote",
            "Ask AI to find gaps in the information you have",
          ],
        },
        {
          week: 4,
          title: "Final project",
          bullets: [
            "Use AI on a sample construction admin task",
            "Submit a project summary, question list, and email draft",
          ],
        },
      ],
      capstone:
        "Complete a sample project admin workflow using AI: notes summary, questions, draft email, and review checklist.",
    },
    masters: {
      durationWeeks: 12,
      summary:
        "Go deeper into prompt templates, document checking, team use, project admin, and safe AI limits in construction.",
      extraThemes: [
        "How to build prompts for repeat project admin tasks",
        "How to check AI answers against source documents",
        "How teams can use AI without replacing expert judgement",
      ],
      weeks: [
        sharedBasicsWeek1,
        { week: 2, title: "Prompting with project context", bullets: ["Give clear inputs", "Set output format", "Ask for questions"] },
        { week: 3, title: "Admin notes and actions", bullets: ["Meeting notes", "Site notes", "Action lists"] },
        { week: 4, title: "Client and contractor emails", bullets: ["Clear wording", "Tone control", "Follow-up drafts"] },
        { week: 5, title: "Quote support", bullets: ["Scope checklists", "Missing details", "Assumption lists"] },
        { week: 6, title: "Document checking", bullets: ["Compare notes", "Find conflicts", "Flag unknowns"] },
        { week: 7, title: "RFI support", bullets: ["Question drafts", "Clear context", "Review before sending"] },
        { week: 8, title: "Team templates", bullets: ["Shared prompts", "Standard formats", "Review steps"] },
        { week: 9, title: "Simple automation ideas", bullets: ["Email templates", "Form outputs", "Task lists"] },
        { week: 10, title: "Project 1", bullets: ["Quote support workflow", "Checklist", "Email draft"] },
        { week: 11, title: "Project 2", bullets: ["Document review workflow", "Questions", "Summary"] },
        { week: 12, title: "Certificate test", bullets: ["Timed practical", "Explain your checks", "Improve weak points"] },
      ],
      capstone:
        "Build a safe AI workflow for one construction admin task, with prompts, checks, and a completed example.",
    },
    quizzes: [
      {
        id: "ce1",
        question: "What is AI best used for in this course?",
        options: ["Replacing site checks", "Helping organise notes and draft admin work", "Approving engineering work", "Guessing quantities"],
        correctIndex: 1,
        explain: "AI can support admin and communication, but expert checks still matter.",
      },
      {
        id: "ce2",
        question: "If details are missing from a project brief, AI should…",
        options: ["Make up the details", "Flag questions to ask", "Ignore the issue", "Change the client request"],
        correctIndex: 1,
        explain: "A useful AI workflow highlights missing details instead of guessing.",
      },
      {
        id: "ce3",
        question: "Before using an AI draft with a client, you should…",
        options: ["Check it against your real documents", "Send it without reading", "Remove all numbers", "Ask AI to sign it"],
        correctIndex: 0,
        explain: "Outputs need to match the real brief, files, and company standards.",
      },
      {
        id: "ce4",
        question: "AI should not replace…",
        options: ["Email drafting", "Checklist creation", "Professional judgement", "Note clean-up"],
        correctIndex: 2,
        explain: "AI supports the work; it does not replace trained judgement.",
      },
    ],
    flashcards: [
      { id: "ce-f1", front: "RFI", back: "A request for information when something needs clarification." },
      { id: "ce-f2", front: "Checklist", back: "A simple list used to avoid missing important steps." },
      { id: "ce-f3", front: "Scope", back: "What is included in the job." },
      { id: "ce-f4", front: "Assumption", back: "Something you are treating as true until confirmed." },
      { id: "ce-f5", front: "Source document", back: "The file or note your AI answer should be based on." },
      { id: "ce-f6", front: "Review step", back: "A check before a message or quote is used." },
    ],
    matchPairs: [
      { id: "ce-m1", term: "Scope", definition: "What the work includes" },
      { id: "ce-m2", term: "RFI", definition: "Question sent for clarification" },
      { id: "ce-m3", term: "Checklist", definition: "Steps to review before sending" },
      { id: "ce-m4", term: "Source", definition: "Document the answer is based on" },
    ],
  },
  {
    slug: "clinical-operations",
    title: "AI for Clinical Admin (Not Diagnosis)",
    shortTitle: "Clinical admin",
    tagline: "Learn how to use AI for safer admin support, clearer notes, and better patient communication drafts.",
    audience: "Clinic admin teams, practice managers, reception teams, and operations staff",
    disclaimer:
      "Not medical advice. Do not use AI to diagnose, choose treatment, or replace a clinician. Follow your workplace privacy rules.",
    course: CLINICAL_COURSE,
    graduate: {
      durationWeeks: 4,
      summary:
        "Start with AI basics and privacy, then learn how AI can help with admin notes, patient messages, and internal tasks.",
      weeks: [
        {
          ...sharedBasicsWeek1,
          title: "AI basics and patient privacy",
          bullets: [
            "What AI can do in admin work",
            "What AI must not do in healthcare",
            "How to protect patient information",
            "How to get human approval before using drafts",
          ],
        },
        {
          week: 2,
          title: "Use AI for admin notes",
          bullets: [
            "Summarise non-clinical notes",
            "Create task lists for the team",
            "Flag missing admin details for follow-up",
          ],
        },
        {
          week: 3,
          title: "Use AI for safe message drafts",
          bullets: [
            "Draft appointment and follow-up messages",
            "Use approved wording where needed",
            "Check that no medical advice was added",
          ],
        },
        {
          week: 4,
          title: "Final project",
          bullets: [
            "Use AI on a sample clinic admin task",
            "Submit a safe message, task list, and review checklist",
          ],
        },
      ],
      capstone:
        "Complete a sample clinic admin workflow using AI: summary, task list, message draft, and safety checklist.",
    },
    masters: {
      durationWeeks: 12,
      summary:
        "Go deeper into privacy, approved templates, team rules, quality checks, and safe AI use in clinic operations.",
      extraThemes: [
        "How to keep AI away from diagnosis and treatment decisions",
        "How to build approved admin templates",
        "How to review AI work safely before it is used",
      ],
      weeks: [
        { ...sharedBasicsWeek1, title: "AI basics and healthcare limits" },
        { week: 2, title: "Privacy basics", bullets: ["What not to paste", "Redacting details", "Tool settings"] },
        { week: 3, title: "Admin summaries", bullets: ["Clear notes", "Task lists", "Follow-up items"] },
        { week: 4, title: "Patient message drafts", bullets: ["Safe wording", "Tone", "Approval steps"] },
        { week: 5, title: "Internal team workflows", bullets: ["Handovers", "Scheduling notes", "Standard templates"] },
        { week: 6, title: "Checking AI output", bullets: ["Spot unsafe wording", "Check facts", "Remove advice"] },
        { week: 7, title: "Team rules", bullets: ["Who can use AI", "What data is allowed", "When to escalate"] },
        { week: 8, title: "Template library", bullets: ["Appointment messages", "FAQs", "Admin SOP drafts"] },
        { week: 9, title: "Simple automation ideas", bullets: ["Forms", "Email drafts", "Task lists"] },
        { week: 10, title: "Project 1", bullets: ["Message workflow", "Safety check", "Approval note"] },
        { week: 11, title: "Project 2", bullets: ["Admin notes workflow", "Task list", "Review"] },
        { week: 12, title: "Certificate test", bullets: ["Timed practical", "Safety explanation", "Corrections"] },
      ],
      capstone:
        "Build a safe AI workflow for a clinic admin task, including privacy rules, prompts, and review steps.",
    },
    quizzes: [
      {
        id: "co1",
        question: "Which use is not allowed in this course?",
        options: ["Drafting an appointment reminder", "Summarising admin notes", "Using AI to diagnose symptoms", "Creating a task list"],
        correctIndex: 2,
        explain: "AI must not diagnose or replace clinical judgement.",
      },
      {
        id: "co2",
        question: "Before using an AI-drafted patient message, you should…",
        options: ["Check it follows clinic rules", "Send it instantly", "Add medical advice", "Remove all review steps"],
        correctIndex: 0,
        explain: "Patient messages must be checked and approved according to policy.",
      },
      {
        id: "co3",
        question: "Patient information should be…",
        options: ["Protected", "Shared freely", "Copied into any app", "Posted online"],
        correctIndex: 0,
        explain: "Privacy is central when using AI in any healthcare setting.",
      },
      {
        id: "co4",
        question: "A safe AI workflow includes…",
        options: ["No human checks", "A review step before use", "Diagnosis by chatbot", "Unlimited data sharing"],
        correctIndex: 1,
        explain: "Human review is essential in sensitive work.",
      },
    ],
    flashcards: [
      { id: "co-f1", front: "Patient privacy", back: "Protecting patient information and only using it when allowed." },
      { id: "co-f2", front: "Clinical advice", back: "Medical guidance that must come from qualified staff." },
      { id: "co-f3", front: "Admin task", back: "Non-clinical work such as scheduling, notes, and messages." },
      { id: "co-f4", front: "Approval step", back: "A person checks the output before use." },
      { id: "co-f5", front: "Template", back: "A reusable safe format for common tasks." },
      { id: "co-f6", front: "Escalation", back: "Passing a problem to the right person." },
    ],
    matchPairs: [
      { id: "co-m1", term: "Privacy", definition: "Protect patient information" },
      { id: "co-m2", term: "Admin", definition: "Non-clinical work tasks" },
      { id: "co-m3", term: "Review", definition: "Check before use" },
      { id: "co-m4", term: "Template", definition: "Reusable safe format" },
    ],
  },
  {
    slug: "accounting-practices",
    title: "AI for Accounting & Bookkeeping",
    shortTitle: "Accounting",
    tagline: "Learn how to use AI for client emails, task checklists, simple explanations, and safer review habits.",
    audience: "Bookkeepers, junior accountants, admin staff, and small practice owners",
    disclaimer:
      "Training only. AI is not tax, legal, or accounting advice. A qualified person must review client-facing or filing-related work.",
    course: ACCOUNTING_COURSE,
    graduate: {
      durationWeeks: 4,
      summary:
        "Start with AI basics, then learn how to use AI for client communication, month-end admin, and review checklists.",
      weeks: [
        sharedBasicsWeek1,
        {
          week: 2,
          title: "Use AI for client messages",
          bullets: [
            "Draft polite requests for missing documents",
            "Explain simple next steps in plain language",
            "Avoid promises about tax or financial outcomes",
          ],
        },
        {
          week: 3,
          title: "Use AI for bookkeeping workflows",
          bullets: [
            "Create month-end task checklists",
            "Summarise provided numbers in simple language",
            "Flag items that need human review",
          ],
        },
        {
          week: 4,
          title: "Final project",
          bullets: [
            "Use AI on a sample client admin task",
            "Submit a client email, checklist, and review notes",
          ],
        },
      ],
      capstone:
        "Complete a sample bookkeeping workflow using AI: client email, month-end checklist, summary, and review checklist.",
    },
    masters: {
      durationWeeks: 12,
      summary:
        "Go deeper into firm templates, privacy, client communication, review checks, and safe AI use across a small practice.",
      extraThemes: [
        "How to write prompts for common firm tasks",
        "How to protect client data",
        "How to keep AI away from professional advice unless reviewed",
      ],
      weeks: [
        sharedBasicsWeek1,
        { week: 2, title: "Client email prompts", bullets: ["Document requests", "Tone", "Follow-up messages"] },
        { week: 3, title: "Task checklists", bullets: ["Month-end steps", "Review items", "Team handovers"] },
        { week: 4, title: "Plain-language summaries", bullets: ["Use provided numbers", "Explain simply", "Flag uncertainty"] },
        { week: 5, title: "Client data safety", bullets: ["What not to paste", "Redacting details", "Tool settings"] },
        { week: 6, title: "Review habits", bullets: ["Check numbers", "Check wording", "Remove promises"] },
        { week: 7, title: "Firm templates", bullets: ["Shared prompts", "Email formats", "Review notes"] },
        { week: 8, title: "Workflow improvement", bullets: ["Repeat tasks", "Simple automation", "Team adoption"] },
        { week: 9, title: "Quality control", bullets: ["Common errors", "Sample checks", "Feedback"] },
        { week: 10, title: "Project 1", bullets: ["Client email workflow", "Checklist", "Review"] },
        { week: 11, title: "Project 2", bullets: ["Month-end workflow", "Summary", "Corrections"] },
        { week: 12, title: "Certificate test", bullets: ["Timed practical", "Explain your checks", "Final submission"] },
      ],
      capstone:
        "Build a safe AI workflow for one accounting or bookkeeping task, with prompts, review rules, and example outputs.",
    },
    quizzes: [
      {
        id: "ap1",
        question: "AI should not be used to…",
        options: ["Draft a client email", "Create a checklist", "Give unchecked tax advice", "Summarise provided notes"],
        correctIndex: 2,
        explain: "Tax and accounting advice must be reviewed by a qualified person.",
      },
      {
        id: "ap2",
        question: "When using numbers in an AI output, they should come from…",
        options: ["The source file you provide", "AI guesses", "A random example", "Old memory"],
        correctIndex: 0,
        explain: "Numbers must come from the real source material and be checked.",
      },
      {
        id: "ap3",
        question: "A good client email draft should…",
        options: ["Promise results", "Be clear, polite, and reviewed", "Include private data unnecessarily", "Avoid next steps"],
        correctIndex: 1,
        explain: "Good drafts are clear and helpful, but still need review.",
      },
      {
        id: "ap4",
        question: "Client data should be…",
        options: ["Protected and used only when allowed", "Copied into every AI tool", "Shared in public prompts", "Ignored"],
        correctIndex: 0,
        explain: "Client data is sensitive and must be handled carefully.",
      },
    ],
    flashcards: [
      { id: "ap-f1", front: "Client data", back: "Private information that must be protected." },
      { id: "ap-f2", front: "Checklist", back: "A list of steps to complete and review." },
      { id: "ap-f3", front: "Source file", back: "The document or report used as evidence." },
      { id: "ap-f4", front: "Review", back: "Checking AI work before using it." },
      { id: "ap-f5", front: "Prompt", back: "The instruction you give to AI." },
      { id: "ap-f6", front: "Plain language", back: "Simple wording that clients can understand." },
    ],
    matchPairs: [
      { id: "ap-m1", term: "Client data", definition: "Private information" },
      { id: "ap-m2", term: "Checklist", definition: "Steps to complete" },
      { id: "ap-m3", term: "Source", definition: "Where the answer comes from" },
      { id: "ap-m4", term: "Review", definition: "Check before use" },
    ],
  },
];

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}
