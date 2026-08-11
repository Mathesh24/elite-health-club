# Elite Health Club website

This is the public Elite Health Club website, built with Next.js.

## Razorpay membership payment testing

The membership section includes a clearly labelled Razorpay **Test Mode**
checkout for the individual and family plans. Test transactions are simulated:
no real money is charged and they do not activate a real membership.

### Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Razorpay **Test Mode** Key ID and Key Secret:

   ```text
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

3. Start the site:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000/#plans` and select either **Test Pay** button.
5. Complete the simulated success or failure flow in Razorpay Checkout.
6. For a successful test, confirm the payment also appears in the Razorpay
   Test Dashboard under **Transactions → Payments**.

The secret must remain server-only. Never rename it with a `NEXT_PUBLIC_`
prefix and never commit `.env.local`.

### How the payment flow works

1. The browser sends only the selected plan ID to
   `POST /api/payments/create-order`.
2. The server selects the trusted plan price, adds no client-provided amount,
   and creates a Razorpay Test order.
3. The website opens Razorpay Web Checkout with that order.
4. After simulated payment, the browser sends the order ID, payment ID and
   signature to `POST /api/payments/verify`.
5. The server verifies the HMAC signature and independently fetches the order
   and payment from Razorpay.
6. Success is displayed only after the plan, amount, currency, order and
   payment all match. The UI separately reports whether the payment is
   captured.

## Deployment requirement

Razorpay order creation and signature verification require server-side code.
This project therefore no longer uses a static GitHub Pages export. Deploy it
to a server-capable Next.js host, add the same Test Mode environment variables
in that host's settings, and use HTTPS for public testing.

The GitHub workflow validates lint and production build; it does not publish a
static site.

## Membership enquiries

Each membership plan retains an **Enquire Instead** option. Enquiries can be
sent to Google Sheets using a deployed Apps Script web app.

Set this optional variable in `.env.local` and in the deployment environment:

```text
NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/...
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```
