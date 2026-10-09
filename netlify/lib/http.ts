// Small helpers shared by the payment functions.

// The parts of Netlify's function context we use.
export type FunctionContext = {
  ip?: string;
  waitUntil?: (promise: Promise<unknown>) => void;
};

// Runs work after the response has been sent, so the customer isn't kept
// waiting on it. Falls back to awaiting where waitUntil isn't available.
export async function inBackground(
  context: FunctionContext | undefined,
  task: () => Promise<unknown>,
  label: string
) {
  const run = task().catch((error) => console.error(`${label} failed`, error));
  if (context?.waitUntil) {
    context.waitUntil(run);
  } else {
    await run;
  }
}

export function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

// The browser-facing endpoints only accept calls from pages on the same host,
// which blocks other sites from driving checkout on a visitor's behalf.
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function clientIp(request: Request, context?: FunctionContext) {
  return (
    context?.ip ??
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// Best-effort throttle per warm function instance. It won't stop a
// distributed attack, but it stops a single client hammering session creation.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return recent.length > limit;
}
