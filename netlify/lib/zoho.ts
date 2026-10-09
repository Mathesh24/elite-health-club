import { getZohoConfig } from "./config";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Thin client for the Zoho Payments REST API.
// Docs: https://www.zoho.com/in/payments/api/v1/introduction/

export class ZohoApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown
  ) {
    super(message);
  }
}

type MetaData = { key: string; value: string }[];

export type ZohoPaymentSession = {
  payments_session_id: string;
  amount: string | number;
  currency: string;
  status?: string;
  reference_number?: string;
  description?: string;
  meta_data?: MetaData;
  payments?: { payment_id: string | number; status: string }[];
};

export type ZohoPayment = {
  payment_id: string;
  payments_session_id?: string;
  amount: string | number;
  currency: string;
  status: string;
  date?: number | string;
  reference_number?: string;
  receipt_email?: string;
  payment_method?: { type?: string } & Record<string, unknown>;
  meta_data?: MetaData;
};

const REQUEST_TIMEOUT_MS = 4_000;

// Zoho access tokens last an hour, and Zoho rate-limits how many can be minted
// per refresh token. Cache per warm function instance and share one in-flight
// refresh between concurrent requests.
let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingRefresh: Promise<string> | null = null;
let retryAfter = 0;

// Netlify Dev reloads function modules independently. Share tokens locally so
// create/verify/webhook and hot reloads don't repeatedly mint OAuth tokens.
// This private, Git-ignored cache is used only by Netlify Dev.
function localTokenPath() {
  if (process.env.NETLIFY_DEV !== "true") return null;
  const config = getZohoConfig();
  const key = createHash("sha256").update(JSON.stringify([
    config.environment, config.accountId, config.clientId,
    config.clientSecret, config.refreshToken,
  ])).digest("hex");
  return join(process.cwd(), ".netlify", "oauth-cache", `${key}.json`);
}

async function saveLocalToken() {
  const path = localTokenPath();
  if (!path) return;
  await mkdir(join(process.cwd(), ".netlify", "oauth-cache"), { recursive: true, mode: 0o700 });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  await writeFile(temporaryPath, JSON.stringify({ token: cachedToken, retryAfter }), { mode: 0o600 });
  await rename(temporaryPath, path);
}

async function getAccessToken(): Promise<string> {
  const path = localTokenPath();
  if (path) {
    try {
      const saved = JSON.parse(await readFile(path, "utf8"));
      if (typeof saved.token?.value === "string" && saved.token.expiresAt > Date.now() + 60_000) {
        cachedToken = saved.token;
      }
      if (typeof saved.retryAfter === "number") retryAfter = Math.max(retryAfter, saved.retryAfter);
    } catch { /* No reusable local token yet. */ }
  }
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  if (retryAfter > Date.now()) {
    throw new ZohoApiError("Zoho token refresh failed: temporary token-generation throttle", 429);
  }
  pendingRefresh ??= refreshAccessToken().finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
}

async function refreshAccessToken(): Promise<string> {
  const config = getZohoConfig();
  const response = await fetch(`${config.accountsBase}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: config.refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  // Zoho reports OAuth failures as HTTP 200 with an `error` field.
  const body = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !body.access_token) {
    if (response.status === 429 || (body.error === "Access Denied" && body.error_description?.includes("too many requests"))) {
      retryAfter = Date.now() + 10 * 60_000;
      await saveLocalToken();
      throw new ZohoApiError("Zoho token refresh failed: temporary token-generation throttle", 429);
    }
    throw new ZohoApiError(
      `Zoho token refresh failed: ${body.error ?? response.status}`,
      response.status
    );
  }

  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  retryAfter = 0;
  await saveLocalToken();
  return cachedToken.value;
}

async function zohoRequest<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> {
  const config = getZohoConfig();
  const url = new URL(`${config.apiBase}${path}`);
  url.searchParams.set("account_id", config.accountId);

  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${await getAccessToken()}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const body = (await response.json().catch(() => null)) as
    | ({ code?: number; message?: string } & Record<string, unknown>)
    | null;

  if (!response.ok || !body || (body.code !== undefined && body.code !== 0)) {
    if (response.status === 401) {
      cachedToken = null;
      const path = localTokenPath();
      if (path) await unlink(path).catch(() => undefined);
    }
    throw new ZohoApiError(
      `Zoho ${init.method ?? "GET"} ${path} failed: ${body?.message ?? response.status}`,
      response.status,
      body
    );
  }
  return body as T;
}

export async function createPaymentSession(input: {
  amount: number;
  description: string;
  referenceNumber: string;
  metaData: MetaData;
}) {
  const body = await zohoRequest<{ payments_session: ZohoPaymentSession }>(
    "/paymentsessions",
    {
      method: "POST",
      body: {
        amount: input.amount,
        currency: "INR",
        description: input.description,
        reference_number: input.referenceNumber,
        meta_data: input.metaData,
        expires_in: 900,
      },
    }
  );
  return body.payments_session;
}

export async function getPaymentSession(sessionId: string) {
  const body = await zohoRequest<{ payments_session: ZohoPaymentSession }>(
    `/paymentsessions/${encodeURIComponent(sessionId)}`
  );
  return body.payments_session;
}

export async function getPayment(paymentId: string) {
  const body = await zohoRequest<{ payment: ZohoPayment }>(
    `/payments/${encodeURIComponent(paymentId)}`
  );
  return body.payment;
}

export function readMeta(meta: MetaData | undefined, key: string) {
  return meta?.find((entry) => entry.key === key)?.value ?? "";
}
