// Single source of truth for what each membership costs. The payment
// functions read amounts from here, never from the browser, so a tampered
// request can't change what the customer is charged.

export const GST_RATE_PERCENT = 18;

export const MEMBERSHIP_PLANS = {
  individual: {
    id: "individual",
    name: "Individual Membership",
    baseAmountRupees: 70_000,
    totalAmountRupees: 82_600,
    termYears: 5,
  },
  family: {
    id: "family",
    name: "Executive Family Membership",
    baseAmountRupees: 200_000,
    totalAmountRupees: 236_000,
    termYears: 5,
  },
} as const;

export type MembershipPlanId = keyof typeof MEMBERSHIP_PLANS;
export type MembershipPlan = (typeof MEMBERSHIP_PLANS)[MembershipPlanId];

export const MEMBERSHIP_PLAN_IDS = Object.keys(MEMBERSHIP_PLANS) as [
  MembershipPlanId,
  ...MembershipPlanId[],
];

export function getMembershipPlan(planId: unknown): MembershipPlan | null {
  if (typeof planId !== "string" || !Object.hasOwn(MEMBERSHIP_PLANS, planId)) {
    return null;
  }
  return MEMBERSHIP_PLANS[planId as MembershipPlanId];
}

export function formatRupees(amountRupees: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountRupees);
}
