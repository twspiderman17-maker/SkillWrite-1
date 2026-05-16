import { Link } from "react-router-dom";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { LegalSection } from "./legal/LegalSection";

export function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="May 15, 2026">
      <LegalSection title="Agreement">
        <p>
          By using SkillWrite you agree to these terms. The site is provided as a demonstration learning product. It does
          not provide legal, medical, insurance, or financial advice.
        </p>
      </LegalSection>
      <LegalSection title="Educational purpose only">
        <p>
          Courses teach how to draft and review AI-assisted work. You remain responsible for verifying every output before
          use with customers, patients, claimants, or regulators. Certificates demonstrate completion of our practical
          test, not professional licensure.
        </p>
      </LegalSection>
      <LegalSection title="Accounts and access">
        <p>
          You must provide accurate account information. Demo purchases unlock content in your browser only; they are not
          real payment transactions unless we explicitly enable live billing.
        </p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <ul className="list-disc space-y-2 pl-6">
          <li>Do not upload unlawful, harassing, or infringing content</li>
          <li>Do not attempt to bypass paywalls or scrape course materials at scale</li>
          <li>Follow your employer’s data-handling and AI policies at all times</li>
        </ul>
      </LegalSection>
      <LegalSection title="Team plans">
        <p>
          Team subscriptions are sold to organizations for multiple learners. The organization is responsible for seat
          assignment, compliance training records, and ensuring learners complete human-review steps. See{" "}
          <Link to="/teams" className="font-semibold text-blue-600 hover:text-blue-700">
            Team plans
          </Link>{" "}
          and{" "}
          <Link to="/pricing" className="font-semibold text-blue-600 hover:text-blue-700">
            Pricing
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, SkillWrite is not liable for decisions made using AI outputs, loss of
          data stored locally in your browser, or indirect damages arising from use of the demo platform.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update these terms. Continued use after changes constitutes acceptance. Material changes will be noted on
          this page with an updated date.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
