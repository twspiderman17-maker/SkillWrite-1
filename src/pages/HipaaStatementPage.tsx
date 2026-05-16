import { LegalPageLayout } from "../components/LegalPageLayout";
import { LegalSection } from "./legal/LegalSection";

export function HipaaStatementPage() {
  return (
    <LegalPageLayout title="HIPAA Statement" updated="May 15, 2026">
      <LegalSection title="Scope">
        <p>
          The Clinical Operations (admin) track discusses scheduling, operations communication, and documentation habits.
          It is not clinical decision support and does not teach diagnosis or treatment.
        </p>
      </LegalSection>
      <LegalSection title="Not a Business Associate agreement">
        <p>
          SkillWrite in demo form does not store PHI on our servers. We do not offer a signed BAA in this demonstration
          build. Covered entities must evaluate their own BAAs with any AI vendor they use in production.
        </p>
      </LegalSection>
      <LegalSection title="Training intent">
        <p>
          Lessons teach HIPAA-aware habits: minimum necessary disclosure in prompts, redaction, and escalation when AI
          output might touch PHI. Learners must follow their facility’s policies and approved tools.
        </p>
      </LegalSection>
      <LegalSection title="Prohibited practice examples">
        <ul className="list-disc space-y-2 pl-6">
          <li>Pasting full medical records into unapproved consumer chatbots</li>
          <li>Using AI output as a substitute for licensed clinical judgment</li>
          <li>Sharing patient-identifiable drafts in unsecured channels</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
