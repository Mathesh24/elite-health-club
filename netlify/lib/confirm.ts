import { getMembershipPlan, type MembershipPlan } from "../../src/lib/membership-plans";
import { getZohoConfig } from "./config";
import { checkoutAmount } from "./checkout-amount";
import { recordPaymentEvent, type SheetPaymentEvent } from "./sheet";
import { getPayment, getPaymentSession, readMeta } from "./zoho";

export type ConfirmationResult =
  | { status: "paid"; plan: MembershipPlan; reference: string; paymentId: string; amount: number }
  | { status: "pending" | "failed"; paymentId: string }
  | { status: "mismatch"; paymentId: string; reason: string };

const PENDING_STATUSES = new Set(["initiated", "incomplete"]);

// The only place a payment is treated as successful. Whoever asks — the
// browser after checkout or Zoho's webhook — we re-read the payment and its
// session from Zoho and check them against our own price list, so a forged or
// replayed request can at most trigger a harmless re-check.
export async function confirmPayment(
  paymentId: string,
  options: {
    expectedSessionId?: string;
    source: "browser" | "webhook";
    // Lets the browser path record in the background. The webhook awaits the
    // write so a failure returns 5xx and Zoho retries.
    record?: (write: () => Promise<void>) => Promise<void>;
  }
): Promise<ConfirmationResult> {
  const record = (event: SheetPaymentEvent) =>
    options.record
      ? options.record(() => recordPaymentEvent(event))
      : recordPaymentEvent(event);
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

  const environment = getZohoConfig().environment;
  const expectedAmount = checkoutAmount(plan);
  const amountMatches =
    Number(payment.amount) === expectedAmount &&
    Number(session.amount) === expectedAmount &&
    session.currency === "INR" && payment.currency === "INR";

  const status = payment.status;
  const details = {
    sessionId,
    reference: session.reference_number ?? readMeta(session.meta_data, "ref"),
    plan: plan.id,
    amount: Number(payment.amount),
    name: readMeta(session.meta_data, "name"),
    email: readMeta(session.meta_data, "email"),
    phone: readMeta(session.meta_data, "phone"),
    environment,
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
    await record({
      action: "payment_update",
      ...details,
      status: "amount_mismatch",
    });
    return { status: "mismatch", paymentId, reason: "amount mismatch" };
  }

  if (status === "succeeded") {
    await record({ action: "payment_update", ...details, status });
    return { status: "paid", plan, reference: details.reference, paymentId, amount: expectedAmount };
  }

  if (PENDING_STATUSES.has(status)) {
    return { status: "pending", paymentId };
  }

  await record({ action: "payment_update", ...details, status });
  return { status: "failed", paymentId };
}
