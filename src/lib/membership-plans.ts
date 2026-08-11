export const MEMBERSHIP_PLANS = {
  individual: {
    id: "individual",
    name: "Individual Membership",
    baseAmountRupees: 70_000,
    gstRatePercent: 18,
    amountPaise: 8_260_000,
  },
  family: {
    id: "family",
    name: "Executive Family Membership",
    baseAmountRupees: 200_000,
    gstRatePercent: 18,
    amountPaise: 23_600_000,
  },
} as const;

export type MembershipPlanId = keyof typeof MEMBERSHIP_PLANS;

export function getMembershipPlan(planId: unknown) {
  if (typeof planId !== "string" || !(planId in MEMBERSHIP_PLANS)) {
    return null;
  }

  return MEMBERSHIP_PLANS[planId as MembershipPlanId];
}

export function formatRupeesFromPaise(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}
