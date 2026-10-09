import { randomBytes } from "node:crypto";
import { z } from "zod";
import {
  MEMBERSHIP_PLAN_IDS,
  getMembershipPlan,
} from "../../src/lib/membership-plans";
import { ConfigError, getZohoConfig, paymentsEnabled } from "../lib/config";
import { checkoutAmount } from "../lib/checkout-amount";
import {
  clientIp,
  inBackground,
  isRateLimited,
  isSameOrigin,
  json,
  type FunctionContext,
} from "../lib/http";
import { recordPaymentEvent } from "../lib/sheet";
import { createPaymentSession, ZohoApiError } from "../lib/zoho";

// POST /api/payments/create
// Starts checkout: validates the customer's details, creates a Zoho payment
// session for the plan's server-side price, and returns what the checkout
// widget needs.

const schema = z.object({
  planId: z.enum(MEMBERSHIP_PLAN_IDS),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(120)),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,18}$/),
  acceptedTerms: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
});

export default async function handler(request: Request, context: FunctionContext) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!paymentsEnabled()) {
    return json({ error: "Online payments are not available right now." }, 503);
  }
  if (!isSameOrigin(request)) {
    return json({ error: "Forbidden" }, 403);
  }
  if (isRateLimited(`create:${clientIp(request, context)}`, 6, 10 * 60_000)) {
    return json({ error: "Too many attempts. Please wait a few minutes." }, 429);
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: "Please check your details and try again." }, 400);
  }

  const input = parsed.data;
  const plan = getMembershipPlan(input.planId)!;
  const description = plan.termYears
    ? `${plan.name} (${plan.termYears} years)`
    : `${plan.name} - one person, all facilities before choosing a membership`;
  const reference = `EHC-${plan.id.slice(0, 3).toUpperCase()}-${Date.now()
    .toString(36)
    .toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const phone = input.phone.replace(/[\s-]/g, "");

  try {
    const config = getZohoConfig();
    const amount = checkoutAmount(plan);
    const session = await createPaymentSession({
      amount,
      description: `${description} - Elite Health Club`,
      referenceNumber: reference,
      metaData: [
        { key: "plan", value: plan.id },
        { key: "ref", value: config.environment === "sandbox" ? `TEST:${reference}` : reference },
        { key: "name", value: input.name },
        { key: "email", value: input.email },
        { key: "phone", value: phone },
      ],
    });

    if (
      Number(session.amount) !== amount ||
      session.currency !== "INR"
    ) {
      console.error("Zoho session amount mismatch", {
        sessionId: session.payments_session_id,
        expectedAmount: amount,
        sessionAmount: session.amount,
        currency: session.currency,
      });
      throw new Error("Zoho returned an unexpected session amount or currency");
    }
    // Log the attempt so abandoned checkouts show up as leads. The payment
    // doesn't depend on this, so it runs after responding and a sheet outage
    // can't block checkout.
    const sessionId = String(session.payments_session_id);
    await inBackground(context, () => recordPaymentEvent({
      action: "payment_created",
      sessionId,
      reference,
      plan: plan.id,
      amount,
      name: input.name,
      email: input.email,
      phone,
      environment: config.environment,
    }), "Sheet lead write");

    return json({
      sessionId,
      reference,
      amount: session.amount,
      description,
      widget: {
        accountId: config.accountId,
        apiKey: config.widgetApiKey,
        testMode: config.environment === "sandbox",
      },
    });
  } catch (error) {
    console.error("Payment session creation failed", error);
    if (error instanceof ZohoApiError && error.status === 429) {
      return json({ error: "Payments are temporarily busy. Please wait 10 minutes before trying again." }, 503);
    }
    const message =
      error instanceof ConfigError
        ? "Online payments are not configured yet."
        : "We couldn't start the payment. Please try again shortly.";
    return json({ error: message }, 502);
  }
}

export const config = { path: "/api/payments/create" };
