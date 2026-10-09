import { Check, Clock3, Crown, Ticket, User } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import MembershipCheckout from "@/components/payments/MembershipCheckout";

// Build-time switch, set per Netlify deploy context in netlify.toml. Turning it
// off restores the enquiry-only buttons.
const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

const individualBenefits = [
  "Dedicated app and web platform for seamless access to club amenities",
  "Prime-time access to all amenities",
  "A dedicated locker and welcome kit",
  "Concessional access to the gym, board games and tennis court",
  "24-hour access to the club and cafeteria",
  "Two sauna and two steam-bath sessions every month (worth ₹90,000)",
  "24-hour coworking access with high-speed internet and work kiosks",
  "One exclusive poolside event per calendar year",
  "Monthly member meetups, movie nights and training activities that encourage screen-free time",
];

const familyBenefits = [
  "Dedicated app and web platform for seamless access to club amenities",
  "Prime-time access to all amenities",
  "Dedicated lockers and a welcome kit for the family",
  "Concessional access to the gym, board games and tennis court",
  "24-hour access to the club and cafeteria",
  "Six complimentary staycations per calendar year for the family and their guests, with access to all amenities (worth ₹90,000)",
  "Two sauna and two steam-bath sessions every month for the family (worth ₹90,000)",
  "24-hour coworking access with high-speed internet and work kiosks",
  "One exclusive poolside family event per calendar year",
  "Monthly member meetups, movie nights and training activities that encourage screen-free time",
];

const guestAccessDetails = [
  "Access to selected facilities only",
  "Advance booking and valid identification required",
  "Entry is subject to availability and member-priority hours",
  "Guest charges apply per visit",
];

function BenefitList({
  benefits,
  featured = false,
}: {
  benefits: readonly string[];
  featured?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {benefits.map((benefit) => (
        <li
          key={benefit}
          className={`flex items-start gap-3 text-sm leading-relaxed ${
            featured ? "text-white/80" : "text-neutral-dark/70"
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              featured
                ? "bg-accent/15 text-accent"
                : "bg-brand/10 text-brand"
            }`}
          >
            <Check size={14} strokeWidth={3} aria-hidden="true" />
          </span>
          {benefit}
        </li>
      ))}
    </ul>
  );
}

export default function Membership() {
  return (
    <section
      id="plans"
      className="scroll-mt-24 overflow-hidden bg-light py-20 sm:py-24"
      aria-label="Membership and guest access"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Choose Your Elite Access"
          subtitle="Explore all facilities with ₹2,000 Early Bird Access before choosing an individual or family membership for five years of club privileges."
          className="!mb-10 sm:!mb-14"
        />

        <article className="mx-auto mb-6 grid max-w-6xl gap-6 rounded-3xl border border-brand/20 bg-white p-6 shadow-md sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">Explore before you join</p>
            <h3 className="font-display text-3xl font-bold text-neutral-dark">Early Bird Access</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark/70">
              For one person to explore Elite Health Club with access to all facilities before purchasing an individual or family membership.
            </p>
            <div className="mt-5">
              <BenefitList benefits={["Access for one person to all club facilities", "Explore the club before choosing your membership", "Our team coordinates your access after payment"]} />
            </div>
          </div>
          <div className="rounded-2xl bg-light p-6">
            <p className="font-display text-4xl font-bold text-brand">₹2,000</p>
            <p className="mt-1 text-sm text-neutral-dark/55">Total payable · includes 18% GST</p>
            {paymentsEnabled ? (
              <MembershipCheckout planId="early_bird" label="Get Early Bird Access" className="mt-5 w-full" />
            ) : (
              <Button href="#contact" className="mt-5 w-full">Enquire About Early Bird Access</Button>
            )}
            <p className="mt-3 text-xs leading-relaxed text-neutral-dark/55">Facility schedules and availability apply. Contact our team for access details.</p>
          </div>
        </article>

        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
          <article className="flex h-full flex-col rounded-3xl border border-neutral-dark/10 bg-white p-6 shadow-md sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                  For one member
                </p>
                <h3 className="font-display text-3xl font-bold text-neutral-dark">
                  Individual Membership
                </h3>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <User size={22} aria-hidden="true" />
              </span>
            </div>

            <div className="mb-5 border-y border-neutral-dark/10 py-5">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                <div>
                  <span className="font-display text-4xl font-bold text-brand sm:text-5xl">
                    ₹70,000
                  </span>
                  <p className="mt-1 text-sm text-neutral-dark/55">
                    + 18% GST
                  </p>
                </div>
                <div className="mb-1 flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
                  <Clock3 size={16} aria-hidden="true" />
                  5 years
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm leading-relaxed text-neutral-dark/70">
              <span className="font-semibold text-neutral-dark">
                Accommodation note:
              </span>{" "}
              Complimentary staycations or room stays are not included.
              Accommodation remains available at applicable charges.
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-dark/45">
              Membership benefits
            </p>
            <div className="flex-1">
              <BenefitList benefits={individualBenefits} />
            </div>

            {paymentsEnabled ? (
              <div className="mt-7 space-y-3">
                <MembershipCheckout
                  planId="individual"
                  label="Become a Member"
                  variant="outline"
                  className="w-full"
                />
                <a
                  href="#contact"
                  className="block text-center text-sm text-neutral-dark/55 underline underline-offset-4 transition-colors hover:text-brand"
                >
                  Have questions? Enquire first
                </a>
              </div>
            ) : (
              <Button href="#contact" variant="outline" className="mt-7 w-full">
                Enquire About Individual Membership
              </Button>
            )}
          </article>

          <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-dark p-6 text-white shadow-2xl sm:p-8">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex h-full flex-col">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Premium family plan
                  </p>
                  <h3 className="font-display text-3xl font-bold">
                    Executive Family Membership
                  </h3>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                  <Crown size={22} aria-hidden="true" />
                </span>
              </div>

              <p className="mb-5 text-sm font-medium text-white/70">
                For a family of four: two adults and two children
              </p>

              <div className="mb-5 border-y border-white/10 py-5">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                  <div>
                    <span className="font-display text-4xl font-bold text-accent sm:text-5xl">
                      ₹2,00,000
                    </span>
                    <p className="mt-1 text-sm text-white/60">
                      + 18% GST
                    </p>
                  </div>
                  <div className="mb-1 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <Clock3 size={16} className="text-accent" aria-hidden="true" />
                    5 years
                  </div>
                </div>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                Membership benefits
              </p>
              <div className="flex-1">
                <BenefitList benefits={familyBenefits} featured />
              </div>

              {paymentsEnabled ? (
                <div className="mt-7 space-y-3">
                  <MembershipCheckout
                    planId="family"
                    label="Become a Member"
                    className="w-full"
                  />
                  <a
                    href="#contact"
                    className="block text-center text-sm text-white/55 underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    Have questions? Enquire first
                  </a>
                </div>
              ) : (
                <Button href="#contact" variant="primary" className="mt-7 w-full">
                  Enquire About Family Membership
                </Button>
              )}
            </div>
          </article>
        </div>

        <article className="mx-auto mt-6 grid max-w-6xl gap-6 rounded-3xl border border-neutral-dark/10 bg-white p-6 shadow-md sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10">
          <div>
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Ticket size={22} aria-hidden="true" />
            </span>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Visit without membership
            </p>
            <h3 className="font-display text-3xl font-bold leading-tight text-neutral-dark">
              Non-Member Guest Access
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark/60">
              Experience selected club facilities with flexible, limited
              pay-per-visit access.
            </p>
            <Button
              href="#contact"
              variant="outline"
              className="mt-6 w-full sm:w-fit"
            >
              Ask About Guest Access
            </Button>
          </div>

          <div className="border-t border-neutral-dark/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <BenefitList benefits={guestAccessDetails} />
          </div>
        </article>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-neutral-dark/50">
          Access, operating hours and availability may vary by facility. Our
          team will confirm the current terms when you enquire.
        </p>
      </div>
    </section>
  );
}
