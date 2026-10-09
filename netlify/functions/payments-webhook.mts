import { getWebhookSigningKey } from "../lib/config";
import { confirmPayment } from "../lib/confirm";
import { json } from "../lib/http";
import { verifyWebhookSignature } from "../lib/webhook-signature";

// POST /api/payments/webhook
// Zoho's server-to-server notification and the source of truth for payment
// outcomes: it arrives even when the customer closes the tab right after
// paying. Must answer within 15 seconds.

const HANDLED_EVENTS = new Set(["payment.succeeded", "payment.failed"]);

type WebhookEvent = {
  event_type?: string;
  event_object?: { payment?: { payment_id?: string | number } };
  data?: { payment?: { payment_id?: string | number } };
};

function extractPaymentId(event: WebhookEvent) {
  const id =
    event.event_object?.payment?.payment_id ?? event.data?.payment?.payment_id;
  return id === undefined ? null : String(id);
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const rawBody = await request.text();
  let signingKey: string;
  try {
    signingKey = getWebhookSigningKey();
  } catch (error) {
    console.error(error);
    return json({ error: "Not configured" }, 503);
  }

  const signature = request.headers.get("x-zoho-webhook-signature");
  if (!verifyWebhookSignature(signature, rawBody, signingKey)) {
    return json({ error: "Invalid signature" }, 401);
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!event.event_type || !HANDLED_EVENTS.has(event.event_type)) {
    return json({ received: true, ignored: event.event_type ?? "unknown" });
  }

  const paymentId = extractPaymentId(event);
  if (!paymentId || !/^\d{1,30}$/.test(paymentId)) {
    console.error("Webhook without a usable payment id", Object.keys(event));
    return json({ received: true, ignored: "no payment id" });
  }

  try {
    const result = await confirmPayment(paymentId, { source: "webhook" });
    console.log("Webhook processed", event.event_type, paymentId, result.status);
    return json({ received: true, status: result.status });
  } catch (error) {
    // A non-2xx makes Zoho retry later, which is what we want if Zoho's API or
    // the sheet was briefly unavailable.
    console.error("Webhook processing failed", error);
    return json({ error: "Processing failed" }, 500);
  }
}

export const config = { path: "/api/payments/webhook" };
