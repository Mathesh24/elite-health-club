import { getSheetConfig } from "./config";

// Records payment events in the club's Google Sheet through the same Apps
// Script web app that stores enquiries (see docs/apps-script.gs). Apps Script
// can't read request headers, so the shared secret travels in the body.

export type SheetPaymentEvent =
  | {
      action: "payment_created";
      sessionId: string;
      reference: string;
      plan: string;
      amount: number;
      name: string;
      email: string;
      phone: string;
      environment: string;
    }
  | {
      action: "payment_update";
      sessionId: string;
      reference: string;
      plan: string;
      amount: number;
      name: string;
      email: string;
      phone: string;
      environment: string;
      status: string;
      paymentId: string;
      method: string;
      source: "browser" | "webhook";
    };

export async function recordPaymentEvent(event: SheetPaymentEvent) {
  const config = getSheetConfig();
  const response = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...event, secret: config.secret }),
    signal: AbortSignal.timeout(5_000),
  });
  const body = (await response.json().catch(() => null)) as {
    status?: string;
    message?: string;
  } | null;

  if (!response.ok || !body || !["success", "duplicate"].includes(body.status ?? "")) {
    throw new Error(
      `Payments sheet write failed: ${body?.message ?? response.status}`
    );
  }
}
