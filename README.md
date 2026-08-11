# Elite Health Club website

This is the public Elite Health Club website, built with Next.js and deployed as a static GitHub Pages site.

## Membership enquiries

The public website does not collect membership payments. Membership and guest-access calls to action direct visitors to the contact form so the club team can confirm current terms and follow up on each enquiry. Submitted enquiries are stored in Google Sheets.

### Connect the enquiry form to Google Sheets

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Replace the editor contents with `google-apps-script/Code.gs` from this repository and save it.
3. Select **Deploy → New deployment → Web app**. Run it as yourself and allow access to anyone.
4. Copy the deployed web-app URL.
5. For local development, copy `.env.example` to `.env.local` and add the URL as `NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL`.
6. For GitHub Pages, add the URL as the repository Actions secret `GOOGLE_SHEETS_WEB_APP_URL`.

The script creates an `Enquiries` tab automatically and records the submission time, name, email, phone, enquiry type, message and source page.

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
