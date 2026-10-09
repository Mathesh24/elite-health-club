#!/usr/bin/env node
// One-off helper for Zoho Payments credentials. Run it in YOUR OWN terminal
// (not through an AI assistant or CI) so the secrets it prints stay with you.
//
//   node scripts/zoho-oauth.mjs token   [--live]
//       Walks through the OAuth consent screen and prints a refresh token.
//
//   node scripts/zoho-oauth.mjs webhook <https://.../api/payments/webhook> [--live]
//       Registers the payment webhook and prints its signing key (shown once).
//
// Before running `token`, create a client at
// https://api-console.zoho.in/add?client_type=ORG with the redirect URI
//   http://localhost:8765/callback

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { createInterface } from "node:readline";

const ACCOUNT_ID = process.env.ZOHO_PAY_ACCOUNT_ID?.trim();
if (!ACCOUNT_ID) {
  console.error("Set ZOHO_PAY_ACCOUNT_ID before running this helper.");
  process.exit(1);
}
const REDIRECT_URI = "http://localhost:8765/callback";
const ACCOUNTS = "https://accounts.zoho.in";

const args = process.argv.slice(2);
const live = args.includes("--live");
const [command, webhookUrl] = args.filter((a) => !a.startsWith("--"));

const scopePrefix = live ? "ZohoPay" : "ZohoPaySandbox";
const soid = `${live ? "zohopay" : "zohopaysandbox"}.${ACCOUNT_ID}`;
const apiBase = live
  ? "https://payments.zoho.in/api/v1"
  : "https://paymentssandbox.zoho.in/api/v1";
const scopes = [
  "payments.CREATE",
  "payments.READ",
  "settings.CREATE",
  "settings.READ",
]
  .map((s) => `${scopePrefix}.${s}`)
  .join(",");

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    if (hidden) {
      rl._writeToOutput = (text) => {
        if (text.includes(question)) rl.output.write(text);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function tokenRequest(params) {
  const response = await fetch(`${ACCOUNTS}/oauth/v2/token`, {
    method: "POST",
    body: new URLSearchParams(params),
  });
  const body = await response.json();
  if (body.error || !body.access_token) {
    throw new Error(`Zoho token request failed: ${JSON.stringify(body)}`);
  }
  return body;
}

function waitForCode() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      if (url.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(
        code
          ? "Authorised. You can close this tab and return to the terminal."
          : `Authorisation failed: ${error}`
      );
      server.close();
      if (code) resolve(code);
      else reject(new Error(error ?? "No code returned"));
    });
    server.listen(8765, "127.0.0.1");
  });
}

async function getToken() {
  console.log(`\nZoho Payments ${live ? "LIVE" : "SANDBOX"} — account ${ACCOUNT_ID}`);
  const clientId = await ask("Client ID: ");
  const clientSecret = await ask("Client Secret (hidden): ", { hidden: true });

  const authUrl = new URL(`${ACCOUNTS}/oauth/v2/org/auth`);
  authUrl.search = new URLSearchParams({
    scope: scopes,
    client_id: clientId,
    soid,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    access_type: "offline",
    prompt: "consent",
  }).toString();

  const codePromise = waitForCode();
  console.log("\nOpening the Zoho consent page. If it doesn't open, visit:\n");
  console.log(authUrl.toString(), "\n");
  execFile("open", [authUrl.toString()], () => undefined);

  const code = await codePromise;
  const tokens = await tokenRequest({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  // Prove the token works with a read-only call.
  const check = await fetch(`${apiBase}/webhooks?account_id=${ACCOUNT_ID}`, {
    headers: { Authorization: `Zoho-oauthtoken ${tokens.access_token}` },
  });
  console.log(`\nAPI check: HTTP ${check.status} ${check.ok ? "✓" : "✗"}`);
  if (!check.ok) console.log(await check.text());

  if (!tokens.refresh_token) {
    console.log(
      "\nNo refresh token returned. Revoke the app's access at accounts.zoho.in and run again."
    );
    return;
  }
  console.log("\nAdd this to Netlify as ZOHO_OAUTH_REFRESH_TOKEN (mark it secret):\n");
  console.log(tokens.refresh_token, "\n");
}

async function createWebhook() {
  if (!webhookUrl?.startsWith("https://")) {
    throw new Error("Usage: node scripts/zoho-oauth.mjs webhook https://<site>/api/payments/webhook");
  }
  console.log(`\nRegistering ${live ? "LIVE" : "SANDBOX"} webhook -> ${webhookUrl}`);
  const clientId = await ask("Client ID: ");
  const clientSecret = await ask("Client Secret (hidden): ", { hidden: true });
  const refreshToken = await ask("Refresh token (hidden): ", { hidden: true });

  const { access_token } = await tokenRequest({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const response = await fetch(`${apiBase}/webhooks?account_id=${ACCOUNT_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Elite Health Club ${live ? "live" : "sandbox"}`.slice(0, 50),
      url: webhookUrl,
      enabled_events: ["payment.succeeded", "payment.failed"],
    }),
  });
  const body = await response.json();
  const signingKey = body.webhook?.signing_key ?? body.signing_key;
  if (!response.ok || !signingKey) {
    throw new Error(`Webhook creation failed: ${JSON.stringify(body)}`);
  }
  console.log("\nWebhook created. Add this to Netlify as ZOHO_PAY_WEBHOOK_SIGNING_KEY (secret).");
  console.log("It is only shown once:\n");
  console.log(signingKey, "\n");
}

const run = { token: getToken, webhook: createWebhook }[command];
if (!run) {
  console.log("Usage: node scripts/zoho-oauth.mjs <token|webhook> [url] [--live]");
  process.exit(1);
}
run().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
