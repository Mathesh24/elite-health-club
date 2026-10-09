import { getZohoConfig } from "./config";

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

async function getAccessToken(): Promise<string> {
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
