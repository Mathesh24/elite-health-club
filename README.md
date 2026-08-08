# Elite Health Club website

This is the public Elite Health Club website, built with Next.js and deployed as a static GitHub Pages site.

## Membership payments

Membership payments use a hosted Razorpay Payment Page. Bank details and gateway secrets must not be added to this repository or exposed in browser code.

1. Complete Razorpay account activation and KYC using the club's settlement bank account.
2. In live mode, create a fixed-amount Payment Page for `INR 150000` and publish it.
3. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
4. Add a repository variable named `MEMBERSHIP_PAYMENT_URL` containing the published `https://rzp.io/...` or `https://pages.razorpay.com/...` URL.
5. Run the Pages deployment workflow or push to `main`.

The payment button is intentionally hidden when this variable is missing or is not an approved HTTPS Razorpay URL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
