/** Free assistants learners can use alongside lessons (names only — no endorsement). */
export const FREE_AI_ASSISTANTS = [
  "Google Gemini",
  "ChatGPT",
  "Microsoft Copilot",
  "Claude",
  "Grok",
  "Meta AI",
] as const;

export const AI_PRACTICE_SHORT =
  "Keep an AI chat open in another tab or window while you study. These courses are designed for hands-on practice, not passive reading only.";

export const AI_PRACTICE_TOOLS_LINE = `Free options include ${FREE_AI_ASSISTANTS.slice(0, -1).join(", ")}, and ${FREE_AI_ASSISTANTS[FREE_AI_ASSISTANTS.length - 1]}. Use whatever your workplace allows; never paste real customer, patient, or client secrets unless your organisation approves that tool.`;

export const AI_PRACTICE_WORKFLOW_STEPS = [
  "Open this lesson and your chosen AI assistant side by side.",
  "Copy the prompt template from the lesson (edit the bracketed parts for your sample scenario).",
  "Run the prompt on fake or redacted notes only — not live production data unless policy allows.",
  "Compare the output to the workplace checklist and fix anything that guesses, over-promises, or skips unknowns.",
] as const;

/** True when this lesson is a good fit for a guided “try it in AI now” block. */
export function lessonSupportsHandsOnAi(lesson: { promptTemplate?: string; practiceTask?: string }): boolean {
  return Boolean(lesson.promptTemplate?.trim() && lesson.practiceTask?.trim());
}
