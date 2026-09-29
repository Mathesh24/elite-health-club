import { getMembershipPlan, type MembershipPlan } from "../../src/lib/membership-plans";
import { getZohoConfig } from "./config";
import { recordPaymentEvent } from "./sheet";
import { getPayment, getPaymentSession, readMeta } from "./zoho";

export type ConfirmationResult =
  | { status: "paid"; plan: MembershipPlan; reference: string; paymentId: string }
  | { status: "pending" | "failed"; paymentId: string }
  | { status: "mismatch"; paymentId: string; reason: string };

const PENDING_STATUSES = new Set(["initiated", "incomplete"]);

// The only place a payment is treated as successful. Whoever asks — the
// browser after checkout or Zoho's webhook — we re-read the payment and its
// session from Zoho and check them against our own price list, so a forged or
// replayed request can at most trigger a harmless re-check.
export async function confirmPayment(
  paymentId: string,
  options: { expectedSessionId?: string; source: "browser" | "webhook" }
): Promise<ConfirmationResult> {
  const payment = await getPayment(paymentId);
  const sessionId = String(payment.payments_session_id ?? "");

  if (!sessionId) {
    return { status: "mismatch", paymentId, reason: "no payment session" };
  }
  if (options.expectedSessionId && options.expectedSessionId !== sessionId) {
    return { status: "mismatch", paymentId, reason: "session mismatch" };
  }

  const session = await getPaymentSession(sessionId);
  const plan = getMembershipPlan(readMeta(session.meta_data, "plan"));
  if (!plan) {
    return { status: "mismatch", paymentId, reason: "unknown plan" };
  }

  const amountMatches =
    Number(payment.amount) === plan.totalAmountRupees &&
    Number(session.amount) === plan.totalAmountRupees &&
    payment.currency === "INR";

  const status = payment.status;
  const record = {
    sessionId,
    reference: session.reference_number ?? readMeta(session.meta_data, "ref"),
    plan: plan.id,
    amount: Number(payment.amount),
    name: readMeta(session.meta_data, "name"),
    email: readMeta(session.meta_data, "email"),
    phone: readMeta(session.meta_data, "phone"),
    environment: getZohoConfig().environment,
    paymentId,
    method: payment.payment_method?.type ?? "",
    source: options.source,
  };

  if (status === "succeeded" && !amountMatches) {
    console.error("Paid amount does not match plan", {
      paymentId,
      plan: plan.id,
      amount: payment.amount,
    });
    await recordPaymentEvent({
      action: "payment_update",
      ...record,
      status: "amount_mismatch",
    });
    return { status: "mismatch", paymentId, reason: "amount mismatch" };
  }

  if (status === "succeeded") {
    await recordPaymentEvent({ action: "payment_update", ...record, status });
    return { status: "paid", plan, reference: record.reference, paymentId };
  }

  if (PENDING_STATUSES.has(status)) {
    return { status: "pending", paymentId };
  }

  await recordPaymentEvent({ action: "payment_update", ...record, status });
  return { status: "failed", paymentId };
}
