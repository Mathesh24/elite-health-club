# Live payment readiness — 9 October 2026

Live payments have not been enabled. Production checkout remains disabled in
`netlify.toml` until the missing production setup is completed. External setup
and deployment observations below are a dated snapshot and should be rechecked
before activation.

## Verified

- The user confirmed successful sandbox checkout, sheet recording, and email delivery.
- `npm run build` passes (Google Fonts requires network access).
- TypeScript checking passes.
- `npm run test:payments` passes all nine tests against the actual payment code
  with isolated API and sheet doubles. Coverage includes live/sandbox pricing,
  rejection of INR 100 in live mode, session/currency mismatch, failed/pending
  payments, webhook signature validation, Apps Script duplicate handling, and
  Early Bird Access confirmation through browser and webhook.
- The public domain `https://elitehealthclub.in` responds with HTTP 200 over HTTPS.
- All live prices remain server-controlled: Early Bird INR 2,000;
  Individual INR 82,600; Family INR 236,000.

## Outstanding

- Confirm the Early Bird Access duration before enabling paid access publicly.
- The deployed domain returns HTTP 404 for `/terms/`, `/refund-policy/`,
  `/privacy-policy/`, and all three `/api/payments/*` routes. Deploy the current
  static export and Netlify Functions, then repeat these route checks.
- Netlify CLI is not authenticated, and this checkout has no linked Netlify site
  ID. A sign-in request was provided to the user; access is pending.
- Local `.env` is configured for sandbox. A live widget key exists, but no
  separately identified live OAuth refresh token or webhook signing key is
  configured. Production-scoped remote environment variables could not be
  inspected without Netlify access.
- The live Zoho Developer Space webhook screen shows an empty setup state.
  Register the deployed HTTPS webhook and configure its signing key, then verify
  an actual Zoho delivery. Automated signature tests are not a delivery test.
- Zoho's live authentication screen says the older widget key expires on
  14 October 2026 and shows a regenerated key. Confirm which key is stored for
  production and use the replacement key according to Zoho's activation rules.
- Merchant approval and settlement bank verification have not yet been confirmed.
- The source GSTIN is blank. Registered business details and policy approval
  have been requested from the user.
- Browser cancellation, mobile device behavior, actual webhook delivery after
  closing checkout, and a controlled real payment/refund are not independently
  verified by these automated tests.

## Activation sequence

1. Authenticate Netlify and link this checkout to the existing production site.
2. Confirm club legal details, policy approval, merchant activation and settlement setup.
3. Obtain live OAuth consent and a live-scoped refresh token; keep secrets out of
   chat and Git. Use the established credential helper in the user's terminal.
4. Configure live credentials in Netlify's **production** context. Keep previews
   and local development in sandbox. Keep new payments disabled during setup.
5. Deploy the current site and functions, register the live webhook at
   `https://elitehealthclub.in/api/payments/webhook`, and set its signing key.
6. Verify policy routes, webhook authentication, failure/cancellation handling,
   and a real Zoho delivery before opening checkout publicly.
7. Enable `PAYMENTS_ENABLED=true` and production
   `NEXT_PUBLIC_PAYMENTS_ENABLED=true`, rebuild/deploy, then perform the agreed
   controlled live validation. The user executes the real payment and refund.

The normal membership checkout will charge the full live prices. Any low-value
live test needs a separately agreed controlled setup; never change public
membership prices to INR 100 for launch testing.

Provider references:
- https://www.zoho.com/in/payments/developerdocs/go-live/
- https://www.zoho.com/in/payments/developerdocs/webhooks/verification/
- https://www.zoho.com/in/payments/developerdocs/sandbox/testing/
