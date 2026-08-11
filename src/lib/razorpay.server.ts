import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { MembershipPlanId } from "@/lib/membership-plans";

const RAZORPAY_API_BASE_URL = "https://api.razorpay.com/v1";

type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: string;
  notes?: Record<string, string>;
};

type RazorpayPayment = {
  id: string;
  amount: number;
  currency: string;
  order_id: string;
  status: string;
};

export class RazorpayConfigurationError extends Error {}

export class RazorpayRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

export function getRazorpayTestCredentials(): RazorpayCredentials {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new RazorpayConfigurationError(
      "Razorpay Test Mode credentials are not configured."
    );
  }

  if (!keyId.startsWith("rzp_test_")) {
    throw new RazorpayConfigurationError(
      "Only Razorpay Test Mode credentials are allowed by this integration."
    );
  }

  return { keyId, keySecret };
}

async function razorpayRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { keyId, keySecret } = getRazorpayTestCredentials();
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch(`${RAZORPAY_API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    let providerMessage = "Razorpay rejected the request.";

    try {
      const data = (await response.json()) as {
        error?: { description?: string };
      };
      providerMessage = data.error?.description || providerMessage;
    } catch {
      // Use the safe fallback when Razorpay does not return JSON.
    }

    throw new RazorpayRequestError(providerMessage, response.status);
  }

  return (await response.json()) as T;
}

export async function createRazorpayOrder(input: {
  planId: MembershipPlanId;
  planName: string;
  amountPaise: number;
}) {
  const receipt = `elite_${input.planId}_${randomUUID().replaceAll("-", "").slice(0, 16)}`;

  return razorpayRequest<RazorpayOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt,
      notes: {
        plan_id: input.planId,
        plan_name: input.planName,
        environment: "test",
      },
    }),
  });
}

export async function fetchRazorpayOrder(orderId: string) {
  return razorpayRequest<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

export async function fetchRazorpayPayment(paymentId: string) {
  return razorpayRequest<RazorpayPayment>(
    `/payments/${encodeURIComponent(paymentId)}`
  );
}

export function verifyRazorpayPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = getRazorpayTestCredentials();
  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");

  if (!/^[a-f0-9]{64}$/i.test(input.signature)) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(input.signature, "hex")
  );
}
