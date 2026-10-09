// Server-side configuration for the payment functions. Everything here comes
// from Netlify environment variables (Site configuration → Environment
// variables), scoped per deploy context so sandbox and live credentials never
// mix. None of these are exposed to the browser except the widget API key,
// which Zoho designs to be public.

export type ZohoEnvironment = "sandbox" | "live";

export class ConfigError extends Error {}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new ConfigError(`Missing environment variable ${name}`);
  }
  return value;
}

export function paymentsEnabled() {
  return process.env.PAYMENTS_ENABLED?.trim() === "true";
}

export function getZohoConfig() {
  const environment = required("ZOHO_PAY_ENV");
  if (environment !== "sandbox" && environment !== "live") {
    throw new ConfigError("ZOHO_PAY_ENV must be sandbox or live");
  }
  if (process.env.CONTEXT === "production" && environment !== "live") {
    throw new ConfigError("Production requires live Zoho credentials");
  }
  // Do not accept money without the required recording and recovery setup.
  getSheetConfig();
  if (environment === "live") getWebhookSigningKey();

  return {
    environment,
    apiBase:
      environment === "live"
        ? "https://payments.zoho.in/api/v1"
        : "https://paymentssandbox.zoho.in/api/v1",
    accountsBase: "https://accounts.zoho.in",
    accountId: required("ZOHO_PAY_ACCOUNT_ID"),
    widgetApiKey: required("ZOHO_PAY_WIDGET_API_KEY"),
    clientId: required("ZOHO_OAUTH_CLIENT_ID"),
    clientSecret: required("ZOHO_OAUTH_CLIENT_SECRET"),
    refreshToken: required("ZOHO_OAUTH_REFRESH_TOKEN"),
  };
}

export function getWebhookSigningKey() {
  return required("ZOHO_PAY_WEBHOOK_SIGNING_KEY");
}

export function getSheetConfig() {
  const url = process.env.PAYMENTS_SHEET_WEB_APP_URL?.trim();
  const secret = process.env.PAYMENTS_SHEET_SECRET?.trim();
  if (!url || !secret) {
    throw new ConfigError("Payment Sheet URL and secret are required");
  }
  return { url, secret };
}
