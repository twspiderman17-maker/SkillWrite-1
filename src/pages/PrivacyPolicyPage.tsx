import { Link } from "react-router-dom";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { LegalSection } from "./legal/LegalSection";

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="May 15, 2026">
      <LegalSection title="Overview">
        <p>
          SkillWrite (“we”, “us”) operates a demo learning platform that teaches job-specific AI workflows. This policy
          explains what information we handle in the demo and what would apply if we moved to production billing.
        </p>
      </LegalSection>
      <LegalSection title="Information we collect (demo)">
        <p>
          In the current demo, account details (name, email) and learning progress are stored locally in your browser
          via localStorage. We do not operate a production database for personal data in this demo build.
        </p>
      </LegalSection>
      <LegalSection title="How we use information">
        <p>We use account and progress data only to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Remember your sign-in state on this device</li>
          <li>Track lesson unlocks, quiz scores, and certificate progress</li>
          <li>Simulate team plan activation for demonstration</li>
        </ul>
      </LegalSection>
      <LegalSection title="AI tools you use alongside lessons">
        <p>
          Lessons encourage you to practise with third-party AI assistants (e.g. ChatGPT, Gemini, Copilot). Those
          services have their own privacy policies. Do not paste confidential customer, patient, or claim data unless your
          employer approves the tool and process.
        </p>
      </LegalSection>
      <LegalSection title="Cookies and storage">
        <p>
          The demo uses browser storage rather than tracking cookies. Clearing site data will remove your progress and
          purchases in this browser.
        </p>
      </LegalSection>
      <LegalSection title="Your choices">
        <p>
          You may sign out, clear browser storage, or stop using the site at any time. For a production launch we would
          add export and deletion requests as required by applicable law.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Questions:{" "}
          <a href="mailto:privacy@skillwrite.example" className="font-semibold text-blue-600 hover:text-blue-700">
            privacy@skillwrite.example
          </a>
          . See also our <Link to="/terms" className="font-semibold text-blue-600 hover:text-blue-700">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
