import { createHmac, timingSafeEqual } from "node:crypto";

// Verifies Zoho's `X-Zoho-Webhook-Signature: t=<ms>,v=<hex>` header:
// v = HMAC-SHA256(signingKey, `${t}.${rawBody}`).
// https://www.zoho.com/in/payments/developerdocs/webhooks/verification

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function verifyWebhookSignature(
  header: string | null,
  rawBody: string,
  signingKey: string,
  now = Date.now()
): boolean {
  if (!header) return false;

  const parts = new Map<string, string>();
  for (const piece of header.split(",")) {
    const index = piece.indexOf("=");
    if (index > 0) {
      parts.set(piece.slice(0, index).trim(), piece.slice(index + 1).trim());
    }
  }

  const timestamp = parts.get("t");
  const signature = parts.get("v");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  if (!/^[0-9a-f]+$/i.test(signature)) return false;

  // Replays are harmless (every event is re-checked with Zoho), but there's no
  // reason to accept very old deliveries.
  if (Math.abs(now - Number(timestamp)) > MAX_AGE_MS) return false;

  const expected = createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest();
  const received = Buffer.from(signature, "hex");

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
