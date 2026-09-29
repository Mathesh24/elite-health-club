import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { CONTACT_INFO, LEGAL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — Elite Health Club",
  description: "How Elite Health Club collects and uses your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={LEGAL_INFO.policiesLastUpdated}>
      <p>
        This policy explains what personal information {LEGAL_INFO.legalName}{" "}
        collects through this website and how we use it.
      </p>

      <LegalSection heading="What we collect">
        <ul>
          <li>
            Contact details you give us — name, email address and phone number —
            when you send an enquiry or purchase a membership.
          </li>
          <li>
            Payment information such as the amount, payment reference, payment
            method type and status. Card, UPI and bank credentials are entered
            directly with our payment provider, Zoho Payments, and are never
            seen or stored by us.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use it">
        <ul>
          <li>To respond to enquiries and arrange tours.</li>
          <li>To process membership payments, issue invoices and onboard members.</li>
          <li>To send service messages about your membership.</li>
          <li>To meet legal, tax and accounting obligations.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="Who we share it with">
        <p>
          We share only what is needed with service providers that help us run
          the club: Zoho Payments (payment processing), Google Workspace (email
          and record keeping) and our website host, Netlify. We may also
          disclose information where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p>
          Enquiry details are kept for up to 2 years. Membership and payment
          records are kept for the duration of your membership and as long as
          required by tax and accounting law.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can ask us to access, correct or delete your personal information
          by writing to {CONTACT_INFO.email}. Some records must be kept to meet
          legal obligations.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
