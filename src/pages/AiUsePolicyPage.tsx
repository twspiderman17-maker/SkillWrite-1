import { LegalPageLayout } from "../components/LegalPageLayout";
import { LegalSection } from "./legal/LegalSection";

export function AiUsePolicyPage() {
  return (
    <LegalPageLayout title="AI Use Policy" updated="May 15, 2026">
      <LegalSection title="Purpose">
        <p>
          This policy describes how SkillWrite expects learners to use AI tools alongside course materials — mirroring
          what responsible employers require in production workflows.
        </p>
      </LegalSection>
      <LegalSection title="Human review is mandatory">
        <p>
          Every lesson includes a review checkpoint. AI output is provisional until a qualified person verifies facts,
          dates, amounts, identifiers, and tone against authoritative sources.
        </p>
      </LegalSection>
      <LegalSection title="Do not guess regulated facts">
        <p>
          Prompts must instruct the model not to invent coverage decisions, diagnoses, tax positions, or structural
          engineering conclusions. If information is missing, the output must say so.
        </p>
      </LegalSection>
      <LegalSection title="Data minimization">
        <p>
          Redact names, policy numbers, MRNs, and account identifiers unless your organization has approved a specific
          tool for that data class. Prefer synthetic or sample data in practice tasks.
        </p>
      </LegalSection>
      <LegalSection title="Tool choice">
        <p>
          You may use any major assistant (ChatGPT, Gemini, Copilot, Claude, Grok, etc.) for practice. Your employer may
          restrict which tools are allowed on work devices — their rules override course suggestions.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
