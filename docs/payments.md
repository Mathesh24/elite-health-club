# Membership payments (Zoho Payments)

## How it works

```
Membership card → "Become a Member" form (name, email, phone, accept terms)
  │ POST /api/payments/create        netlify/functions/payments-create.mts
  │   price looked up server-side (src/lib/membership-plans.ts)
  │   → Zoho: create payment session → Sheet: "created" row (lead)
  ▼
Zoho checkout widget (zpayments.js) — customer pays by UPI / card / net banking
  │ POST /api/payments/verify        netlify/functions/payments-verify.mts
  ▼
confirmPayment() — netlify/lib/confirm.ts
  re-reads the payment + session from Zoho, checks status, amount, currency,
  plan → Sheet: row updated → Apps Script emails member + club (first time only)

Zoho webhook payment.succeeded / payment.failed
  │ POST /api/payments/webhook       netlify/functions/payments-webhook.mts
  └ verifies X-Zoho-Webhook-Signature (HMAC-SHA256) → confirmPayment()
```

The webhook is the backstop for customers who close the tab right after
paying. The browser and the webhook can both report the same payment; the
Apps Script de-duplicates by payment session ID.

The site itself stays a static export (`output: "export"`), so the payment
endpoints are Netlify Functions rather than Next.js route handlers.

## Switches

| Where | Variable | Effect |
|---|---|---|
| `netlify.toml` per context | `NEXT_PUBLIC_PAYMENTS_ENABLED` | Shows the checkout buttons (build time). `true` in production; server configuration must be complete. |
| Netlify UI | `PAYMENTS_ENABLED` | Server-side kill switch. Anything but `true` makes the create/verify endpoints return 503. |
| Netlify UI | `ZOHO_PAY_ENV` | `sandbox` or `live`; selects API host and OAuth scopes. |

**Rollback:** set `NEXT_PUBLIC_PAYMENTS_ENABLED = "false"` for production in
`netlify.toml` (or override in the UI) and redeploy — the buttons return to
"Enquire". Setting `PAYMENTS_ENABLED=false` in the UI stops new checkouts
immediately, without a rebuild.

## Environment variables (Netlify UI)

See `.env.example`. Use **different values per deploy context**: sandbox
credentials for *Deploy Previews* / *Branch deploys* / *Local*, live
credentials for *Production* only. Mark every value labelled secret as
"Contains secret values".

## Credentials

1. **OAuth client** — https://api-console.zoho.in/add?client_type=ORG, redirect
   URI `http://localhost:8765/callback`.
2. **Refresh token** — in your own terminal: `node scripts/zoho-oauth.mjs token`
   (add `--live` for production).
3. **Webhook** — once the site URL exists (before enabling checkout):
   `node scripts/zoho-oauth.mjs webhook https://<site>/api/payments/webhook`
   (add `--live` for production). The signing key is shown once.
4. **Apps Script** — paste `docs/apps-script.gs`, set Script Properties
   `PAYMENTS_SECRET` and `CLUB_NOTIFY_EMAIL`, run `sendTestEmail()` once,
   then deploy a new version of the existing web-app deployment.

## Test checklist (sandbox)

All checkout amounts match the advertised price in both sandbox and live:
Early Bird ₹2,000, Individual ₹82,600, Family ₹2,36,000. The session, widget,
verification, sheet and receipt all use the same amount. Start a fresh checkout
after deploying; old ₹100 sessions are no longer accepted by verification.
Zoho's sandbox bank-account UPI method documents success only up to ₹500, so
use a documented sandbox card success scenario for these full-price tests.

Reference: https://www.zoho.com/in/payments/developerdocs/sandbox/testing/

- [ ] Early Bird, Individual and Family: pay → success screen → sheet row `succeeded` → both emails (subject prefixed `[TEST]`)
- [ ] Close the widget → "Payment was cancelled", can retry
- [ ] Failed payment (sandbox test failure method) → sheet row `failed`, no email
- [ ] Close the tab right after paying → webhook still marks the row `succeeded`
- [ ] Same payment reported twice → only one set of emails
- [ ] Mobile Safari and Chrome (Android) — widget, UPI flow
- [ ] Policy pages reachable from the footer and the checkout form

## Go-live checklist

- [ ] Client approved Terms, Refund and Privacy text; `LEGAL_INFO` (legal name, GSTIN) filled in `src/lib/constants.ts`
- [ ] Production-scoped live variables set in Netlify: `ZOHO_PAY_ENV=live`, live widget key, live refresh token, live webhook signing key, `PAYMENTS_ENABLED=true`
- [ ] Deploy Apps Script as `Elitehealthclubkdkr@gmail.com` with **Execute as: Me**. The club account must have access to the backing Sheet. Set `PAYMENTS_SECRET` and `CLUB_NOTIFY_EMAIL`, authorise email sending, then run `sendTestEmail()` and inspect the actual From address. For a replacement deployment, update `src/lib/google-sheets.ts`, push and redeploy. Reply-To alone does not change the sender.
- [ ] Live webhook registered against `https://elitehealthclub.in/api/payments/webhook`
- [ ] `NEXT_PUBLIC_PAYMENTS_ENABLED = "true"` for production in `netlify.toml`
- [ ] One real low-value payment end-to-end, then refunded from the Zoho dashboard

## Early Bird Access

`early_bird` is ₹2,000 total (including GST) in live mode and uses the same
Zoho session, widget, verification and webhook flow as memberships. It provides
access to all facilities before choosing an individual or family membership;
it covers one person and has no five-year term. Access duration still needs
to be specified by the club. Production checkout remains subject to the existing
payment switches. Redeploy the updated `docs/apps-script.gs` web app so receipt
emails describe Early Bird Access correctly.

Live payments require a webhook signing key; all payments require a Sheet
secret before creating a payment. Netlify production deploys support sandbox
mode for testing. Bind `docs/apps-script.gs`
to the existing **Elite-health-club** spreadsheet; payment details go in its
**Payments** tab. Do not create a separate spreadsheet.

OAuth caching uses only the warm function instance; no local token files are
written. Missing/invalid `ZOHO_PAY_ENV` is rejected rather than defaulting to sandbox.

Local/preview sandbox checkout can run without a webhook signing key; browser
verification still records payments. Configure the sandbox key to test webhook
delivery and confirmation after closing the browser. Live checkout requires it.

## Current Netlify sandbox validation

The public Apps Script endpoint is configured once in `src/lib/google-sheets.ts`
and shared by enquiries and payment functions. Old URL environment variables
are no longer read, so pushing a URL change updates both flows on deployment.
Keep `ZOHO_PAY_ENV=sandbox` and matching sandbox credentials in Netlify for
testing; deploy context does not force real payments. `PAYMENTS_SHEET_SECRET`
must match the new deployment's `PAYMENTS_SECRET`. Secret credentials remain
in Netlify and are not committed to GitHub.
