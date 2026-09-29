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
| `netlify.toml` per context | `NEXT_PUBLIC_PAYMENTS_ENABLED` | Shows the checkout buttons (build time). `false` in production until go-live. |
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
3. **Webhook** — once the site URL exists:
   `node scripts/zoho-oauth.mjs webhook https://<site>/api/payments/webhook`
   (add `--live` for production). The signing key is shown once.
4. **Apps Script** — paste `docs/apps-script.gs`, set Script Properties
   `PAYMENTS_SECRET` and `CLUB_NOTIFY_EMAIL`, run `sendTestEmail()` once,
   then deploy a new version of the existing web-app deployment.

## Test checklist (sandbox)

- [ ] Individual and Family: pay → success screen → sheet row `succeeded` → both emails (subject prefixed `[TEST]`)
- [ ] Close the widget → "Payment was cancelled", can retry
- [ ] Failed payment (sandbox test failure method) → sheet row `failed`, no email
- [ ] Close the tab right after paying → webhook still marks the row `succeeded`
- [ ] Same payment reported twice → only one set of emails
- [ ] Mobile Safari and Chrome (Android) — widget, UPI flow
- [ ] Policy pages reachable from the footer and the checkout form

## Go-live checklist

- [ ] Client approved Terms, Refund and Privacy text; `LEGAL_INFO` (legal name, GSTIN) filled in `src/lib/constants.ts`
- [ ] Production-scoped live variables set in Netlify: `ZOHO_PAY_ENV=live`, live widget key, live refresh token, live webhook signing key, `PAYMENTS_ENABLED=true`
- [ ] Emails come from the club, not a personal account: either transfer the Sheet + Apps Script to the club Gmail and redeploy the web app (update both Sheet URL variables in Netlify), or move sending to a transactional provider on a club domain address
- [ ] Live webhook registered against `https://elitehealthclub.in/api/payments/webhook`
- [ ] `NEXT_PUBLIC_PAYMENTS_ENABLED = "true"` for production in `netlify.toml`
- [ ] One real low-value payment end-to-end, then refunded from the Zoho dashboard
