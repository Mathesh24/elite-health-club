import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { LEGAL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions — Elite Health Club",
  description: "Terms that apply to Elite Health Club memberships and this website.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lastUpdated={LEGAL_INFO.policiesLastUpdated}
    >
      <p>
        These terms apply when you use this website or purchase a membership
        from {LEGAL_INFO.legalName} (&ldquo;the Club&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;). By completing a payment you agree to them.
      </p>

      <LegalSection heading="Memberships">
        <ul>
          <li>
            Individual Membership covers one person. Executive Family Membership
            covers a family of four: two adults and two children.
          </li>
          <li>
            Memberships run for five (5) years from the date of activation.
          </li>
          <li>
            Memberships are personal and non-transferable. Members may be asked
            to show valid photo identification.
          </li>
          <li>
            Benefits are as described on our website at the time of purchase.
            Facility access, operating hours and availability may vary and are
            subject to club rules.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Prices and payment">
        <ul>
          <li>
            Prices are in Indian Rupees and include 18% GST. A GST invoice is
            issued for every membership purchase.
          </li>
          <li>
            Payments are processed securely by Zoho Payments. We do not see or
            store your card, UPI or bank credentials.
          </li>
          <li>
            A membership is confirmed only after the payment has been verified.
            You will receive a confirmation email with your payment reference.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Activation">
        <p>
          After payment our team will contact you to complete onboarding, which
          may include identity verification, member photographs and signing the
          club&rsquo;s membership form.
        </p>
      </LegalSection>

      <LegalSection heading="Cancellations and refunds">
        <p>
          Cancellations and refunds are governed by our{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/refund-policy/`}
            className="text-brand underline"
          >
            Refund &amp; Cancellation Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Conduct">
        <p>
          Members and guests must follow club rules and staff instructions. The
          Club may suspend or terminate a membership, without refund, for
          serious or repeated breaches of club rules, unsafe behaviour or
          misuse of facilities.
        </p>
      </LegalSection>

      <LegalSection heading="Health and liability">
        <p>
          Members use fitness, pool, sauna and steam facilities at their own
          risk and should consult a doctor before starting any exercise
          programme. To the extent permitted by law, the Club is not liable for
          injury, loss or damage except where caused by its negligence.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and governing law">
        <p>
          We may update these terms from time to time; the version in force on
          the date of your payment applies to your purchase. These terms are
          governed by the laws of India, and the courts at{" "}
          {LEGAL_INFO.jurisdiction} have jurisdiction.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
