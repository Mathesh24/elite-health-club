import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { CONTACT_INFO, LEGAL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Elite Health Club",
  description: "How membership cancellations and refunds work at Elite Health Club.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      lastUpdated={LEGAL_INFO.policiesLastUpdated}
    >
      <p>
        We want every member to be confident in their decision. This policy
        explains when a membership fee paid on our website can be refunded.
      </p>

      <LegalSection heading="7-day cancellation window">
        <p>
          You may cancel your membership within <strong>7 days</strong> of
          payment for a full refund, provided the membership has not yet been
          activated and no club facilities or member benefits have been used.
        </p>
      </LegalSection>

      <LegalSection heading="After activation or 7 days">
        <p>
          Once your membership has been activated, or 7 days have passed since
          payment, the membership fee is non-refundable. Memberships are
          personal and cannot be transferred to another person.
        </p>
      </LegalSection>

      <LegalSection heading="Failed, duplicate or unconfirmed payments">
        <ul>
          <li>
            If money was debited but the payment failed, it is reversed
            automatically by the payment provider, usually within 5–7 working
            days.
          </li>
          <li>
            If you were charged more than once for the same membership, the
            duplicate payment is refunded in full.
          </li>
          <li>
            If we are unable to activate your membership for any reason on our
            side, you will receive a full refund.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How to request a refund">
        <p>
          Email {CONTACT_INFO.email} or call {CONTACT_INFO.phone} with your
          name, the payment reference (starting with EHC-) and payment ID from
          your confirmation email.
        </p>
      </LegalSection>

      <LegalSection heading="Refund timelines">
        <p>
          Approved refunds are processed within 5–7 working days to the original
          payment method (UPI, card or bank account). Your bank may take a few
          additional days to reflect the amount.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
