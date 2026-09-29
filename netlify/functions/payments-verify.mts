import { z } from "zod";
import { paymentsEnabled } from "../lib/config";
import { confirmPayment } from "../lib/confirm";
import { clientIp, isRateLimited, isSameOrigin, json } from "../lib/http";
import { getPaymentSession } from "../lib/zoho";

// POST /api/payments/verify
// Called by the browser once the checkout widget reports a payment, and polled
// (without a paymentId) while the widget is open, because Zoho's widget doesn't
// always report back after card authentication. Either way the browser's word
// isn't trusted: confirmPayment re-reads everything from Zoho.

const schema = z.object({
  paymentId: z
    .string()
    .regex(/^\d{1,30}$/)
    .optional(),
  sessionId: z.string().regex(/^\d{1,30}$/),
});

export default async function handler(request: Request, context: { ip?: string }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!paymentsEnabled()) {
    return json({ error: "Online payments are not available right now." }, 503);
  }
  if (!isSameOrigin(request)) {
    return json({ error: "Forbidden" }, 403);
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: "Invalid payment details." }, 400);
  }

  // Polls are frequent by design, so they get their own, larger allowance.
  const polling = !parsed.data.paymentId;
  const limited = polling
    ? isRateLimited(`poll:${clientIp(request, context)}`, 300, 10 * 60_000)
    : isRateLimited(`verify:${clientIp(request, context)}`, 20, 10 * 60_000);
  if (limited) {
    return json({ error: "Too many attempts. Please wait a few minutes." }, 429);
  }

  const { sessionId } = parsed.data;
  let paymentId = parsed.data.paymentId;

  try {
    if (!paymentId) {
      const session = await getPaymentSession(sessionId);
      const paid = session.payments?.find((p) => p.status === "succeeded");
      if (!paid) {
        return json({ status: "waiting" });
      }
      paymentId = String(paid.payment_id);
    }

    const result = await confirmPayment(paymentId, {
      expectedSessionId: sessionId,
      source: "browser",
    });

    if (result.status === "paid") {
      return json({
        status: "paid",
        reference: result.reference,
        paymentId: result.paymentId,
        plan: result.plan.name,
        amount: result.plan.totalAmountRupees,
      });
    }
    if (result.status === "mismatch") {
      console.error("Payment verification mismatch", result);
      return json({ status: "failed", paymentId: result.paymentId });
    }
    return json({ status: result.status, paymentId: result.paymentId });
  } catch (error) {
    // The webhook will still record the payment; tell the customer it's being
    // confirmed rather than that it failed.
    console.error("Payment verification failed", error);
    return json(
      polling
        ? { status: "waiting" }
        : { status: "pending", paymentId: parsed.data.paymentId }
    );
  }
}

export const config = { path: "/api/payments/verify" };
