import { Check, Clock3, Crown, Ticket } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const membershipBenefits = [
  "Early access before regular memberships open",
  "Full access to the pool, gym, tennis and badminton facilities",
  "Priority booking for courts, activities and club events",
  "Founding-member invitations and exclusive club experiences",
  "Five years of membership with no annual renewal",
];

const guestAccessDetails = [
  "Access to selected facilities only",
  "Advance booking and valid identification required",
  "Entry is subject to availability and member-priority hours",
  "Guest charges apply per visit",
];

const paymentPageHosts = new Set(["rzp.io", "pages.razorpay.com"]);

function getMembershipPaymentUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_PAYMENT_URL?.trim();

  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" && paymentPageHosts.has(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default function Membership() {
  const membershipPaymentUrl = getMembershipPaymentUrl();

  return (
    <section
      id="plans"
      className="flex min-h-[calc(100svh-6rem)] scroll-mt-24 items-center overflow-hidden bg-light py-14 sm:py-16 lg:py-12 [@media(min-width:1024px)_and_(max-height:900px)]:py-4"
      aria-label="Membership and guest access"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Your Access to Elite"
          subtitle="Join as an early member for five years of complete club access, or visit as a non-member guest with limited access."
          className="!mb-10 [@media(min-width:1024px)_and_(max-height:900px)]:!mb-4 [@media(min-width:1024px)_and_(max-height:900px)]:[&>div]:!mt-4 [@media(min-width:1024px)_and_(max-height:900px)]:[&>p]:!mt-2 [@media(min-width:1024px)_and_(max-height:900px)]:[&>p]:!text-base"
        />

        <div className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-dark p-6 text-white shadow-2xl sm:p-8 [@media(min-width:1024px)_and_(max-height:900px)]:!p-6">
              <div
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col">
                <div className="mb-5 flex items-start justify-between gap-4 [@media(min-width:1024px)_and_(max-height:900px)]:mb-4">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      Limited early offer
                    </p>
                    <h3 className="font-display text-3xl font-bold">
                      Early Membership Access
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                    <Crown size={21} aria-hidden="true" />
                  </span>
                </div>

                <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-2 border-y border-white/10 py-4 [@media(min-width:1024px)_and_(max-height:900px)]:mb-4 [@media(min-width:1024px)_and_(max-height:900px)]:py-3">
                  <div>
                    <span className="font-display text-5xl font-bold text-accent">
                      ₹1,50,000
                    </span>
                    <p className="mt-1 text-sm text-white/60">One-time membership fee</p>
                  </div>
                  <div className="mb-2 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <Clock3 size={16} className="text-accent" aria-hidden="true" />
                    5 years
                  </div>
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                  Membership benefits
                </p>
                <ul className="flex-1 space-y-2.5 [@media(min-width:1024px)_and_(max-height:900px)]:space-y-2">
                  {membershipBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check size={14} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row [@media(min-width:1024px)_and_(max-height:900px)]:mt-4">
                  {membershipPaymentUrl && (
                    <Button
                      href={membershipPaymentUrl}
                      external
                      variant="primary"
                      className="w-full sm:w-fit"
                    >
                      Pay Membership Fee
                    </Button>
                  )}
                  <Button
                    href="#contact"
                    variant={membershipPaymentUrl ? "ghost" : "primary"}
                    className="w-full sm:w-fit"
                  >
                    {membershipPaymentUrl ? "Ask a Question" : "Enquire for Early Access"}
                  </Button>
                </div>
                {membershipPaymentUrl && (
                  <p className="mt-3 text-xs leading-relaxed text-white/55">
                    Secure checkout opens with our payment partner. A receipt is issued after successful payment.
                  </p>
                )}
              </div>
          </article>

          <article className="flex h-full flex-col rounded-3xl border border-neutral-dark/10 bg-white p-6 shadow-md sm:p-8 [@media(min-width:1024px)_and_(max-height:900px)]:!p-6">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand [@media(min-width:1024px)_and_(max-height:900px)]:mb-4">
                <Ticket size={21} aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                Visit without membership
              </p>
              <h3 className="font-display text-3xl font-bold leading-tight text-neutral-dark [@media(min-width:1024px)_and_(max-height:900px)]:text-2xl">
                Non-Member Guest Access
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-dark/60 [@media(min-width:1024px)_and_(max-height:900px)]:mt-2">
                Experience selected club facilities with limited, pay-per-visit access.
              </p>

              <ul className="mt-6 flex-1 space-y-3 border-t border-neutral-dark/10 pt-6 [@media(min-width:1024px)_and_(max-height:900px)]:mt-4 [@media(min-width:1024px)_and_(max-height:900px)]:space-y-2 [@media(min-width:1024px)_and_(max-height:900px)]:pt-4">
                {guestAccessDetails.map((detail) => (
                  <li key={detail} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-dark/70">
                    <Check size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>

              <Button href="#contact" variant="outline" className="mt-6 w-full [@media(min-width:1024px)_and_(max-height:900px)]:mt-4">
                Ask About Guest Access
              </Button>
          </article>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-neutral-dark/50 [@media(min-width:1024px)_and_(max-height:900px)]:hidden">
          Access, operating hours and availability may vary by facility. Our team will confirm the current terms when you enquire.
        </p>
      </div>
    </section>
  );
}
